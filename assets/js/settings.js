console.log("Settings JS loaded");

// FIREBASE

const settingsAuth = firebase.auth();
const settingsDb = firebase.firestore();


// USER DOC REF

function getUserDocRef(user) {

  return settingsDb
    .collection("users")
    .doc(user.uid);

}

// POPUP

function showSavePopup(message) {

  const oldPopup =
    document.querySelector(".save-popup");

  if (oldPopup) {

    oldPopup.remove();

  }

  const popup =
    document.createElement("div");

  popup.className =
    "save-popup";

  popup.innerHTML = `

    <div class="save-popup-box">

      <p>${message}</p>

    </div>

  `;

  document.body.appendChild(
    popup
  );

  setTimeout(() => {

    popup.classList.add("show");

  }, 10);

  setTimeout(() => {

    popup.classList.remove("show");

    setTimeout(() => {

      popup.remove();

    }, 300);

  }, 2500);

}


// LOAD PROFILE


window.loadUserProfile =
  async function (user) {

  if (!user) return;

  try {

    const displayNameEl =
      document.getElementById(
        "currentDisplayName"
      );

    const usernameEl =
      document.getElementById(
        "currentUsername"
      );

    const emailEl =
      document.getElementById(
        "currentEmail"
      );

    const themeSelect =
      document.getElementById(
        "themeSelect"
      );

    const backgroundSelect =
      document.getElementById(
        "backgroundSelect"
      );

    const snap =
      await getUserDocRef(user)
      .get();

    const data =
      snap.exists
        ? snap.data()
        : {};

    if (displayNameEl) {

      displayNameEl.textContent =
        data.displayName
        || user.displayName
        || "(not set)";

    }

    if (usernameEl) {

      usernameEl.textContent =
        data.username
        || "(not set)";

    }

    if (emailEl) {

      emailEl.textContent =
        user.email
        || "(not set)";

    }

    if (themeSelect) {

      themeSelect.value =
        data.theme || "dark";

    }

    if (backgroundSelect) {

      backgroundSelect.value =
        data.background || "sky";

    }

  } catch (err) {

    console.error(
      "Load profile error:",
      err
    );

  }

};


// SAVE APPEARANCE


async function handleSaveAppearance(event) {

  event.preventDefault();

  const theme =
    document.getElementById(
      "themeSelect"
    )?.value || "dark";

  const background =
    document.getElementById(
      "backgroundSelect"
    )?.value || "sky";

  const user =
    settingsAuth.currentUser;

  if (!user) {

    showSavePopup(
      "You must be logged in."
    );

    return;

  }

  try {

    await getUserDocRef(user)
    .set({

      theme,
      background

    }, {

      merge: true

    });

    showSavePopup(
      "Appearance updated successfully!"
    );

  } catch (err) {

    console.error(err);

    showSavePopup(
      "Failed to save appearance."
    );

  }

}


// DISPLAY NAME

async function handleDisplayNameSubmit(event) {

  event.preventDefault();

  const input =
    document.getElementById(
      "newDisplayName"
    );

  const newName =
    input.value.trim();

  if (!newName) {

    showSavePopup(
      "Enter a display name."
    );

    return;

  }

  const user =
    settingsAuth.currentUser;

  if (!user) {

    showSavePopup(
      "Not logged in."
    );

    return;

  }

  try {

    const snap =
      await getUserDocRef(user)
      .get();

    const data =
      snap.data() || {};

    const lastChange =
      data.lastDisplayNameChange || 0;

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    if (
      Date.now() - lastChange
      < sevenDays
    ) {

      const daysLeft =
        Math.ceil(

          (
            sevenDays -
            (
              Date.now()
              - lastChange
            )
          )

          / (1000 * 60 * 60 * 24)

        );

      showSavePopup(
        `You can change display name again in ${daysLeft} day(s).`
      );

      return;

    }

    await getUserDocRef(user)
    .set({

      displayName:
        newName,

      lastDisplayNameChange:
        Date.now()

    }, {

      merge: true

    });

    await user.updateProfile({

      displayName:
        newName

    });

    document.getElementById(
      "currentDisplayName"
    ).textContent = newName;

    input.value = "";

    showSavePopup(
      "Display name updated!"
    );

  } catch (err) {

    console.error(err);

    showSavePopup(
      "Failed to update display name."
    );

  }

}


// USERNAME


async function handleUsernameSubmit(event) {

  event.preventDefault();

  const input =
    document.getElementById(
      "newUsername"
    );

  const newUsername =
    input.value.trim();

  if (!newUsername) {

    showSavePopup(
      "Enter a username."
    );

    return;

  }

  const user =
    settingsAuth.currentUser;

  if (!user) {

    showSavePopup(
      "Not logged in."
    );

    return;

  }

  try {

    const snap =
      await getUserDocRef(user)
      .get();

    const data =
      snap.data() || {};

    const lastChange =
      data.lastUsernameChange || 0;

    const thirtyDays =
      30 * 24 * 60 * 60 * 1000;

    if (
      Date.now() - lastChange
      < thirtyDays
    ) {

      const daysLeft =
        Math.ceil(

          (
            thirtyDays -
            (
              Date.now()
              - lastChange
            )
          )

          / (1000 * 60 * 60 * 24)

        );

      showSavePopup(
        `You can change username again in ${daysLeft} day(s).`
      );

      return;

    }

    await getUserDocRef(user)
    .set({

      username:
        newUsername,

      lastUsernameChange:
        Date.now()

    }, {

      merge: true

    });

    document.getElementById(
      "currentUsername"
    ).textContent =
      newUsername;

    input.value = "";

    showSavePopup(
      "Username updated!"
    );

  } catch (err) {

    console.error(err);

    showSavePopup(
      "Failed to update username."
    );

  }

}


