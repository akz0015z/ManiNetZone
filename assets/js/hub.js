auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = db.collection("users").doc(user.uid);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const data = userDoc.data();
    document.getElementById("hubDisplayName").textContent = data.displayName || "User";
  } else {
    document.getElementById("hubDisplayName").textContent = user.email;
  }
});
