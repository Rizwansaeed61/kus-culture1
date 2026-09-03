/**
 * KUS CULTURE - E-Commerce Shopping Cart Manager
 * Handles localStorage persistence, slide-out drawer, dynamic free shipping bar,
 * item adjustments, and toast notifications.
 */

const CartManager = (function() {
  const STORAGE_KEY = 'kus_culture_cart';
  const FREE_SHIPPING_THRESHOLD = 50.00;

  // Initial default cart items if first visit
  const defaultItems = [
    {
      id: 'hairrevive-500ml',
      title: 'HairRevive™ Anti Hair Fall Shampoo',
      size: '500ml Trial',
      price: 24.99,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCR5RYUEWtEvP01b_APRd4TmRQCmm8fj7LR5TxKDIlAprC8TLOJyYpDD6xW_tulRoQF95ZTZ1e6Q877YaiYcjBaPWej6RAzcP592WD7MOJcFMxzM6_l1U-8GzXNzUcHybWbYWCSmLAFSV16Zv5ZCtJswcIrt2uaOObILBILYed2uXtBbmev8dfKQY4ClNfwVb00DexL7sdyJ6HASj-qxWwTaYp7xevk3DXjpPGYL_rbxietzICsZA'
    },
    {
      id: 'cuticleshield-500ml',
      title: 'CuticleShield™ Deep Moisture Conditioner',
      size: '500ml Standard',
      price: 26.99,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3D7lrN1Sk9E7vbM4Vmw6rUEo6lWq8lEpBdtM06iXxkkya9UPFm6mGeyP1QK495IBLJQbnMRglEy64qcxzMQMNw9mpV7pwRqCQwdx04e3jewj3gcdMv4EooYhJWVd3JQnNMNC0Ri2qvYBO440QlVxDdm0jTRuZSD-bd6jOUoyUQL0VNnTvLs8ofZds0MREden-CmvNQOc-gU0u9xeWfg3fRLu46FmebVMgRWnlS6sKwyoxcgAXG63f'
    }
  ];

  let cart = [];

  function loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        cart = JSON.parse(stored);
      } else {
        cart = [...defaultItems];
        saveCart();
      }
    } catch (e) {
      cart = [...defaultItems];
    }
    updateUI();
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
    updateUI();
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function addItem(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        size: product.size || 'Standard',
        price: parseFloat(product.price),
        quantity: product.quantity || 1,
        image: product.image
      });
    }
    saveCart();
    showToast(`Added ${product.title} to bag`);
    openDrawer();
  }

  function updateQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
  }

  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showToast('Item removed from bag');
  }

  function openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function updateUI() {
    const totalCount = getTotalItems();
    const subtotal = getSubtotal();

    // Update all badge counts in header
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // Update Drawer Header Count
    const drawerCount = document.getElementById('cart-drawer-count');
    if (drawerCount) drawerCount.textContent = `(${totalCount})`;

    // Update Subtotal & Checkout Price
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Update Free Shipping Progress Bar
    const progressEl = document.getElementById('shipping-progress-fill');
    const shippingTextEl = document.getElementById('shipping-progress-text');
    if (progressEl && shippingTextEl) {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      if (remaining <= 0) {
        progressEl.style.width = '100%';
        progressEl.classList.add('bg-emerald-600');
        shippingTextEl.innerHTML = '<span class="text-emerald-700 font-bold flex items-center gap-1 justify-center"><span class="material-symbols-outlined text-[16px]">celebration</span> Free Express Delivery Unlocked!</span>';
      } else {
        const percentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
        progressEl.style.width = `${percentage}%`;
        progressEl.classList.remove('bg-emerald-600');
        shippingTextEl.innerHTML = `Add <strong class="text-on-surface font-bold">$${remaining.toFixed(2)}</strong> more for <strong>FREE Express Shipping</strong>`;
      }
    }

    // Render Cart Items List
    const itemsContainer = document.getElementById('cart-items-list');
    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant">
            <span class="material-symbols-outlined text-[54px] text-surface-container-high mb-3">shopping_bag</span>
            <p class="font-headline-sm text-headline-sm text-on-surface mb-1">Your bag is empty</p>
            <p class="font-body-sm text-body-sm mb-6 max-w-xs">Discover our clinical botanical hair formulas designed to revive scalp and strand density.</p>
            <a href="shop.html" class="bg-primary text-on-primary font-label-md px-6 py-3 rounded-full hover:bg-primary-container transition-colors">
              Explore Collection
            </a>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = cart.map(item => `
          <div class="flex gap-4 py-4 border-b border-surface-container items-center">
            <div class="w-16 h-20 bg-surface-container-low rounded-xl p-1.5 flex items-center justify-center flex-shrink-0">
              <img src="${item.image}" alt="${item.title}" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-label-md text-label-md text-on-surface font-semibold truncate">${item.title}</h4>
              <p class="font-body-sm text-body-sm text-on-surface-variant">${item.size}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center bg-surface-container-low rounded-full px-2 py-0.5 shadow-inner">
                  <button type="button" onclick="CartManager.updateQty('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary font-bold text-sm">−</button>
                  <span class="w-6 text-center font-label-md text-xs font-bold">${item.quantity}</span>
                  <button type="button" onclick="CartManager.updateQty('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-on-surface hover:text-primary font-bold text-sm">+</button>
                </div>
                <span class="font-label-md text-label-md text-on-surface font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
            <button type="button" onclick="CartManager.removeItem('${item.id}')" aria-label="Remove item" class="text-outline hover:text-error transition-colors p-1">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        `).join('');
      }
    }
  }

  // Inject Drawer HTML onto any page if not present
  function initDrawerDOM() {
    if (document.getElementById('cart-drawer')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'cart-drawer-overlay';
    overlay.onclick = closeDrawer;
    document.body.appendChild(overlay);

    const drawer = document.createElement('aside');
    drawer.id = 'cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="p-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
        <div class="flex items-center gap-2">
          <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Shopping Bag</span>
          <span id="cart-drawer-count" class="font-label-sm text-on-surface-variant font-semibold">(0)</span>
        </div>
        <button type="button" onclick="CartManager.closeDrawer()" aria-label="Close bag" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Free Shipping Meter -->
      <div class="p-4 bg-surface border-b border-surface-container">
        <div id="shipping-progress-text" class="font-body-sm text-body-sm text-center mb-2 text-on-surface-variant">
          Add $25.01 more for <strong>FREE Express Shipping</strong>
        </div>
        <div class="shipping-bar-bg">
          <div id="shipping-progress-fill" class="shipping-bar-fill" style="width: 50%;"></div>
        </div>
      </div>

      <!-- Items Scrollable Container -->
      <div id="cart-items-list" class="flex-1 overflow-y-auto px-4 py-2">
        <!-- Rendered dynamically -->
      </div>

      <!-- Footer / Checkout -->
      <div class="p-4 bg-surface-container-lowest border-t border-surface-container space-y-3">
        <div class="flex items-center justify-between font-headline-sm">
          <span class="text-on-surface font-semibold">Subtotal</span>
          <span id="cart-subtotal" class="text-on-surface font-bold">$51.98</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant text-center">Taxes & shipping calculated at checkout</p>
        <button type="button" onclick="CartManager.checkout()" class="w-full bg-primary text-on-primary py-3.5 px-6 rounded-full font-label-lg uppercase tracking-wider font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2">
          <span>PROCEED TO CHECKOUT</span>
          <span class="material-symbols-outlined text-[18px]">lock</span>
        </button>
        <div class="flex items-center justify-center gap-2 pt-1 text-on-surface-variant">
          <span class="material-symbols-outlined text-[14px]">shield</span>
          <span class="font-label-sm text-[11px]">30-Day Money Back Guarantee • Encrypted 256-bit Checkout</span>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  function checkout() {
    showToast('Redirecting to secure checkout...');
    setTimeout(() => {
      alert('Secure Checkout Simulation: In a live Shopify store, this directs seamlessly to your shopify checkout domain with all items preserved!');
    }, 800);
  }

  // Bind trigger buttons across page
  function initListeners() {
    document.querySelectorAll('[aria-label="View shopping bag"], .cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initDrawerDOM();
    loadCart();
    initListeners();
  });

  return {
    addItem,
    updateQty,
    removeItem,
    openDrawer,
    closeDrawer,
    showToast,
    checkout,
    getSubtotal
  };
})();
window.CartManager = CartManager;
