/**
 * KUS CULTURE - 60-Second Hair Diagnostic Trichology Quiz Engine
 * Interactive modal, 5 multi-step questions, personalized regimen diagnosis,
 * and 1-click bundle add-to-cart with automatic discount code activation.
 */

const HairQuiz = (function() {
  let currentStep = 0;
  const answers = {};

  const questions = [
    {
      id: 'concern',
      title: 'What is your primary scalp & hair concern?',
      subtitle: 'Select the primary factor you wish to resolve',
      options: [
        { label: 'Excessive hair shedding & thinning', value: 'fall', icon: 'shield' },
        { label: 'Oily roots & rapid buildup in 24 hours', value: 'oil', icon: 'opacity' },
        { label: 'Dry, itchy, or flake-prone sensitive scalp', value: 'dry', icon: 'spa' },
        { label: 'Brittle breakage, split ends & dullness', value: 'breakage', icon: 'flare' }
      ]
    },
    {
      id: 'shed_rate',
      title: 'What best describes your shower shedding rate?',
      subtitle: 'Measured during wash & brush routines',
      options: [
        { label: 'Normal maintenance (10–30 strands)', value: 'low', icon: 'check' },
        { label: 'Moderate / Noticeable clumps in drain (40–80 strands)', value: 'med', icon: 'warning' },
        { label: 'Significant thinning / Scalp parting widening', value: 'high', icon: 'crisis_alert' }
      ]
    },
    {
      id: 'wash_freq',
      title: 'How frequently do you cleanse your scalp?',
      subtitle: 'Helps balance surfactant & lipid formulation',
      options: [
        { label: 'Daily or post-workout', value: 'daily', icon: 'routine' },
        { label: '2–3 times per week (recommended)', value: 'standard', icon: 'calendar_today' },
        { label: 'Once a week or less', value: 'infrequent', icon: 'event_busy' }
      ]
    },
    {
      id: 'treatment',
      title: 'Is your hair color-treated, bleached, or chemically processed?',
      subtitle: 'Our formulas are 100% color-safe & sulfate-free',
      options: [
        { label: 'Yes, heavily bleached or balayage', value: 'bleach', icon: 'palette' },
        { label: 'Yes, regular single-process color or toner', value: 'colored', icon: 'brush' },
        { label: 'No, completely natural virgin hair', value: 'virgin', icon: 'eco' }
      ]
    },
    {
      id: 'water',
      title: 'What is your regional tap water hardness?',
      subtitle: 'Mineral buildup directly impacts follicle health',
      options: [
        { label: 'Hard water (heavy minerals / scale on taps)', value: 'hard', icon: 'water' },
        { label: 'Soft or filtered showerhead water', value: 'soft', icon: 'filter_alt' },
        { label: 'I am not sure', value: 'unsure', icon: 'help_outline' }
      ]
    }
  ];

  function openQuiz() {
    currentStep = 0;
    initModalDOM();
    const modal = document.getElementById('quiz-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderStep();
    }
  }

  function closeQuiz() {
    const modal = document.getElementById('quiz-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function renderStep() {
    const card = document.getElementById('quiz-modal-content');
    if (!card) return;

    if (currentStep < questions.length) {
      const q = questions[currentStep];
      const progressPercent = Math.round(((currentStep + 1) / questions.length) * 100);

      card.innerHTML = `
        <div class="p-6 md:p-8 space-y-6">
          <div class="flex items-center justify-between">
            <span class="font-caption-caps text-caption-caps uppercase text-secondary font-bold">
              Question ${currentStep + 1} of ${questions.length}
            </span>
            <span class="font-label-sm text-label-sm text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
              ${progressPercent}% Completed
            </span>
          </div>

          <!-- Progress bar -->
          <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div class="bg-primary h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
          </div>

          <div>
            <h3 class="font-headline-lg text-headline-lg text-on-surface leading-snug">${q.title}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${q.subtitle}</p>
          </div>

          <div class="space-y-3 pt-2">
            ${q.options.map(opt => `
              <div onclick="HairQuiz.selectOption('${q.id}', '${opt.value}')"
                   class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-all border border-transparent hover:border-outline-variant flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface">
                    <span class="material-symbols-outlined text-[18px]">${opt.icon}</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary">${opt.label}</span>
                </div>
                <span class="material-symbols-outlined text-outline group-hover:text-primary text-[20px] transition-transform group-hover:translate-x-1">chevron_right</span>
              </div>
            `).join('')}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-surface-container">
            ${currentStep > 0 ? `
              <button type="button" onclick="HairQuiz.prevStep()" class="font-label-md text-on-surface-variant hover:text-on-surface flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px]">chevron_left</span> Back
              </button>
            ` : '<div></div>'}
            <button type="button" onclick="HairQuiz.closeQuiz()" class="font-label-sm text-on-surface-variant hover:text-on-surface uppercase">
              Cancel
            </button>
          </div>
        </div>
      `;
    } else {
      // Diagnostic Result Card
      card.innerHTML = `
        <div class="p-6 md:p-8 space-y-6 text-center">
          <div class="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed mx-auto flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[32px]">verified</span>
          </div>

          <div>
            <span class="font-caption-caps text-caption-caps uppercase text-secondary font-bold">Personalized Diagnosis Complete</span>
            <h3 class="font-headline-lg text-headline-lg text-on-surface mt-1">Prescribed: Cellular Density Protocol</h3>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-2">
              Based on your clinical markers, your scalp requires bio-peptide anchoring, pH 5.5 lipid protection, and weekly micro-sebum exfoliation.
            </p>
          </div>

          <!-- Prescribed Products Box -->
          <div class="bg-surface-container-low rounded-2xl p-4 text-left space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-surface-container">
              <span class="font-label-sm uppercase font-bold text-on-surface">Your Prescribed 3-Step Routine</span>
              <span class="font-label-sm text-on-tertiary-fixed bg-tertiary-fixed px-2 py-0.5 rounded font-bold">15% OFF Code: HAIR15</span>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-14 bg-surface-container-lowest rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFCR5RYUEWtEvP01b_APRd4TmRQCmm8fj7LR5TxKDIlAprC8TLOJyYpDD6xW_tulRoQF95ZTZ1e6Q877YaiYcjBaPWej6RAzcP592WD7MOJcFMxzM6_l1U-8GzXNzUcHybWbYWCSmLAFSV16Zv5ZCtJswcIrt2uaOObILBILYed2uXtBbmev8dfKQY4ClNfwVb00DexL7sdyJ6HASj-qxWwTaYp7xevk3DXjpPGYL_rbxietzICsZA" class="max-h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-label-md font-bold text-on-surface truncate">Step 1: HairRevive™ Anti Hair Fall Shampoo</p>
                <p class="font-body-sm text-on-surface-variant">Biotinoyl Tripeptide-1 • 500ml</p>
              </div>
              <span class="font-label-md font-bold">$24.99</span>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-14 bg-surface-container-lowest rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54-FJWDAY26xS-oXcVoqkHAqY8hbRFTuXsCx8vB1jRA_guOPETcCAtxCdSCrJOPpRD3Nw2WdCj1qtXJQ7gtz9PAno8laSIg31gY4vkeVXjhtTqcyunakDZdPdzTYm-Pp6tKCCDrgB8CALJqPmwVckQ6x9Qs1w4vJwkIbUWQ98FZ4ROKF2De1SjOyoCfrdxTUo6YkwOfszKtZFIBlKEQRaiQUfVhHJWAzQyukSIcpNRj7Am52c92r5" class="max-h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-label-md font-bold text-on-surface truncate">Step 2: Cell-Anchor™ Scalp Activator Serum</p>
                <p class="font-body-sm text-on-surface-variant">Copper Peptide GHK-Cu • 60ml</p>
              </div>
              <span class="font-label-md font-bold">$44.99</span>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-14 bg-surface-container-lowest rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD466zw4GpRscQro2QEkCzHgvVESbho0TFfR6jD_Yh03oBckudHDwv7Shw7M4S1oPSkzVelRDxpbVbysgTu7rcx9-OMrnuGZINhJmTy-8v9LRasi3Dswur2sebUmGxdkQ9jptQwUgDFxKE1zbx1b_YcZqhT_3j0rZ1pNMUJybPf7dFMU8GeDZMO2mkRxUwj9hhVBWSeIwKY2sVZ5TAbOmtsVGJhOuDI4IB8tohFd2aYYVpjO0Jk3-r1" class="max-h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-label-md font-bold text-on-surface truncate">Step 3: Purifying Pre-Wash Scalp Scrub</p>
                <p class="font-body-sm text-on-surface-variant">Jojoba Wax Spheres • 200ml</p>
              </div>
              <span class="font-label-md font-bold">$29.99</span>
            </div>
          </div>

          <!-- Total & 1-Click Action -->
          <div class="pt-2 space-y-3">
            <div class="flex items-center justify-between text-on-surface">
              <span class="font-body-md">Regimen Value: <span class="line-through text-on-surface-variant">$99.97</span></span>
              <span class="font-display-sm font-bold text-emerald-700">Quiz Price: $79.99 (Save $19.98)</span>
            </div>

            <button type="button" onclick="HairQuiz.claimRoutine()"
                    class="w-full bg-primary text-on-primary py-4 px-6 rounded-full font-label-lg uppercase tracking-wider font-bold shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2">
              <span>ADD PRESCRIBED REGIMEN TO BAG</span>
              <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
            </button>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Includes Free Express Shipping & 30-Day Money-Back Guarantee</p>
          </div>
        </div>
      `;
    }
  }

  function selectOption(qId, val) {
    answers[qId] = val;
    currentStep++;
    renderStep();
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  }

  function claimRoutine() {
    if (window.CartManager) {
      window.CartManager.addItem({
        id: 'bundle-prescribed-regimen',
        title: 'Prescribed Cellular Density Regimen (3-Piece)',
        size: 'Full Regimen Protocol',
        price: 79.99,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCR5RYUEWtEvP01b_APRd4TmRQCmm8fj7LR5TxKDIlAprC8TLOJyYpDD6xW_tulRoQF95ZTZ1e6Q877YaiYcjBaPWej6RAzcP592WD7MOJcFMxzM6_l1U-8GzXNzUcHybWbYWCSmLAFSV16Zv5ZCtJswcIrt2uaOObILBILYed2uXtBbmev8dfKQY4ClNfwVb00DexL7sdyJ6HASj-qxWwTaYp7xevk3DXjpPGYL_rbxietzICsZA'
      });
    }
    closeQuiz();
  }

  function initModalDOM() {
    if (document.getElementById('quiz-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'quiz-modal';
    modal.className = 'quiz-modal-backdrop';
    modal.innerHTML = `
      <div class="quiz-modal-card relative" id="quiz-modal-content">
        <!-- Injected via renderStep -->
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuiz();
    });
    document.body.appendChild(modal);
  }

  // Bind trigger links across pages
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[href="#hair-quiz"], .hair-quiz-trigger').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openQuiz();
      });
    });
  });

  return {
    openQuiz,
    closeQuiz,
    selectOption,
    prevStep,
    claimRoutine
  };
})();
window.HairQuiz = HairQuiz;
