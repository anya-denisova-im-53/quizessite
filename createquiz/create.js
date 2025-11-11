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

  const label = document.createElement("label");
  label.textContent = "Mark as correct answer";
  label.style.marginTop = "4px";
  label.appendChild(checkbox);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "del-btn";
  delBtn.onclick = () => {
    optionsBox.removeChild(row);
    const index = currentOptions.indexOf(option);
    if (index > -1) currentOptions.splice(index, 1);
  };

  row.appendChild(input);
  row.appendChild(label);
  row.appendChild(delBtn);

  optionsBox.appendChild(row);
};


document.getElementById("save-question-btn").onclick = () => {
  const questionText = document.getElementById("q-text").value.trim();
  if (!questionText) {
    alert("Please enter a question");
    return;
  }

  const options = [];
  currentOptions.forEach(opt => {
    const text = opt.input ? opt.input.value.trim() : opt.text;
    const isCorrect = opt.checkbox ? opt.checkbox.checked : opt.isCorrect;
    if (text) options.push({ text, isCorrect });
  });

  if (options.length === 0) {
    alert("Add at least one option");
    return;
  }

  allQuestions.push({ text: questionText, options });

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
  if (!name || !desc || allQuestions.length === 0) {
    alert("Fill in quiz name, description, and add at least one question");
    return;
  }

  const quiz = { name, description: desc, questions: allQuestions };
  const saved = JSON.parse(localStorage.getItem("userQuizzes") || "[]");
  saved.push(quiz);
  localStorage.setItem("userQuizzes", JSON.stringify(saved));
  alert("Quiz saved!");
};




