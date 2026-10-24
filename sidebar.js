function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show', isOpen);
    const menuButton = document.getElementById('studentMenuToggle')
        || document.getElementById('menuToggle')
        || document.querySelector('.menu-toggle');
    if (menuButton) {
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close student navigation' : 'Open student navigation');
    }
}

function toggleSubmenu(groupTitleEl) {
    const group = groupTitleEl.parentElement;
    if (!group) return;
    group.classList.toggle('active');
}

function logout() {
    let dialog = document.getElementById('studentLogoutDialog');
    if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'studentLogoutDialog';
        dialog.className = 'student-logout-dialog';
        dialog.setAttribute('aria-labelledby', 'studentLogoutTitle');
        dialog.innerHTML = '<h2 id="studentLogoutTitle">Log out?</h2><p>Are you sure you want to end your student session?</p><div class="student-logout-actions"><button type="button" class="student-logout-cancel">Cancel</button><button type="button" class="student-logout-confirm">Log out</button></div>';
        document.body.appendChild(dialog);
        dialog.querySelector('.student-logout-cancel').addEventListener('click', () => dialog.close());
        dialog.querySelector('.student-logout-confirm').addEventListener('click', redirectToLogin);
        dialog.addEventListener('click', event => {
            if (event.target === dialog) dialog.close();
        });
    }
    if (!dialog.open) dialog.showModal();
}

function redirectToLogin() {
    const insidePagesFolder = window.location.pathname.includes('/pages/');
    sessionStorage.clear();
    window.location.href = insidePagesFolder ? '../website.html' : 'website.html';
}

// Highlight the sidebar link matching the current page and open its group.
(function highlightActiveLink() {
    const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.submenu li a').forEach(link => {
        const linkFile = (link.getAttribute('href') || '').split('/').pop();
        if (linkFile === currentFile) {
            link.classList.add('active');
            const group = link.closest('.menu-group');
            if (group) group.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();

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

const logoutModal = document.getElementById('logoutModal');
const logoutButton = document.getElementById('logoutBtn');
const cancelLogoutButton = document.getElementById('cancelLogout');
const confirmLogoutButton = document.getElementById('confirmLogout');

if (logoutModal && logoutButton && cancelLogoutButton && confirmLogoutButton) {
    const closeLogoutModal = () => {
        logoutModal.classList.remove('show');
        logoutModal.setAttribute('aria-hidden', 'true');
        logoutButton.focus();
    };

    logoutButton.addEventListener('click', () => {
        logoutModal.classList.add('show');
        logoutModal.setAttribute('aria-hidden', 'false');
        confirmLogoutButton.focus();
    });

    cancelLogoutButton.addEventListener('click', closeLogoutModal);
    confirmLogoutButton.addEventListener('click', redirectToLogin);

    logoutModal.addEventListener('click', (event) => {
        if (event.target === logoutModal) closeLogoutModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && logoutModal.classList.contains('show')) {
            closeLogoutModal();
        }
    });
}

const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle && !menuToggle.hasAttribute('aria-expanded')) {
    menuToggle.setAttribute('aria-expanded', 'false');
}
if (menuToggle && !menuToggle.hasAttribute('onclick')) {
    menuToggle.addEventListener('click', toggleSidebar);
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('sidebar')?.classList.contains('open')) {
        toggleSidebar();
    }
});
document.querySelectorAll('.group-title').forEach((groupTitle) => {
    if (!groupTitle.hasAttribute('onclick')) {
        groupTitle.addEventListener('click', () => toggleSubmenu(groupTitle));
    }
});