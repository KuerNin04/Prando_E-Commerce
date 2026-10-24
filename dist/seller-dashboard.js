const productStorageKey = "sellerProducts";
const sampleProducts = [
    { id: "sample-1", name: "PE Uniform", price: 650, category: "PE & Sports", stock: 24 },
    { id: "sample-2", name: "ID Lace", price: 150, category: "IDs & Laces", stock: 56 },
    { id: "sample-3", name: "College T-shirt", price: 350, category: "Merch", stock: 38 },
    { id: "sample-4", name: "Uniform Set", price: 800, category: "Uniforms", stock: 16 }
];
const previousSampleProducts = [
    { id: "sample-1", name: "Campus Hoodie", price: 42.5, category: "Apparel", stock: 18 },
    { id: "sample-2", name: "Insulated Water Bottle", price: 18, category: "Accessories", stock: 32 },
    { id: "sample-3", name: "Campus Notebook Set", price: 12.75, category: "Stationery", stock: 45 }
];
const sampleOrders = [
    { id: "#1048", customer: "Maya Thompson", product: "PE Uniform", status: "Processing", amount: 650 },
    { id: "#1047", customer: "Noah Williams", product: "ID Lace", status: "Completed", amount: 150 },
    { id: "#1046", customer: "Ava Chen", product: "College T-shirt", status: "Pending", amount: 350 },
    { id: "#1045", customer: "Ethan Brooks", product: "Uniform Set", status: "Completed", amount: 800 }
];
const sellerProfile = {
    name: "Jordan Lee",
    store: "Campus Corner",
    email: "hello@campuscorner.example",
    contact: "(555) 014-2024"
};

function loadProducts() {
    try {
        const savedProducts = localStorage.getItem(productStorageKey);
        if (savedProducts === null) return [...sampleProducts];

        const parsedProducts = JSON.parse(savedProducts);
        if (JSON.stringify(parsedProducts) === JSON.stringify(previousSampleProducts)) {
            localStorage.setItem(productStorageKey, JSON.stringify(sampleProducts));
            return [...sampleProducts];
        }
        return Array.isArray(parsedProducts) ? parsedProducts : [...sampleProducts];
    } catch {
        return [...sampleProducts];
    }
}

let products = loadProducts();
const productRows = document.getElementById("productRows");
const productForm = document.getElementById("productForm");
const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
}

function saveProducts() {
    localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function renderProducts() {
    productRows.innerHTML = products.map(product => `
        <tr>
            <td class="seller-product-name">${escapeHtml(product.name)}</td>
            <td>${currency.format(Number(product.price))}</td>
            <td>${escapeHtml(product.category)}</td>
            <td><span class="seller-stock ${Number(product.stock) === 0 ? "out-of-stock" : ""}">${Number(product.stock)} in stock</span></td>
            <td class="seller-row-actions"><button type="button" class="seller-edit-button" data-action="edit" data-id="${escapeHtml(product.id)}">Edit</button><button type="button" class="seller-delete-button" data-action="delete" data-id="${escapeHtml(product.id)}">Delete</button></td>
        </tr>`).join("");
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("productCount").textContent = products.length;
    document.getElementById("emptyProducts").hidden = products.length > 0;
}

function renderOrders() {
    const orderMarkup = sampleOrders.map(order => {
        const statusClass = order.status.toLowerCase().replace(/\s+/g, "-");
        return `<article class="seller-order-row"><div class="seller-order-id"><strong>${escapeHtml(order.id)}</strong><span>${escapeHtml(order.customer)}</span></div><div class="seller-order-product"><span>Product ordered</span><strong>${escapeHtml(order.product)}</strong></div><span class="seller-order-status status-${statusClass}">${escapeHtml(order.status)}</span><strong class="seller-order-amount">${currency.format(order.amount)}</strong></article>`;
    }).join("");
    document.getElementById("recentOrders").innerHTML = orderMarkup;
    document.getElementById("allOrders").innerHTML = orderMarkup;

    const sales = sampleOrders.reduce((total, order) => total + order.amount, 0);
    const completed = sampleOrders.filter(order => order.status === "Completed");
    const completedSales = completed.reduce((total, order) => total + order.amount, 0);
    const pendingCount = sampleOrders.filter(order => order.status === "Pending" || order.status === "Processing").length;
    document.getElementById("totalOrders").textContent = sampleOrders.length;
    document.getElementById("salesTotal").textContent = currency.format(sales);
    document.getElementById("completedSales").textContent = currency.format(completedSales);
    document.getElementById("pendingOrders").textContent = pendingCount;
    document.getElementById("averageOrder").textContent = currency.format(sales / sampleOrders.length);
    document.getElementById("salesProgress").style.width = `${sales ? completedSales / sales * 100 : 0}%`;
}

function renderProfile() {
    const firstName = sellerProfile.name.split(" ")[0];
    document.getElementById("welcomeSellerName").textContent = firstName;
    document.getElementById("topbarSellerName").textContent = sellerProfile.name;
    document.getElementById("detailSellerName").textContent = sellerProfile.name;
    document.getElementById("detailStoreName").textContent = sellerProfile.store;
    document.getElementById("detailSellerEmail").textContent = sellerProfile.email;
    document.getElementById("detailSellerContact").textContent = sellerProfile.contact;
}

function showSection(sectionId) {
    document.querySelectorAll(".seller-section").forEach(section => {
        const isActive = section.id === sectionId;
        section.classList.remove("seller-section-enter");
        section.hidden = !isActive;
        section.classList.toggle("active", isActive);
        if (isActive) {
            void section.offsetWidth;
            section.classList.add("seller-section-enter");
        }
    });
    document.querySelectorAll(".seller-nav-link").forEach(button => {
        button.classList.toggle("active", button.dataset.section === sectionId);
    });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

const sellerSidebar = document.getElementById("sellerSidebar");
const sellerMenuButton = document.getElementById("sellerMenuButton");
const sellerMobileOverlay = document.getElementById("sellerMobileOverlay");

function setMenuOpen(isOpen) {
    sellerSidebar.classList.toggle("open", isOpen);
    sellerMobileOverlay.classList.toggle("show", isOpen);
    sellerMenuButton.setAttribute("aria-expanded", String(isOpen));
}

document.querySelectorAll(".seller-nav-link").forEach(button => {
    button.addEventListener("click", () => showSection(button.dataset.section));
});
document.querySelectorAll("[data-go-section]").forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.goSection);
        if (button.hasAttribute("data-add-product")) openProductDialog();
    });
});

