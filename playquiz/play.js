let quizzes = Storage.load("userQuizzes");
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

const quizSelect = document.getElementById("quiz-select");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers-box");
const resultText = document.getElementById("result-text");


quizzes.forEach((quiz, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = quiz.name;
    quizSelect.appendChild(option);
});


document.getElementById("start-quiz-btn").onclick = () => {
    if (quizSelect.value === "") return alert("Select a quiz");

    currentQuiz = quizzes[quizSelect.value];
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById("select-quiz-box").style.display = "none";
    quizBox.style.display = "block";

    showQuestion();
};


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


document.getElementById("next-btn").onclick = () => {
    const q = currentQuiz.questions[currentQuestionIndex];
    let correct = true;

    q.options.forEach((opt, index) => {
        const cb = document.getElementById("opt-" + index);
        if (cb.checked !== opt.isCorrect) correct = false;
    });

    if (correct) score++;

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};


function showResult() {
    quizBox.style.display = "none";
    resultBox.style.display = "block";

    resultText.textContent = `You scored ${score} out of ${currentQuiz.questions.length}`;

    
    const results = Storage.load("quizResults");
    results.push({
        quiz: currentQuiz.name,
        score: `${score}/${currentQuiz.questions.length}`,
        date: new Date().toISOString().split("T")[0]
    });
    Storage.save("quizResults", results); 
};



