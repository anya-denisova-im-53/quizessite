function goToPage(page) {
  window.location.href = page;
}


if (!localStorage.getItem("quizzes")) {
  localStorage.setItem("quizzes", JSON.stringify([]));
}
if (!localStorage.getItem("results")) {
  localStorage.setItem("results", JSON.stringify([]));
}
function showPage(page) {
    document.querySelectorAll('main > div').forEach(d => d.style.display = "none");
    document.getElementById(page).style.display = "block";
    if(page === "manage") loadManageList();
}
