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
    "design","render","reset","start","stop","finish","stable","debug","bully"
  ];

  const wordsElement = document.getElementById("words");
  const input = document.getElementById("typingInput");
  const timeLeftEl = document.getElementById("timeLeft");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy");

  if (!wordsElement || !input) {
    console.error("Typing test elements not found. Check HTML IDs.");
    return;
  }

  let words = [];
  let wordIndex = 0;
  let correctChars = 0;
  let totalChars = 0;
  let timer = null;
  let timeLeft = 60;
  let testDuration = 60;   
  let testRunning = false;

  
  // generate words 
  
  function generateWords() {
    words = [];
    wordsElement.innerHTML = "";

   // words
    for (let i = 0; i < 80; i++) {
      const w = wordList[Math.floor(Math.random() * wordList.length)];
      words.push(w);

      const span = document.createElement("span");
      span.className = "word";
      span.innerHTML = w
        .split("")
        .map((letter) => `<span class="letter">${letter}</span>`)
        .join("");

      wordsElement.appendChild(span);
    }

    const firstWord = document.querySelectorAll(".word")[0];
    if (firstWord) firstWord.classList.add("active-word");
  }

  generateWords();

  
  // typing input handler
  
  input.addEventListener("input", () => {
    if (!testRunning) startTest();

    const wordSpans = document.querySelectorAll(".word");
    const currentWordEl = wordSpans[wordIndex];
    if (!currentWordEl) return;

    const letters = currentWordEl.querySelectorAll(".letter");
    const typed = input.value;

    // highlight per letter
    for (let i = 0; i < letters.length; i++) {
      if (typed[i] == null) {
        letters[i].className = "letter";
      } else if (typed[i] === letters[i].innerText) {
        letters[i].className = "letter correct";
      } else {
        letters[i].className = "letter incorrect";
      }
    }

    // space then finish word
    if (typed.endsWith(" ")) {
      checkWord(typed.trim());
      input.value = "";
    }
  });

  
  // validate a finished word
  
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

 
  // start timer
 
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


  // the end test 

  function endTest() {
    clearInterval(timer);
    testRunning = false;
    input.disabled = true;

    const minutes = testDuration / 60; // full test duration
    const wordsPerMinute = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    wpmEl.innerText = wordsPerMinute;
    accuracyEl.innerText = accuracy + "%";
  }


  // time buttons

  const timeButtons = document.querySelectorAll(".time-btn");
  timeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".time-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      testDuration = parseInt(btn.dataset.time);
      timeLeft = testDuration;
      timeLeftEl.innerText = timeLeft;

      resetTest();
    });
  });

  // reset test
 
  function resetTest() {
    clearInterval(timer);
    testRunning = false;

    input.disabled = false;
    input.value = "";

    wordIndex = 0;
    correctChars = 0;
    totalChars = 0;

    generateWords();
  }
});
