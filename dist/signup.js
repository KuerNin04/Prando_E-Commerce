document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const studentid = document.getElementById("studentid").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;
    const pwd = document.getElementById("pwd").value;
    const confirmpwd = document.getElementById("confirmpwd").value;
    const errorMsg = document.getElementById("errorMsg");

    if (fullname === "" || studentid === "" || age === "" || course === "" || pwd === "" || confirmpwd === "") {
        errorMsg.textContent = "Please fill in all fields.";
    } else if (pwd !== confirmpwd) {
        errorMsg.textContent = "Passwords do not match.";
    } else {
        errorMsg.textContent = "";
        alert("Account created successfully!");
        window.location.href = "website.html";
    }
});

function togglePassword() {
    const pwd = document.getElementById("pwd");
    pwd.type = pwd.type === "password" ? "text" : "password";
}

function toggleConfirmPassword() {
    const confirmpwd = document.getElementById("confirmpwd");
    confirmpwd.type = confirmpwd.type === "password" ? "text" : "password";
}