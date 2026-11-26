const menuItems = [
  { id: 1, name: "Peri-Peri Loaded Fries", category: "bites", tag: "Bestseller", price: 140, desc: "Crispy golden fries tossed in house peri-peri seasoning with creamy cheese drizzle." },
  { id: 2, name: "Crispy Cheese Corn Nuggets", category: "bites", tag: "Small Plate", price: 150, desc: "Crunchy golden bites filled with sweet corn, melted mozzarella, and herbs." },
  { id: 3, name: "Garlic Herb Bruschetta", category: "bites", tag: "Chef's Pick", price: 160, desc: "Toasted artisan bread topped with fresh tomatoes, basil, olive oil, and garlic." },
  { id: 4, name: "Smoky Paneer Grill Sandwich", category: "mains", tag: "Popular", price: 170, desc: "Char-grilled cottage cheese, bell peppers, and mint mayo pressed in sourdough." },
  { id: 5, name: "One Bite Signature Burger", category: "mains", tag: "House Special", price: 185, desc: "Crispy herb patty, cheddar slice, caramelized onions, and signature house sauce." },
  { id: 6, name: "Classic Club Decker", category: "mains", tag: "Filling", price: 195, desc: "Triple-layered toasted sandwich packed with fresh veggies, cheese, and coleslaw." },
  { id: 7, name: "Hazelnut Cold Coffee", category: "sips", tag: "Chilled", price: 130, desc: "Rich espresso blended with chilled milk, roasted hazelnut syrup, and cream." },
  { id: 8, name: "Virgin Mint Mojito", category: "sips", tag: "Refreshing", price: 110, desc: "Fresh garden mint leaves, zesty lime wedges, and sparkling soda over crushed ice." },
  { id: 9, name: "Classic Belgian Hot Chocolate", category: "sips", tag: "Cozy", price: 145, desc: "Velvety melted dark chocolate whisked into steamed milk for cozy evenings." }
];

const cart = {};

// Live IST Opening Hours Check (Tue-Sun: 12:00 PM - 10:00 PM, Mon: Closed)
function updateLiveStatus() {
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("liveStatusText");
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = istTime.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const hour = istTime.getHours();

  if (day === 1) {
    statusDot.classList.add("closed");
    statusText.textContent = "Closed Today (Opens Tue at 12:00 PM)";
  } else if (hour >= 12 && hour < 22) {
    statusDot.classList.remove("closed");
    statusText.textContent = "Open Now • Closes at 10:00 PM";
  } else {
    statusDot.classList.add("closed");
    statusText.textContent = hour < 12 ? "Opens Today at 12:00 PM" : "Closed Now • Opens Tomorrow 12:00 PM";
  }
}

// Render Menu Cards
function renderMenu(filter = "all") {
  const grid = document.getElementById("menuGrid");
  const filtered = filter === "all" ? menuItems : menuItems.filter(item => item.category === filter);

  grid.innerHTML = filtered.map(item => `
    <div class="menu-card">
      <div>
        <div class="menu-top">
          <span class="menu-badge">${item.tag}</span>
          <span class="menu-price">&#8377;${item.price}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <button class="add-btn" onclick="addToCart(${item.id})">+ Add to Order Bag</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  if (!item) return;
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...item, qty: 1 };
  }
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  document.getElementById("cartCount").textContent = totalCount;
  document.getElementById("cartTotal").textContent = `₹${totalAmount}`;

  const listEl = document.getElementById("cartItemsList");
  if (items.length === 0) {
    listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem 0;">Your order bag is empty. Add quick bites from the menu!</p>`;
    return;
  }

  listEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div style="font-size: 0.8rem; color: var(--text-muted);">&#8377;${item.price} each</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
}

// Event Listeners
document.getElementById("filterTabs").addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab-btn")) return;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  renderMenu(e.target.dataset.filter);
});

document.getElementById("mobileToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

const cartModal = document.getElementById("cartModal");
document.getElementById("openCartBtn").addEventListener("click", () => cartModal.classList.add("open"));
document.getElementById("closeCartBtn").addEventListener("click", () => cartModal.classList.remove("open"));
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.classList.remove("open");
});

document.getElementById("sendWhatsappOrder").addEventListener("click", () => {
  const items = Object.values(cart);
  if (items.length === 0) {
    alert("Please add at least one item from the menu first.");
    return;
  }
  const mode = document.getElementById("orderMode").value;
  const lines = items.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join("\n");
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const message = `Hello One Bite Cafe! I'd like to place an order:\n\nOrder Type: ${mode}\n${lines}\n\nTotal: ₹${total}`;
  window.open(`https://wa.me/918861636951?text=${encodeURIComponent(message)}`, "_blank");
});

document.getElementById("year").textContent = new Date().getFullYear();
updateLiveStatus();
renderMenu();
updateCartUI();
