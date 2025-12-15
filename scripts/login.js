let token = "";

window.onload = function () {
  document.querySelector("#loginBtn").addEventListener("click", async () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    await login(username, password);
  });

  document.querySelector("#statusBtn").addEventListener("click", displayStatus);
};

async function login(username, password) {
  const loginCredentials = { username, password };

  const response = await fetch("http://localhost:3000/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginCredentials)
  });

  if (response.ok) {
    const tokenResponse = await response.json();

    token = tokenResponse.token;
    const uname = tokenResponse.username2;
    const auth = tokenResponse.auth;

    localStorage.setItem("token", token);
    localStorage.setItem("uname", uname);
    localStorage.setItem("auth", auth);

    window.location.replace("index.html");
  } else {
    document.querySelector("#error").innerHTML = "Bad username and/or password";
  }
}

async function displayStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found. Log in first.");
    return;
  }

  const response = await fetch("http://localhost:3000/api/status", {
    method: "GET",
    headers: {
      "x-auth": token
    }
  });

  if (response.ok) {
    const users = await response.json();
    document.querySelector("#status").innerHTML =
      users.map(u => `<div>${u.username} - ${u.status}</div>`).join("");
  } else {
    document.querySelector("#error").innerHTML = "Status request failed (token invalid?)";
  }
}
