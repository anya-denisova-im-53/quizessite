console.log("Manage loaded");

let quizzes = Storage.load("userQuizzes");
const listBox = document.getElementById("manage-list");
const editBox = document.getElementById("edit-box");



function loadManageList() {
    listBox.innerHTML = "";
    editBox.style.display = "none";

    if (quizzes.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No quizzes created.";
        listBox.appendChild(msg);
        return;
    }

    quizzes.forEach((quiz, index) => {
        const box = document.createElement("div");
        box.className = "quiz-item";

        const title = document.createElement("h3");
        title.textContent = quiz.name;

        const desc = document.createElement("p");
        desc.textContent = quiz.description;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditor(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteQuiz(index);

        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(editBtn);
        box.appendChild(deleteBtn);

        listBox.appendChild(box);
    });
}



function deleteQuiz(i) {
    if (!confirm("Delete this quiz?")) return;

    quizzes.splice(i, 1);
    Storage.save("userQuizzes", quizzes);
    loadManageList();
}



function openEditor(i) {
    const quiz = quizzes[i];

    listBox.innerHTML = "";
    editBox.style.display = "block";
    editBox.innerHTML = "";

   
    const titleInput = document.createElement("input");
    titleInput.value = quiz.name;

   
    const descInput = document.createElement("textarea");
    descInput.value = quiz.description;

    editBox.appendChild(titleInput);
    editBox.appendChild(descInput);

  

    const qList = document.createElement("div");
    editBox.appendChild(qList);

    function renderQuestions() {
        qList.innerHTML = "";

        quiz.questions.forEach((q, qIndex) => {
            const qBox = document.createElement("div");
            qBox.className = "question-item";

            
            const qInput = document.createElement("input");
            qInput.value = q.text;
            qInput.oninput = () => q.text = qInput.value;

            qBox.appendChild(qInput);

           
            const optsBox = document.createElement("div");
            optsBox.className = "options-box";

            q.options.forEach((opt, optIndex) => {
                const optRow = document.createElement("div");
                optRow.className = "opt-row";

                const optInput = document.createElement("input");
                optInput.value = opt.text;
                optInput.oninput = () => opt.text = optInput.value;

                const optCheck = document.createElement("input");
                optCheck.type = "checkbox";
                optCheck.checked = opt.isCorrect;
                optCheck.onchange = () => opt.isCorrect = optCheck.checked;

                const delOpt = document.createElement("button");
                delOpt.textContent = "X";
                delOpt.onclick = () => {
                    q.options.splice(optIndex, 1);
                    renderQuestions();
                };

                optRow.appendChild(optInput);
                optRow.appendChild(optCheck);
                optRow.appendChild(delOpt);

                optsBox.appendChild(optRow);
            });
            
            const addOpt = document.createElement("button");
            addOpt.textContent = "Add Option";
            addOpt.onclick = () => {
                q.options.push({ text: "", isCorrect: false });
                renderQuestions();
            };

           
            const delQ = document.createElement("button");
            delQ.textContent = "Delete Question";
            delQ.onclick = () => {
                quiz.questions.splice(qIndex, 1);
                renderQuestions();
            };

            qBox.appendChild(optsBox);
            qBox.appendChild(addOpt);
            qBox.appendChild(delQ);

            qList.appendChild(qBox);
        });
    }

    renderQuestions();

    
    const addQuestionBtn = document.createElement("button");
    addQuestionBtn.textContent = "Add Question";
    addQuestionBtn.onclick = () => {
        quiz.questions.push({
            text: "",
            options: []
        });
        renderQuestions();
    };
    editBox.appendChild(addQuestionBtn);

   

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.onclick = () => {
        quiz.name = titleInput.value.trim();
        quiz.description = descInput.value.trim();

        quizzes[i] = quiz;
        Storage.save("userQuizzes", quizzes);

        alert("Saved!");
        loadManageList();
    };

    editBox.appendChild(saveBtn);

    
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = loadManageList;
    editBox.appendChild(cancelBtn);
}


loadManageList();