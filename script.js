// === CURSOR GLOW ===
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
(function animGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animGlow);
})();

// === NAVBAR SCROLL ===
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// === MOBILE MENU ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// === STATE ===
let cart = [];
let favorites = [];

// === MODAL HELPERS ===
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    if (!document.querySelector('.modal.active, .search-modal.active, .size-modal.active, .quickview-modal.active')) {
        document.body.style.overflow = '';
    }
}

// === SEARCH ===
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const allProducts = [];

document.querySelectorAll('.product-card').forEach(card => {
    allProducts.push({
        name: card.querySelector('.product-name').textContent,
        material: card.querySelector('.product-material').textContent,
        price: card.querySelector('.price-current').textContent,
        img: card.querySelector('.product-img').src,
        category: card.dataset.category
    });
});

function doSearch(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '<p class="search-hint">Начни вводить название товара</p>';
        return;
    }
    const q = query.toLowerCase();
    const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-hint">Ничего не найдено по запросу "' + query + '"</p>';
        return;
    }
    searchResults.innerHTML = results.map(p => `
        <div class="search-result-item" data-search-name="${p.name}">
            <img src="${p.img}" alt="${p.name}" class="search-result-img">
            <div class="search-result-info">
                <div class="search-result-name">${p.name}</div>
                <div class="search-result-price">${p.price}</div>
            </div>
            <svg class="search-result-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
    `).join('');
}

searchInput.addEventListener('input', (e) => doSearch(e.target.value));

searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (!item) return;
    const name = item.dataset.searchName;
    closeModal('searchModal');
    searchInput.value = '';
    searchResults.innerHTML = '<p class="search-hint">Начни вводить название товара</p>';

    const card = document.querySelector('.product-card');
    document.querySelectorAll('.product-card').forEach(c => {
        if (c.querySelector('.product-name').textContent === name) {
            c.scrollIntoView({ behavior: 'smooth', block: 'center' });
            c.style.boxShadow = '0 0 0 2px var(--accent-orange)';
            setTimeout(() => { c.style.boxShadow = ''; }, 2000);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !document.querySelector('.search-modal.active') && !document.querySelector('.size-modal.active')) {
        e.preventDefault();
        openModal('searchModal');
        setTimeout(() => searchInput.focus(), 100);
    }
});

// === SIZE MODAL ===
let sizeModalCallback = null;
let sizeModalData = {};

function openSizeModal(name, price, img, sizes, callback) {
    sizeModalCallback = callback;
    sizeModalData = { name, price, img, sizes };

    document.getElementById('sizeModalImg').src = img;
    document.getElementById('sizeModalName').textContent = name;
    document.getElementById('sizeModalPrice').textContent = price;

    const sizesWrap = document.getElementById('sizeModalSizes');
    sizesWrap.innerHTML = '';
    sizes.forEach(s => {
        const el = document.createElement('span');
        el.className = 'size-modal-size';
        el.textContent = s;
        sizesWrap.appendChild(el);
    });

    document.getElementById('sizeModalError').classList.remove('show');
    openModal('sizeModal');
}

document.getElementById('sizeModalSizes').addEventListener('click', (e) => {
    const sizeEl = e.target.closest('.size-modal-size');
    if (!sizeEl) return;
    document.querySelectorAll('.size-modal-size').forEach(s => s.classList.remove('active'));
    sizeEl.classList.add('active');
    document.getElementById('sizeModalError').classList.remove('show');
});

document.getElementById('sizeModalConfirm').addEventListener('click', () => {
    const selected = document.querySelector('.size-modal-size.active');
    if (!selected) {
        document.getElementById('sizeModalError').classList.add('show');
        return;
    }
    if (sizeModalCallback) sizeModalCallback(selected.textContent);
    closeModal('sizeModal');
});

// === CART ===
function updateCart() {
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cc = document.querySelector('.cart-count');
    cc.textContent = totalItems;
    cc.classList.toggle('visible', totalItems > 0);
    document.getElementById('cartTotal').textContent = totalPrice.toLocaleString() + ' \u20BD';
    const ci = document.getElementById('cartItems');
    if (cart.length === 0) {
        ci.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
    } else {
        ci.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.img}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price.toLocaleString()} \u20BD \u00D7 ${item.quantity} &middot; ${item.size}</span>
                    <button class="cart-item-remove" data-remove-cart="${idx}">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

function updateFavCount() {
    const fc = document.querySelector('.fav-count');
    fc.textContent = favorites.length;
    fc.classList.toggle('visible', favorites.length > 0);
}

