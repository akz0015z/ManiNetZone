const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");

let index = 0;
let score = 0;

let timer;
let timeLeft = 10;
let selectedTime = 10;

//  GET SETTINGS FROM URL
const params = new URLSearchParams(window.location.search);

const category = params.get("category") || "web";
const difficulty = params.get("difficulty") || "easy";

// FIXED: timer handling
const selectedTimeFromURL = parseInt(params.get("time"));
selectedTime = !isNaN(selectedTimeFromURL) ? selectedTimeFromURL : 10;


const timerEnabled = selectedTime > 0;

//  RANDOM QUESTION PICKER
function getRandomQuestions(pool, count = 10) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// LOAD QUESTIONS
const pool = questions[category]?.[difficulty] || [];
const quizQuestions = getRandomQuestions(pool, 10);

// SHOW QUESTION
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

// TIMER
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

//  ANSWER
function selectAnswer(i) {
  clearInterval(timer);

  if (i === quizQuestions[index].correct) {
    score++;
  }

  nextQuestion();
}

//  NEXT
function nextQuestion() {
  index++;

  if (index >= quizQuestions.length) {
    endQuiz();
    return;
  }

  showQuestion();
}

// END QUIZ
function endQuiz() {

  saveQuizResult();

  document.querySelector(".quiz-player-container").innerHTML = `
    <div class="quiz-box finish-box">
      <h2>🏁 Quiz Complete</h2>
      <p class="score-text">Score: ${score}/${quizQuestions.length}</p>

      <button class="feature-btn" onclick="goBackToMenu()">
        Back to Quiz Menu
      </button>
    </div>
  `;
}

// SMART BACK BUTTON
function goBackToMenu() {

  const hubs = {
    cyber: "cyber.html",
    hacking: "cyber.html",
    malware: "cyber.html",
    network: "cyber.html",

    web: "software.html",
    js: "software.html",
    algo: "software.html",
    system: "software.html"
  };

  window.location.href = hubs[category] || "software.html";
}

// SAVE QUIZ TO FIRESTORE
async function saveQuizResult() {

  console.log("Saving quiz...");
  console.log(auth.currentUser);

  const user = auth.currentUser;

  if (!user) {
    console.log("No user logged in");
    return;
  }

  const percentage = Math.round(
    (score / quizQuestions.length) * 100
  );

  try {

    await db.collection("quizResults").add({
      uid: user.uid,
      email: user.email,
      category: category,
      difficulty: difficulty,
      score: score,
      total: quizQuestions.length,
      percentage: percentage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Quiz result saved!");

// XP BASED ON SCORE
const earnedXP = score * 10;

// USER DOC REF
const userRef = db.collection("users").doc(user.uid);

// GET CURRENT USER DATA
const userSnap = await userRef.get();

if (userSnap.exists) {

  const userData = userSnap.data();

  // CURRENT VALUES
  const currentXP = userData.xp || 0;
  const currentBest = userData.bestScore || 0;
  const currentQuizzes = userData.totalQuizzes || 0;

  // UPDATE VALUES
  const newXP = currentXP + earnedXP;
  const newBest = Math.max(currentBest, score);

  // LEVEL SYSTEM
  const level = Math.floor(newXP / 100) + 1;

  // SAVE UPDATED STATS
  await userRef.update({

    xp: newXP,
    bestScore: newBest,
    totalQuizzes: currentQuizzes + 1,
    level: level,
    accuracy: percentage

  });

  console.log("User stats updated!");

}

  } catch (err) {

    console.error("Firestore Error:", err);

  }
}

// START
showQuestion();