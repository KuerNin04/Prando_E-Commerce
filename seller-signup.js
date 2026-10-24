const sellerSignupForm = document.getElementById("sellerSignupForm");
const sellerPassword = document.getElementById("sellerPassword");
const confirmSellerPassword = document.getElementById("confirmSellerPassword");

sellerSignupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = document.getElementById("sellerSignupMessage");
    if (sellerPassword.value !== confirmSellerPassword.value) {
        message.textContent = "Passwords do not match.";
        confirmSellerPassword.focus();
        return;
    }

    message.textContent = "Seller registration is not connected yet. Contact your portal administrator.";
});

document.getElementById("showSellerPasswords").addEventListener("change", function (event) {
    const inputType = event.target.checked ? "text" : "password";
    sellerPassword.type = inputType;
    confirmSellerPassword.type = inputType;
});