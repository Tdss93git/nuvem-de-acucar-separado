/* =========================================================
   CONFIG — placeholders, replace with the real business data
   ========================================================= */
const CONFIG = {
  // Digits only, country + area code, e.g. 55 62 99999-9999 -> "5562999999999"
  whatsappNumber: '5562999999999', // PLACEHOLDER — troque pelo número real
  instagramUrl: 'https://instagram.com/nuvemdeacucar', // PLACEHOLDER — troque pelo perfil real
};

/* =========================================================
   MENU DATA (ticket 03) — from the business-plan sample table
   ========================================================= */
const MENU = [
  { category:'Bolos', items:[
    { name:'Bolo caseiro', desc:'Bolo simples e macio, ideal para o dia a dia ou o café da tarde.', price:40, icon:'icon-bolo' },
    { name:'Bolo recheado', desc:'Massa fofinha com recheio e cobertura à sua escolha.', price:135, icon:'icon-bolo' },
  ]},
  { category:'Bolos de Aniversário', items:[
    { name:'Bolo de aniversário personalizado', desc:'Feito sob medida: tamanho, sabor e tema à sua escolha.', price:220, priceNote:'a partir de', icon:'icon-bolo-aniversario' },
  ]},
  { category:'Doces Gourmet', items:[
    { name:'Caixa com 6 brigadeiros', desc:'Brigadeiros gourmet feitos à mão, em sabores variados.', price:30, icon:'icon-brigadeiro' },
  ]},
  { category:'Sobremesas', items:[
    { name:'Sobremesa no pote', desc:'Camadas cremosas em pote individual, prontas para presentear.', price:18, icon:'icon-pote' },
    { name:'Cupcake', desc:'Cupcake fofinho com cobertura cremosa.', price:12, icon:'icon-cupcake' },
  ]},
  { category:'Kits Presente', items:[
    { name:'Kit café da tarde', desc:'Seleção de doces para presentear ou compartilhar.', price:65, priceNote:'a partir de', icon:'icon-presente' },
  ]},
  { category:'Festas', items:[
    { name:'Combo para festas', desc:'Doces variados para eventos e comemorações, sob encomenda.', price:150, priceNote:'a partir de', icon:'icon-festa' },
  ]},
];

/* =========================================================
   PRICING (ticket 02) — data tables and pricing formula mirrored
   from src/pricing.js. This is a static single-file site with no
   build step, so the tested module and this copy are kept manually
   in sync; see src/pricing.js + test/pricing.test.js for the tested
   source. One deliberate difference: calculatePrice() here returns
   null for incomplete selections instead of throwing, since the
   wizard calls it after every single-field change while the user is
   still mid-flow — the tested module's stricter throw-on-invalid
   behavior is exercised via its own test suite, not here.
   ========================================================= */
const SIZES = {
  pequeno:{ label:'Pequeno (até 15 pessoas)', price:180 },
  medio:{ label:'Médio (20 a 30 pessoas)', price:220 },
  grande:{ label:'Grande (35 a 50 pessoas)', price:260 },
  extraGrande:{ label:'Extra grande (60+ pessoas)', price:300 },
};
const BATTERS = {
  baunilha:{ label:'Baunilha', addOn:0 },
  chocolate:{ label:'Chocolate', addOn:10 },
  cenoura:{ label:'Cenoura com chocolate', addOn:10 },
  redVelvet:{ label:'Red velvet', addOn:20 },
};
const FILLINGS = {
  brigadeiro:{ label:'Brigadeiro', addOn:0 },
  doceDeLeite:{ label:'Doce de leite', addOn:10 },
  ninhoMorango:{ label:'Ninho com morango', addOn:20 },
  ganache:{ label:'Ganache de chocolate belga', addOn:25 },
};
const FROSTINGS = {
  chantininho:{ label:'Chantininho', addOn:0 },
  nakedCake:{ label:'Naked cake', addOn:10 },
  buttercream:{ label:'Buttercream', addOn:15 },
  pastaAmericana:{ label:'Pasta americana', addOn:30 },
};
const THEMES = {
  simples:{ label:'Simples, sem tema', addOn:0 },
  tematicoInfantil:{ label:'Temático infantil', addOn:20 },
  personalizadoTopper:{ label:'Personalizado com topper', addOn:35 },
  elaborado:{ label:'Elaborado (flores/pintura à mão)', addOn:50 },
};