function renderFavorites() {
    const fi = document.getElementById('favItems');
    if (favorites.length === 0) {
        fi.innerHTML = '<div class="cart-empty">Список избранного пуст</div>';
    } else {
        fi.innerHTML = favorites.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price} &middot; ${item.size}</span>
                    <button class="cart-item-remove" data-remove-fav="${idx}">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

// === EVENT DELEGATION ===
document.addEventListener('click', (e) => {
    const t = e.target;

    // CART OPEN
    if (t.closest('#cartBtn')) { openModal('cartModal'); return; }

    // FAV OPEN
    if (t.closest('#favNavBtn')) { renderFavorites(); openModal('favModal'); return; }

    // AUTH OPEN
    if (t.closest('#authBtn')) { openModal('authModal'); return; }

    // SEARCH OPEN
    if (t.closest('#searchBtn')) {
        openModal('searchModal');
        setTimeout(() => searchInput.focus(), 100);
        return;
    }

    // SEARCH CLOSE
    if (t.closest('#searchCloseBtn') || t.closest('#searchBackdrop')) {
        closeModal('searchModal');
        searchInput.value = '';
        searchResults.innerHTML = '<p class="search-hint">Начни вводить название товара</p>';
        return;
    }

    // CLOSE CART
    if (t.closest('#cartClose') || t.closest('#cartBackdrop')) { closeModal('cartModal'); return; }

    // CLOSE FAV
    if (t.closest('#favClose') || t.closest('#favBackdrop')) { closeModal('favModal'); return; }

    // CLOSE AUTH
    if (t.closest('#authClose') || t.closest('#authBackdrop')) { closeModal('authModal'); return; }

    // CLOSE QUICKVIEW
    if (t.closest('#quickviewClose') || t.closest('#quickviewBackdrop')) { closeModal('quickviewModal'); return; }

    // CLOSE SIZE MODAL
    if (t.closest('#sizeModalClose') || t.closest('#sizeModalBackdrop')) { closeModal('sizeModal'); return; }

    // REMOVE FROM CART
    const rc = t.closest('[data-remove-cart]');
    if (rc) { cart.splice(parseInt(rc.dataset.removeCart), 1); updateCart(); return; }

    // REMOVE FROM FAV
    const rf = t.closest('[data-remove-fav]');
    if (rf) {
        const idx = parseInt(rf.dataset.removeFav);
        const favItem = favorites[idx];
        favorites.splice(idx, 1);
        updateFavCount();
        renderFavorites();
        const fb = document.querySelector('.favorite-btn[data-id="' + favItem.id + '"]');
        if (fb) fb.classList.remove('active');
        return;
    }

    // ADD TO CART (requires size)
    const addBtn = t.closest('.add-to-cart-btn');
    if (addBtn) {
        e.stopPropagation();
        const { id, name, price } = addBtn.dataset;
        const card = addBtn.closest('.product-card') || addBtn.closest('.quickview-panel');
        const img = card.querySelector('.product-img, .quickview-img');
        const imgSrc = img ? img.src : '';
        const sizeEls = card.querySelectorAll('.size-option, .quickview-size');
        const sizes = Array.from(sizeEls).map(s => s.textContent);

        openSizeModal(name, parseInt(price).toLocaleString() + ' \u20BD', imgSrc, sizes, (selectedSize) => {
            const ex = cart.find(i => i.id === id && i.size === selectedSize);
            if (ex) ex.quantity++;
            else cart.push({ id, name, price: parseInt(price), quantity: 1, size: selectedSize, img: imgSrc });
            updateCart();
            addBtn.style.background = '#22c55e';
            setTimeout(() => { addBtn.style.background = ''; }, 800);
        });
        return;
    }

    // FAVORITE TOGGLE (requires size)
    const favBtn = t.closest('.favorite-btn');
    if (favBtn) {
        e.stopPropagation();
        const id = favBtn.dataset.id;
        const card = favBtn.closest('.product-card');
        const name = card.querySelector('.product-name').textContent;
        const img = card.querySelector('.product-img').src;
        const price = card.querySelector('.price-current').textContent;
        const sizeEls = card.querySelectorAll('.size-option');
        const sizes = Array.from(sizeEls).map(s => s.textContent);

        if (favBtn.classList.contains('active')) {
            favBtn.classList.remove('active');
            favorites = favorites.filter(f => !(f.id === id));
            updateFavCount();
            return;
        }

        openSizeModal(name, price, img, sizes, (selectedSize) => {
            favBtn.classList.add('active');
            favorites.push({ id: id + '_' + selectedSize, name, img, price, size: selectedSize });
            updateFavCount();
        });
        return;
    }

    // QUICK VIEW
    const qvBtn = t.closest('.quick-view-btn');
    if (qvBtn) {
        e.stopPropagation();
        const card = qvBtn.closest('.product-card');
        openQuickView(card);
        return;
    }

    // QUICKVIEW FAV
    if (t.closest('#quickviewFavBtn')) {
        const qvFav = document.getElementById('quickviewFavBtn');
        const name = document.getElementById('quickviewName').textContent;
        const img = document.getElementById('quickviewImg').src;
        const price = document.getElementById('quickviewPrice').textContent;
        const activeSize = document.querySelector('.quickview-size.active');

        if (qvFav.classList.contains('active')) {
            qvFav.classList.remove('active');
            favorites = favorites.filter(f => f.name !== name);
            updateFavCount();
            return;
        }

        const sizeEls = document.querySelectorAll('.quickview-size');
        const sizes = Array.from(sizeEls).map(s => s.textContent);

        openSizeModal(name, price, img, sizes, (selectedSize) => {
            qvFav.classList.add('active');
            favorites.push({ id: name + '_' + selectedSize, name, img, price, size: selectedSize });
            updateFavCount();
        });
        return;
    }

    // QUICKVIEW CART
    if (t.closest('#quickviewCartBtn')) {
        const name = document.getElementById('quickviewName').textContent;
        const img = document.getElementById('quickviewImg').src;
        const price = document.getElementById('quickviewPrice').textContent;
        const numPrice = parseInt(price.replace(/[^\d]/g, ''));
        const sizeEls = document.querySelectorAll('.quickview-size');
        const sizes = Array.from(sizeEls).map(s => s.textContent);

        openSizeModal(name, price, img, sizes, (selectedSize) => {
            const ex = cart.find(i => i.name === name && i.size === selectedSize);
            if (ex) ex.quantity++;
            else cart.push({ id: name + '_' + selectedSize, name, price: numPrice, quantity: 1, size: selectedSize, img });
            updateCart();
            const btn = document.getElementById('quickviewCartBtn');
            btn.style.transform = 'scale(1.3)';
            btn.style.background = 'var(--accent-orange)';
            setTimeout(() => { btn.style.transform = ''; btn.style.background = ''; }, 400);
        });
        return;
    }

    // QUICKVIEW ZOOM
    if (t.closest('#quickviewZoomBtn') || t.target.classList.contains('quickview-img')) {
        document.getElementById('quickviewImg').classList.toggle('zoomed');
        return;
    }

    // QUICKVIEW SIZE
    const qvSize = t.closest('.quickview-size');
    if (qvSize) {
        document.querySelectorAll('.quickview-size').forEach(o => o.classList.remove('active'));
        qvSize.classList.add('active');
        return;
    }

    // FILTER
    const filterBtn = t.closest('.filter-btn');
    if (filterBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        filterBtn.classList.add('active');
        const filter = filterBtn.dataset.filter;
        document.querySelectorAll('.product-card').forEach((card, i) => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeUp 0.5s ease ' + (i * 0.1) + 's forwards';
            } else {
                card.classList.add('hidden');
            }
        });
        return;
    }
});

