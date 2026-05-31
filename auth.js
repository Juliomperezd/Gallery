(function () {
  if (localStorage.getItem('refs_auth') === GALLERY_PIN) return;

  var style = document.createElement('style');
  style.textContent = [
    '#auth-overlay{position:fixed;inset:0;background:#0d0d0d;z-index:9999;display:flex;align-items:center;justify-content:center;}',
    '#auth-box{display:flex;flex-direction:column;align-items:center;gap:16px;width:280px;}',
    '#auth-box h2{font-size:13px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#555;margin-bottom:8px;font-family:"Inter","Helvetica Neue",sans-serif;}',
    '#auth-input{width:100%;background:#111;border:1px solid #222;border-radius:6px;color:#ccc;font-size:16px;letter-spacing:0.2em;text-align:center;padding:12px;outline:none;font-family:inherit;transition:border-color 0.15s;}',
    '#auth-input:focus{border-color:#444;}',
    '#auth-input.shake{animation:shake 0.3s ease;}',
    '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
    '#auth-btn{width:100%;padding:11px;background:#fff;color:#0d0d0d;border:none;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:opacity 0.15s;}',
    '#auth-btn:hover{opacity:0.85;}',
    '#auth-err{font-size:11px;color:#6a2a2a;letter-spacing:0.04em;opacity:0;transition:opacity 0.2s;font-family:inherit;}'
  ].join('');
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = '<div id="auth-box"><h2>Refs</h2><input id="auth-input" type="password" placeholder="PIN" autocomplete="off"><button id="auth-btn">Entrar</button><span id="auth-err">PIN incorrecto</span></div>';
  document.body.appendChild(overlay);

  var input = document.getElementById('auth-input');
  var err   = document.getElementById('auth-err');
  input.focus();

  function tryAuth() {
    if (input.value === GALLERY_PIN) {
      localStorage.setItem('refs_auth', GALLERY_PIN);
      overlay.remove();
    } else {
      err.style.opacity = '1';
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
      input.value = '';
    }
  }

  document.getElementById('auth-btn').addEventListener('click', tryAuth);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryAuth(); });
})();
