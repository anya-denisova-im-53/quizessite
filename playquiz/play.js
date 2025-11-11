let quizzes = JSON.parse(localStorage.getItem("userQuizzes") || "[]");
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

// Elements
const quizSelect = document.getElementById("quiz-select");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers-box");
const resultText = document.getElementById("result-text");

// Load quizzes into select
quizzes.forEach((quiz, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = quiz.name;
  quizSelect.appendChild(option);
});

// Start quiz
document.getElementById("start-quiz-btn").onclick = () => {
  if (quizSelect.value === "") {
    alert("Please select a quiz");
    return;
  }

  currentQuiz = quizzes[quizSelect.value];
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("select-quiz-box").style.display = "none";
  quizBox.style.display = "block";
  showQuestion();
};

// Show a question dynamically
function showQuestion() {
  const q = currentQuiz.questions[currentQuestionIndex];
  questionText.textContent = q.text;

  answersBox.innerHTML = "";

  q.options.forEach((opt, index) => {
    const row = document.createElement("div");
    row.className = "answer-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "opt-" + index;

    const label = document.createElement("label");
    label.htmlFor = "opt-" + index;
    label.textContent = opt.text;

    row.appendChild(cb);
    row.appendChild(label);
    answersBox.appendChild(row);
  });
}

// Next question
document.getElementById("next-btn").onclick = () => {
  const q = currentQuiz.questions[currentQuestionIndex];
  let correct = true;

  q.options.forEach((opt, index) => {
    const cb = document.getElementById("opt-" + index);
    if (cb.checked !== opt.isCorrect) {
      correct = false;
    }
  });

  if (correct) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

// Show result
function showResult() {
  quizBox.style.display = "none";
  resultBox.style.display = "block";

  resultText.textContent =
    `You scored ${score} out of ${currentQuiz.questions.length}`;
}

// Navigation buttons
document.getElementById("exit-btn").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("home-btn").onclick = () => {
  window.location.href = "index.html";
};


