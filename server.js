const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);

    if (reqPath === '/' || reqPath === '/preview') {
      sendFile(path.join(ROOT, 'index.html'), res);
      return;
    }

    const filePath = path.join(ROOT, reqPath.replace(/^\//, ''));

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isFile()) {
        sendFile(filePath, res);
      } else {
        sendFile(path.join(ROOT, 'index.html'), res);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`Preview server running at http://localhost:${PORT}`);
  });
