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

// === MODAL HELPERS ===
function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}

// === CART ===
let cart = [];
let favorites = [];

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
        ci.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;color:var(--gray-600)">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price.toLocaleString()} \u20BD \u00D7 ${item.quantity}</span>
                    <button class="cart-item-remove" data-remove-cart="${item.id}">Удалить</button>
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
        fi.innerHTML = favorites.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price}</span>
                    <button class="cart-item-remove" data-remove-fav="${item.id}">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

// === EVENT DELEGATION FOR ALL BUTTONS ===
document.addEventListener('click', (e) => {
    const t = e.target;

    // CART OPEN
    if (t.closest('#cartBtn')) {
        e.preventDefault();
        openModal('cartModal');
        return;
    }

    // FAVORITES OPEN
    if (t.closest('#favNavBtn')) {
        e.preventDefault();
        renderFavorites();
        openModal('favModal');
        return;
    }

    // AUTH OPEN
    if (t.closest('#authBtn')) {
        e.preventDefault();
        openModal('authModal');
        return;
    }

    // SEARCH
    if (t.closest('#searchBtn')) {
        e.preventDefault();
        const query = prompt('Поиск товаров:');
        if (query && query.trim()) {
            const q = query.toLowerCase().trim();
            let found = 0;
            document.querySelectorAll('.product-card').forEach(card => {
                const name = card.querySelector('.product-name').textContent.toLowerCase();
                const mat = card.querySelector('.product-material').textContent.toLowerCase();
                const show = name.includes(q) || mat.includes(q);
                card.classList.toggle('hidden', !show);
                if (show) { card.classList.add('animated'); found++; }
            });
            if (found === 0) {
                alert('Ничего не найдено');
                document.querySelectorAll('.product-card').forEach(c => c.classList.remove('hidden'));
            }
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // CLOSE CART
    if (t.closest('#cartClose') || t.closest('#cartBackdrop')) {
        closeModal('cartModal');
        return;
    }

    // CLOSE FAV
    if (t.closest('#favClose') || t.closest('#favBackdrop')) {
        closeModal('favModal');
        return;
    }

    // CLOSE AUTH
    if (t.closest('#authClose') || t.closest('#authBackdrop')) {
        closeModal('authModal');
        return;
    }

    // CLOSE QUICKVIEW
    if (t.closest('#quickviewClose') || t.closest('#quickviewBackdrop')) {
        closeModal('quickviewModal');
        return;
    }

    // REMOVE FROM CART
    const removeCart = t.closest('[data-remove-cart]');
    if (removeCart) {
        cart = cart.filter(i => i.id !== removeCart.dataset.removeCart);
        updateCart();
        return;
    }

    // REMOVE FROM FAV
    const removeFav = t.closest('[data-remove-fav]');
    if (removeFav) {
        favorites = favorites.filter(f => f.id !== removeFav.dataset.removeFav);
        updateFavCount();
        renderFavorites();
        const fb = document.querySelector('.favorite-btn[data-id="' + removeFav.dataset.removeFav + '"]');
        if (fb) fb.classList.remove('active');
        return;
    }

    // ADD TO CART
    const addBtn = t.closest('.add-to-cart-btn');
    if (addBtn) {
        e.stopPropagation();
        const { id, name, price } = addBtn.dataset;
        const ex = cart.find(i => i.id === id);
        if (ex) ex.quantity++;
        else cart.push({ id, name, price: parseInt(price), quantity: 1 });
        updateCart();
        addBtn.style.background = '#22c55e';
        setTimeout(() => { addBtn.style.background = ''; }, 800);
        return;
    }

    // FAVORITE TOGGLE
    const favBtn = t.closest('.favorite-btn');
    if (favBtn) {
        e.stopPropagation();
        const id = favBtn.dataset.id;
        const card = favBtn.closest('.product-card');
        const name = card.querySelector('.product-name').textContent;
        const img = card.querySelector('.product-img').src;
        const price = card.querySelector('.price-current').textContent;
        favBtn.classList.toggle('active');
        if (favBtn.classList.contains('active')) {
            if (!favorites.find(f => f.id === id)) favorites.push({ id, name, img, price });
        } else {
            favorites = favorites.filter(f => f.id !== id);
        }
        updateFavCount();
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
        qvFav.classList.toggle('active');
        return;
    }

    // QUICKVIEW CART
    if (t.closest('#quickviewCartBtn')) {
        const qvName = document.getElementById('quickviewName').textContent;
        const qvPrice = document.getElementById('quickviewPrice').textContent;
        const qvId = qvName.replace(/\s/g, '_');
        const ex = cart.find(i => i.id === qvId);
        const numPrice = parseInt(qvPrice.replace(/[^\d]/g, ''));
        if (ex) ex.quantity++;
        else cart.push({ id: qvId, name: qvName, price: numPrice, quantity: 1 });
        updateCart();
        const btn = document.getElementById('quickviewCartBtn');
        btn.style.transform = 'scale(1.3)';
        btn.style.background = 'var(--accent-orange)';
        setTimeout(() => { btn.style.transform = ''; btn.style.background = ''; }, 400);
        return;
    }

    // QUICKVIEW ZOOM
    if (t.closest('#quickviewZoomBtn') || t.closest('.quickview-img')) {
        document.getElementById('quickviewImg').classList.toggle('zoomed');
        return;
    }

    // SIZE OPTIONS
    const sizeOpt = t.closest('.size-option');
    if (sizeOpt) {
        const parent = sizeOpt.closest('.size-options') || sizeOpt.closest('.quickview-sizes-list');
        if (parent) {
            parent.querySelectorAll('.size-option, .quickview-size').forEach(o => o.classList.remove('active'));
            sizeOpt.classList.add('active');
        }
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

    const qvFav = document.getElementById('quickviewFavBtn');
    qvFav.classList.remove('active');

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
        ['cartModal', 'favModal', 'authModal', 'quickviewModal'].forEach(closeModal);
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
