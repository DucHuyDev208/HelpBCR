// META BOT PRO - Authentication System (CLEAN VERSION)
(function() {
  'use strict';

  const VALID_PASSWORD = 'metabot2024'; // ĐỔI MẬT KHẨU TẠI ĐÂY
  const PASSWORD_VERSION = 'v1'; // TĂNG LÊN KHI ĐỔI PASS (v1, v2, v3...)
  
  const SESSION_KEY = 'metabot_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 giờ

  const authOverlay = document.getElementById('authOverlay');
  const appContent = document.getElementById('appContent');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const authError = document.getElementById('authError');

  // Kiểm tra session có hợp lệ không
  function checkSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return false;

      const data = JSON.parse(session);
      const now = Date.now();
      
      // Kiểm tra password version
      if (data.passwordVersion !== PASSWORD_VERSION) {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }
      
      // Kiểm tra thời gian hết hạn
      if (now - data.timestamp >= SESSION_DURATION) {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }

      return true;
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
  }

  // Tạo session mới
  function createSession() {
    const session = {
      timestamp: Date.now(),
      passwordVersion: PASSWORD_VERSION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  // Mở khóa app
  function unlockApp() {
    authOverlay.style.display = 'none';
    appContent.classList.add('unlocked');
    window.dispatchEvent(new CustomEvent('metabot:unlocked'));
  }

  // Xác thực mật khẩu
  function handleLogin() {
    const input = passwordInput.value.trim();
    
    if (!input) {
      showError('Vui lòng nhập mật khẩu');
      return;
    }

    if (input === VALID_PASSWORD) {
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

  // Hiển thị lỗi
  function showError(message) {
    authError.textContent = `❌ ${message}`;
    authError.classList.add('show');
    setTimeout(() => authError.classList.remove('show'), 3000);
  }

  // Kiểm tra password version định kỳ
  function checkPasswordVersion() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.passwordVersion !== PASSWORD_VERSION) {
          localStorage.removeItem(SESSION_KEY);
          window.location.reload();
        }
      } catch (e) {
        console.error('Check version error:', e);
      }
    }
  }

  // Event listeners
  loginBtn.addEventListener('click', handleLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Kiểm tra password version mỗi 10 giây
  setInterval(checkPasswordVersion, 10000);

  // Khởi tạo
  if (checkSession()) {
    unlockApp();
  } else {
    passwordInput.focus();
  }

  // Public API
  window.MetaBotAuth = {
    logout: function() {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    }
  };

})();
