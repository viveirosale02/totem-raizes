/* ============================================================
   RAÍZES DO NORDESTE — TOTEM DE AUTOATENDIMENTO
   Protótipo de navegação e estado (sem backend real).
   Regra de pagamento mock replica a regra do back-end:
   aprova total <= R$ 1.000,00, recusa valores acima disso.
   ============================================================ */

const PRODUCTS = [
  { id: 1, cat: 'salgados', name: 'Tapioca Tradicional', desc: 'Goma fresca com manteiga de garrafa.', price: 9.90, icon: '🫓', seasonal: false },
  { id: 2, cat: 'salgados', name: 'Tapioca de Carne de Sol', desc: 'Carne de sol desfiada e queijo coalho.', price: 16.90, icon: '🫓', seasonal: false },
  { id: 3, cat: 'bolos', name: 'Bolo de Macaxeira', desc: 'Fatia generosa, receita de família.', price: 8.50, icon: '🍰', seasonal: false },
  { id: 4, cat: 'bolos', name: 'Cuscuz Recheado', desc: 'Cuscuz com queijo coalho e coco.', price: 12.90, icon: '🍚', seasonal: false },
  { id: 5, cat: 'bebidas', name: 'Suco de Caju', desc: 'Suco regional natural, 400ml.', price: 7.90, icon: '🥤', seasonal: false },
  { id: 6, cat: 'bebidas', name: 'Café Passado na Hora', desc: 'Café tradicional, coado no pano.', price: 5.50, icon: '☕', seasonal: false },
  { id: 7, cat: 'junino', name: 'Bolo de Milho Junino', desc: 'Disponível só no período junino.', price: 10.90, icon: '🌽', seasonal: true },
  { id: 8, cat: 'junino', name: 'Canjica Quentinha', desc: 'Receita tradicional de festa.', price: 9.50, icon: '🥣', seasonal: true },
];

const state = {
  screen: 'welcome',
  cart: {}, // { productId: qty }
  selectedProduct: null,
  modalQty: 1,
  identifyMode: 'anon',
  consentGiven: false,
  payMethod: null,
  orderId: null,
};

function brl(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* -------------------- NAVEGAÇÃO -------------------- */
function goTo(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('is-visible'));
  const target = document.getElementById('screen-' + screenName);
  if (target) target.classList.add('is-visible');
  state.screen = screenName;
  window.scrollTo(0, 0);

  if (screenName === 'welcome') resetOrder();
  if (screenName === 'sacola') renderCart();
  if (screenName === 'pagamento') renderPaymentTotal();
  if (screenName === 'aguardando') runMockPayment();
}

function resetOrder() {
  state.cart = {};
  state.identifyMode = 'anon';
  state.consentGiven = false;
  state.payMethod = null;
  state.orderId = null;
  document.getElementById('identify-toggle').querySelectorAll('.toggle-opt').forEach(b => b.classList.remove('is-active'));
  document.querySelector('[data-mode="anon"]').classList.add('is-active');
  document.getElementById('identify-form').hidden = true;
  document.getElementById('consent-check').checked = false;
  document.querySelectorAll('.pay-opt').forEach(b => b.classList.remove('is-active'));
  document.getElementById('confirm-payment').disabled = true;
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.getAttribute('data-goto')));
});

