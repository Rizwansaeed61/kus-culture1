/**
 * KUS CULTURE - Shopify AJAX Theme Script & Hair Diagnostic Quiz
 */
document.addEventListener('DOMContentLoaded', function() {
  // Mobile sticky ATC observer
  const stickyAtc = document.getElementById('shopify-sticky-atc');
  const hero = document.querySelector('.hero-section') || document.querySelector('section');
  if (stickyAtc && hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        stickyAtc.classList.remove('translate-y-full');
      } else {
        stickyAtc.classList.add('translate-y-full');
      }
    }, { threshold: 0.1 });
    observer.observe(hero);
  }

  // Bind drawer triggers
  document.querySelectorAll('[data-cart-trigger], .cart-trigger, [aria-label="View shopping bag"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
});

function openCartDrawer() {
  const drawer = document.getElementById('shopify-cart-drawer');
  const overlay = document.getElementById('shopify-cart-overlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('shopify-cart-drawer');
  const overlay = document.getElementById('shopify-cart-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function shopifyAddToCart(variantId, quantity = 1) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    });
    if (res.ok) {
      openCartDrawer();
      refreshCart();
    } else {
      window.location.href = '/cart';
    }
  } catch (err) {
    window.location.href = '/cart';
  }
}

async function refreshCart() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = cart.item_count;
    });
  } catch (e) {}
}

// Bulletproof Coupon Copy & Auto-Discount Engine
function copyCoupon(code, buttonElement) {
  const couponCode = code || 'HAIR15';
  let copySuccessful = false;

  // 1. Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(couponCode).then(() => {
      onCouponCopied(couponCode, buttonElement);
    }).catch(() => {
      fallbackClipboardCopy(couponCode, buttonElement);
    });
  } else {
    fallbackClipboardCopy(couponCode, buttonElement);
  }

  // 2. Register discount in Shopify session
  try {
    fetch('/discount/' + encodeURIComponent(couponCode), { method: 'GET', credentials: 'same-origin' });
  } catch (err) {}
}

function fallbackClipboardCopy(text, buttonElement) {
  try {
    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.top = '-9999px';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  } catch (e) {}
  onCouponCopied(text, buttonElement);
}

function onCouponCopied(code, btn) {
  // Update button visual state
  const targetBtn = btn || event?.target?.closest('button') || document.getElementById('showcase-copy-btn') || document.getElementById('copyBtn');
  if (targetBtn) {
    const origHtml = targetBtn.innerHTML;
    targetBtn.innerHTML = '<span class="material-symbols-outlined text-[15px] text-emerald-600 font-bold" style="vertical-align: middle;">check_circle</span> <span class="text-emerald-700 font-bold">Copied!</span>';
    targetBtn.classList.add('bg-emerald-100', 'border', 'border-emerald-400');

    setTimeout(() => {
      targetBtn.innerHTML = origHtml;
      targetBtn.classList.remove('bg-emerald-100', 'border', 'border-emerald-400');
    }, 3000);
  }

  // Show floating toast notification
  showKusToast('✓ Coupon code ' + code + ' copied! 15% discount applied at checkout.');
}

function showKusToast(message) {
  let toast = document.getElementById('kus-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'kus-toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-[99999] bg-primary text-on-primary px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<span class="material-symbols-outlined text-[20px] text-tertiary-fixed">celebration</span><span>' + message + '</span>';
  toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

  clearTimeout(window.kusToastTimeout);
  window.kusToastTimeout = setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
  }, 3500);
}

// Showcase Size Selector Helper
function selectShowcaseTier(tier, price) {
  document.querySelectorAll('.showcase-size-card').forEach(c => {
    c.classList.remove('ring-2', 'ring-primary', 'bg-surface-container-high', 'shadow-md');
    c.classList.add('bg-surface-container-low', 'shadow-sm');
  });
  const active = document.getElementById('showcase-tier-' + tier);
  if (active) {
    active.classList.add('ring-2', 'ring-primary', 'bg-surface-container-high', 'shadow-md');
    active.classList.remove('bg-surface-container-low', 'shadow-sm');
  }
  const priceDisplay = document.getElementById('shopify-active-price');
  if (priceDisplay && price) {
    priceDisplay.textContent = price;
  }
}


