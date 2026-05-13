const totalQuizzesEl =
  document.getElementById("totalQuizzes");

const accuracyEl =
  document.getElementById("accuracyStat");

const bestScoreEl =
  document.getElementById("bestScore");

const xpEl =
  document.getElementById("xpStat");

const xpFill =
  document.getElementById("xpFill");

const levelText =
  document.getElementById("levelText");

// THE TYPING STATS

const highestWPMEl =
  document.getElementById("highestWPM");

const averageWPMEl =
  document.getElementById("averageWPM");

const typingAccuracyEl =
  document.getElementById("typingAccuracy");

const testsCompletedEl =
  document.getElementById("testsCompleted");

const typingXPEl =
  document.getElementById("typingXP");

// THE ARENA STATS

const arenaGamesPlayedEl =
  document.getElementById("arenaGamesPlayed");

const arenaHighScoreEl =
  document.getElementById("arenaHighScore");

const arenaBestComboEl =
  document.getElementById("arenaBestCombo");

const arenaXPEl =
  document.getElementById("arenaXP");

// THE LEADERBOARD FUNCTION

async function loadLeaderboard() {

  try {

    const snapshot = await firebase
      .firestore()
      .collection("users")
      .get();

    const leaders =
      document.querySelectorAll(".leader");

    const medals =
      ["🥇", "🥈", "🥉"];

    let users = [];

    snapshot.forEach((doc) => {

      const data = doc.data();

      users.push({

        username:
          data.username || "Player",

        xp:
          data.xp || 0

      });

    });

    // WHERE TO SORT XP

    users.sort(
      (a, b) => b.xp - a.xp
    );

    // TOP 3

    users.slice(0, 3)
      .forEach((user, index) => {

        if (leaders[index]) {

          leaders[index].innerHTML = `

            <span class="leader-name">
              ${medals[index]} ${user.username}
            </span>

            <span class="leader-xp">
              ${user.xp} XP
            </span>

          `;
        }

      });

  } catch (err) {

    console.error(
      "Leaderboard Error:",
      err
    );

  }

}

// THE LIVE USER STATS

firebase.auth()
.onAuthStateChanged((user) => {

  if (!user) return;

  firebase
    .firestore()
    .collection("users")
    .doc(user.uid)

    // THE LIVE SNAPSHOT
    .onSnapshot((doc) => {

      if (!doc.exists) return;

      const data = doc.data();

     
      // THE QUIZ STATS
     

      totalQuizzesEl.innerText =
        data.totalQuizzes || 0;

      accuracyEl.innerText =
        (data.accuracy || 0) + "%";

      bestScoreEl.innerText =
        `${data.bestScore || 0}/10`;

      xpEl.innerText =
        `${data.xp || 0} XP`;

      
      // TYPING STATS
      

      highestWPMEl.innerText =
        data.highestWPM || 0;

      averageWPMEl.innerText =
        data.averageWPM || 0;

      typingAccuracyEl.innerText =
        (data.typingAccuracy || 0) + "%";

      testsCompletedEl.innerText =
        data.testsCompleted || 0;

      typingXPEl.innerText =
        `${data.typingXP || 0} XP`;

      
      // ARENA STATS
    

      arenaGamesPlayedEl.innerText =
        data.arenaGamesPlayed || 0;

      arenaHighScoreEl.innerText =
        data.arenaHighScore || 0;

      arenaBestComboEl.innerText =
        data.arenaBestCombo || 0;

      arenaXPEl.innerText =
        `${data.arenaXP || 0} XP`;

     
      // LEVEL SYSTEM
      

      const xp =
        data.xp || 0;

      let level =
        Math.floor(xp / 1000) + 1;

      // MAX LEVEL

      if (level > 30) {

        level = 30;

      }

      const currentLevelXPNeeded =
        (level - 1) * 1000;

      const nextLevelXPNeeded =
        level * 1000;

      const xpIntoLevel =
        xp - currentLevelXPNeeded;

      const xpNeededThisLevel =
        nextLevelXPNeeded -
        currentLevelXPNeeded;

      const progressPercent =
        (xpIntoLevel /
        xpNeededThisLevel) * 100;

      // XP BAR

      xpFill.style.width =
        progressPercent + "%";

      // LEVEL TEXT

      levelText.innerHTML =

        `<span>Level ${level}</span> • ${xp}/${nextLevelXPNeeded} XP`;

     
      // THE LEADERBOARD
      

      loadLeaderboard();

    });

});