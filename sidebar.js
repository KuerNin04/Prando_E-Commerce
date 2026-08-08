function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function toggleSubmenu(el) {
    const group = el.parentElement;
    group.classList.toggle('active');
}