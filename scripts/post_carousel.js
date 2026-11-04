#!/usr/bin/env node
/**
 * Lira Instagram Carousel Auto-Publisher via Buffer GraphQL API
 * 
 * Usage:
 *   node scripts/post_carousel.js \
 *     --slides "/path/to/slide1.png" "/path/to/slide2.png" "/path/to/slide3.png" "/path/to/slide4.png" \
 *     --caption "Your caption" \
 *     --mode shareNow
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { spawn } = require('child_process');

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch(e) {}

const directAgent = new https.Agent({
  lookup: (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    dns.resolve4(hostname, (err, addrs) => {
      if (err) return callback(err);
      if (!addrs || addrs.length === 0) return callback(new Error('No IPv4 resolved'));
      if (options && options.all) {
        callback(null, addrs.map(a => ({ address: a, family: 4 })));
      } else {
        callback(null, addrs[0], 4);
      }
    });
  }
});
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
}

const BUFFER_TOKEN = process.env.BUFFER_TOKEN || process.env.BUFFER_ACCESS_TOKEN || '';
const BUFFER_API = 'https://api.buffer.com';
const CLOUDFLARED_BIN = '/Users/caleb/.gemini/antigravity/scratch/bin/cloudflared';
const PORT = 8991;

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    slides: [],
    caption: '',
    mode: 'shareNow',
    dueAt: null,
    collaborators: [],
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slides') {
      while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        params.slides.push(args[++i]);
      }
    } else if (args[i] === '--caption' && args[i + 1]) {
      params.caption = args[++i];
    } else if (args[i] === '--mode' && args[i + 1]) {
      params.mode = args[++i];
    } else if (args[i] === '--dueAt' && args[i + 1]) {
      params.dueAt = args[++i];
    } else if ((args[i] === '--collaborator' || args[i] === '--collaborators') && args[i + 1]) {
      params.collaborators = args[++i].split(',').map(c => c.trim().replace(/^@/, '')).filter(Boolean);
    }
  }

  return params;
}

// Execute GraphQL query against Buffer API
function queryBuffer(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = https.request(BUFFER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUFFER_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.errors && json.errors.length > 0) {
            reject(new Error(`Buffer API Error: ${json.errors[0].message}`));
          } else {
            resolve(json.data);
          }
        } catch (err) {
          reject(new Error(`Failed to parse Buffer response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Find Instagram channel ID for drinklira
async function getInstagramChannel() {
  const orgData = await queryBuffer(`query {
    account {
      organizations {
        id
        name
      }
    }
  }`);

  const orgId = orgData.account.organizations[0]?.id;
  if (!orgId) throw new Error('No organization found in Buffer account.');

  const channelsData = await queryBuffer(`query GetChannels($input: ChannelsInput!) {
    channels(input: $input) {
      id
      name
      service
      displayName
    }
  }`, { input: { organizationId: orgId } });

  const igChannel = channelsData.channels.find(
    c => c.service === 'instagram' && (c.name.toLowerCase().includes('lira') || c.displayName.toLowerCase().includes('lira'))
  ) || channelsData.channels.find(c => c.service === 'instagram');

  if (!igChannel) throw new Error('No connected Instagram account found in Buffer.');
  return igChannel;
}

// Serve slides locally
function startSlideServer(slidePaths) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const match = req.url.match(/^\/slide_(\d+)\.(png|jpg|jpeg)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const slideFile = slidePaths[index];
        if (slideFile && fs.existsSync(slideFile)) {
          const stat = fs.statSync(slideFile);
          const ext = path.extname(slideFile).toLowerCase();
          const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
          console.log(`[HTTP Server] Serving Slide ${index + 1}: ${req.url} (${stat.size} bytes)`);
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stat.size,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
          });
          fs.createReadStream(slideFile).pipe(res);
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Serving ${slidePaths.length} carousel slides at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// Start cloudflared tunnel
function startCloudflareTunnel(port) {
  return new Promise((resolve, reject) => {
    console.log('[Tunnel] Starting temporary Cloudflare quick tunnel...');
    const tunnel = spawn(CLOUDFLARED_BIN, ['tunnel', '--url', `http://127.0.0.1:${port}`]);

    let urlFound = false;

    const parseOutput = (data) => {
      const text = data.toString();
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !urlFound) {
        urlFound = true;
        const url = match[0];
        console.log(`[Tunnel] Public HTTPS tunnel established: ${url}`);
        resolve({ tunnel, url });
      }
    };

    tunnel.stdout.on('data', parseOutput);
    tunnel.stderr.on('data', parseOutput);

    tunnel.on('error', (err) => {
      if (!urlFound) reject(err);
    });

    setTimeout(() => {
      if (!urlFound) {
        tunnel.kill();
        reject(new Error('Timed out waiting for Cloudflare tunnel URL (25s).'));
      }
    }, 25000);
  });
}

// Ensure edge tunnel is returning 200 OK before calling Buffer API
// Ensure edge tunnel is returning 200 OK before calling Buffer API
function verifyTunnelReachable(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    let attempts = 0;
    const maxAttempts = 30;
    console.log(`[Tunnel] Verifying public edge connectivity for ${url}...`);

    const check = () => {
      attempts++;
      dns.resolve4(hostname, (dnsErr, addrs) => {
        if (dnsErr || !addrs || addrs.length === 0) {
          console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: Waiting for DNS (${dnsErr ? dnsErr.message : 'no IP'})...`);
          if (attempts >= maxAttempts) {
            return reject(new Error(`DNS resolution failed for ${hostname}: ${dnsErr ? dnsErr.message : 'unknown'}`));
          }
          return setTimeout(check, 1500);
        }

        const req = https.get(url, { agent: directAgent }, (res) => {
          if (res.statusCode === 200) {
            console.log(`✓ Edge tunnel verified reachable on attempt ${attempts} (Status: 200 OK, IP: ${addrs[0]})`);
            resolve();
          } else {
            console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: Status ${res.statusCode}, retrying in 1.5s...`);
            if (attempts >= maxAttempts) {
              reject(new Error(`Edge tunnel returned status ${res.statusCode}`));
            } else {
              setTimeout(check, 1500);
            }
          }
        });

        req.on('error', (err) => {
          console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: HTTP error (${err.message}), retrying in 1.5s...`);
          if (attempts >= maxAttempts) {
            reject(new Error(`Edge tunnel probe error: ${err.message}`));
          } else {
            setTimeout(check, 1500);
          }
        });
      });
    };

    setTimeout(check, 2000);
  });
}

async function main() {
  const args = parseArgs();

  if (!args.slides || args.slides.length < 2) {
    console.error('Error: Please provide at least 2 slides via --slides <path1> <path2> ...');
    process.exit(1);
  }

  const resolvedSlides = args.slides.map(s => path.resolve(s.replace(/^~/, process.env.HOME)));
  for (const s of resolvedSlides) {
    if (!fs.existsSync(s)) {
      console.error(`Error: Slide file not found at ${s}`);
      process.exit(1);
    }
  }

  console.log('====================================================');
  console.log('🚀 LIRA INSTAGRAM CAROUSEL PUBLISHER (BUFFER GRAPHQL)');
  console.log('====================================================');
  console.log(`Slides Count: ${resolvedSlides.length}`);
  resolvedSlides.forEach((s, i) => console.log(`  Slide ${i + 1}: ${path.basename(s)}`));
  console.log(`Caption: ${args.caption}`);
  console.log(`Mode: ${args.mode}`);

  // Step 1: Verify Buffer Channel
  console.log('\n[1/4] Verifying Buffer Instagram Channel...');
  const channel = await getInstagramChannel();
  console.log(`✓ Connected Instagram: @${channel.displayName} (ID: ${channel.id})`);

  // Step 2: Start local file server & Cloudflare tunnel
  console.log('\n[2/4] Initializing secure carousel slide delivery link...');
  const server = await startSlideServer(resolvedSlides);
  const { tunnel, url: tunnelUrl } = await startCloudflareTunnel(PORT);

  // Build public URLs for each slide
  const publicSlideUrls = resolvedSlides.map((s, i) => {
    const ext = path.extname(s).toLowerCase();
    return `${tunnelUrl}/slide_${i}${ext}`;
  });

  // Verify public edge connectivity before calling Buffer
  await verifyTunnelReachable(publicSlideUrls[0]);
  console.log(`✓ Direct public carousel URLs ready: ${publicSlideUrls[0]}`);

  // Step 3: Build createPost mutation for carousel
  console.log('\n[3/4] Sending Carousel creation mutation to Buffer...');
  const mutation = `mutation CreateCarousel($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post {
          id
          status
          text
          dueAt
        }
      }
      ... on MutationError {
        message
      }
    }
  }`;

  const assets = publicSlideUrls.map(url => ({
    image: {
      url: url,
    },
  }));

  const igMeta = {
    type: 'post',
    shouldShareToFeed: true,
  };
  if (args.collaborators && args.collaborators.length > 0) {
    igMeta.collaborators = args.collaborators;
    console.log(`[Collaborators] Inviting Instagram collaborators: ${args.collaborators.map(c => '@' + c).join(', ')}`);
  }

  const input = {
    channelId: channel.id,
    schedulingType: 'automatic',
    mode: args.mode,
    needsApproval: false,
    text: args.caption || '',
    metadata: {
      instagram: igMeta,
    },
    assets: assets,
  };

  if (args.mode === 'customScheduled' && args.dueAt) {
    input.dueAt = args.dueAt;
  }

  try {
    const result = await queryBuffer(mutation, { input });
    const postResult = result.createPost;

    if (postResult.message) {
      throw new Error(`Buffer Post Error: ${postResult.message}`);
    }

    const postId = postResult.post?.id;
    console.log('====================================================');
    console.log('🎉 CAROUSEL SUCCESSFULLY DISPATCHED TO BUFFER!');
    console.log('====================================================');
    console.log(`Post ID: ${postId}`);
    console.log(`Initial Status: ${postResult.post?.status}`);
    console.log(`Target Channel: @${channel.displayName}`);

    // Step 4: Active status polling (strict 5-minute cap)
    console.log(`\n⏳ Polling Buffer post status for ${postId} while keeping tunnel alive...`);
    const maxWaitMs = 300000; // 5 minutes strict cap for posting phase
    const startTime = Date.now();
    let finalStatus = postResult.post?.status;

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(r => setTimeout(r, 8000));
      try {
        const check = await queryBuffer(`query GetPost($input: PostInput!) {
          post(input: $input) {
            id
            status
            error { message }
          }
        }`, { input: { id: postId } });

        const p = check.post;
        if (p) {
          finalStatus = p.status;
          console.log(`[Buffer Status] Post ${postId}: ${p.status}${p.error?.message ? ' (' + p.error.message + ')' : ''}`);
          if (p.status === 'sent' || p.status === 'published' || p.status === 'scheduled') {
            console.log(`✅ CAROUSEL SUCCESSFULLY ${p.status.toUpperCase()} ON BUFFER / INSTAGRAM!`);
            break;
          }
          if (p.status === 'error') {
            console.error(`❌ Post ended in error: ${p.error?.message}`);
            break;
          }
        }
      } catch (err) {
        console.log(`[Buffer Status Check Warning] ${err.message}`);
      }
    }

    console.log(`✓ Delivery process complete. Final status: ${finalStatus}`);

  } finally {
    console.log('[Cleanup] Shutting down tunnel and local HTTP server...');
    try { tunnel.kill('SIGKILL'); } catch (e) {}
    try { server.close(); } catch (e) {}
    console.log('✓ Cleanup complete. Done!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('\n❌ Execution Failed:', err.message);
  process.exit(1);
});
