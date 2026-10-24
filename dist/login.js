const studentForm = document.getElementById("loginForm");
const sellerForm = document.getElementById("sellerForm");
const sellerSwitchButton = document.getElementById("sellerSwitchBtn");
const sellerConfirmDialog = document.getElementById("sellerConfirmDialog");

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    document.getElementById("errorMsg").textContent = "";
    const accountId = document.getElementById("studentid").value;
    sessionStorage.setItem("studentId", accountId);
    window.location.href = "dashboard.html";
});

sellerSwitchButton.addEventListener("click", function () {
    if (sellerForm.hidden) {
        sellerConfirmDialog.showModal();
    } else {
        showStudentForm();
    }
});

document.getElementById("confirmSellerSwitch").addEventListener("click", function () {
    sellerConfirmDialog.close();
    showSellerForm();
});

document.getElementById("cancelSellerSwitch").addEventListener("click", function () {
    sellerConfirmDialog.close();
    sellerSwitchButton.focus();
});

sellerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const accountId = document.getElementById("sellerId").value;
    document.getElementById("sellerErrorMsg").textContent = "";
    sessionStorage.setItem("sellerId", accountId);
    window.location.href = "seller-dashboard.html";
});

document.getElementById("showSellerPassword").addEventListener("change", function (event) {
    document.getElementById("sellerPwd").type = event.target.checked ? "text" : "password";
});

function showStudentForm() {
    sellerForm.hidden = true;
    studentForm.hidden = false;
    animateAccountSwitch(studentForm, 'account-switch-from-left');
    sellerSwitchButton.setAttribute("aria-label", "Switch to seller sign-in");
    sellerSwitchButton.title = "Seller sign-in";
    document.getElementById("studentid").focus();
}

function showSellerForm() {
    studentForm.hidden = true;
    sellerForm.hidden = false;
    animateAccountSwitch(sellerForm, 'account-switch-from-right');
    sellerSwitchButton.setAttribute("aria-label", "Switch to student sign-in");
    sellerSwitchButton.title = "Student sign-in";
    document.getElementById("sellerId").focus();
}

if (new URLSearchParams(window.location.search).get("account") === "seller") {
    showSellerForm();
}

function togglePassword() {
    const pwd = document.getElementById("pwd");
    pwd.type = pwd.type === "password" ? "text" : "password";
}

function animateAccountSwitch(form, direction) {
    form.classList.remove('account-switch-from-left', 'account-switch-from-right');
    void form.offsetWidth;
    form.classList.add(direction);
}