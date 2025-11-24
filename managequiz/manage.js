let quizzes = window.quizzes || [];

function draw() {
  const box = document.getElementById("quiz-list");
  box.innerHTML = "";

  quizzes.forEach((quiz, qi) => {
    const div = document.createElement("div");
    div.className = "q-item";

    const name = document.createElement("input");
    name.value = quiz.name;
    name.oninput = () => quiz.name = name.value;

    const desc = document.createElement("textarea");
    desc.value = quiz.description;
    desc.oninput = () => quiz.description = desc.value;

    div.appendChild(name);
    div.appendChild(desc);

    quiz.questions.forEach((q, i) => {
      const qDiv = document.createElement("div");
      qDiv.className = "answer-row";

      const inp = document.createElement("input");
      inp.value = q.text;
      inp.oninput = () => q.text = inp.value;

      const delQ = document.createElement("button");
      delQ.textContent = "Delete question";
      delQ.onclick = () => {
        quiz.questions.splice(i, 1);
        draw();
      };

      qDiv.appendChild(inp);
      qDiv.appendChild(delQ);
      div.appendChild(qDiv);
    });

    const delQuiz = document.createElement("button");
    delQuiz.textContent = "Delete quiz";
    delQuiz.onclick = () => {
      quizzes.splice(qi, 1);
      draw();
    };

    div.appendChild(delQuiz);
    box.appendChild(div);
  });
}

draw();
