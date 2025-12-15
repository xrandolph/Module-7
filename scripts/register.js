window.onload = function () {
  document.querySelector("#registerBtn").addEventListener("click", registerUser);
};

async function registerUser() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  const response = await fetch("http://localhost:3000/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, status: "loggedout" })
  });

  if (response.status === 201) {
    alert("User registered successfully");
    window.location.replace("login.html");
  } else {
    const data = await response.json().catch(() => ({}));
    document.querySelector("#error").innerHTML = data.error || "Registration failed";
  }
}