// === QUICK VIEW ===
function openQuickView(card) {
    const img = card.querySelector('.product-img');
    const name = card.querySelector('.product-name').textContent;
    const material = card.querySelector('.product-material').textContent;
    const price = card.querySelector('.price-current').textContent;
    const priceOld = card.querySelector('.price-old');
    const sizes = card.querySelectorAll('.size-option');

    document.getElementById('quickviewImg').src = img.src;
    document.getElementById('quickviewImg').alt = name;
    document.getElementById('quickviewImg').classList.remove('zoomed');
    document.getElementById('quickviewName').textContent = name;
    document.getElementById('quickviewMaterial').textContent = material;
    document.getElementById('quickviewPrice').textContent = price;

    const po = document.getElementById('quickviewPriceOld');
    if (priceOld) { po.textContent = priceOld.textContent; po.style.display = 'inline'; }
    else { po.style.display = 'none'; }

    const qs = document.getElementById('quickviewSizes');
    qs.innerHTML = '';
    sizes.forEach(s => {
        const el = document.createElement('span');
        el.className = 'quickview-size' + (s.classList.contains('active') ? ' active' : '');
        el.textContent = s.textContent;
        qs.appendChild(el);
    });

    document.getElementById('quickviewFavBtn').classList.remove('active');
    openModal('quickviewModal');
}

// === SCROLL ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('animated'), parseInt(entry.target.dataset.delay || 0));
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// === COUNTER ===
const cObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let current = 0;
            const inc = target / 50;
            const timer = setInterval(() => {
                current += inc;
                if (current >= target) { entry.target.textContent = target.toLocaleString(); clearInterval(timer); }
                else entry.target.textContent = Math.floor(current).toLocaleString();
            }, 40);
            cObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => cObserver.observe(el));

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === PARALLAX ===
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const s = window.scrollY;
    if (hero && s < window.innerHeight) {
        hero.style.transform = 'translateY(' + (s * 0.3) + 'px)';
        hero.style.opacity = 1 - (s / window.innerHeight);
    }
});

// === ESCAPE KEY ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ['cartModal', 'favModal', 'authModal', 'quickviewModal', 'sizeModal', 'searchModal'].forEach(closeModal);
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// === CONTACT FORM ===
const cf = document.querySelector('.contact-form');
if (cf) {
    cf.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = cf.querySelector('.submit-btn');
        btn.innerHTML = '<span>Отправлено!</span>';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
        setTimeout(() => { btn.innerHTML = '<span>Отправить</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'; btn.style.background = ''; btn.style.color = ''; cf.reset(); }, 2000);
    });
}
