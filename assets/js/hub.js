auth.onAuthStateChanged(async (user) => {

  if (!user) {

    window.location.href =
      "index.html";

    return;

  }

 
  // USER INFO
 

  try {

    const userRef =
      db.collection("users")
      .doc(user.uid);

    const userDoc =
      await userRef.get();

    if (userDoc.exists) {

      const data =
        userDoc.data();

      document.getElementById(
        "hubDisplayName"
      ).textContent =

        data.displayName ||
        data.username ||
        "User";

    }

    else {

      document.getElementById(
        "hubDisplayName"
      ).textContent =
        user.email;

    }

  } catch (err) {

    console.error(
      "User load error:",
      err
    );

  }

 
  // QUIZ STATS
 

  try {

  const userRef =
  db.collection("users")
  .doc(user.uid);

  const userDoc =
  await userRef.get();

  if (userDoc.exists) {

  const data =
    userDoc.data();

  document.getElementById(
    "statQuizAttempts"
  ).textContent =

    data.totalQuizzes || 0;

}

  } catch (err) {

    console.error(
      "Quiz stats error:",
      err
    );

  }

  
  // TYPING STATS


  try {

    const typingSnap =
      await db
      .collection("typingResults")
      .where(
        "uid",
        "==",
        user.uid
      )
      .get();

    document.getElementById(
      "statTypingSessions"
    ).textContent =
      typingSnap.size;

  } catch (err) {

    console.error(
      "Typing stats error:",
      err
    );

  }


// ARENA STATS


try {

  const userRef =
    db.collection("users")
    .doc(user.uid);

  const userDoc =
    await userRef.get();

  if (userDoc.exists) {

    const data =
      userDoc.data();

    document.getElementById(
      "statArenaAttempts"
    ).textContent =

      data.arenaGamesPlayed || 0;

  }

} catch (err) {

  console.error(
    "Arena stats error:",
    err
  );

}

});