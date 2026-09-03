/**
 * KUS CULTURE - Core Store Interactivity
 * Handles Buy Box variant selections, gallery thumbnail swapping,
 * quantity changes, bundle multi-buys, coupon copying, FAQ toggles,
 * and mobile sticky CTA dock observer.
 */

// Active State Tracker
let activeTier = 'trial';
let activeProductPrice = 24.99;
let activeProductTitle = 'HairRevive™ Anti Hair Fall Shampoo';
let activeProductSize = '500ml Trial';
let activeProductImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCR5RYUEWtEvP01b_APRd4TmRQCmm8fj7LR5TxKDIlAprC8TLOJyYpDD6xW_tulRoQF95ZTZ1e6Q877YaiYcjBaPWej6RAzcP592WD7MOJcFMxzM6_l1U-8GzXNzUcHybWbYWCSmLAFSV16Zv5ZCtJswcIrt2uaOObILBILYed2uXtBbmev8dfKQY4ClNfwVb00DexL7sdyJ6HASj-qxWwTaYp7xevk3DXjpPGYL_rbxietzICsZA';
let currentQty = 1;

// Gallery Thumbnails Map
const galleryImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCR5RYUEWtEvP01b_APRd4TmRQCmm8fj7LR5TxKDIlAprC8TLOJyYpDD6xW_tulRoQF95ZTZ1e6Q877YaiYcjBaPWej6RAzcP592WD7MOJcFMxzM6_l1U-8GzXNzUcHybWbYWCSmLAFSV16Zv5ZCtJswcIrt2uaOObILBILYed2uXtBbmev8dfKQY4ClNfwVb00DexL7sdyJ6HASj-qxWwTaYp7xevk3DXjpPGYL_rbxietzICsZA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5dPLbl_9AspIv7g5qv71UWpGLU9i0urV_7FJmao-Tf2CGl0JiCjkxBa38ZVMvAItOV8bImmwc1NLde_H0_LGMeX1hBSUnf6wMTG6qf9D90sxd3Jm6hocybSOu450MbOW1DWjDq811Jyk9A1TOO3ux9hX0WMA08gRy8wXKBb6ORN7-EMs8Cz5prLCLSgSt4P0sBrzSsyD6_3unVbllJ4WAKKe1cvop4egQ38OB9koIWLwOkQK57PeK',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDAyGZyDTaBPqqbr5mqoKMdrWI282v2mca-Nze1_lZPuIDuzO3W1rwHJ9imDLbj-VRcFnHPwjqliYxsnQn8092BdKau_BrzQz-I46onNrM1_8CIP4L3A1Ocw6fAix6C9OenDlrj-cH9C8zxk0Bttdr96oxmv5exkAVMPc4F-0Rz_rrZ8v3DEH5V8LWy7dVCFpN6dgLUJCjmLtwNhNMJ0VNd8wJ07u4Y6XTk8gfqFXm7dlpueMUE6Y_Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqr6iU4TOOAPfMrnxEUwMEvrBKs6wSFoWwlI6OW5IxmWOO9XaTPl21warGA9hP8m2EPi9-75afPTkusvNNvgCCDeKDEUtKZfP1XyynorcIjZ6ApFC2_Py4X0kjxHksOLnQIwYKKYsO1HvtlEdJkNNgx0AJKQKANelFAnBjRdgkgABu4cYOZSeIH9lOM953PqOWHOWMU3G61tYdets-KxQgeih2zBGPMlySc2QQESPF8E85IP96uokb'
];

function selectGalleryThumb(index) {
  const mainImg = document.getElementById('mainProductImage') || document.getElementById('main-product-img');
  if (mainImg && galleryImages[index]) {
    mainImg.src = galleryImages[index];
  }
  document.querySelectorAll('.thumb-btn').forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('ring-2', 'ring-primary', 'bg-surface-container-high');
      btn.classList.remove('bg-surface-container-low');
    } else {
      btn.classList.remove('ring-2', 'ring-primary', 'bg-surface-container-high');
      btn.classList.add('bg-surface-container-low');
    }
  });
}

