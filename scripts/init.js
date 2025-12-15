const auth = new Auth();

const logoutBtn = document.querySelector("#logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => auth.logout());
}
