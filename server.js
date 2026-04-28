const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DATA_DIR = './data';

// MIME types
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

// JSON файл унших
function readData(file) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// JSON файл бичих
function writeData(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return;
  }

  // ===== API =====

  // GET /api/news
  if (pathname === '/api/news' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(readData('news.json')));
    return;
  }

  // POST /api/news
  if (pathname === '/api/news' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const news = readData('news.json');
      const item = { id: Date.now(), ...JSON.parse(body) };
      news.push(item);
      writeData('news.json', news);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(item));
    });
    return;
  }

  // DELETE /api/news/:id
  if (pathname.startsWith('/api/news/') && req.method === 'DELETE') {
    const id = Number(pathname.split('/')[3]);
    let news = readData('news.json');
    news = news.filter(n => n.id !== id);
    writeData('news.json', news);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // PUT /api/news/:id
  if (pathname.startsWith('/api/news/') && req.method === 'PUT') {
    const id = Number(pathname.split('/')[3]);
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      let news = readData('news.json');
      news = news.map(n => n.id === id ? { ...n, ...JSON.parse(body) } : n);
      writeData('news.json', news);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // GET /api/menus
  if (pathname === '/api/menus' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(readData('menus.json')));
    return;
  }

  // POST /api/menus
  if (pathname === '/api/menus' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const menus = readData('menus.json');
      const item = { id: Date.now(), ...JSON.parse(body) };
      menus.push(item);
      writeData('menus.json', menus);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(item));
    });
    return;
  }

  // DELETE /api/menus/:id
  if (pathname.startsWith('/api/menus/') && req.method === 'DELETE') {
    const id = Number(pathname.split('/')[3]);
    let menus = readData('menus.json');
    menus = menus.filter(m => m.id !== id);
    writeData('menus.json', menus);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // PUT /api/menus/:id
  if (pathname.startsWith('/api/menus/') && req.method === 'PUT') {
    const id = Number(pathname.split('/')[3]);
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      let menus = readData('menus.json');
      menus = menus.map(m => m.id === id ? { ...m, ...JSON.parse(body) } : m);
      writeData('menus.json', menus);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // ===== СТАТИК ФАЙЛ =====
  let filePath = '.' + pathname;
  if (filePath === './') filePath = './index.html';

  if (filePath.endsWith('/')) filePath += 'index.html';

  const ext = path.extname(filePath);
  const contentType = mime[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 - Файл олдсонгүй');
      return;
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Сервер ажиллаж байна: http://localhost:${PORT}`);
  console.log(`📊 Админ хэсэг: http://localhost:${PORT}/admin/`);
});