function calculatePrice(selections){
  const { size, batter, filling, frosting, theme } = selections || {};
  const sizeEntry = SIZES[size];
  const batterEntry = BATTERS[batter];
  const fillingEntry = FILLINGS[filling];
  const frostingEntry = FROSTINGS[frosting];
  const themeEntry = THEMES[theme];
  if(!sizeEntry || !batterEntry || !fillingEntry || !frostingEntry || !themeEntry) return null;
  return sizeEntry.price + batterEntry.addOn + fillingEntry.addOn + frostingEntry.addOn + themeEntry.addOn;
}

/* =========================================================
   WIZARD (ticket 04)
   ========================================================= */
const WIZARD_STEPS = [
  { key:'size', label:'Tamanho', title:'Escolha o tamanho', hint:'Quantas pessoas vão saborear o bolo?', options:SIZES, showPrice:'price' },
  { key:'batter', label:'Massa', title:'Escolha a massa', hint:'A base do seu bolo.', options:BATTERS, showPrice:'addOn' },
  { key:'filling', label:'Recheio', title:'Escolha o recheio', hint:'O que vai por dentro.', options:FILLINGS, showPrice:'addOn' },
  { key:'frosting', label:'Cobertura', title:'Escolha a cobertura', hint:'O acabamento por fora.', options:FROSTINGS, showPrice:'addOn' },
  { key:'theme', label:'Tema', title:'Escolha o tema e a decoração', hint:'O visual da festa.', options:THEMES, showPrice:'addOn' },
  { key:'entrega', label:'Entrega', title:'Data de entrega e resumo', hint:'Falta só a data — confira o resumo ao lado.' },
];

const selections = { size:null, batter:null, filling:null, frosting:null, theme:null, date:'' };
let currentStep = 0;

function formatMoney(n){ return n.toLocaleString('pt-BR'); }

