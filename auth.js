// META BOT PRO - Authentication System
(function() {
  'use strict';

  const VALID_PASSWORD = 'metabot2024';
  const SESSION_KEY = 'metabot_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000;

  const authOverlay = document.getElementById('authOverlay');
  const appContent = document.getElementById('appContent');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const authError = document.getElementById('authError');

  function checkSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const data = JSON.parse(session);
        const now = Date.now();
        
        if (now - data.timestamp < SESSION_DURATION) {
          unlockApp();
          return true;
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Session check error:', e);
    }
    return false;
  }

  function createSession() {
    try {
      const session = {
        timestamp: Date.now(),
        version: '9.0'
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Session creation error:', e);
    }
  }

  function unlockApp() {
    authOverlay.style.display = 'none';
    appContent.classList.add('unlocked');
    window.dispatchEvent(new CustomEvent('metabot:unlocked'));
  }

  function verifyPassword(input) {
    return input === VALID_PASSWORD;
  }

  function handleLogin() {
    const input = passwordInput.value.trim();
    
    if (!input) {
      showError('Vui lòng nhập mật khẩu');
      return;
    }

    if (verifyPassword(input)) {
      createSession();
      unlockApp();
      passwordInput.value = '';
      authError.classList.remove('show');
    } else {
      showError('Mật khẩu không đúng!');
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  function showError(message) {
    authError.textContent = `❌ ${message}`;
    authError.classList.add('show');
    
    setTimeout(() => {
      authError.classList.remove('show');
    }, 3000);
  }

  loginBtn.addEventListener('click', handleLogin);
  
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });

  if (!checkSession()) {
    passwordInput.focus();
  }

  window.MetaBotAuth = {
    logout: function() {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    }
  };

})();
