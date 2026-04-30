// assets/js/navbar.js

function applyAppearance(theme, background) {
  const body = document.body;
  const page = body.getAttribute("data-page");
  const allowedPages = ["typing-test", "memory-game", "guess-game", "chat"];

  if (!allowedPages.includes(page)) {
    body.classList.remove(
      "theme-dark",
      "theme-light",
      "bg-sky-sparkles",
      "bg-pink-sparkles",
      "bg-black-sparkles",
      "bg-grey-sparkles"
    );
    const layer = document.getElementById("sparkleLayer");
    if (layer) layer.remove();
    return;
  }

  body.classList.remove("theme-dark", "theme-light");
  body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

  body.classList.remove(
    "bg-sky-sparkles",
    "bg-pink-sparkles",
    "bg-black-sparkles",
    "bg-grey-sparkles"
  );

  let bgClass = "bg-sky-sparkles";
  switch (background) {
    case "pink": bgClass = "bg-pink-sparkles"; break;
    case "black": bgClass = "bg-black-sparkles"; break;
    case "grey": bgClass = "bg-grey-sparkles"; break;
    default: bgClass = "bg-sky-sparkles";
  }

  body.classList.add(bgClass);
  ensureSparkleLayer();
}

function ensureSparkleLayer() {
  let layer = document.getElementById("sparkleLayer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "sparkleLayer";
    document.body.appendChild(layer);
  }
}

function setupNavbarUserData() {
  if (!window.firebase || !firebase.auth) return;

  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      applyAppearance("dark", "sky");
      return;
    }

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      const data = doc.exists ? doc.data() : {};

      applyAppearance(data.theme || "dark", data.background || "sky");
    } catch (err) {
      console.error("Error loading navbar user data:", err);
    }
  });
}

function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const page = document.body.getAttribute("data-page");

  // 🔥 AUTO PATH DETECTION
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const basePath = isInPagesFolder ? "" : "pages/";
  const imgBase = isInPagesFolder ? ".." : ".";

  const showSettingsIcon = page !== "settings";

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <img src="${imgBase}/assets/img/tmt.jpg" class="nav-logo" />
        <span class="nav-title">ManiNet Zone</span>
      </div>

      <div class="nav-center">
        <a href="${isInPagesFolder ? '../hub.html' : 'hub.html'}">Hub</a>
        <a href="${basePath}typing-test.html">Typing Test</a>
        <a href="${basePath}memory-game.html">Memory Game</a>
        <a href="${basePath}quiz-selection.html">Quiz Game</a>
        <a href="${basePath}chat.html">Chat</a>
        <a href="${basePath}analytics.html">Analytics</a>
        <a href="${basePath}feedback.html">Feedback</a>
      </div>

      <div class="nav-right">
        ${showSettingsIcon ? `
          <button id="settingsBtn" class="icon-btn">
            <img src="${imgBase}/assets/img/settings.png" class="icon-img" />
          </button>
        ` : ""}

        <button id="logoutBtn" class="btn small danger">Logout</button>
      </div>
    </nav>
  `;

  // 🔒 LOGIN PAGE PROTECTION
  if (page === "login" || page === "signup") {
    const navLinks = navbar.querySelectorAll("a");
    const logoutBtn = document.getElementById("logoutBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    if (logoutBtn) logoutBtn.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "none";

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Log in or Sign up to access these features.");
      });
    });
  }

  // ⚙ SETTINGS BUTTON
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      window.location.href = `${basePath}settings.html`;
    });
  }

  // 🚪 LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (window.logoutUser) window.logoutUser();
    });
  }

  setupNavbarUserData();
}

document.addEventListener("DOMContentLoaded", loadNavbar);