// CHANGE PASSWORD


async function handlePasswordChange(event) {

  event.preventDefault();

  const currentPassword =
    document.getElementById(
      "currentPassword"
    ).value.trim();

  const newPassword =
    document.getElementById(
      "newPassword"
    ).value.trim();

  const confirmPassword =
    document.getElementById(
      "confirmPassword"
    ).value.trim();

  const user =
    settingsAuth.currentUser;

  if (!user) {

    showSavePopup(
      "Not logged in."
    );

    return;

  }

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {

    showSavePopup(
      "Fill in all password fields."
    );

    return;

  }

  if (
    newPassword !== confirmPassword
  ) {

    showSavePopup(
      "Passwords do not match."
    );

    return;

  }

  try {

    const credential =
      firebase.auth
      .EmailAuthProvider
      .credential(

        user.email,
        currentPassword

      );

    await user
      .reauthenticateWithCredential(
        credential
      );

    await user
      .updatePassword(
        newPassword
      );

    document.getElementById(
      "currentPassword"
    ).value = "";

    document.getElementById(
      "newPassword"
    ).value = "";

    document.getElementById(
      "confirmPassword"
    ).value = "";

    showSavePopup(
      "Password updated successfully!"
    );

  } catch (err) {

    console.error(err);

    if (
      err.code ===
      "auth/wrong-password"
    ) {

      showSavePopup(
        "Current password is incorrect."
      );

    } else {

      showSavePopup(
        "Failed to update password."
      );

    }

  }

}


// CHANGE EMAIL


async function handleEmailChange(event) {

  event.preventDefault();

  const newEmail =
    document.getElementById(
      "newEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "confirmEmailPassword"
    ).value.trim();

  const user =
    settingsAuth.currentUser;

  if (!user) {

    showSavePopup(
      "Not logged in."
    );

    return;

  }

  if (
    !newEmail ||
    !password
  ) {

    showSavePopup(
      "Fill in all email fields."
    );

    return;

  }

  try {

    const credential =
      firebase.auth
      .EmailAuthProvider
      .credential(

        user.email,
        password

      );

    await user
      .reauthenticateWithCredential(
        credential
      );

    await user
      .updateEmail(
        newEmail
      );

    await getUserDocRef(user)
    .set({

      email:
        newEmail

    }, {

      merge: true

    });

    document.getElementById(
      "currentEmail"
    ).textContent =
      newEmail;

    document.getElementById(
      "newEmail"
    ).value = "";

    document.getElementById(
      "confirmEmailPassword"
    ).value = "";

    showSavePopup(
      "Email updated successfully!"
    );

  } catch (err) {

    console.error(err);

    if (
      err.code ===
      "auth/wrong-password"
    ) {

      showSavePopup(
        "Incorrect password."
      );

    }

    else if (
      err.code ===
      "auth/invalid-email"
    ) {

      showSavePopup(
        "Invalid email address."
      );

    }

    else if (
      err.code ===
      "auth/requires-recent-login"
    ) {

      showSavePopup(
        "Please log out and log back in."
      );

    }

    else {

      showSavePopup(
        "Failed to update email."
      );

    }

  }

}


// LOG OUT


async function handleLogoutAllDevices() {

  try {

    await settingsAuth.signOut();

    showSavePopup(
      "Logged out successfully."
    );

    setTimeout(() => {

      window.location.href =
        "../index.html";

    }, 1200);

  } catch (err) {

    console.error(err);

    showSavePopup(
      "Failed to log out."
    );

  }

}


// EVENTS


document.addEventListener(
  "DOMContentLoaded",
  () => {

  document.getElementById(
    "saveAppearanceBtn"
  )?.addEventListener(

    "click",
    handleSaveAppearance

  );

  document.getElementById(
    "displayNameForm"
  )?.addEventListener(

    "submit",
    handleDisplayNameSubmit

  );

  document.getElementById(
    "usernameForm"
  )?.addEventListener(

    "submit",
    handleUsernameSubmit

  );

  document.getElementById(
    "passwordForm"
  )?.addEventListener(

    "submit",
    handlePasswordChange

  );

  document.getElementById(
    "emailForm"
  )?.addEventListener(

    "submit",
    handleEmailChange

  );

  document.getElementById(
    "manageSessionsBtn"
  )?.addEventListener(

    "click",
    handleLogoutAllDevices

  );

});