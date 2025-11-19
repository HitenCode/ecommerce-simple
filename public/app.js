// app.js

// ------- STATE -------
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// ------- DOM ELEMENTS -------
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const cartCountSpan = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

// ------- INITIAL LOAD -------
fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    products = data;
    filteredProducts = [...products];
    populateCategories();
    renderProducts();
    updateCartUI();
  })
  .catch((err) => console.error("Error loading products:", err));

// ------- FUNCTIONS -------

function populateCategories() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function renderProducts() {
  productsGrid.innerHTML = "";

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-sm overflow-hidden flex flex-col";

    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}"
           class="h-48 w-full object-cover" />
      <div class="p-4 flex flex-col flex-1">
        <h3 class="font-semibold text-lg mb-1">${product.name}</h3>
        <p class="text-sm text-gray-600 flex-1">${product.description}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="font-bold">$${product.price.toFixed(2)}</span>
          <button
            class="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(product));

    productsGrid.appendChild(card);
  });
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  filteredProducts = products.filter((p) => {
    const matchesText =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchesCat = !cat || p.category === cat;
    return matchesText && matchesCat;
  });

  if (sort === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts();
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  // count badge
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountSpan.textContent = totalQty;

  // items list
  cartItemsDiv.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      totalPrice += item.price * item.qty;
      const row = document.createElement("div");
      row.className =
        "flex items-center justify-between bg-gray-50 rounded px-3 py-2";
      row.innerHTML = `
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-600">Qty: ${item.qty}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold">$${(
            item.price * item.qty
          ).toFixed(2)}</p>
          <button class="text-xs text-red-600">Remove</button>
        </div>
      `;
      row.querySelector("button").addEventListener("click", () => {
        removeFromCart(item.id);
      });
      cartItemsDiv.appendChild(row);
    });
  }

  cartTotalSpan.textContent = totalPrice.toFixed(2);
}

// ------- EVENT LISTENERS -------

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

cartButton.addEventListener("click", () => {
  cartOverlay.classList.remove("hidden");
  cartOverlay.classList.add("flex");
});

closeCart.addEventListener("click", () => {
  cartOverlay.classList.add("hidden");
  cartOverlay.classList.remove("flex");
});

checkoutBtn.addEventListener("click", () => {
  alert("This is a demo checkout – cart will be cleared.");
  cart = [];
  saveCart();
  updateCartUI();
  cartOverlay.classList.add("hidden");
  cartOverlay.classList.remove("flex");
});