document.querySelectorAll("[data-add-product]:not([data-go-section])").forEach(button => {
    button.addEventListener("click", () => openProductDialog());
});

function resetProductForm() {
    productForm.reset();
    document.getElementById("productId").value = "";
    document.getElementById("productFormTitle").textContent = "Add a product";
    document.getElementById("productFormEyebrow").textContent = "NEW LISTING";
    document.getElementById("productSubmitButton").textContent = "Save product";
}

const sellerProductDialog = document.getElementById("sellerProductDialog");
const sellerDeleteDialog = document.getElementById("sellerDeleteDialog");
let pendingDeleteId = null;

function openProductDialog(product = null) {
    resetProductForm();
    if (product) {
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productStock").value = product.stock;
        document.getElementById("productFormTitle").textContent = "Edit product";
        document.getElementById("productFormEyebrow").textContent = "UPDATE LISTING";
        document.getElementById("productSubmitButton").textContent = "Save changes";
    }
    sellerProductDialog.showModal();
    document.getElementById("productName").focus();
}

productForm.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("productId").value;
    const product = {
        id: id || `product-${Date.now()}`,
        name: document.getElementById("productName").value.trim(),
        price: Number(document.getElementById("productPrice").value),
        category: document.getElementById("productCategory").value.trim(),
        stock: Number(document.getElementById("productStock").value)
    };
    if (id) {
        products = products.map(existing => existing.id === id ? product : existing);
    } else {
        products.unshift(product);
    }
    saveProducts();
    renderProducts();
    sellerProductDialog.close();
    resetProductForm();
});

productRows.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const product = products.find(item => item.id === button.dataset.id);
    if (!product) return;

    if (button.dataset.action === "delete") {
        pendingDeleteId = product.id;
        document.getElementById("sellerDeleteMessage").textContent = `Delete ${product.name} from your catalog? This cannot be undone.`;
        sellerDeleteDialog.showModal();
        return;
    }

    openProductDialog(product);
});

document.getElementById("cancelProductEdit").addEventListener("click", () => {
    sellerProductDialog.close();
    resetProductForm();
});
document.getElementById("cancelProductDelete").addEventListener("click", () => {
    pendingDeleteId = null;
    sellerDeleteDialog.close();
});
document.getElementById("confirmProductDelete").addEventListener("click", () => {
    if (pendingDeleteId === null) return;
    products = products.filter(item => item.id !== pendingDeleteId);
    saveProducts();
    renderProducts();
    pendingDeleteId = null;
    sellerDeleteDialog.close();
});
const sellerLogoutDialog = document.getElementById("sellerLogoutDialog");
document.getElementById("sellerLogout").addEventListener("click", () => sellerLogoutDialog.showModal());
document.getElementById("cancelSellerLogout").addEventListener("click", () => sellerLogoutDialog.close());
document.getElementById("confirmSellerLogout").addEventListener("click", () => {
    sessionStorage.removeItem("sellerId");
    window.location.href = "website.html?account=seller";
});
sellerMenuButton.addEventListener("click", () => {
    setMenuOpen(!sellerSidebar.classList.contains("open"));
});
sellerMobileOverlay.addEventListener("click", () => setMenuOpen(false));
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && sellerSidebar.classList.contains("open")) setMenuOpen(false);
});

renderProfile();
renderProducts();
renderOrders();