const chatDb = firebase.firestore();
let currentUser = null;

// wait for auth
firebase.auth().onAuthStateChanged(user => {
  currentUser = user;
  if (!user) return;

  loadMessages();
});

// load last 100 messages
function loadMessages() {
  chatDb.collection("chat")
    .orderBy("timestamp", "desc")
    .limit(100)
    .onSnapshot(snapshot => {

      const messages = [];
      snapshot.forEach(doc => messages.push(doc.data()));

      messages.reverse(); // fix order oldest → newest
      displayMessages(messages);
    });
}

function displayMessages(messages) {
  const box = document.getElementById("chatMessages");
  box.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");

    const isYou = msg.uid === currentUser.uid;

    div.className = "chat-message " + (isYou ? "you" : "other");

    div.innerHTML = `
      <div class="chat-username">${msg.username}</div>
      ${msg.text}
    `;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

// send message
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("chatInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text || !currentUser) return;

  chatDb.collection("chat").add({
    uid: currentUser.uid,
    username: currentUser.displayName || "Anonymous",
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
}

// clear chat (LOCAL only)
document.getElementById("clearLocalBtn").addEventListener("click", () => {
  document.getElementById("chatMessages").innerHTML = "";
});
