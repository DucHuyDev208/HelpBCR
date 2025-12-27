// META BOT PRO - Authentication System
// Version: 9.0

(function() {
  'use strict';

  const VALID_PASSWORD = 'metabot2024'; // CHANGE THIS PASSWORD
  const SESSION_KEY = 'metabot_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  const authOverlay = document.getElementById('authOverlay');
  const appContent = document.getElementById('appContent');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const authError = document.getElementById('authError');

  // Check existing session
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

  // Create session
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

  // Unlock app
  function unlockApp() {
    authOverlay.style.display = 'none';
    appContent.classList.add('unlocked');
    
    // Dispatch custom event for app initialization
    window.dispatchEvent(new CustomEvent('metabot:unlocked'));
  }

  // Verify password
  function verifyPassword(input) {
    return input === VALID_PASSWORD;
  }

  // Handle login
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

  // Show error message
  function showError(message) {
    authError.textContent = `❌ ${message}`;
    authError.classList.add('show');
    
    setTimeout(() => {
      authError.classList.remove('show');
    }, 3000);
  }

  // Event listeners
  loginBtn.addEventListener('click', handleLogin);
  
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });

  // Initialize
  if (!checkSession()) {
    passwordInput.focus();
  }

  // Expose logout function
  window.MetaBotAuth = {
    logout: function() {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    },
    changePassword: function(newPassword) {
      console.warn('To change password, edit VALID_PASSWORD in auth.js');
    }
  };

})();
