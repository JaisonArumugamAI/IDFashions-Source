(function () {
  const CART_KEY = "idfashions_cart";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function updateCount() {
    const count = getCart().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
  }

  function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price: Number(price), quantity: 1 });
    saveCart(cart);
    updateCount();
    alert(name + " added to cart.");
  }

  function renderCart() {
    const list = document.getElementById("cart-items");
    const empty = document.getElementById("cart-empty");
    const summary = document.getElementById("cart-summary");
    if (!list) return;

    const cart = getCart();
    list.innerHTML = "";
    let subtotal = 0;

    if (!cart.length) {
      empty.hidden = false;
      summary.hidden = true;
      return;
    }

    empty.hidden = true;
    summary.hidden = false;

    cart.forEach((item, index) => {
      const total = item.price * item.quantity;
      subtotal += total;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div><strong>${item.name}</strong><small>$${item.price.toFixed(2)} each</small></div>
        <div class="cart-controls">
          <button data-action="minus" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-index="${index}">+</button>
          <strong>$${total.toFixed(2)}</strong>
          <button class="remove-item" data-action="remove" data-index="${index}">Remove</button>
        </div>`;
      list.appendChild(row);
    });

    document.getElementById("cart-subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("checkout-link").href = "payment.html";
  }

  document.addEventListener("click", function (event) {
    const add = event.target.closest(".add-cart");
    if (add) addToCart(add.dataset.name, add.dataset.price);

    const action = event.target.closest("[data-action]");
    if (action) {
      const cart = getCart();
      const index = Number(action.dataset.index);
      if (!cart[index]) return;
      if (action.dataset.action === "plus") cart[index].quantity += 1;
      if (action.dataset.action === "minus") cart[index].quantity -= 1;
      if (action.dataset.action === "remove" || cart[index].quantity <= 0) cart.splice(index, 1);
      saveCart(cart);
      updateCount();
      renderCart();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    updateCount();
    renderCart();
  });
})();
