// assets/js/navbar.js
function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  // You can hide navbar on login/signup if you want
  const page = document.body.getAttribute("data-page");
  const showNav = page !== "login" && page !== "signup";
  if (!showNav) {
    navbar.innerHTML = "";
    return;
  }

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <img src="assets/img/logo.png" alt="ManiNet Zone" class="nav-logo" />
        <span class="nav-title">ManiNet Zone</span>
      </div>
      <div class="nav-center">
        <a href="hub.html">Hub</a>
        <a href="pages/typing-test.html">Typing Test</a>
        <a href="pages/memory-game.html">Memory Game</a>
        <a href="pages/guess-game.html">Guess Game</a>
        <a href="pages/chat.html">Chat</a>
        <a href="pages/analytics.html">Analytics</a>
        <a href="pages/feedback.html">Feedback</a>
      </div>
      <div class="nav-right">
        <button id="settingsBtn" class="icon-btn" title="Security & Settings">
          <span class="material-symbols-outlined">shield_person</span>
        </button>
        <img id="navAvatar" src="assets/img/default-avatar.png" class="nav-avatar" alt="Profile" />
        <button id="logoutBtn" class="btn small danger">Logout</button>
      </div>
    </nav>
  `;

  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      window.location.href = "pages/settings.html";
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (window.logoutUser) {
        window.logoutUser(); // defined in auth.js
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
