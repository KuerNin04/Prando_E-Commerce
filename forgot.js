document.getElementById("forgotForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const studentid = document.getElementById("studentid").value;
    const email = document.getElementById("email").value;
    const errorMsg = document.getElementById("errorMsg");

    if (studentid === "" || email === "") {
        errorMsg.textContent = "Please fill in both ID Number and Email.";
    } else {
        errorMsg.textContent = "";
        alert("Reset instructions sent to " + email);
        window.location.href = "website1.html";
    }
});