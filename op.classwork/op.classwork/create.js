let currentOptions = [];
let allQuestions = [];

const optionsBox = document.getElementById("options-box");

document.getElementById("add-option-btn").onclick = () => {
    const option = { text: "", isCorrect: false };
    currentOptions.push(option);

    const row = document.createElement("div");
    row.className = "option-row";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Option text";
    input.oninput = () => option.text = input.value;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = () => option.isCorrect = checkbox.checked;

    const label = document.createElement("label");
    label.textContent = "Mark as correct answer";
    label.appendChild(checkbox);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "del-btn";
    delBtn.onclick = () => {
        row.remove();
        currentOptions = currentOptions.filter(o => o !== option);
    };

    row.appendChild(input);
    row.appendChild(label);
    row.appendChild(delBtn);

    optionsBox.appendChild(row);
};

document.getElementById("save-question-btn").onclick = () => {
    const questionText = document.getElementById("q-text").value.trim();
    if (!questionText) return alert("Please enter a question");

    if (currentOptions.length === 0) return alert("Add at least one option");

    allQuestions.push({
        text: questionText,
        options: [...currentOptions]
    });

    document.getElementById("q-text").value = "";
    optionsBox.innerHTML = "";
    currentOptions = [];

    updateQuestionList();
};

function updateQuestionList() {
    const list = document.getElementById("questions-list");
    list.innerHTML = "";

    allQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.textContent = `${i + 1}. ${q.text}`;
        list.appendChild(div);
    });
}

document.getElementById("save-quiz-btn").onclick = () => {
    const name = document.getElementById("quiz-name").value.trim();
    const desc = document.getElementById("quiz-desc").value.trim();

    if (!name || !desc || allQuestions.length === 0)
        return alert("Fill name, description, and at least one question");

    const quiz = { name, description: desc, questions: allQuestions };

    const quizzes = Storage.load("userQuizzes");
    quizzes.push(quiz);
    Storage.save("userQuizzes", quizzes);

    alert("Quiz saved!");

    // reset
    allQuestions = [];
    document.getElementById("questions-list").innerHTML = "";
};
