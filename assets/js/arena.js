document.addEventListener("DOMContentLoaded", () => {


  // ELEMENTS
 

  const arena = document.getElementById("arena");

  const timeEl = document.getElementById("time");
  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");

  const startBtn =
    document.getElementById("startArenaBtn");

 
  // TARGETS
  
  const goodTargets = [
    "💻",
    "🖥️",
    "⌨️",
    "🖱️",
    "📱",
    "🌐",
    "📡",
    "⚡",
    "🧠",
    "🛠️",
    "💾",
    "📁",
    "☁️"
  ];

  const badTargets = [
    "☠️",
    "🦠",
    "🐛",
    "⚠️",
    "🚫",
    "💀",
    "👾"
  ];


  // GAME SETTINGS
  

  let gameRunning = false;

  let score = 0;
  let combo = 0;

  let timeLeft = 60;

  let gameTimer = null;
  let spawnTimer = null;

  // MODES

  let selectedTime = 15;

  let speedMode = "medium";

  // SPEEDS

  const speedSettings = {

    slow: 950,

    medium: 700,

    fast: 400

  };

  
  // CREATE CONTROLS
 

  const controls =
    document.createElement("div");

  controls.className =
    "arena-controls";

  controls.innerHTML = `

    <div class="mode-group">

      <button class="arena-btn active time-mode" data-time="15">
        15s
      </button>

      <button class="arena-btn time-mode" data-time="30">
        30s
      </button>

      <button class="arena-btn time-mode" data-time="60">
        60s
      </button>

    </div>

    <div class="mode-group">

      <button class="arena-btn speed-mode" data-speed="slow">
        🐢 Slow
      </button>

      <button class="arena-btn active speed-mode" data-speed="medium">
        ⚡ Medium
      </button>

      <button class="arena-btn speed-mode" data-speed="fast">
        ☄️ Fast
      </button>

    </div>

  `;

  arena.parentElement.insertBefore(
    controls,
    arena
  );

  
  // TIME MODE BUTTONS
 

  document
    .querySelectorAll(".time-mode")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        document
          .querySelectorAll(".time-mode")
          .forEach(b =>
            b.classList.remove("active")
          );

        btn.classList.add("active");

        selectedTime =
          parseInt(btn.dataset.time);

        timeLeft = selectedTime;

        timeEl.innerText = timeLeft;

      });

    });

  
  // SPEED MODE BUTTONS
  

  document
    .querySelectorAll(".speed-mode")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        document
          .querySelectorAll(".speed-mode")
          .forEach(b =>
            b.classList.remove("active")
          );

        btn.classList.add("active");

        speedMode =
          btn.dataset.speed;

      });

    });

  
  // START GAME
  

  startBtn.addEventListener("click", () => {

    if (gameRunning) return;

    startGame();

  });

  function startGame() {

    gameRunning = true;

    score = 0;
    combo = 0;

    timeLeft = selectedTime;

    updateUI();

    startBtn.style.display = "none";

    // TIMER

    gameTimer = setInterval(() => {

      timeLeft--;

      updateUI();

      if (timeLeft <= 0) {

        endGame();

      }

    }, 1000);

    // TARGET SPAWN

    spawnTimer = setInterval(() => {

      spawnTarget();

    }, speedSettings[speedMode]);

  }

  
  // SPAWN TARGET
 

  function spawnTarget() {

    if (!gameRunning) return;

    const target =
      document.createElement("div");

    target.classList.add("target");

    // GOOD / BAD

    const isGood =
      Math.random() > 0.25;

    if (isGood) {

      target.classList.add("good");

      target.innerText =
        goodTargets[
          Math.floor(
            Math.random() *
            goodTargets.length
          )
        ];

    } else {

      target.classList.add("bad");

      target.innerText =
        badTargets[
          Math.floor(
            Math.random() *
            badTargets.length
          )
        ];

    }

    // POSITION

    const maxX =
      arena.clientWidth - 80;

    const maxY =
      arena.clientHeight - 80;

    const x =
      Math.random() * maxX;

    const y =
      Math.random() * maxY;

    target.style.left =
      `${x}px`;

    target.style.top =
      `${y}px`;

    arena.appendChild(target);

    // CLICK EVENT

    target.addEventListener("click", () => {

      if (isGood) {

        combo++;

        score +=
          25 + (combo * 2);

        // BONUS

        if (combo % 5 === 0) {

          score += 50;

        }

      } else {

        score -= 15;

        combo = 0;

      }

      updateUI();

      target.remove();

    });

    // REMOVE TARGET

    setTimeout(() => {

      target.remove();

    }, speedMode === "fast"
        ? 700
        : speedMode === "slow"
        ? 1500
        : 1000);

  }

  
  // UPDATE UI
  

  function updateUI() {

    timeEl.innerText =
      timeLeft;

    scoreEl.innerText =
      score;

    comboEl.innerText =
      combo;

  }

  
  // END GAME
  

  function endGame() {

    gameRunning = false;

    clearInterval(gameTimer);

    clearInterval(spawnTimer);

    // REMOVE TARGETS

    document
      .querySelectorAll(".target")
      .forEach(t => t.remove());

    
    // XP SYSTEM
    

    let earnedXP = 0;

    // 15s

    if (selectedTime === 15) {

      earnedXP =
        Math.floor(score / 20);

    }

    // 30s

    else if (selectedTime === 30) {

      earnedXP =
        Math.floor(score / 15);

    }

    // 60s

    else if (selectedTime === 60) {

      earnedXP =
        Math.floor(score / 10);

    }

    // FAST BONUS

    if (speedMode === "fast") {

      earnedXP += 50;

    }

    // COMBO BONUS

    earnedXP +=
      Math.floor(combo * 2);

    // MIN XP

    if (earnedXP < 10) {

      earnedXP = 10;

    }

    // SAVE STATS

    saveArenaStats(
      score,
      earnedXP
    );

    // PLAY AGAIN

    startBtn.style.display =
      "block";

    startBtn.innerText =
      `Play Again (${score} Score • ${earnedXP} XP)`;

  }

  
  // SAVE TO FIREBASE
 

  async function saveArenaStats(
    score,
    earnedXP
  ) {

    // FIXED AUTH

    const user =
      firebase
        .auth()
        .currentUser;

    if (!user) return;

    try {

      // FIXED FIRESTORE

      const userRef =
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid);

      const snap =
        await userRef.get();

      if (!snap.exists) return;

      const data =
        snap.data();

      const oldXP =
        data.xp || 0;

      const oldArenaXP =
        data.arenaXP || 0;

      const oldHighScore =
        data.arenaHighScore || 0;

      const oldGames =
        data.arenaGamesPlayed || 0;

      const oldBestCombo =
        data.arenaBestCombo || 0;

      // UPDATE FIRESTORE

      await userRef.update({

        xp:
          oldXP + earnedXP,

        arenaXP:
          oldArenaXP + earnedXP,

        arenaHighScore:
          Math.max(
            oldHighScore,
            score
          ),

        arenaGamesPlayed:
          oldGames + 1,

        arenaBestCombo:
          Math.max(
            oldBestCombo,
            combo
          )

      });

      console.log(
        "Arena stats saved!"
      );

    } catch (err) {

      console.error(
        "Arena Save Error:",
        err
      );

    }

  }

});