function formatDateBR(iso){
  if(!iso) return 'a combinar';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function buildWaLink(number, message){
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildOrderMessage(){
  const price = calculatePrice(selections);
  return 'Olá! Quero encomendar um bolo personalizado 🎂\n\n' +
    'Produto: Bolo de aniversário personalizado (Monte seu Bolo)\n' +
    `Tamanho: ${SIZES[selections.size]?.label ?? '-'}\n` +
    `Massa: ${BATTERS[selections.batter]?.label ?? '-'}\n` +
    `Recheio: ${FILLINGS[selections.filling]?.label ?? '-'}\n` +
    `Cobertura: ${FROSTINGS[selections.frosting]?.label ?? '-'}\n` +
    `Tema/decoração: ${THEMES[selections.theme]?.label ?? '-'}\n` +
    `Data de entrega: ${formatDateBR(selections.date)}\n` +
    `Preço estimado: R$ ${price !== null ? formatMoney(price) : '-'}\n\n` +
    'Pode confirmar disponibilidade?';
}

function renderWizardProgress(){
  const list = document.getElementById('wizard-progress');
  list.innerHTML = '';
  WIZARD_STEPS.forEach((step, i) => {
    const li = document.createElement('li');
    if(i === currentStep) li.classList.add('is-current');
    else if(i < currentStep) li.classList.add('is-done');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Passo ${i+1}: ${step.label}`);
    btn.disabled = i > currentStep;
    btn.addEventListener('click', () => { if(i <= currentStep){ currentStep = i; renderAll(); } });
    const span = document.createElement('span');
    span.textContent = step.label;
    li.append(btn, span);
    list.appendChild(li);
  });
}

function renderWizardStep(){
  const step = WIZARD_STEPS[currentStep];
  const wrap = document.getElementById('wizard-step-content');
  wrap.innerHTML = '';

  const h3 = document.createElement('h3');
  h3.textContent = step.title;
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = step.hint;
  wrap.append(h3, hint);

  if(step.options){
    const grid = document.createElement('div');
    grid.className = 'option-grid';
    Object.entries(step.options).forEach(([key, opt]) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'option-card';
      if(selections[step.key] === key) card.classList.add('is-selected');
      card.setAttribute('aria-pressed', selections[step.key] === key ? 'true' : 'false');
      const labelEl = document.createElement('span');
      labelEl.className = 'opt-label';
      labelEl.textContent = opt.label;
      const priceEl = document.createElement('span');
      priceEl.className = 'opt-price';
      priceEl.textContent = step.showPrice === 'price' ? `R$ ${formatMoney(opt.price)}` : (opt.addOn > 0 ? `+ R$ ${formatMoney(opt.addOn)}` : 'incluso');
      card.append(labelEl, priceEl);
      card.addEventListener('click', () => {
        selections[step.key] = key;
        renderAll();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
  } else {
    const field = document.createElement('div');
    field.className = 'date-field';
    const label = document.createElement('label');
    label.setAttribute('for', 'delivery-date');
    label.textContent = 'Data de entrega desejada';
    const input = document.createElement('input');
    input.type = 'date';
    input.id = 'delivery-date';
    input.value = selections.date;
    input.min = new Date().toISOString().split('T')[0];
    input.addEventListener('change', (e) => { selections.date = e.target.value; renderAll(); });
    field.append(label, input);
    wrap.appendChild(field);
  }
}

function renderWizardSummary(){
  const list = document.getElementById('wizard-summary-list');
  list.innerHTML = '';
  const rows = [
    ['Tamanho', selections.size ? SIZES[selections.size].label : '—'],
    ['Massa', selections.batter ? BATTERS[selections.batter].label : '—'],
    ['Recheio', selections.filling ? FILLINGS[selections.filling].label : '—'],
    ['Cobertura', selections.frosting ? FROSTINGS[selections.frosting].label : '—'],
    ['Tema', selections.theme ? THEMES[selections.theme].label : '—'],
    ['Entrega', formatDateBR(selections.date)],
  ];
  rows.forEach(([k,v]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="k">${k}</span><span class="v">${v}</span>`;
    list.appendChild(li);
  });

  const price = calculatePrice(selections);
  document.getElementById('wizard-price').textContent = price !== null ? formatMoney(price) : '—';

  const waBtn = document.getElementById('wizard-whatsapp');
  if(price !== null && currentStep === WIZARD_STEPS.length - 1){
    waBtn.style.display = 'inline-flex';
    waBtn.href = buildWaLink(CONFIG.whatsappNumber, buildOrderMessage());
  } else {
    waBtn.style.display = 'none';
  }
}

function renderWizardNav(){
  const back = document.getElementById('wizard-back');
  const next = document.getElementById('wizard-next');
  back.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

  const step = WIZARD_STEPS[currentStep];
  const isLast = currentStep === WIZARD_STEPS.length - 1;
  next.style.display = isLast ? 'none' : 'inline-flex';
  if(step.options){
    next.disabled = !selections[step.key];
  } else {
    next.disabled = false;
  }
}

function renderAll(){
  renderWizardProgress();
  renderWizardStep();
  renderWizardSummary();
  renderWizardNav();
}

document.getElementById('wizard-back').addEventListener('click', () => {
  if(currentStep > 0){ currentStep -= 1; renderAll(); }
});
document.getElementById('wizard-next').addEventListener('click', () => {
  if(currentStep < WIZARD_STEPS.length - 1){ currentStep += 1; renderAll(); }
});

renderAll();

/* =========================================================
   CARDÁPIO (ticket 03)
   ========================================================= */
function renderMenu(activeCategory){
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';
  MENU.forEach(group => {
    group.items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'menu-card reveal';
      card.dataset.category = group.category;
      if(activeCategory && activeCategory !== 'Todos' && activeCategory !== group.category){
        card.classList.add('is-hidden');
      }
      card.innerHTML = `
        <span class="icon-wrap"><svg class="icon" aria-hidden="true"><use href="#${item.icon}"></use></svg></span>
        <span class="cat-tag">${group.category}</span>
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="price-row">
          <span class="price">R$ ${formatMoney(item.price)}</span>
          ${item.priceNote ? `<span class="price-note">${item.priceNote}</span>` : ''}
        </div>`;
      grid.appendChild(card);
    });
  });
}

