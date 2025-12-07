const wordList = [
  "hello", "world", "typing", "speed", "test", "monkey", "zone",
  "javascript", "firebase", "coding", "project", "keyboard", "future",
  "stars", "dream", "focus", "create", "system", "flow", "magic"
];

const wordsElement = document.getElementById("words");
const input = document.getElementById("typingInput");
const timeLeftEl = document.getElementById("timeLeft");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");

let words = [];
let wordIndex = 0;
let correctChars = 0;
let totalChars = 0;
let timer;
let timeLeft = 60;
let testRunning = false;

// generate infinite words
function generateWords() {
  words = [];
  wordsElement.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const w = wordList[Math.floor(Math.random() * wordList.length)];
    words.push(w);

    const span = document.createElement("span");
    span.className = "word";
    span.innerHTML = w.split("").map(letter => `<span class="letter">${letter}</span>`).join("");
    wordsElement.appendChild(span);
  }

  document.querySelectorAll(".word")[0].classList.add("active-word");
}

generateWords();

// start typing
input.addEventListener("input", () => {
  if (!testRunning) startTest();

  const currentWordEl = document.querySelectorAll(".word")[wordIndex];
  const letters = currentWordEl.querySelectorAll(".letter");

  const typed = input.value;

  
  for (let i = 0; i < letters.length; i++) {
    if (typed[i] == null) {
      letters[i].className = "letter";
    } else if (typed[i] === letters[i].innerText) {
      letters[i].className = "letter correct";
    } else {
      letters[i].className = "letter incorrect";
    }
  }

  
  if (typed.endsWith(" ")) {
    checkWord(typed.trim());
    input.value = "";
  }
});

// validate a word
function checkWord(typedWord) {
  const correctWord = words[wordIndex];

  totalChars += typedWord.length;

  if (typedWord === correctWord) {
    correctChars += typedWord.length;
  }

  // move to next word
  document.querySelectorAll(".word")[wordIndex].classList.remove("active-word");
  wordIndex++;

  if (wordIndex < words.length) {
    document.querySelectorAll(".word")[wordIndex].classList.add("active-word");
  }

  
  if (wordIndex % 10 === 0) {
    wordsElement.style.transform = `translateY(-${(wordIndex / 10) * 40}px)`;
  }
}

// start test
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

// end test
function endTest() {
  clearInterval(timer);
  input.disabled = true;

  const minutes = (60 - timeLeft) / 60;
  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy = Math.round((correctChars / totalChars) * 100);

  wpmEl.innerText = wpm || 0;
  accuracyEl.innerText = accuracy ? accuracy + "%" : "0%";
}

// time selector button
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".time-btn.active").classList.remove("active");
    btn.classList.add("active");

    timeLeft = parseInt(btn.dataset.time);
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
  wordsElement.style.transform = "translateY(0px)";

  generateWords();
}
