const API = 'http://localhost:3000/api';

// ===== НЭВТРЭХ =====
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('isAdmin', 'true');
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('error').style.display = 'block';
  }
}

function handleLoginKey(e) { if (e.key === 'Enter') login(); }
function logout() { localStorage.removeItem('isAdmin'); window.location.href = 'index.html'; }
function checkAuth() { if (localStorage.getItem('isAdmin') !== 'true') window.location.href = 'index.html'; }

// ===== ЦЭС =====
let menus = [];

async function initMenu() {
  checkAuth();
  const res = await fetch(`${API}/menus`);
  menus = await res.json();
  renderMenuTable();
}

function renderMenuTable() {
  const tbody = document.getElementById('menuList');
  if (!tbody) return;
  tbody.innerHTML = menus.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">Цэс байхгүй</td></tr>'
    : menus.map(m => `
      <tr>
        <td>${menus.indexOf(m)+1}</td>
        <td>${m.name}</td>
        <td><a href="${m.link}" target="_blank" style="color:#3498db">${m.link}</a></td>
        <td>
          <button class="btn btn-blue" onclick="editMenu(${m.id})">✏️ Засах</button>
          <button class="btn btn-red" onclick="deleteMenu(${m.id})">🗑️ Устгах</button>
        </td>
      </tr>`).join('');
}

async function addMenu() {
  const name = document.getElementById('menuName').value.trim();
  const link = document.getElementById('menuLink').value.trim();
  if (!name || !link) return alert('Дутуу байна!');
  await fetch(`${API}/menus`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, link })
  });
  document.getElementById('menuName').value = '';
  document.getElementById('menuLink').value = '';
  await initMenu();
}

async function deleteMenu(id) {
  if (confirm('Устгах уу?')) {
    await fetch(`${API}/menus/${id}`, { method: 'DELETE' });
    await initMenu();
  }
}

async function editMenu(id) {
  const m = menus.find(x => x.id === id);
  const name = prompt('Нэр:', m.name);
  const link = prompt('Линк:', m.link);
  if (name && link) {
    await fetch(`${API}/menus/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, link })
    });
    await initMenu();
  }
}

// ===== МЭДЭЭ =====
let news = [];

async function initNews() {
  checkAuth();
  const res = await fetch(`${API}/news`);
  news = await res.json();
  renderNewsTable();
}

function renderNewsTable() {
  const tbody = document.getElementById('newsList');
  if (!tbody) return;
  tbody.innerHTML = news.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">Мэдээ байхгүй</td></tr>'
    : news.map(n => `
      <tr>
        <td>${news.indexOf(n)+1}</td>
        <td><strong>${n.title}</strong></td>
        <td style="color:#666;font-size:13px">${n.content.substring(0,80)}...</td>
        <td>
          <button class="btn btn-blue" onclick="editNews(${n.id})">✏️ Засах</button>
          <button class="btn btn-red" onclick="deleteNews(${n.id})">🗑️ Устгах</button>
        </td>
      </tr>`).join('');
}

async function addNews() {
  const title = document.getElementById('newsTitle').value.trim();
  const content = document.getElementById('newsContent').value.trim();
  if (!title || !content) return alert('Дутуу байна!');
  await fetch(`${API}/news`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, content })
  });
  document.getElementById('newsTitle').value = '';
  document.getElementById('newsContent').value = '';
  await initNews();
}

async function deleteNews(id) {
  if (confirm('Устгах уу?')) {
    await fetch(`${API}/news/${id}`, { method: 'DELETE' });
    await initNews();
  }
}

async function editNews(id) {
  const n = news.find(x => x.id === id);
  const title = prompt('Гарчиг:', n.title);
  const content = prompt('Агуулга:', n.content);
  if (title && content) {
    await fetch(`${API}/news/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, content })
    });
    await initNews();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}