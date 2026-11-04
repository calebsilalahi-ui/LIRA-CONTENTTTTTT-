#!/usr/bin/env node
/**
 * Lira Reels Auto-Publisher via Buffer GraphQL API
 * 
 * Usage:
 *   node scripts/post_reel.js --file "/Users/caleb/Desktop/lira reels/04_order_tutorial.mp4" \
 *                            --caption "Pesen Lira di bio link sekarang 🌿" \
 *                            [--firstComment "Link: bit.ly/LiraVault"] \
 *                            [--mode shareNow|customScheduled|addToQueue] \
 *                            [--dueAt "2026-10-25T18:00:00Z"]
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { spawn } = require('child_process');

// Use Cloudflare & Google DNS to bypass local macOS negative DNS caching for new quick tunnels
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  // Fallback to system default
}

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
const PORT = 8990;

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    file: '',
    caption: '',
    firstComment: '',
    mode: 'shareNow', // 'shareNow' | 'customScheduled' | 'addToQueue'
    dueAt: null,
    collaborators: [],
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) params.file = args[++i];
    else if (args[i] === '--caption' && args[i + 1]) params.caption = args[++i];
    else if (args[i] === '--firstComment' && args[i + 1]) params.firstComment = args[++i];
    else if (args[i] === '--mode' && args[i + 1]) params.mode = args[++i];
    else if (args[i] === '--dueAt' && args[i + 1]) params.dueAt = args[++i];
    else if ((args[i] === '--collaborator' || args[i] === '--collaborators') && args[i + 1]) {
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

// Serve video file locally with full HTTP 206 Range support
function startFileServer(filePath) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const stat = fs.statSync(filePath);
      const range = req.headers.range;
      console.log(`[HTTP Server] Incoming request: ${req.url} (${range || 'no range'})`);

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
          'Access-Control-Allow-Origin': '*',
        });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Type': 'video/mp4',
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Serving ${path.basename(filePath)} at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// Start cloudflared tunnel and wait for the trycloudflare.com URL
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
        reject(new Error('Timed out waiting for Cloudflare tunnel URL (30s).'));
      }
    }, 30000);
  });
}

// Ensure edge tunnel is returning 200 OK before calling Buffer API
function verifyTunnelReachable(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    let attempts = 0;
    const maxAttempts = 60;
    console.log(`[Tunnel] Verifying public edge connectivity for ${url}...`);

    const check = () => {
      attempts++;
      dns.lookup(hostname, (dnsErr, address) => {
        if (dnsErr || !address) {
          console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: Waiting for DNS (${dnsErr ? dnsErr.message : 'no IP'})...`);
          if (attempts >= maxAttempts) {
            return reject(new Error(`DNS resolution failed for ${hostname}: ${dnsErr ? dnsErr.message : 'unknown'}`));
          }
          return setTimeout(check, 1500);
        }

        const req = https.get(url, { agent: directAgent }, (res) => {
          if (res.statusCode === 200) {
            console.log(`✓ Edge tunnel verified reachable on attempt ${attempts} (Status: 200 OK, IP: ${address})`);
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

  if (!args.file) {
    console.error('Error: Please provide --file <path_to_video.mp4>');
    process.exit(1);
  }

  const resolvedFile = path.resolve(args.file.replace(/^~/, process.env.HOME));
  if (!fs.existsSync(resolvedFile)) {
    console.error(`Error: File does not exist at ${resolvedFile}`);
    process.exit(1);
  }

  console.log('====================================================');
  console.log('🚀 LIRA INSTAGRAM REEL PUBLISHER (BUFFER GRAPHQL)');
  console.log('====================================================');
  console.log(`Video File: ${resolvedFile}`);
  console.log(`Caption: ${args.caption || '(None provided)'}`);
  console.log(`Mode: ${args.mode}`);

  // Step 1: Verify Buffer Channel
  console.log('\n[1/4] Verifying Buffer Instagram Channel...');
  const channel = await getInstagramChannel();
  console.log(`✓ Connected Instagram: @${channel.displayName} (ID: ${channel.id})`);

  // Step 2: Start local file server & Cloudflare tunnel
  console.log('\n[2/4] Initializing secure video delivery link...');
  const server = await startFileServer(resolvedFile);
  const { tunnel, url: tunnelUrl } = await startCloudflareTunnel(PORT);
  const publicVideoUrl = `${tunnelUrl}/video.mp4`;

  // Wait until Cloudflare edge node propagates 200 OK
  await verifyTunnelReachable(publicVideoUrl);
  console.log(`✓ Direct public video URL: ${publicVideoUrl}`);

  // Step 3: Call createPost mutation
  console.log('\n[3/4] Sending Reel creation mutation to Buffer...');
  const mutation = `mutation CreateReel($input: CreatePostInput!) {
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

  const igMetadata = {
    type: 'reel',
    shouldShareToFeed: true,
  };
  if (args.firstComment) {
    igMetadata.firstComment = args.firstComment;
  }
  if (args.collaborators && args.collaborators.length > 0) {
    igMetadata.collaborators = args.collaborators;
    console.log(`[Collaborators] Inviting Instagram collaborators: ${args.collaborators.map(c => '@' + c).join(', ')}`);
  }

  const input = {
    channelId: channel.id,
    schedulingType: 'automatic',
    mode: args.mode,
    needsApproval: false,
    text: args.caption || '',
    metadata: {
      instagram: igMetadata,
    },
    assets: [
      {
        video: {
          url: publicVideoUrl,
        },
      },
    ],
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

    console.log('====================================================');
    console.log('🎉 REEL SUCCESSFULLY DISPATCHED TO BUFFER!');
    console.log('====================================================');
    console.log(`Post ID: ${postResult.post?.id}`);
    console.log(`Status: ${postResult.post?.status}`);
    console.log(`Target Channel: @${channel.displayName}`);
    const postId = postResult.post?.id;
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
            console.log(`✅ REEL SUCCESSFULLY ${p.status.toUpperCase()} ON BUFFER / INSTAGRAM!`);
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
    console.log(`✓ Polling complete. Final status: ${finalStatus}`);

  } catch (err) {
    console.error('\n❌ Error in main execution:', err);
    throw err;
  } finally {
    console.log('[Cleanup] Shutting down tunnel and local HTTP server...');
    try { tunnel.kill('SIGKILL'); } catch (e) {}
    try { server.close(); } catch (e) {}
    console.log('✓ Cleanup complete.');
  }
}

main().catch((err) => {
  console.error('\n❌ Execution Failed:', err.message);
  process.exit(1);
});
