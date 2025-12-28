// META BOT PRO - Authentication System
(function() {
  'use strict';

  const VALID_PASSWORD = 'metabot2024'; // ĐỔI MẬT KHẨU TẠI ĐÂY
  const PASSWORD_VERSION = 'v1'; // TĂNG LÊN KHI ĐỔI PASS (v1, v2, v3...)
  
  const SESSION_KEY = 'metabot_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000;
  const TAB_CLOSE_KEY = 'metabot_tab_closed';

  const authOverlay = document.getElementById('authOverlay');
  const appContent = document.getElementById('appContent');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const authError = document.getElementById('authError');

  // Kiểm tra xem tab có bị đóng trước đó không
  function wasTabClosed() {
    const tabClosed = sessionStorage.getItem(TAB_CLOSE_KEY);
    return tabClosed === 'true';
  }

  // Đánh dấu tab đang mở
  function markTabOpen() {
    sessionStorage.setItem(TAB_CLOSE_KEY, 'false');
  }

  // Đánh dấu tab đã đóng
  function markTabClosed() {
    sessionStorage.setItem(TAB_CLOSE_KEY, 'true');
  }

  function checkSession() {
    try {
      // Nếu tab bị đóng trước đó, reload để reset mọi thứ
      if (wasTabClosed()) {
        console.log('🔄 Tab was closed - Reloading...');
        markTabOpen();
        window.location.reload();
        return false;
      }

      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const data = JSON.parse(session);
        const now = Date.now();
        
        // Kiểm tra password version - nếu khác thì đá ra
        if (data.passwordVersion !== PASSWORD_VERSION) {
          console.log('Password đã thay đổi - yêu cầu đăng nhập lại');
          localStorage.removeItem(SESSION_KEY);
          return false;
        }
        
        // Kiểm tra session còn hạn không
        if (now - data.timestamp < SESSION_DURATION) {
          markTabOpen();
          unlockApp();
          return true;
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Session check error:', e);
      localStorage.removeItem(SESSION_KEY);
    }
    markTabOpen();
    return false;
  }

  function createSession() {
    try {
      const session = {
        timestamp: Date.now(),
        version: '9.0',
        passwordVersion: PASSWORD_VERSION
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      markTabOpen();
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

  // Phát hiện khi tab/window sắp đóng
  window.addEventListener('beforeunload', () => {
    markTabClosed();
  });

  // Phát hiện khi page bị unload (đóng tab, reload, navigate away)
  window.addEventListener('unload', () => {
    markTabClosed();
  });

  // Phát hiện khi page được load lại sau khi đóng
  window.addEventListener('pageshow', (event) => {
    // Nếu page load từ cache (back/forward button)
    if (event.persisted) {
      console.log('🔄 Page loaded from cache - Reloading...');
      window.location.reload();
    }
  });

  if (!checkSession()) {
    passwordInput.focus();
  }

  window.MetaBotAuth = {
    logout: function() {
      localStorage.removeItem(SESSION_KEY);
      markTabClosed();
      window.location.reload();
    },
    checkPasswordVersion: function() {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        try {
          const data = JSON.parse(session);
          if (data.passwordVersion !== PASSWORD_VERSION) {
            console.log('🔒 Mật khẩu đã thay đổi - Đăng xuất...');
            localStorage.removeItem(SESSION_KEY);
            window.location.reload();
          }
        } catch (e) {
          console.error('Check version error:', e);
        }
      }
    }
  };

  // Tự động kiểm tra password version mỗi 10 giây
  setInterval(() => {
    window.MetaBotAuth.checkPasswordVersion();
  }, 10000);

  console.log('🔐 Auth system ready');

})();
