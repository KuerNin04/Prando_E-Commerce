/* ============================================
   Sidebar & Page Interactions
   Matches classes in style.css:
   .sidebar / .sidebar.open
   .menu-group.active  (controls .arrow rotation + .submenu max-height)
   .overlay / .overlay.show
   ============================================ */

// Open/close the whole sidebar (hamburger button + overlay)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

// Expand/collapse a menu group when its title is clicked.
// "groupTitleEl" is the .group-title div; its parent <li> is .menu-group
function toggleSubmenu(groupTitleEl) {
    const group = groupTitleEl.parentElement; // the <li class="menu-group">
    if (!group) return;
    group.classList.toggle('active');
}

// Logout confirmation
function logout() {
    redirectToLogin();
}

// Works whether this page is at the root (dashboard.html) or inside pages/
function redirectToLogin() {
    const insidePagesFolder = window.location.pathname.includes('/pages/');
    window.location.href = insidePagesFolder ? '../website.html' : 'website.html';
}

// Highlight the current page's link as active, and auto-expand its group
(function highlightActiveLink() {
    const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.submenu li a').forEach(link => {
        const linkFile = (link.getAttribute('href') || '').split('/').pop();
        if (linkFile === currentFile) {
            link.classList.add('active');
            // auto-open the group this link belongs to
            const group = link.closest('.menu-group');
            if (group) group.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();

// Add to Cart button interaction (Home + Products pages)
document.querySelectorAll('.btn-outline').forEach(btn => {
    if (btn.textContent.trim() === 'Add to Cart') {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const name = card ? card.querySelector('h4').textContent : 'Item';
            const original = btn.textContent;
            btn.textContent = 'Added ✓';
            btn.disabled = true;
            showToast(`${name} added to cart`);
            setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
            }, 1500);
        });
    }

    if (btn.textContent.trim() === 'Move to Cart') {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const name = card ? card.querySelector('h4').textContent : 'Item';
            showToast(`${name} moved to cart`);
        });
    }
});

// Checkout button (Cart page)
const checkoutBtn = document.querySelector('.cart-summary .btn-primary');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        showToast('Order placed! Check My Orders for status.');
    });
}

// Logout button on the Logout page itself (id="logoutBtn")
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        redirectToLogin();
    });
}

// Small toast/confirmation popup used above
function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#1e2a3a';
        toast.style.color = '#fff';
        toast.style.padding = '12px 22px';
        toast.style.borderRadius = '10px';
        toast.style.fontSize = '13.5px';
        toast.style.fontFamily = "'Poppins', sans-serif";
        toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        toast.style.zIndex = '1200';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2200);
}