// Interactive Hair Quiz Engine
const HairQuiz = (function() {
  const questions = [
    {
      id: 1,
      question: "What best describes your scalp environment?",
      subtitle: "Our formulas are calibrated to biological pH 5.2-5.5.",
      options: [
        { label: "Oily & Congested", desc: "Excess sebum within 24 hours of washing", value: "oily" },
        { label: "Dry & Sensitive", desc: "Prone to tightness, flaking, or itchiness", value: "dry" },
        { label: "Normal / Balanced", desc: "Comfortable, wash every 2-3 days", value: "normal" },
        { label: "Combination", desc: "Oily roots with dry, brittle ends", value: "combination" }
      ]
    },
    {
      id: 2,
      question: "What is your primary hair density concern?",
      subtitle: "Pinpointing follicular weakness allows precise peptide selection.",
      options: [
        { label: "Noticeable Shedding", desc: "Hair in shower drain or comb daily", value: "shedding" },
        { label: "Thinning at Temples / Part", desc: "Visible scalp widening or hairline recession", value: "thinning" },
        { label: "Breakage & Weak Strands", desc: "Snapping easily when brushed or styled", value: "breakage" },
        { label: "Loss of Volume & Lifeless", desc: "Hair falls flat with no root lift", value: "flat" }
      ]
    },
    {
      id: 3,
      question: "What is your natural hair strand texture?",
      subtitle: "Determines lipid weight requirements to prevent weighing hair down.",
      options: [
        { label: "Fine & Silky", desc: "Easily weighed down by heavy oils", value: "fine" },
        { label: "Medium / Normal", desc: "Standard density and thickness", value: "medium" },
        { label: "Coarse / Thick", desc: "Requires intense lipid cuticle repair", value: "coarse" },
        { label: "Curly / Coily", desc: "Thirsty for hydration and barrier protection", value: "curly" }
      ]
    },
    {
      id: 4,
      question: "How often do you currently wash your hair?",
      subtitle: "Ensures botanical surfactant dosage aligns with your routine.",
      options: [
        { label: "Daily", desc: "Require ultra-gentle, non-stripping base", value: "daily" },
        { label: "Every 2-3 Days", desc: "Optimal balance for active botanical delivery", value: "2-3days" },
        { label: "Once or Twice a Week", desc: "Need deep clarifying & prolonged protection", value: "weekly" }
      ]
    },
    {
      id: 5,
      question: "Is your hair color-treated or chemically processed?",
      subtitle: "All formulas are sulfate-free and keratin-safe.",
      options: [
        { label: "Yes, Bleached / Highlighted", desc: "Needs high antioxidant UV and pigment shield", value: "bleached" },
        { label: "Yes, Color-Dyed / Keratin", desc: "Requires sulfate-free gentle cuticle seal", value: "colored" },
        { label: "No, 100% Virgin Hair", desc: "Natural cuticle intact", value: "virgin" }
      ]
    }
  ];

  let currentStep = 0;
  let userAnswers = {};

  function openQuiz() {
    const modal = document.getElementById('hair-quiz-modal');
    if (!modal) return;
    currentStep = 0;
    userAnswers = {};
    renderStep();
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    const box = document.getElementById('quiz-modal-box');
    if (box) {
      box.classList.remove('scale-95');
      box.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeQuiz() {
    const modal = document.getElementById('hair-quiz-modal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    const box = document.getElementById('quiz-modal-box');
    if (box) {
      box.classList.add('scale-95');
      box.classList.remove('scale-100');
    }
    document.body.style.overflow = '';
  }

  function renderStep() {
    const stage = document.getElementById('quiz-dynamic-stage');
    const stepTag = document.getElementById('quiz-step-tag');
    const pctTag = document.getElementById('quiz-pct-tag');
    const progBar = document.getElementById('quiz-progress-bar');
    if (!stage) return;

    if (currentStep < questions.length) {
      const q = questions[currentStep];
      const pct = Math.round(((currentStep + 1) / questions.length) * 100);
      if (stepTag) stepTag.textContent = "Step " + (currentStep + 1) + " of " + questions.length;
      if (pctTag) pctTag.textContent = pct + "% Completed";
      if (progBar) progBar.style.width = pct + "%";

      let optionsHtml = q.options.map((opt, i) => `
        <button type="button" onclick="HairQuiz.selectAnswer(${i})" class="w-full text-left p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container hover:border-primary transition-all group flex items-start gap-3">
          <div class="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
            <div class="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <p class="font-bold text-sm text-on-surface">${opt.label}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">${opt.desc}</p>
          </div>
        </button>
      `).join('');

      stage.innerHTML = `
        <div class="space-y-4">
          <div>
            <h3 class="font-serif text-xl sm:text-2xl text-on-surface font-semibold">${q.question}</h3>
            <p class="text-xs text-on-surface-variant mt-1">${q.subtitle}</p>
          </div>
          <div class="space-y-2 pt-2">
            ${optionsHtml}
          </div>
        </div>
      `;
    } else {
      renderResult();
    }
  }

  function selectAnswer(optIndex) {
    const q = questions[currentStep];
    userAnswers[q.id] = q.options[optIndex].value;
    currentStep++;
    renderStep();
  }

  function renderResult() {
    const stage = document.getElementById('quiz-dynamic-stage');
    const stepTag = document.getElementById('quiz-step-tag');
    const pctTag = document.getElementById('quiz-pct-tag');
    const progBar = document.getElementById('quiz-progress-bar');

    if (stepTag) stepTag.textContent = "Diagnosis Complete";
    if (pctTag) pctTag.textContent = "100% Match";
    if (progBar) progBar.style.width = "100%";

    if (stage) {
      stage.innerHTML = `
        <div class="space-y-5 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold shadow-sm">
            <span class="material-symbols-outlined text-[16px]">verified</span>
            Bespoke Trichology Formula Prescribed
          </div>
          <h3 class="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">Your Recommended Regimen</h3>
          <p class="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
            Based on your responses, we prescribed the <strong>Complete 4-Step Hair Growth Routine</strong> featuring Biotinoyl Tripeptide-1 and cold-pressed Australian botanicals.
          </p>
          
          <div class="bg-surface-container-low p-4 rounded-2xl border border-surface-container flex items-center justify-between gap-4 text-left">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold">4-Piece System</span>
              <p class="text-sm font-bold text-on-surface">Shampoo + Conditioner + Serum + Scalp Tx</p>
              <p class="text-xs text-on-surface font-semibold">$79.99 <span class="line-through text-outline font-normal">$97.99 (Save $18)</span></p>
            </div>
            <button type="button" onclick="HairQuiz.addPrescribedRoutine()" class="bg-primary text-on-primary font-bold text-xs uppercase px-5 py-3 rounded-full hover:bg-primary-container transition-all shadow-md whitespace-nowrap">
              Add To Bag
            </button>
          </div>
          <p class="text-[11px] text-on-surface-variant">Includes 30-day money back guarantee & free express shipping.</p>
        </div>
      `;
    }
  }

  function addPrescribedRoutine() {
    closeQuiz();
    openCartDrawer();
  }

  return {
    openQuiz,
    closeQuiz,
    selectAnswer,
    addPrescribedRoutine
  };
})();