function selectSize(tier, priceStr, comparePriceStr, savingsText) {
  activeTier = tier;

  let priceNum = 24.99;
  if (tier === 'trial') {
    priceNum = 24.99;
    activeProductSize = '500ml Trial';
  } else if (tier === 'popular') {
    priceNum = 49.99;
    activeProductSize = '1 Liter Popular';
  } else if (tier === 'value' || tier === 'best') {
    priceNum = 84.99;
    activeProductSize = '1.5 Liter Best Value';
  }
  activeProductPrice = priceNum;

  // Visual card updates
  document.querySelectorAll('.size-card').forEach(el => {
    el.classList.remove('bg-surface-container-high', 'ring-2', 'ring-primary');
    el.classList.add('bg-surface-container-low');
  });

  const activeCard = document.getElementById('size-' + tier) || document.getElementById('tier-' + tier);
  if (activeCard) {
    activeCard.classList.remove('bg-surface-container-low');
    activeCard.classList.add('bg-surface-container-high', 'ring-2', 'ring-primary');
  }

  // Update DOM displays
  const priceDisplay = document.getElementById('activePrice') || document.getElementById('display-price');
  const btnPriceDisplay = document.getElementById('btnPrice') || document.getElementById('cta-price-prefix');
  const stickyPriceDisplay = document.getElementById('stickyPriceTag');
  const compareDisplay = document.getElementById('activeComparePrice') || document.getElementById('display-original-price');
  const savingsDisplay = document.getElementById('activeSavingsBadge') || document.getElementById('display-savings-tag');

  const formattedPrice = `$${(activeProductPrice * currentQty).toFixed(2)}`;

  if (priceDisplay) priceDisplay.innerText = `$${activeProductPrice.toFixed(2)}`;
  if (btnPriceDisplay) btnPriceDisplay.innerText = formattedPrice;
  if (stickyPriceDisplay) stickyPriceDisplay.innerText = formattedPrice;

  if (comparePriceStr) {
    if (compareDisplay) {
      compareDisplay.innerText = comparePriceStr;
      compareDisplay.classList.remove('hidden');
    }
  } else {
    if (compareDisplay) compareDisplay.classList.add('hidden');
  }

  if (savingsText) {
    if (savingsDisplay) {
      savingsDisplay.innerText = savingsText;
      savingsDisplay.classList.remove('hidden');
    }
  } else {
    if (savingsDisplay) savingsDisplay.classList.add('hidden');
  }
}

function adjustQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  const qtyEl = document.getElementById('qtyCount') || document.getElementById('qty-counter');
  if (qtyEl) qtyEl.innerText = currentQty;

  const btnPrice = document.getElementById('btnPrice') || document.getElementById('cta-price-prefix');
  const stickyPrice = document.getElementById('stickyPriceTag');
  const total = `$${(activeProductPrice * currentQty).toFixed(2)}`;

  if (btnPrice) btnPrice.innerText = total;
  if (stickyPrice) stickyPrice.innerText = total;
}

function copyCode(code) {
  navigator.clipboard?.writeText(code).then(() => {
    const btn = document.getElementById('copyBtn') || document.getElementById('copy-btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span><span>Copied!</span>';
      if (window.CartManager) window.CartManager.showToast(`Coupon code ${code} copied!`);
      setTimeout(() => {
        btn.innerHTML = orig;
      }, 2000);
    }
  });
}

function copyCouponCode() {
  copyCode('HAIR15');
}

function applyBundlePill(qty, discountPercent) {
  currentQty = qty;
  const qtyEl = document.getElementById('qtyCount') || document.getElementById('qty-counter');
  if (qtyEl) qtyEl.innerText = currentQty;

  const discountedTotal = (activeProductPrice * qty * (1 - discountPercent / 100)).toFixed(2);
  const btnPrice = document.getElementById('btnPrice') || document.getElementById('cta-price-prefix');
  const stickyPrice = document.getElementById('stickyPriceTag');

  if (btnPrice) btnPrice.innerText = `$${discountedTotal}`;
  if (stickyPrice) stickyPrice.innerText = `$${discountedTotal}`;

  if (window.CartManager) {
    window.CartManager.showToast(`Selected Buy ${qty} (${discountPercent}% OFF)`);
  }
}

function handleAddToCart() {
  if (window.CartManager) {
    window.CartManager.addItem({
      id: `hairrevive-${activeTier}-${currentQty}`,
      title: activeProductTitle,
      size: activeProductSize,
      price: activeProductPrice,
      quantity: currentQty,
      image: activeProductImg
    });
  }
}

function toggleFaq(id) {
  const content = document.getElementById('faqContent-' + id);
  const icon = document.getElementById('faqIcon-' + id);
  if (!content || !icon) return;

  const isHidden = content.classList.contains('hidden');
  if (isHidden) {
    content.classList.remove('hidden');
    content.classList.add('block');
    icon.innerText = 'expand_less';
  } else {
    content.classList.add('hidden');
    content.classList.remove('block');
    icon.innerText = 'expand_more';
  }
}

// Mobile Sticky Dock Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  const stickyDock = document.getElementById('sticky-mobile-cta') || document.querySelector('.sticky.bottom-4');
  const heroSection = document.querySelector('section');

  if (stickyDock && heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyDock.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        } else {
          stickyDock.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroSection);
  }

  // Bind Main Add to Cart buttons
  document.querySelectorAll('#add-to-cart-cta, #mainAddToCartBtn, [data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart();
    });
  });
});
