// === CURSOR GLOW ===
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// === MOBILE MENU ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// === SCROLL ANIMATIONS ===
const animatedElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));
        }
    });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

// === COUNTER ANIMATION ===
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// === PRODUCT FILTER ===
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach((card, index) => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = `fadeUp 0.5s ease ${index * 0.1}s forwards`;
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// === QUICK VIEW MODAL ===
const quickviewModal = document.getElementById('quickviewModal');
const quickviewBackdrop = document.getElementById('quickviewBackdrop');
const quickviewClose = document.getElementById('quickviewClose');
const quickviewImg = document.getElementById('quickviewImg');
const quickviewName = document.getElementById('quickviewName');
const quickviewMaterial = document.getElementById('quickviewMaterial');
const quickviewPrice = document.getElementById('quickviewPrice');
const quickviewPriceOld = document.getElementById('quickviewPriceOld');
const quickviewSizes = document.getElementById('quickviewSizes');
const quickviewFavBtn = document.getElementById('quickviewFavBtn');
const quickviewCartBtn = document.getElementById('quickviewCartBtn');
const quickviewZoomBtn = document.getElementById('quickviewZoomBtn');

let currentQuickViewProduct = null;

const quickViewBtns = document.querySelectorAll('.quick-view-btn');
quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        openQuickView(card);
    });
});

function openQuickView(card) {
    const img = card.querySelector('.product-img');
    const name = card.querySelector('.product-name').textContent;
    const material = card.querySelector('.product-material').textContent;
    const price = card.querySelector('.price-current').textContent;
    const priceOld = card.querySelector('.price-old');
    const sizes = card.querySelectorAll('.size-option');
    const id = card.querySelector('.add-to-cart-btn')?.dataset.id || '';
    const priceNum = card.querySelector('.add-to-cart-btn')?.dataset.price || '';

    currentQuickViewProduct = { id, name, price: priceNum };

    quickviewImg.src = img.src;
    quickviewImg.alt = name;
    quickviewImg.classList.remove('zoomed');
    quickviewName.textContent = name;
    quickviewMaterial.textContent = material;
    quickviewPrice.textContent = price;
    quickviewPriceOld.textContent = priceOld ? priceOld.textContent : '';

    quickviewSizes.innerHTML = '';
    sizes.forEach(s => {
        const sizeEl = document.createElement('span');
        sizeEl.className = 'quickview-size' + (s.classList.contains('active') ? ' active' : '');
        sizeEl.textContent = s.textContent;
        sizeEl.addEventListener('click', () => {
            quickviewSizes.querySelectorAll('.quickview-size').forEach(x => x.classList.remove('active'));
            sizeEl.classList.add('active');
        });
        quickviewSizes.appendChild(sizeEl);
    });

    quickviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    quickviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

quickviewBackdrop.addEventListener('click', closeQuickView);
quickviewClose.addEventListener('click', closeQuickView);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickView();
});

// Quick View Zoom
quickviewImg.addEventListener('click', () => {
    quickviewImg.classList.toggle('zoomed');
});

quickviewZoomBtn.addEventListener('click', () => {
    quickviewImg.classList.toggle('zoomed');
});

// Quick View Favorite
quickviewFavBtn.addEventListener('click', () => {
    quickviewFavBtn.classList.toggle('active');
});

// Quick View Add to Cart
quickviewCartBtn.addEventListener('click', () => {
    if (currentQuickViewProduct && currentQuickViewProduct.id) {
        const existingItem = cart.find(item => item.id === currentQuickViewProduct.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: currentQuickViewProduct.id,
                name: currentQuickViewProduct.name,
                price: parseInt(currentQuickViewProduct.price),
                quantity: 1
            });
        }
        updateCart();

        quickviewCartBtn.style.transform = 'scale(1.3)';
        quickviewCartBtn.style.background = 'var(--accent-orange)';
        quickviewCartBtn.style.borderColor = 'var(--accent-orange)';
        setTimeout(() => {
            quickviewCartBtn.style.transform = '';
            quickviewCartBtn.style.background = '';
            quickviewCartBtn.style.borderColor = '';
        }, 400);
    }
});

// === FAVORITES ===
const favoriteBtns = document.querySelectorAll('.favorite-btn');

favoriteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const card = btn.closest('.product-card');
        const name = card.querySelector('.product-name').textContent;
        const img = card.querySelector('.product-img').src;
        const price = card.querySelector('.price-current').textContent;

        btn.classList.toggle('active');

        if (btn.classList.contains('active')) {
            if (!favorites.find(f => f.id === id)) {
                favorites.push({ id, name, img, price });
            }
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
        } else {
            favorites = favorites.filter(f => f.id !== id);
        }

        updateFavCount();
        renderFavorites();
    });
});

function updateFavCount() {
    favCount.textContent = favorites.length;
    favCount.classList.toggle('visible', favorites.length > 0);
}

function renderFavorites() {
    if (favorites.length === 0) {
        favItems.innerHTML = '<div class="cart-empty">Список избранного пуст</div>';
    } else {
        favItems.innerHTML = favorites.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price}</span>
                    <button class="cart-item-remove" onclick="removeFromFav('${item.id}')">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

function removeFromFav(id) {
    favorites = favorites.filter(f => f.id !== id);
    updateFavCount();
    renderFavorites();

    const btn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
    if (btn) btn.classList.remove('active');
}

// === SIZE SELECTION ===
const sizeOptions = document.querySelectorAll('.size-option');

sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const parent = option.closest('.size-options');
        parent.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

// === CART ===
let cart = [];
let favorites = [];
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const favNavBtn = document.getElementById('favNavBtn');
const favModal = document.getElementById('favModal');
const favBackdrop = document.getElementById('favBackdrop');
const favClose = document.getElementById('favClose');
const favItems = document.getElementById('favItems');
const favCount = document.querySelector('.fav-count');
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const authBackdrop = document.getElementById('authBackdrop');
const authClose = document.getElementById('authClose');

cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

cartBackdrop.addEventListener('click', closeCart);
cartClose.addEventListener('click', closeCart);

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

favNavBtn.addEventListener('click', () => {
    favModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

favBackdrop.addEventListener('click', closeFav);
favClose.addEventListener('click', closeFav);

function closeFav() {
    favModal.classList.remove('active');
    document.body.style.overflow = '';
}

authBtn.addEventListener('click', () => {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

authBackdrop.addEventListener('click', closeAuth);
authClose.addEventListener('click', closeAuth);

function closeAuth() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

// === ADD TO CART BUTTONS ===
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCart();
        showAddedAnimation(btn);
    });
});

function showAddedAnimation(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Добавлено!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1200);
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartCount.classList.toggle('visible', totalItems > 0);
    cartTotal.textContent = totalPrice.toLocaleString() + ' \u20BD';

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price.toLocaleString()} \u20BD \u00D7 ${item.quantity}</span>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Удалить</button>
                </div>
            </div>
        `).join('');
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// === CONTACT FORM ===
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Отправлено!</span>';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            contactForm.reset();
        }, 2000);
    });
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === PARALLAX EFFECT ON HERO ===
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeFav();
        closeAuth();
        closeQuickView();
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// === PRELOADER ANIMATION ===
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add CSS animation for filter
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
