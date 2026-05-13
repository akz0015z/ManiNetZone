console.log("Feedback JS loaded");


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


// FEEDBACK FORM


const feedbackForm =
  document.getElementById(
    "feedbackForm"
  );

if (feedbackForm) {

  feedbackForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const subject =
        document.getElementById(
          "feedbackSubject"
        ).value.trim();

      const message =
        document.getElementById(
          "feedbackMessage"
        ).value.trim();

      const user =
        firebase.auth().currentUser;

      if (!subject || !message) {

        showSavePopup(
          "Fill in all fields."
        );

        return;

      }

      try {

        await firebase
          .firestore()
          .collection("feedback")
          .add({

            uid:
              user?.uid || null,

            email:
              user?.email || "Unknown",

            subject,
            message,

            createdAt:
              firebase.firestore
              .FieldValue
              .serverTimestamp()

          });

        feedbackForm.reset();

        showSavePopup(
          "Feedback submitted!"
        );

      } catch (err) {

        console.error(
          "Feedback error:",
          err
        );

        showSavePopup(
          "Failed to send feedback."
        );

      }

    });

}