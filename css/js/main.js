// =============================================
//  main.js — Нүүр хуудасд цэс + мэдээ харуулах
// =============================================

document.addEventListener('DOMContentLoaded', function () {
  loadMenu();
  loadNews();
});

// ---------- ЦЭС ----------
function loadMenu() {
  const nav = document.getElementById('dynamicMenu');
  if (!nav) return;

  const menus = JSON.parse(localStorage.getItem('menus') || '[]');

  if (menus.length === 0) {
    nav.innerHTML = '<span style="color:rgba(255,255,255,0.5); font-size:13px;">Цэс байхгүй байна</span>';
    return;
  }

  nav.innerHTML = menus
    .map(m => `<a href="${m.link}">${m.name}</a>`)
    .join('');
}

// ---------- МЭДЭЭ ----------
function loadNews() {
  const container = document.getElementById('dynamicNews');
  if (!container) return;

  const news = JSON.parse(localStorage.getItem('news') || '[]');

  if (news.length === 0) {
    container.innerHTML = '<p class="empty-msg">Одоогоор мэдээ байхгүй байна.</p>';
    return;
  }

  container.innerHTML = `
    <div class="news-grid">
      ${news.map((n, i) => `
        <div class="news-card">
          <h3>${escapeHtml(n.title)}</h3>
          <p>${escapeHtml(n.content)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// XSS-ээс хамгаалах
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}