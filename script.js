const app = document.getElementById("app");


function showCreateQuiz() {
  app.innerHTML = `
    <h2>Create New Quiz</h2>
    <input id="quizName" placeholder="Quiz Name" />
    <textarea id="quizDesc" placeholder="Quiz Description"></textarea>
    <div id="questions"></div>
    <button onclick="addQuestion()">Add Question</button>
    <br><br>
    <button onclick="saveQuiz()">Save Quiz</button>
  `;
}


function addQuestion() {
  const questionsDiv = document.getElementById("questions");
  const qIndex = questionsDiv.children.length;

  const qDiv = document.createElement("div");
  qDiv.className = "question-block";

  qDiv.innerHTML = `
    <div class="question-header">
      <input placeholder="Question" id="q-${qIndex}" />
      <button class="delete-btn" onclick="deleteQuestion(${qIndex})">Delete Question</button>
    </div>
    <div class="answers">
      <div class="answer-block">
        <input placeholder="Answer 1" id="a-${qIndex}-0" />
        <input type="radio" name="correct-${qIndex}" value="0" title="Correct"/>
      </div>
      <div class="answer-block">
        <input placeholder="Answer 2" id="a-${qIndex}-1" />
        <input type="radio" name="correct-${qIndex}" value="1"/>
      </div>
      <div class="answer-block">
        <input placeholder="Answer 3" id="a-${qIndex}-2" />
        <input type="radio" name="correct-${qIndex}" value="2"/>
      </div>
    </div>
  `;

  questionsDiv.appendChild(qDiv);
}


function deleteQuestion(index) {
  const questionsDiv = document.getElementById("questions");
  const qBlocks = Array.from(questionsDiv.children);
  qBlocks[index]?.remove();

  const remaining = Array.from(questionsDiv.children);
  remaining.forEach((qDiv, i) => {
    qDiv.querySelector("input[id^='q-']").id = `q-${i}`;
    qDiv.querySelectorAll(".answer-block input[type='text']").forEach((a, j) => {
      a.id = `a-${i}-${j}`;
    });
    qDiv.querySelectorAll(".answer-block input[type='radio']").forEach((r, j) => {
      r.name = `correct-${i}`;
      r.value = j;
    });
    qDiv.querySelector(".delete-btn").setAttribute("onclick", `deleteQuestion(${i})`);
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

  const quiz = { name, description: desc, questions };
  localStorage.setItem("currentQuiz", JSON.stringify(quiz));
  alert("Quiz saved!");
  startQuiz();
}


function startQuiz() {
  const quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  let current = 0;
  let score = 0;

  showQuestion();

  function showQuestion() {
    const q = quiz.questions[current];
    app.innerHTML = `
      <h2>${quiz.name}</h2>
      <p>${q.text}</p>
      ${q.options.map((opt, i) => `<div><button onclick="answer(${i})">${opt.text}</button></div>`).join("")}
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
      <button onclick="showCreateQuiz()">Create New Quiz</button>
    `;
  }
}


showCreateQuiz();

