const https = require('https');
const fs = require('fs');
const dns = require('dns');

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {}

const directAgent = new https.Agent({
  lookup: (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    dns.resolve4(hostname, (err, addrs) => {
      if (err) return callback(err);
      if (options && options.all) {
        callback(null, addrs.map(a => ({ address: a, family: 4 })));
      } else {
        callback(null, addrs[0], 4);
      }
    });
  }
});

const url = 'https://www.instagram.com/p/De2lNC8DueQ/embed/captioned/';
https.get(url, {
  agent: directAgent,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  console.log('Status:', res.statusCode);
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Length:', data.length);
    fs.writeFileSync('scripts/ig_embed.html', data);
    const cdnMatches = [...data.matchAll(/https:\/\/[^"'\s<>]+cdninstagram\.com[^"'\s<>]*/g)].map(m => m[0]);
    console.log('Found CDN matches:', cdnMatches.length);
    for (const link of cdnMatches.slice(0, 10)) {
      console.log('CDN Link:', link.replace(/&amp;/g, '&'));
    }
  });
});
