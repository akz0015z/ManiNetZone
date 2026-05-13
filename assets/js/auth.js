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


// REQUIRE AUTH


function requireAuth() {

  auth.onAuthStateChanged((user) => {

    const page =
      document.body.getAttribute(
        "data-page"
      );

    if (!user) {

      // allow login/signup pages
      if (
        page === "login" ||
        page === "signup"
      ) return;

      const currentPath =
        window.location.pathname;

      // pages folder
      if (
        currentPath.includes("/pages/")
      ) {

        window.location.href =
          "../index.html";

      }

      // root folder
      else {

        window.location.href =
          "index.html";

      }

      return;

    }

    // settings loader
    if (
      page === "settings" &&
      typeof window.loadUserProfile === "function"
    ) {

      window.loadUserProfile(user);

    }

  });

}


// PAGE LOAD


document.addEventListener(
  "DOMContentLoaded",
  () => {

  const page =
    document.body.getAttribute(
      "data-page"
    );

  // auth check
  if (
    page !== "login" &&
    page !== "signup"
  ) {

    requireAuth();

  }

  
  // LOGIN
 
  const loginForm =
    document.getElementById(
      "loginForm"
    );

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "loginEmail"
        ).value.trim();

      const password =
        document.getElementById(
          "loginPassword"
        ).value;

      try {

        await auth
          .signInWithEmailAndPassword(
            email,
            password
          );

        const currentUser =
          auth.currentUser;

        // EMAIL VERIFICATION CHECK
        
        const bypassEmails = [

          "finalpoint@gmail.com"

        ];

        if (

          !currentUser.emailVerified &&

          !bypassEmails.includes(
            currentUser.email
          )

        ) {

          await auth.signOut();

          showSavePopup(
            "Please Verify Your Email Address Before Logging In."
          );

          return;

        }

        window.location.href =
          "hub.html";

      } catch (err) {

        console.error(err);

        showSavePopup(
          "Incorrect Email or Password. Please try again."
        );

      }

    });

  }

  
  // SIGNUP
  

  const signupForm =
    document.getElementById(
      "signupForm"
    );

  if (signupForm) {

    signupForm.addEventListener(
      "submit",
      async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "signupEmail"
        ).value.trim();

      const password =
        document.getElementById(
          "signupPassword"
        ).value;

      const username =
        document.getElementById(
          "signupUsername"
        ).value.trim();

      try {

        const cred =
          await auth
          .createUserWithEmailAndPassword(
            email,
            password
          );

        
        // WHERE IT SENDS VERIFICATION EMAIL
        

        await cred.user
          .sendEmailVerification();

        await db
          .collection("users")
          .doc(cred.user.uid)
          .set({

            email,
            username,

            displayName:
              username,

            createdAt:
              firebase.firestore
              .FieldValue
              .serverTimestamp(),

          });

        await auth.signOut();

        showSavePopup(
          "Account Created Successfully. Please Verify Your Email Before Logging In."
        );

        setTimeout(() => {

          window.location.href =
            "index.html";

        }, 2500);

      } catch (err) {

        console.error(err);

        showSavePopup(
          "Unable To Create Account. Please try again."
        );

      }

    });

  }

  
  // RESET PASSWORD MODEL
  

  const forgotPasswordBtn =
    document.getElementById(
      "forgotPasswordBtn"
    );

  const resetPasswordModal =
    document.getElementById(
      "resetPasswordModal"
    );

  const closeResetModal =
    document.getElementById(
      "closeResetModal"
    );

  const sendResetBtn =
    document.getElementById(
      "sendResetBtn"
    );

  // OPEN MODAL

  if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
      "click",
      () => {

        resetPasswordModal
          .classList.add("show");

      }
    );

  }

  // CLOSE MODAL

  if (closeResetModal) {

    closeResetModal.addEventListener(
      "click",
      () => {

        resetPasswordModal
          .classList.remove("show");

      }
    );

  }

  // SEND RESET EMAIL

  if (sendResetBtn) {

    sendResetBtn.addEventListener(
      "click",
      async () => {

        const email =
          document.getElementById(
            "resetPasswordEmail"
          ).value.trim();

        if (!email) {

          showSavePopup(
            "Please Enter Your Email Address."
          );

          return;

        }

        try {

          await auth
            .sendPasswordResetEmail(
              email
            );

          resetPasswordModal
            .classList.remove("show");

          showSavePopup(
            "Password Reset Email Sent Successfully."
          );

        } catch (err) {

          console.error(err);

          showSavePopup(
            "Unable To Send Password Reset Email."
          );

        }

      }
    );

  }

});


// LOGOUT CODE


window.logoutUser =
  async function () {

  try {

    await auth.signOut();

    const currentPath =
      window.location.pathname;

    // pages folder
    if (
      currentPath.includes("/pages/")
    ) {

      window.location.href =
        "../index.html";

    }

    // root folder
    else {

      window.location.href =
        "index.html";

    }

  } catch (err) {

    console.error(err);

    showSavePopup(
      "Logout Failed. Please try again."
    );

  }

};