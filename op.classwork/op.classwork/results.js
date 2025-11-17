// Sample data (for testing)
const sampleResults = [
  { quiz: "History Quiz", score: "8/10", date: "2025-11-09" },
  { quiz: "Math Quiz", score: "10/10", date: "2025-11-10" },
];

// Save sample data to localStorage if not already there
if (!localStorage.getItem("quizResults")) {
  localStorage.setItem("quizResults", JSON.stringify(sampleResults));
}

// Load and display results
function loadResults() {
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = "";

  const results = JSON.parse(localStorage.getItem("quizResults")) || [];

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

// Clear all saved results
function clearResults() {
  localStorage.removeItem("quizResults");
  loadResults();
}

loadResults();
