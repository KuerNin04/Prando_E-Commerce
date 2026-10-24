(() => {
    const cartKey = 'studentCart';
    const wishlistKey = 'studentWishlist';
    const ordersKey = 'studentOrders';
    const maxQuantity = 24;
    const catalog = [
        { id: 'pe-uniform', price: 650 },
        { id: 'id-lace', price: 150 },
        { id: 'college-tshirt', price: 350 },
        { id: 'uniform-set', price: 800 }
    ];

    function readList(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
        } catch {
            return [];
        }
    }

    function saveList(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            notify('Your browser could not save this change.');
            return false;
        }
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    function formatMoney(value) {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value) || 0);
    }

    function getQuantity(value) {
        return Math.max(1, Math.min(maxQuantity, Math.trunc(Number(value) || 1)));
    }

    function notify(message) {
        if (typeof showToast === 'function') showToast(message);
    }

    function setupProducts() {
        const cards = document.querySelectorAll('.page-content > .card-grid > .card, .page-content > .uniform-grid > .card');
        cards.forEach((card, index) => {
            const product = card.dataset.productId
                ? { id: card.dataset.productId, price: Number(card.dataset.price) || 0 }
                : catalog[index];
            if (!product) return;

            if (!card.dataset.productId) {
                const oldButton = card.querySelector('.btn');
                if (oldButton) oldButton.remove();
            }
            card.dataset.productId = product.id;
            card.dataset.price = String(product.price);

            const controls = document.createElement('div');
            controls.className = 'product-actions';
            controls.innerHTML = `
                <label class="store-quantity">Quantity
                    <input type="number" min="1" max="${maxQuantity}" value="1" data-product-quantity aria-label="${escapeHtml(card.querySelector('h4, h2')?.textContent)} quantity">
                </label>
                <button class="btn btn-primary btn-block" type="button" data-add-to-cart>Add to Cart</button>
                <button class="btn btn-outline btn-block" type="button" data-add-to-wishlist>Save to Wishlist</button>`;
            card.append(controls);
        });
    }

    function readProduct(card) {
        const sizeControl = card.querySelector('[data-product-size]');
        if (sizeControl && !sizeControl.value) {
            notify('Please select a size first.');
            sizeControl.focus();
            return null;
        }

        const size = sizeControl?.value || '';
        const baseId = card.dataset.productId;
        return {
            id: size ? `${baseId}-${size.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : baseId,
            name: card.querySelector('h4, h2')?.textContent.trim() || 'Product',
            description: card.querySelector('.card-desc')?.textContent.trim() || '',
            price: Number(card.dataset.price) || 0,
            ...(card.dataset.category ? { category: card.dataset.category } : {}),
            ...(size ? { size, detail: `Size: ${size}` } : {})
        };
    }

    function addToCart(product, quantity) {
        const cart = readList(cartKey);
        const existing = cart.find(item => item.id === product.id);
        const currentQuantity = getQuantity(existing?.quantity || 0) - (existing ? 0 : 1);
        const nextQuantity = Math.min(maxQuantity, currentQuantity + quantity);
        if (existing && nextQuantity === currentQuantity) {
            notify('Maximum quantity reached.');
            return false;
        }

        if (existing) {
            existing.quantity = nextQuantity;
        } else {
            cart.push({ ...product, quantity: Math.min(maxQuantity, quantity) });
        }
        return saveList(cartKey, cart);
    }

    function renderCart() {
        const list = document.getElementById('cart-list');
        if (!list) return;

        const cart = readList(cartKey);
        const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * getQuantity(item.quantity), 0);
        list.innerHTML = cart.length ? cart.map(item => `
            <article class="cart-item" data-item-id="${escapeHtml(item.id)}">
                <div class="cart-thumb" aria-hidden="true">${escapeHtml(String(item.name || 'P').split(/\s+/).map(word => word[0]).join('').slice(0, 2))}</div>
                <div class="cart-info"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.description || 'Campus store product')}${item.size ? ` · Size: ${escapeHtml(item.size)}` : ''}</p></div>
                <label class="cart-qty">Quantity
                    <input type="number" min="1" max="${maxQuantity}" value="${getQuantity(item.quantity)}" data-cart-quantity aria-label="${escapeHtml(item.name)} quantity">
                </label>
                <div class="cart-item-actions"><div class="cart-price">${formatMoney((Number(item.price) || 0) * getQuantity(item.quantity))}</div>
                    <button class="store-remove" type="button" data-remove-cart>Remove</button></div>
            </article>`).join('') : '<p class="store-empty">Your cart is empty. Browse products to get started.</p>';

        const totalElement = document.getElementById('cart-total');
        const checkout = document.getElementById('checkout-button');
        if (totalElement) totalElement.textContent = formatMoney(total);
        if (checkout) checkout.disabled = cart.length === 0;
    }

    function renderWishlist() {
        const list = document.getElementById('wishlist-list');
        if (!list) return;

        const wishlist = readList(wishlistKey);
        list.innerHTML = wishlist.length ? wishlist.map(item => `
            <article class="card wishlist-item" data-item-id="${escapeHtml(item.id)}">
                <div class="card-thumb" aria-hidden="true">${escapeHtml(String(item.name || 'P').split(/\s+/).map(word => word[0]).join('').slice(0, 2))}</div>
                <h4>${escapeHtml(item.name)}</h4>
                <p class="card-desc">${escapeHtml(item.description || 'Saved for later.')}${item.size ? ` · Size: ${escapeHtml(item.size)}` : ''}</p>
                <p class="price">${formatMoney(item.price)}</p>
                <div class="wishlist-actions">
                    <label class="store-quantity">Quantity
                        <input type="number" min="1" max="${maxQuantity}" value="${getQuantity(item.quantity)}" data-wishlist-quantity aria-label="${escapeHtml(item.name)} wishlist quantity">
                    </label>
                    <button class="btn btn-primary btn-block" type="button" data-move-to-cart>Move to Cart</button>
                    <button class="store-remove" type="button" data-remove-wishlist>Remove</button>
                </div>
            </article>`).join('') : '<p class="store-empty">Your wishlist is empty. Save products to find them here.</p>';
    }

    function renderOrders() {
        const list = document.getElementById('student-orders');
        if (!list) return;

        const orders = readList(ordersKey);
        list.innerHTML = orders.length ? orders.map(order => `
            <article class="order-card">
                <div class="order-top"><span class="order-number">Order ${escapeHtml(order.id)}</span>
                    <span class="status status-pending">${escapeHtml(order.status || 'Processing')}</span></div>
                <p class="order-total">${formatMoney(order.total)}</p>
            </article>`).join('') : '<p class="store-empty">No store orders yet.</p>';
    }

    function render() {
        renderCart();
        renderWishlist();
        renderOrders();
    }

    document.addEventListener('click', event => {
        const addButton = event.target.closest('[data-add-to-cart]');
        if (addButton) {
            const card = addButton.closest('.card');
            const quantityInput = card.querySelector('[data-product-quantity]');
            const quantity = getQuantity(quantityInput.value);
            quantityInput.value = quantity;
            const product = readProduct(card);
            if (product && addToCart(product, quantity)) notify('Added to cart.');
            return;
        }

        const wishlistButton = event.target.closest('[data-add-to-wishlist]');
        if (wishlistButton) {
            const card = wishlistButton.closest('.card');
            const product = readProduct(card);
            if (!product) return;
            const wishlist = readList(wishlistKey);
            if (!wishlist.some(item => item.id === product.id)) {
                product.quantity = getQuantity(card.querySelector('[data-product-quantity]').value);
                if (saveList(wishlistKey, [...wishlist, product])) {
                    renderWishlist();
                    notify('Saved to wishlist.');
                }
            } else {
                notify('This product is already in your wishlist.');
            }
            return;
        }

        const cartItem = event.target.closest('.cart-item');
        if (event.target.closest('[data-remove-cart]') && cartItem) {
            saveList(cartKey, readList(cartKey).filter(item => item.id !== cartItem.dataset.itemId));
            renderCart();
            return;
        }

        const wishlistItem = event.target.closest('.wishlist-item');
        if (event.target.closest('[data-remove-wishlist]') && wishlistItem) {
            saveList(wishlistKey, readList(wishlistKey).filter(item => item.id !== wishlistItem.dataset.itemId));
            renderWishlist();
            return;
        }

        if (event.target.closest('[data-move-to-cart]') && wishlistItem) {
            const product = readList(wishlistKey).find(item => item.id === wishlistItem.dataset.itemId);
            if (product && addToCart(product, getQuantity(product.quantity))) {
                saveList(wishlistKey, readList(wishlistKey).filter(item => item.id !== product.id));
                render();
                notify('Moved to cart.');
            }
            return;
        }

        if (event.target.closest('[data-checkout]')) {
            const cart = readList(cartKey);
            if (!cart.length) return;
            const order = {
                id: `#${String(Date.now()).slice(-6)}`,
                status: 'Processing',
                total: cart.reduce((sum, item) => sum + (Number(item.price) || 0) * getQuantity(item.quantity), 0),
                placedAt: new Date().toISOString()
            };
            if (saveList(ordersKey, [order, ...readList(ordersKey)]) && saveList(cartKey, [])) {
                render();
                notify(`Order ${order.id} placed. Cart cleared.`);
            }
        }
    });

    document.addEventListener('change', event => {
        const cartItem = event.target.closest('.cart-item');
        if (event.target.matches('[data-cart-quantity]') && cartItem) {
            const quantity = getQuantity(event.target.value);
            event.target.value = quantity;
            saveList(cartKey, readList(cartKey).map(item => item.id === cartItem.dataset.itemId ? { ...item, quantity } : item));
            renderCart();
        }

        const wishlistItem = event.target.closest('.wishlist-item');
        if (event.target.matches('[data-wishlist-quantity]') && wishlistItem) {
            const quantity = getQuantity(event.target.value);
            event.target.value = quantity;
            saveList(wishlistKey, readList(wishlistKey).map(item => item.id === wishlistItem.dataset.itemId ? { ...item, quantity } : item));
            renderWishlist();
        }
    });

    setupProducts();
    render();
})();