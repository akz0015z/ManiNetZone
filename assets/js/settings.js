console.log("Settings JS loaded");

// use shared Firebase instances (from firebase-config.js)
const settingsAuth = firebase.auth();
const settingsDb = firebase.firestore();


function getUserDocRef(user) {
  return settingsDb.collection("users").doc(user.uid);
}


window.loadUserProfile = async function (user) {
  if (!user) return;

  const displayNameEl = document.getElementById("currentDisplayName");
  const usernameEl = document.getElementById("currentUsername");
  const emailEl = document.getElementById("currentEmail");
  const themeSelect = document.getElementById("themeSelect");
  const backgroundSelect = document.getElementById("backgroundSelect");

  try {
    const snap = await getUserDocRef(user).get();
    const data = snap.exists ? snap.data() : {};

    const displayName = data.displayName || user.displayName || "(not set)";
    const username = data.username || "(not set)";
    const email = user.email || data.email || "(not set)";

    if (displayNameEl) displayNameEl.textContent = displayName;
    if (usernameEl) usernameEl.textContent = username;
    if (emailEl) emailEl.textContent = email;

    // load saved theme/background 
    if (themeSelect) themeSelect.value = data.theme || "dark";
    if (backgroundSelect) backgroundSelect.value = data.background || "sky";
  } catch (err) {
    console.error("Error loading user profile in settings:", err);
  }
};


async function handleSaveAppearance(event) {
  event.preventDefault();

  const themeEl = document.getElementById("themeSelect");
  const bgEl = document.getElementById("backgroundSelect");

  const theme = themeEl ? themeEl.value : "dark";
  const background = bgEl ? bgEl.value : "sky";

  const user = settingsAuth.currentUser;
  if (!user) {
    alert("You must be logged in.");
    return;
  }

  try {
    await getUserDocRef(user).set(
      { theme, background },
      { merge: true }
    );

    alert(
      "Appearance saved! It will apply on Typing Test, Memory Game, Quiz Game and Chat pages."
    );
  } catch (err) {
    console.error("Error saving appearance:", err);
    alert("Failed to save appearance.");
  }
}

/**
 * update display name
 */
async function handleDisplayNameSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("newDisplayName");
  const newName = input?.value.trim();
  if (!newName) {
    alert("Enter a display name.");
    return;
  }

  const user = settingsAuth.currentUser;
  if (!user) {
    alert("Not logged in.");
    return;
  }

  try {
    await getUserDocRef(user).set(
      { displayName: newName },
      { merge: true }
    );

    // Also update Firebase Auth profile
    await user.updateProfile({ displayName: newName });

    const displayNameEl = document.getElementById("currentDisplayName");
    if (displayNameEl) displayNameEl.textContent = newName;

    input.value = "";
    alert("Display name updated!");
  } catch (err) {
    console.error("Display name error:", err);
    alert("Failed to update display name.");
  }
}

/**
 * update username
 */
async function handleUsernameSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("newUsername");
  const newUsername = input?.value.trim();
  if (!newUsername) {
    alert("Enter a username.");
    return;
  }

  const user = settingsAuth.currentUser;
  if (!user) {
    alert("Not logged in.");
    return;
  }

  try {
    await getUserDocRef(user).set(
      { username: newUsername },
      { merge: true }
    );

    const usernameEl = document.getElementById("currentUsername");
    if (usernameEl) usernameEl.textContent = newUsername;

    input.value = "";
    alert("Username updated!");
  } catch (err) {
    console.error("Username error:", err);
    alert("Failed to update username.");
  }
}

/**
 * Wire up events
 */
document.addEventListener("DOMContentLoaded", () => {
  const saveAppearanceBtn = document.getElementById("saveAppearanceBtn");
  if (saveAppearanceBtn) {
    saveAppearanceBtn.addEventListener("click", handleSaveAppearance);
  }

  const displayNameForm = document.getElementById("displayNameForm");
  if (displayNameForm) {
    displayNameForm.addEventListener("submit", handleDisplayNameSubmit);
  }

  const usernameForm = document.getElementById("usernameForm");
  if (usernameForm) {
    usernameForm.addEventListener("submit", handleUsernameSubmit);
  }

  // (Password/email/2FA buttons stay as stubs for now)
});
