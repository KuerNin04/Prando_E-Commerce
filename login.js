document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("studentid").value;
    const pwd = document.getElementById("pwd").value;
    const errorMsg = document.getElementById("errorMsg");

    if (id === "" || pwd === "") {
        errorMsg.textContent = "Please fill in both ID Number and Password.";
    } else {
        errorMsg.textContent = "";
        window.location.href = "dashboard.html";
    }
});

function togglePassword() {
    const pwd = document.getElementById("pwd");
    pwd.type = pwd.type === "password" ? "text" : "password";
}