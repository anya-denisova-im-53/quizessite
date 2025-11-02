const app = document.getElementById("app");


const getQuizzes = () => JSON.parse(localStorage.getItem("quizzes") || "[]");
const saveQuizzes = (quizzes) => localStorage.setItem("quizzes", JSON.stringify(quizzes));


function showHome() {
  const quizzes = getQuizzes();
  app.innerHTML = `
    <h2>Quiz List</h2>
    ${quizzes.length === 0 ? "<p>No quizzes available</p>" : ""}
    <ul>
      ${quizzes.map((q, i) => `<li>
        ${q.name} 
        <button onclick="startQuiz(${i})" class="take-btn">Take</button>
        <button onclick="deleteQuiz(${i})" class="delete-btn">Delete</button>
      </li>`).join("")}
    </ul>
    <button onclick="showCreate()">Create New Quiz</button>
  `;
}

function deleteQuiz(index) {
  if (!confirm("Are you sure you want to delete this quiz?")) return;
  const quizzes = getQuizzes();
  quizzes.splice(index, 1);
  saveQuizzes(quizzes);
  showHome();
}

function showCreate() {
  app.innerHTML = `
    <h2>Create New Quiz</h2>
    <input id="quizName" placeholder="Quiz Name" />
    <textarea id="quizDesc" placeholder="Quiz Description"></textarea>
    <div id="questions"></div>
    <button onclick="addQuestion()">Add Question</button>
    <br><br>
    <button onclick="saveQuiz()">Save Quiz</button>
    <button onclick="showHome()">Back</button>
  `;
}

function addQuestion() {
  const questionsDiv = document.getElementById("questions");
  const qIndex = questionsDiv.children.length;
  const qDiv = document.createElement("div");
  qDiv.className = "question-block";
  qDiv.innerHTML = `
    <input placeholder="Question" id="q-${qIndex}" />
    <div class="answers">
      <div class="answer-block"><input placeholder="Answer 1" id="a-${qIndex}-0" /> 
      <input type="radio" name="correct-${qIndex}" value="0" title="Correct"/></div>
      <div class="answer-block"><input placeholder="Answer 2" id="a-${qIndex}-1" /> 
      <input type="radio" name="correct-${qIndex}" value="1"/></div>
      <div class="answer-block"><input placeholder="Answer 3" id="a-${qIndex}-2" /> 
      <input type="radio" name="correct-${qIndex}" value="2"/></div>
    </div>
    <button class="delete-btn" onclick="deleteQuestion(${qIndex})">Delete Question</button>
  `;
  questionsDiv.appendChild(qDiv);
}

function deleteQuestion(index) {
  const questionsDiv = document.getElementById("questions");
  questionsDiv.removeChild(questionsDiv.children[index]);

  Array.from(questionsDiv.children).forEach((div, i) => {
    div.querySelector(`input[id^='q-']`).id = `q-${i}`;
    div.querySelectorAll(`input[id^='a-']`).forEach((a, j) => a.id = `a-${i}-${j}`);
    div.querySelector(`input[name^='correct-']`).name = `correct-${i}`;
    div.querySelector(".delete-btn").setAttribute("onclick", `deleteQuestion(${i})`);
  });
}

function saveQuiz() {
  const name = document.getElementById("quizName").value.trim();
  if (!name) return alert("Enter quiz name!");
  const desc = document.getElementById("quizDesc").value.trim();
  const questionDivs = document.querySelectorAll(".question-block");
  if (questionDivs.length === 0) return alert("Add at least one question!");

  const questions = Array.from(questionDivs).map((div, i) => {
    const text = div.querySelector(`#q-${i}`).value.trim();
    const answers = Array.from(div.querySelectorAll(`input[id^='a-${i}-']`)).map((a, j) => ({
      text: a.value,
      isCorrect: div.querySelector(`input[name='correct-${i}']:checked`)?.value == j
    }));
    return { text, options: answers };
  });

  const quizzes = getQuizzes();
  quizzes.push({ name, description: desc, questions });
  saveQuizzes(quizzes);
  alert("Quiz saved!");
  showHome();
}

function startQuiz(index) {
  const quiz = getQuizzes()[index];
  let current = 0;
  let score = 0;
  showQuestion();

  function showQuestion() {
    const q = quiz.questions[current];
    app.innerHTML = `
      <h2>${quiz.name}</h2>
      <p>${q.text}</p>
      ${q.options.map((opt, i) => `
        <div><button onclick="answer(${i})">${opt.text}</button></div>
      `).join("")}
      <br>
      <small>Question ${current + 1} of ${quiz.questions.length}</small>
    `;
  }

  window.answer = function(i) {
    if (quiz.questions[current].options[i].isCorrect) score++;
    current++;
    if (current < quiz.questions.length) showQuestion();
    else showResult();
  }

  function showResult() {
    app.innerHTML = `
      <h2>Result</h2>
      <p>Your score: ${score} / ${quiz.questions.length}</p>
      <button onclick="showHome()">Back to Home</button>
    `;
  }
}


showHome();
