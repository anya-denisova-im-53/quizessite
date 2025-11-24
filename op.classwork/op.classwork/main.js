// Перехід між сторінками
function goToPage(page) {
  window.location.href = page;
}

// Якщо тестів ще немає — створюємо порожній масив
if (!localStorage.getItem("quizzes")) {
  localStorage.setItem("quizzes", JSON.stringify([]));
}

// Якщо результатів ще немає — створюємо порожній масив
if (!localStorage.getItem("results")) {
  localStorage.setItem("results", JSON.stringify([]));
}
function showPage(page) {
    document.querySelectorAll('main > div').forEach(d => d.style.display = "none");
    document.getElementById(page).style.display = "block";
    if(page === "manage") loadManageList();
}
