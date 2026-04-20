// =============================================
//  admin.js — Нэвтрэх, цэс, мэдээ удирдах логик
// =============================================

// ---------- НЭВТРЭХ ----------
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');

  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('isAdmin', 'true');
    window.location.href = 'dashboard.html';
  } else {
    errorEl.style.display = 'block';
    document.getElementById('password').value = '';
  }
}

// Enter товч дарахад нэвтрэх
function handleLoginKey(event) {
  if (event.key === 'Enter') login();
}

// ---------- ГАРАХ ----------
function logout() {
  if (confirm('Гарах уу?')) {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  }
}

// ---------- НЭВТРЭЛТ ШАЛГАХ ----------
function checkAuth() {
  if (localStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'index.html';
  }
}

// ================================================
//  ЦЭС УДИРДАХ
// ================================================
let menus = [];

function initMenu() {
  checkAuth();
  menus = JSON.parse(localStorage.getItem('menus') || '[]');
  renderMenuTable();
}

function renderMenuTable() {
  const tbody = document.getElementById('menuList');
  if (!tbody) return;

  if (menus.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">Цэс байхгүй байна</td></tr>';
    localStorage.setItem('menus', JSON.stringify(menus));
    return;
  }

  tbody.innerHTML = menus.map((m, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(m.name)}</td>
      <td><a href="${m.link}" target="_blank" style="color:#3498db;">${m.link}</a></td>
      <td>
        <button class="btn btn-blue" onclick="editMenu(${i})">✏️ Засах</button>
        <button class="btn btn-red"  onclick="deleteMenu(${i})">🗑️ Устгах</button>
      </td>
    </tr>
  `).join('');

  localStorage.setItem('menus', JSON.stringify(menus));
}

function addMenu() {
  const name = document.getElementById('menuName').value.trim();
  const link = document.getElementById('menuLink').value.trim();

  if (!name) return showAlert('menuName', 'Цэсний нэрийг оруулна уу!');
  if (!link) return showAlert('menuLink', 'Линкийг оруулна уу!');

  menus.push({ name, link });
  document.getElementById('menuName').value = '';
  document.getElementById('menuLink').value = '';
  renderMenuTable();
}

function deleteMenu(i) {
  if (confirm(`"${menus[i].name}" цэсийг устгах уу?`)) {
    menus.splice(i, 1);
    renderMenuTable();
  }
}

function editMenu(i) {
  const name = prompt('Цэсний нэр:', menus[i].name);
  if (name === null) return;
  const link = prompt('Линк:', menus[i].link);
  if (link === null) return;

  if (name.trim() && link.trim()) {
    menus[i] = { name: name.trim(), link: link.trim() };
    renderMenuTable();
  }
}

// ================================================
//  МЭДЭЭ УДИРДАХ
// ================================================
let news = [];

function initNews() {
  checkAuth();
  news = JSON.parse(localStorage.getItem('news') || '[]');
  renderNewsTable();
}

function renderNewsTable() {
  const tbody = document.getElementById('newsList');
  if (!tbody) return;

  if (news.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">Мэдээ байхгүй байна</td></tr>';
    localStorage.setItem('news', JSON.stringify(news));
    return;
  }

  tbody.innerHTML = news.map((n, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(n.title)}</strong></td>
      <td style="color:#666; font-size:13px;">${escapeHtml(n.content.substring(0, 80))}${n.content.length > 80 ? '...' : ''}</td>
      <td>
        <button class="btn btn-blue" onclick="editNews(${i})">✏️ Засах</button>
        <button class="btn btn-red"  onclick="deleteNews(${i})">🗑️ Устгах</button>
      </td>
    </tr>
  `).join('');

  localStorage.setItem('news', JSON.stringify(news));
}

function addNews() {
  const title   = document.getElementById('newsTitle').value.trim();
  const content = document.getElementById('newsContent').value.trim();

  if (!title)   return showAlert('newsTitle', 'Гарчиг оруулна уу!');
  if (!content) return showAlert('newsContent', 'Агуулга оруулна уу!');

  news.push({ title, content });
  document.getElementById('newsTitle').value   = '';
  document.getElementById('newsContent').value = '';
  renderNewsTable();
}

function deleteNews(i) {
  if (confirm(`"${news[i].title}" мэдээг устгах уу?`)) {
    news.splice(i, 1);
    renderNewsTable();
  }
}

function editNews(i) {
  const title = prompt('Гарчиг:', news[i].title);
  if (title === null) return;
  const content = prompt('Агуулга:', news[i].content);
  if (content === null) return;

  if (title.trim() && content.trim()) {
    news[i] = { title: title.trim(), content: content.trim() };
    renderNewsTable();
  }
}

// ================================================
//  ТУСЛАХ ФУНКЦҮҮД
// ================================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function showAlert(fieldId, msg) {
  const el = document.getElementById(fieldId);
  el.style.border = '2px solid #e74c3c';
  alert(msg);
  el.focus();
  setTimeout(() => el.style.border = '1px solid #ddd', 2000);
}