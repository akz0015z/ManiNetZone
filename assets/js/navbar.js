// assets/js/navbar.js

function applyAppearance(theme, background) {
  const body = document.body;
  const page = body.getAttribute("data-page");
  const allowedPages = ["typing-test", "memory-game", "guess-game", "chat"];

  // if not one of the 4 tool pages, reset and exit
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

  // theme
  body.classList.remove("theme-dark", "theme-light");
  body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

  // background selection
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
    case "sky":
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

      const theme = data.theme || "dark";
      const background = data.background || "sky";

      applyAppearance(theme, background);
    } catch (err) {
      console.error("Error loading navbar user data:", err);
    }
  });
}

function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const page = document.body.getAttribute("data-page");
  const showNav = page !== "login" && page !== "signup";

  if (!showNav) {
    navbar.innerHTML = "";
    return;
  }

  
  const isSubPage = [
    "settings",
    "typing-test",
    "memory-game",
    "guess-game",
    "chat",
    "analytics",
    "feedback",
  ].includes(page);

  
  const imgBase = isSubPage ? ".." : ".";

  
  const showSettingsIcon = page !== "settings";

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <img src="${imgBase}/assets/img/tmt.jpg" alt="ManiNet Zone" class="nav-logo" />
        <span class="nav-title">ManiNet Zone</span>
      </div>

      <div class="nav-center">
        <a href="${isSubPage ? '../hub.html' : 'hub.html'}">Hub</a>
        <a href="${isSubPage ? 'typing-test.html' : 'pages/typing-test.html'}">Typing Test</a>
        <a href="${isSubPage ? 'memory-game.html' : 'pages/memory-game.html'}">Memory Game</a>
        <a href="${isSubPage ? 'guess-game.html' : 'pages/guess-game.html'}">Quiz Game</a>
        <a href="${isSubPage ? 'chat.html' : 'pages/chat.html'}">Chat</a>
        <a href="${isSubPage ? 'analytics.html' : 'pages/analytics.html'}">Analytics</a>
        <a href="${isSubPage ? 'feedback.html' : 'pages/feedback.html'}">Feedback</a>
      </div>

      <div class="nav-right">
        ${showSettingsIcon ? `
          <button id="settingsBtn" class="icon-btn" title="Settings">
            <img src="${imgBase}/assets/img/settings.png" class="icon-img" alt="Settings" />
          </button>
        ` : ""}

        <button id="logoutBtn" class="btn small danger">Logout</button>
      </div>
    </nav>
  `;

  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      window.location.href = isSubPage ? "settings.html" : "pages/settings.html";
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (window.logoutUser) window.logoutUser();
    });
  }

  setupNavbarUserData();
}

document.addEventListener("DOMContentLoaded", loadNavbar);
