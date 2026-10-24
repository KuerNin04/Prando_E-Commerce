const forgotForm = document.getElementById("forgotForm");
const isSellerRecovery = new URLSearchParams(window.location.search).get("account") === "seller";

if (isSellerRecovery) {
    document.getElementById("forgotTitle").textContent = "Seller Password Help";
    document.getElementById("forgotDescription").textContent = "Enter the email address linked to your seller account.";
    document.getElementById("studentIdField").hidden = true;
    document.getElementById("studentid").required = false;
    document.getElementById("forgotSubmit").value = "Request Help";
    document.getElementById("backToLogin").href = "website.html?account=seller";
}

forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = isSellerRecovery
        ? "Seller password recovery is not connected yet. Contact your portal administrator."
        : "Password recovery is not connected yet. Contact your portal administrator.";
});