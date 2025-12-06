// assets/js/auth.js

// Helper: redirect if not logged in
function requireAuth() {
  auth.onAuthStateChanged((user) => {
    const page = document.body.getAttribute("data-page");

    if (!user) {
      // allow login/signup pages without auth
      if (page === "login" || page === "signup") return;
      window.location.href = "index.html";
    } else {
      // you can load user profile, avatar, etc here
      if (window.loadUserProfile) {
        window.loadUserProfile(user);
      }
    }
  });
}

// Called on pages that require auth
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  if (page !== "login" && page !== "signup") {
    requireAuth();
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "hub.html";
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const username = document.getElementById("signupUsername").value.trim();

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection("users").doc(cred.user.uid).set({
          email,
          username,
          displayName: username,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        window.location.href = "hub.html";
      } catch (err) {
        alert("Signup failed: " + err.message);
      }
    });
  }
});

// logout used by navbar
window.logoutUser = async function () {
  try {
    await auth.signOut();
    window.location.href = "index.html";
  } catch (err) {
    alert("Logout failed: " + err.message);
  }
};