/* -------------------- CARDÁPIO -------------------- */
function renderProducts(filterCat) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  const items = PRODUCTS.filter(p => filterCat === 'todos' || !filterCat ? true : p.cat === filterCat);

  items.forEach(p => {
    const card = document.createElement('button');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card__media">
        ${p.seasonal ? '<span class="product-card__seasonal">Só no São João</span>' : ''}
        ${p.icon}
      </div>
      <div class="product-card__body">
        <p class="product-card__name">${p.name}</p>
        <p class="product-card__desc">${p.desc}</p>
        <p class="product-card__price">${brl(p.price)}</p>
      </div>
    `;
    card.addEventListener('click', () => openProductModal(p.id));
    grid.appendChild(card);
  });
}

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderProducts(btn.getAttribute('data-cat'));
  });
});

/* -------------------- MODAL DE PRODUTO -------------------- */
function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  state.selectedProduct = p;
  state.modalQty = 1;

  document.getElementById('modal-media').textContent = p.icon;
  document.getElementById('modal-tag').textContent = p.seasonal ? 'Disponível no período junino' : 'Disponível agora';
  document.getElementById('modal-product-name').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-price').textContent = brl(p.price);
  document.getElementById('qty-value').textContent = '1';

  document.getElementById('product-modal').classList.add('is-visible');
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('product-modal').classList.remove('is-visible');
});

document.getElementById('qty-minus').addEventListener('click', () => {
  state.modalQty = Math.max(1, state.modalQty - 1);
  document.getElementById('qty-value').textContent = state.modalQty;
});
document.getElementById('qty-plus').addEventListener('click', () => {
  state.modalQty = Math.min(20, state.modalQty + 1);
  document.getElementById('qty-value').textContent = state.modalQty;
});

document.getElementById('add-to-cart').addEventListener('click', () => {
  const p = state.selectedProduct;
  state.cart[p.id] = (state.cart[p.id] || 0) + state.modalQty;
  document.getElementById('product-modal').classList.remove('is-visible');
  updateCartPill();
});

/* -------------------- CARRINHO / SACOLA -------------------- */
function cartItems() {
  return Object.entries(state.cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === Number(id)), qty }));
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function cartCount() {
  return cartItems().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartPill() {
  document.getElementById('cart-count').textContent = cartCount();
  document.getElementById('cart-total').textContent = brl(cartTotal());
}

function renderCart() {
  const list = document.getElementById('cart-list');
  const items = cartItems();

  if (items.length === 0) {
    list.innerHTML = '<p class="cart-empty">Sua sacola está vazia. Volte ao cardápio para escolher algo gostoso.</p>';
  } else {
    list.innerHTML = '';
    items.forEach(({ product, qty }) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item__media">${product.icon}</div>
        <div class="cart-item__info">
          <p class="cart-item__name">${product.name}</p>
          <p class="cart-item__unit-price">${brl(product.price)} cada</p>
        </div>
        <div class="cart-item__qty">
          <button data-action="dec" data-id="${product.id}" aria-label="Diminuir">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${product.id}" aria-label="Aumentar">+</button>
        </div>
        <div class="cart-item__line-total">${brl(product.price * qty)}</div>
      `;
      list.appendChild(row);
    });

    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const delta = btn.getAttribute('data-action') === 'inc' ? 1 : -1;
        state.cart[id] = Math.max(0, (state.cart[id] || 0) + delta);
        renderCart();
        updateCartPill();
      });
    });
  }

  document.getElementById('summary-subtotal').textContent = brl(cartTotal());
  document.getElementById('summary-total').textContent = brl(cartTotal());
}

/* -------------------- IDENTIFICAÇÃO / LGPD -------------------- */
document.querySelectorAll('.toggle-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-opt').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const mode = btn.getAttribute('data-mode');
    state.identifyMode = mode;
    document.getElementById('identify-form').hidden = (mode === 'anon');
  });
});

document.getElementById('open-lgpd').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('lgpd-modal').classList.add('is-visible');
});
document.getElementById('lgpd-close').addEventListener('click', () => {
  document.getElementById('lgpd-modal').classList.remove('is-visible');
});

/* -------------------- PAGAMENTO -------------------- */
function renderPaymentTotal() {
  document.getElementById('payment-total-value').textContent = brl(cartTotal());
}

document.querySelectorAll('.pay-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pay-opt').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.payMethod = btn.getAttribute('data-pay');
    document.getElementById('confirm-payment').disabled = false;
  });
});

document.getElementById('confirm-payment').addEventListener('click', () => {
  state.orderId = String(Math.floor(100 + Math.random() * 900));
  document.getElementById('waiting-order-id').textContent = state.orderId;
  goTo('aguardando');
});

/* Regra de negócio replicada do MockPaymentGateway do back-end:
   aprova total <= R$ 1.000,00; recusa valores acima desse limite. */
function runMockPayment() {
  const total = cartTotal();
  setTimeout(() => {
    if (total <= 1000) {
      document.getElementById('success-order-id').textContent = state.orderId;
      goTo('sucesso');
    } else {
      goTo('recusado');
    }
  }, 1800);
}

/* -------------------- INIT -------------------- */
renderProducts('todos');
updateCartPill();
goTo('welcome');
