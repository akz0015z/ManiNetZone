const chatDb = firebase.firestore();
let currentUser = null;

const onlineUsersList =
  document.getElementById("onlineUsersList");

// wait for auth
firebase.auth().onAuthStateChanged(user => {

  currentUser = user;

  if (!user) return;

  // SAVE ONLINE USER
  chatDb.collection("onlineUsers")
    .doc(user.uid)
    .set({
      username: user.displayName || "Anonymous",
      uid: user.uid
    });

  // ADMIN ONLY BUTTON
  if (user.email === "finalpoint@gmail.com") {

    document
      .getElementById("adminClearBtn")
      .style.display = "block";

  }

  loadMessages();
  loadOnlineUsers();

});

// load last 1000 messages
function loadMessages() {

  chatDb.collection("chat")
    .orderBy("timestamp", "desc")
    .limit(1000)
    .onSnapshot(snapshot => {

      const messages = [];

      snapshot.forEach(doc =>
        messages.push(doc.data())
      );

      messages.reverse();

      displayMessages(messages);

    });

}

function displayMessages(messages) {

  const box =
    document.getElementById("chatMessages");

  box.innerHTML = "";

  messages.forEach(msg => {

    const div =
      document.createElement("div");

    const isYou =
      msg.uid === currentUser.uid;

    div.className =
      "chat-message " +
      (isYou ? "you" : "other");

    div.innerHTML = `
      <div class="chat-username">
        ${msg.username}
      </div>

      ${msg.text}
    `;

    box.appendChild(div);

  });

  box.scrollTop =
    box.scrollHeight;

}

// send message
document
  .getElementById("sendBtn")
  .addEventListener("click", sendMessage);

document
  .getElementById("chatInput")
  .addEventListener("keydown", (e) => {

    if (e.key === "Enter")
      sendMessage();

});

function sendMessage() {

  const input =
    document.getElementById("chatInput");

  const text =
    input.value.trim();

  if (!text || !currentUser)
    return;

  chatDb.collection("chat").add({

    uid: currentUser.uid,

    username:
      currentUser.displayName ||
      "Anonymous",

    text,

    timestamp:
      firebase.firestore.FieldValue.serverTimestamp()

  });

  input.value = "";

}

// clear chat (LOCAL only)
document
  .getElementById("clearLocalBtn")
  .addEventListener("click", () => {

    document
      .getElementById("chatMessages")
      .innerHTML = "";

});

// GLOBAL CHAT CLEAR
document
  .getElementById("adminClearBtn")
  ?.addEventListener("click", async () => {

    try {

      const snapshot =
        await chatDb
          .collection("chat")
          .get();

      const batch =
        chatDb.batch();

      snapshot.forEach(doc => {

        batch.delete(doc.ref);

      });

      await batch.commit();

      alert("Global chat cleared.");

    } catch (err) {

      console.error(err);

      alert("Failed to clear chat.");

    }

});

// LOAD ONLINE USERS
function loadOnlineUsers() {

  chatDb.collection("onlineUsers")
    .onSnapshot(snapshot => {

      onlineUsersList.innerHTML = "";

      snapshot.forEach(doc => {

        const data =
          doc.data();

        const li =
          document.createElement("li");

        li.textContent =
          data.username;

        onlineUsersList
          .appendChild(li);

      });

    });

}

// REMOVE USER WHEN THEY LEAVE
window.addEventListener(
  "beforeunload",
  async () => {

    if (currentUser) {

      await chatDb
        .collection("onlineUsers")
        .doc(currentUser.uid)
        .delete();

    }

});