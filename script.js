let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ✅ Toast Function (instead of alert)
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100); // fade in
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300); // remove from DOM
  }, 2500);
}

// ✅ Load products on Home / Gents / Ladies pages
function loadProducts(products) {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <input type="number" id="qty-${p.id}" value="1" min="1">
      <br>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.img}')">🛒 Add to Cart</button>
      <button onclick="toggleFavorite(${p.id}, '${p.name}', ${p.price}, '${p.img}')">
        ${favorites.find(f => f.id === p.id) ? "💔 Unfavorite" : "❤️ Favorite"}
      </button>
    `;
    productList.appendChild(card);
  });
  updateCounts();
}

// ✅ Add to Cart
function addToCart(id, name, price, img) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, img, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounts();
  showToast("✅ Added to Cart");
}

// ✅ Toggle Favorite (add/remove with symbol change)
function toggleFavorite(id, name, price, img) {
  const existing = favorites.find(item => item.id === id);
  if (existing) {
    favorites = favorites.filter(f => f.id !== id);
    showToast("💔 Removed from Favorites");
  } else {
    favorites.push({ id, name, price, img });
    showToast("❤️ Added to Favorites");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateCounts();
  location.reload(); // refresh to update button text
}

// ✅ Update Header Counts
function updateCounts() {
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const favCount = favorites.length;
  const cBadge = document.getElementById("cart-count");
  const fBadge = document.getElementById("fav-count");
  if (cBadge) cBadge.innerText = cartCount;
  if (fBadge) fBadge.innerText = favCount;
}

/* -------------------- CART PAGE -------------------- */
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<h2>Your cart is empty 🛒</h2>";
    document.getElementById("total").innerText = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    container.innerHTML += `
      <div class="cart-card">
        <img src="${item.img}" alt="${item.name}" style="width:80px;height:80px;object-fit:contain;">
        <span>${item.name} (x${item.qty}) - ₹${item.price * item.qty}</span>
        <button class="order" onclick="orderItem(${index})">✅ Order</button>
        <button class="remove" onclick="removeFromCart(${index})">❌ Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

// ✅ Remove item from Cart
function removeFromCart(index) {
  showToast(`🗑️ Removed: ${cart[index].name}`);
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounts();
  renderCart();
}

// ✅ Order one item
function orderItem(index) {
  showToast(`✅ Ordered Successfully: ${cart[index].name}`);
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounts();
  renderCart();
}

// ✅ Place all orders
// ✅ Place all orders
function placeOrder() {
  if (cart.length === 0) return showToast("⚠️ Cart is empty!");

  showToast("✅ Order placed successfully!");

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCounts();

  // Redirect to home page after 2s
  setTimeout(() => {
    window.location.href = "home.html";
  }, 2000);
}

/* -------------------- FAVORITES PAGE -------------------- */
function renderFavorites() {
  const favItems = document.getElementById("fav-items");
  if (!favItems) return;

  favItems.innerHTML = "";
  if (favorites.length === 0) {
    favItems.innerHTML = "<h2>No favorites yet ❤️</h2>";
    return;
  }

  favorites.forEach(item => {
    favItems.innerHTML += `
      <div class="fav-card">
        <img src="${item.img}" alt="${item.name}" style="width:80px;height:80px;object-fit:contain;">
        <span>${item.name}</span>
        <button onclick="toggleFavorite(${item.id}, '${item.name}', ${item.price}, '${item.img}')">💔 Unfavorite</button>
      </div>
    `;
  });
}
