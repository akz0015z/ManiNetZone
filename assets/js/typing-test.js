document.addEventListener("DOMContentLoaded", () => {
  // WORD LIST
  const wordList = [
    "hello","world","typing","speed","test","monkey","zone","javascript",
    "firebase","coding","project","keyboard","future","stars","dream",
    "focus","create","system","flow","magic","cloud","rocket","planet",
    "galaxy","vision","logic","screen","window","button","pixel","shadow",
    "mirror","music","noise","ocean","river","forest","field","storm",
    "rain","thunder","sunrise","sunset","color","pattern","object","number",
    "letter","symbol","string","array","loop","function","method","class",
    "network","secure","token","access","storage","file","login","logout",
    "account","profile","status","message","chat","strong","simple",
    "complex","bonus","repeat","break","escape","delete","quick","slow",
    "wild","calm","idea","solve","build","change","adapt","improve",
    "design","render","reset","start","stop","finish","stable","debug",
    "backend","frontend","database","developer","software","hardware",
    "responsive","browser","server","client","runtime","compile",
    "syntax","framework","library","deploy","github","commit",
    "terminal","virtual","memory","engine","workflow","interface",
    "animation","module","boolean","integer","react","python",
    "hacker","firewall","malware","phishing","trojan","payload",
    "virus","exploit","encryption","decrypt","spoofing","spyware",
    "ransomware","keylogger","anonymous","scanner","protocol",
    "router","switch","packet","breach","authentication","vpn",
    "cyber","networking","security","linux","windows","firefox",
    "leaderboard","streak","accuracy","winner","rank","elite",
    "diamond","bronze","silver","gold","master","challenge",
    "practice","reaction","achievement","xp","score","boost"
  ];

  // ELEMENTS

  const wordsElement = document.getElementById("words");
  const input = document.getElementById("typingInput");

  const timeLeftEl = document.getElementById("timeLeft");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy");
  const rankEl = document.getElementById("typingRank");

  if (!wordsElement || !input) {
    console.error("Typing test elements not found.");
    return;
  }

  // VARIABLES

  let words = [];
  let wordIndex = 0;

  let correctChars = 0;
  let totalChars = 0;

  let timer = null;

  let timeLeft = 60;
  let testDuration = 60;

  let testRunning = false;

  // GENERATE WORDS

  function generateWords() {

    words = [];
    wordsElement.innerHTML = "";

    for (let i = 0; i < 80; i++) {

      const w =
        wordList[Math.floor(Math.random() * wordList.length)];

      words.push(w);

      const span = document.createElement("span");
      span.className = "word";

      span.innerHTML = w
        .split("")
        .map(letter => `<span class="letter">${letter}</span>`)
        .join("");

      wordsElement.appendChild(span);
    }

    const firstWord = document.querySelectorAll(".word")[0];

    if (firstWord) {
      firstWord.classList.add("active-word");
    }
  }

  generateWords();

  // GET TYPING RANK

  function getTypingRank(wpm, accuracy) {

    if (accuracy < 85) {
      return "⚠️ Focus More On Accuracy";
    }

    if (wpm < 30) {
      return "🐢 Beginner Typist";
    }

    if (wpm < 50) {
      return "🙂 Average Typist";
    }

    if (wpm < 75) {
      return "🔥 Good Typist";
    }

    if (wpm < 80) {
      return "⚡ Fast Typist";
    }

    return "👑 Elite Typist";
  }

  // START TEST

  function startTest() {

    testRunning = true;

    timer = setInterval(() => {

      timeLeft--;

      timeLeftEl.innerText = timeLeft;

      if (timeLeft <= 0) {
        endTest();
      }

    }, 1000);
  }

  // INPUT HANDLER

  input.addEventListener("input", () => {

    if (!testRunning) {
      startTest();
    }

    const wordSpans = document.querySelectorAll(".word");

    const currentWordEl = wordSpans[wordIndex];

    if (!currentWordEl) return;

    const letters = currentWordEl.querySelectorAll(".letter");

    const typed = input.value;

    // LETTER HIGHLIGHTING

    for (let i = 0; i < letters.length; i++) {

      if (typed[i] == null) {

        letters[i].className = "letter";

      } else if (typed[i] === letters[i].innerText) {

        letters[i].className = "letter correct";

      } else {

        letters[i].className = "letter incorrect";
      }
    }

    // SPACE = COMPLETE WORD

    if (typed.endsWith(" ")) {

      checkWord(typed.trim());

      input.value = "";
    }
  });

  // CHECK WORD

  function checkWord(typedWord) {

    const wordSpans = document.querySelectorAll(".word");

    const correctWord = words[wordIndex];

    totalChars += typedWord.length;

    if (typedWord === correctWord) {
      correctChars += typedWord.length;
    }

    if (wordSpans[wordIndex]) {
      wordSpans[wordIndex].classList.remove("active-word");
    }

    wordIndex++;

    if (wordSpans[wordIndex]) {
      wordSpans[wordIndex].classList.add("active-word");
    }
  }

  // END TEST

  function endTest() {

    clearInterval(timer);

    testRunning = false;

    input.disabled = true;

    const minutes = testDuration / 60;

    const wordsPerMinute =
      minutes > 0
        ? Math.round((correctChars / 5) / minutes)
        : 0;

    const accuracy =
      totalChars > 0
        ? Math.round((correctChars / totalChars) * 100)
        : 0;

    // DISPLAY RESULTS

    wpmEl.innerText = wordsPerMinute;

    accuracyEl.innerText = accuracy + "%";

    const rank =
      getTypingRank(wordsPerMinute, accuracy);

    rankEl.innerText = "Rank: " + rank;

    // 🔥 SAVE TO FIRESTORE
    saveTypingResult(wordsPerMinute, accuracy);
  }

  // TIME BUTTONS

  const timeButtons =
    document.querySelectorAll(".time-btn");

  timeButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      document
        .querySelector(".time-btn.active")
        ?.classList.remove("active");

      btn.classList.add("active");

      testDuration =
        parseInt(btn.dataset.time);

      timeLeft = testDuration;

      timeLeftEl.innerText = timeLeft;

      resetTest();
    });
  });

  // RESET TEST

  function resetTest() {

    clearInterval(timer);

    testRunning = false;

    input.disabled = false;

    input.value = "";

    wordIndex = 0;

    correctChars = 0;

    totalChars = 0;

    wpmEl.innerText = "0";

    accuracyEl.innerText = "0%";

    if (rankEl) {
      rankEl.innerText = "Rank: --";
    }

    generateWords();
  }

  // SAVING TYPING RESULT

  async function saveTypingResult(wpm, accuracy) {

    const user = auth.currentUser;

    if (!user) return;

    try {

      //  XP SYSTEM

      let earnedXP = 15;

      if (testDuration === 30) {
        earnedXP = 45;
      }

      if (testDuration === 60) {
        earnedXP = 75;
      }

      // BONUS XP
      if (wpm >= 70) {
        earnedXP += 25;
      }
      else if (wpm >= 50) {
        earnedXP += 10;
      }

      // SAVE TEST HISTORY

      await db.collection("typingResults").add({

        uid: user.uid,

        username:
          user.displayName || "Player",

        wpm: wpm,

        accuracy: accuracy,

        duration: testDuration,

        xpEarned: earnedXP,

        createdAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });

      // USER REF

      const userRef =
        db.collection("users").doc(user.uid);

      const userSnap =
        await userRef.get();

      if (!userSnap.exists) return;

      const data = userSnap.data();

      // OLD VALUES

      const oldTypingXP =
        data.typingXP || 0;

      const oldTotalXP =
        data.xp || 0;

      const oldTests =
        data.testsCompleted || 0;

      const oldHighestWPM =
        data.highestWPM || 0;

      const oldAverageWPM =
        data.averageWPM || 0;

      // NEW VALUES

      const newTypingXP =
        oldTypingXP + earnedXP;

      const newTotalXP =
        oldTotalXP + earnedXP;

      const highestWPM =
        Math.max(oldHighestWPM, wpm);

      const averageWPM =
        Math.round(
          (
            (oldAverageWPM * oldTests) + wpm
          ) / (oldTests + 1)
        );

      // UPDATE USER

      await userRef.update({

        typingXP: newTypingXP,

        xp: newTotalXP,

        highestWPM: highestWPM,

        averageWPM: averageWPM,

        testsCompleted: oldTests + 1,

        typingAccuracy: accuracy

      });

      console.log("Typing stats saved!");

    } catch (err) {

      console.error(
        "Typing Firestore Error:",
        err
      );

    }

  }

});