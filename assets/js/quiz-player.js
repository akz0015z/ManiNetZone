const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");

let index = 0;
let score = 0;

let timer;
let timeLeft = 10;
let selectedTime = 10;

// 🔥 STEP 1 — GET SETTINGS FROM URL (FIXED + CLEAN)
const params = new URLSearchParams(window.location.search);

const category = params.get("category") || "web";
const difficulty = params.get("difficulty") || "easy";

// FIXED: timer should be NUMBER not boolean
const selectedTimeFromURL = parseInt(params.get("timer"));
selectedTime = !isNaN(selectedTimeFromURL) ? selectedTimeFromURL : 10;

// if timer = 0 → disabled
const timerEnabled = selectedTime > 0;

// 🔥 RANDOM QUESTION PICKER
function getRandomQuestions(pool, count = 10) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random);
  return shuffled.slice(0, count);
}

// 🔥 LOAD QUESTIONS
const pool = questions[category]?.[difficulty] || [];
const quizQuestions = getRandomQuestions(pool, 10);

// 🚀 SHOW QUESTION
function showQuestion() {
  const q = quizQuestions[index];

  if (!q) {
    endQuiz();
    return;
  }

  questionEl.innerText = q.q;
  progressEl.innerText = `Question ${index + 1}/${quizQuestions.length}`;

  optionsEl.innerHTML = "";

  q.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;

    btn.onclick = () => selectAnswer(i);

    optionsEl.appendChild(btn);
  });

  if (timerEnabled) {
    startTimer();
  } else {
    timerEl.innerText = "--";
  }
}

// ⏱️ TIMER
function startTimer() {
  clearInterval(timer);

  timeLeft = selectedTime;
  timerEl.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// ✅ ANSWER
function selectAnswer(i) {
  clearInterval(timer);

  if (i === quizQuestions[index].correct) {
    score++;
  }

  nextQuestion();
}

// ➡️ NEXT
function nextQuestion() {
  index++;

  if (index >= quizQuestions.length) {
    endQuiz();
    return;
  }

  showQuestion();
}

function endQuiz() {
  document.querySelector(".quiz-player-container").innerHTML = `
    <div class="quiz-box finish-box">
      <h2>🏁 Quiz Complete</h2>
      <p class="score-text">Score: ${score}/${quizQuestions.length}</p>

      <button class="feature-btn" onclick="goBack()">Back to Quiz Menu</button>
    </div>
  `;
}

function goBack() {
  window.location.href = "software.html";
}

// 🚀 START
showQuestion();