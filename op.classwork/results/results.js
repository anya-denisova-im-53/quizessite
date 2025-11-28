function loadResults() {
    const tableBody = document.querySelector("#resultsTable tbody");
    tableBody.innerHTML = "";

    const results = Storage.load("quizResults");

    if (results.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No results yet</td></tr>`;
        return;
    }

    results.forEach(result => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.quiz}</td>
            <td>${result.score}</td>
            <td>${result.date}</td>
        `;
        tableBody.appendChild(row);
    });
}

function clearResults() {
    Storage.remove("quizResults");
    loadResults();
}

loadResults();