function renderMenuFilters(){
  const filters = document.getElementById('menu-filters');
  const categories = ['Todos', ...MENU.map(g => g.category)];
  filters.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-chip';
    if(cat === 'Todos') btn.classList.add('is-active');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelectorAll('.menu-card').forEach(card => {
        card.classList.toggle('is-hidden', cat !== 'Todos' && card.dataset.category !== cat);
      });
    });
    filters.appendChild(btn);
  });
}

renderMenuFilters();
renderMenu();

/* =========================================================
   WHATSAPP / INSTAGRAM links + mobile nav (ticket 01 / 05)
   ========================================================= */
const genericMessage = 'Olá! Vi o site da Nuvem de Açúcar e queria saber mais sobre os doces 🍰';
const genericWa = buildWaLink(CONFIG.whatsappNumber, genericMessage);
['header-whatsapp','contact-whatsapp','fab-whatsapp'].forEach(id => {
  document.getElementById(id).href = genericWa;
});
document.getElementById('contact-instagram').href = CONFIG.instagramUrl;

const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.getElementById('nav-toggle-icon').innerHTML = `<use href="#${isOpen ? 'icon-close' : 'icon-menu'}"></use>`;
});
primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.getElementById('nav-toggle-icon').innerHTML = '<use href="#icon-menu"></use>';
}));

/* =========================================================
   ANIMATIONS (ticket 06) — GSAP + ScrollTrigger, reduced-motion aware
   ========================================================= */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!prefersReducedMotion && window.gsap){
  gsap.registerPlugin(ScrollTrigger);

  // hero load-in sequence
  gsap.timeline({ defaults:{ ease:'power2.out', duration:.7 } })
    .from('.hero .eyebrow', { y:16, opacity:0 })
    .from('.hero h1', { y:20, opacity:0 }, '-=.45')
    .from('.hero .lede', { y:16, opacity:0 }, '-=.45')
    .from('.hero-ctas .btn', { y:12, opacity:0, stagger:.1 }, '-=.4')
    .from('.hero-art', { scale:.9, opacity:0, duration:.9 }, '-=.6');

  // scroll reveals across sections
  document.querySelectorAll('.section .reveal').forEach(el => {
    gsap.from(el, {
      y:28, opacity:0, duration:.7, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 85%' }
    });
  });

  // menu cards stagger in as a group
  gsap.from('#menu-grid .menu-card', {
    y:20, opacity:0, duration:.5, stagger:.08, ease:'power2.out',
    scrollTrigger:{ trigger:'#menu-grid', start:'top 85%' }
  });

  // signature "piping thread" draws itself as the page is scrolled
  const threadPath = document.getElementById('thread-path');
  const len = threadPath.getTotalLength();
  threadPath.style.strokeDasharray = len;
  threadPath.style.strokeDashoffset = len;
  gsap.to(threadPath, {
    strokeDashoffset:0, ease:'none',
    scrollTrigger:{ trigger:document.body, start:'top top', end:'bottom bottom', scrub:.4 }
  });
} else {
  document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
  const threadPath = document.getElementById('thread-path');
  if(threadPath) threadPath.style.strokeDashoffset = 0;
}
