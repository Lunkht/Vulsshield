document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const pixelBackground = document.querySelector('.pixel-background');

// Pixels replaced by a CSS grid background; no need to generate pixel elements
if (pixelBackground) {
    // Intentionally left empty to avoid creating pixel nodes
}

// URL Risk Analyzer Module
(function () {
  const STORAGE_KEY = 'vs_url_risk_log';

  function parseUrl(href) {
    try { return new URL(href, window.location.href); } catch (e) { return null; }
  }
  function isInternalAnchor(a) {
    const href = a.getAttribute('href');
    return href && href.startsWith('#');
  }
  function scoreUrl(urlObj) {
    let score = 0; const reasons = [];
    const href = urlObj.href; const host = urlObj.hostname.toLowerCase();
    const protocol = urlObj.protocol;

    if (protocol === 'http:') { score += 20; reasons.push('HTTP non sécurisé'); }
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) { score += 20; reasons.push('IP directe'); }
    if (host.includes('xn--')) { score += 15; reasons.push('IDN/Punycode'); }

    const tld = host.split('.').pop();
    const riskyTlds = ['zip', 'mov', 'tk', 'ml', 'cf', 'gq', 'biz', 'top'];
    if (riskyTlds.includes(tld)) { score += 10; reasons.push('TLD risqué .' + tld); }

    const hyphenCount = (host.match(/-/g) || []).length; if (hyphenCount >= 2) { score += 10; reasons.push('Nom de domaine avec plusieurs tirets'); }

    const keywords = ['login', 'support', 'verify', 'update', 'secure', 'account', 'paypal', 'apple', 'bank', 'microsoft'];
    let kwHits = 0; const text = (urlObj.hostname + urlObj.pathname + urlObj.search).toLowerCase();
    keywords.forEach(k => { if (text.includes(k) && kwHits < 4) { kwHits++; score += 5; } });

    if (href.length > 120) { score += 10; reasons.push('URL très longue'); }
    if (/@/.test(href)) { score += 15; reasons.push('Caractère @ dans l’URL'); }
    if (/[?&](password|pass|session|token|confirm|otp)=/i.test(urlObj.search)) { score += 10; reasons.push('Paramètres sensibles'); }

    const port = urlObj.port; if (port && port !== '80' && port !== '443') { score += 5; reasons.push('Port non standard'); }

    score = Math.min(100, score);
    let level = 'low';
    if (score >= 60) level = 'high'; else if (score >= 30) level = 'medium';
    return { score, level, reasons };
  }

  function loadLog() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveLog(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

  function logVisit(urlObj) {
    const { score, level, reasons } = scoreUrl(urlObj);
    const entry = { url: urlObj.href, host: urlObj.hostname, path: urlObj.pathname, time: Date.now(), score, level, reasons };
    let list = loadLog();
    const idx = list.findIndex(e => e.url === entry.url);
    if (idx >= 0) { list[idx] = { ...list[idx], ...entry }; }
    else { list.push(entry); }
    list.sort((a, b) => b.score - a.score || b.time - a.time);
    if (list.length > 200) list = list.slice(0, 200);
    saveLog(list);
  }

  function handleLinkClick(evt) {
    const a = evt.target && evt.target.closest ? evt.target.closest('a') : null;
    if (!a) return;
    if (isInternalAnchor(a)) return;
    const href = a.getAttribute('href');
    if (!href) return;
    const urlObj = parseUrl(a.href || href);
    if (!urlObj) return;
    try { logVisit(urlObj); } catch (e) { /* noop */ }
  }
  document.addEventListener('click', handleLinkClick, true);

  function renderUrlRiskList() {
    const container = document.getElementById('urlRiskList');
    if (!container) return;
    const list = loadLog();
    container.innerHTML = '';
    if (!list.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-globe"></i></div><p>Aucune URL analysée pour le moment.</p></div>';
      return;
    }
    const wrapper = document.createElement('div'); wrapper.className = 'url-risk-list';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'url-risk-item';
      const badgeClass = item.level === 'high' ? 'risk-high' : (item.level === 'medium' ? 'risk-medium' : 'risk-low');
      const date = new Date(item.time);
      const reasonsText = (item.reasons || []).join(', ');
      div.innerHTML = `
        <div class="url-main">
          <div class="url-host">
            <i class="fas fa-link"></i>
            <span class="host">${item.host}</span>
            <span class="path">${item.path}</span>
          </div>
          <span class="risk-badge ${badgeClass}">${item.score}</span>
        </div>
        <div class="url-meta">
          <span class="time">${date.toLocaleString()}</span>
          <span class="reasons">${reasonsText}</span>
          <a href="${item.url}" class="open-link" target="_blank" rel="noreferrer noopener" title="Ouvrir"><i class="fas fa-external-link-alt"></i></a>
        </div>`;
      wrapper.appendChild(div);
    });
    container.appendChild(wrapper);
  }

  function clearLog() {
    localStorage.removeItem(STORAGE_KEY);
    renderUrlRiskList();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderUrlRiskList();
    const btn = document.getElementById('clearUrlRiskLog');
    if (btn) btn.addEventListener('click', clearLog);
  });
})();
