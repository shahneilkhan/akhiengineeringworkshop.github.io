const U = "https://irrfurniture.com/wp-content/uploads/";
const products = [
  { id: 1, name: "Orange Mesh Gust Chair-101 O", price: 3800, image: U + "2025/05/IRR-101-A.png" },
  { id: 2, name: "Chair-102A", price: 4200, image: U + "2025/01/1.png" },
  { id: 3, name: "Chair-102", price: 4300, image: U + "2025/04/Untitle-800x800.jpg" },
  { id: 4, name: "Chair-105", price: 4600, image: U + "2025/03/3.jpg" },
  { id: 5, name: "Hight Adjustable Swivel Task Chair-109", price: 4600, image: U + "2025/01/521293928_1471402680875557_22310.jpg" },
  { id: 6, name: "Chair-104", price: 4800, image: U + "2025/03/122002029_158231699282095_306450-800x800.jpg" },
  { id: 7, name: "Modern Gust Chair-112", price: 5790, image: U + "2025/03/Chair-112-800x800.png" },
  { id: 8, name: "Apex Mesh Chair-115", price: 6800, image: U + "2025/01/H0568b13b32224721b6cef14e04b1f9f.jpg" },
  { id: 9, name: "Executive Chair-108", price: 6800, image: U + "2025/04/520968503_754547573644430_913493-1.jpg" },
  { id: 10, name: "Executive Leather Office Chair-100", price: 11500, image: U + "2025/03/Chair-100-1.png" },
  { id: 11, name: "Chair-110", price: 12500, image: U + "2025/01/C-C110-3.jpg" },
  { id: 12, name: "Office Chair with Wooden Armrests Chair-111", price: 20600, image: U + "2025/04/Untitled-1-1.png" },
];

let cart = {};
try { cart = JSON.parse(localStorage.getItem("cart")) || {}; } catch (e) {}

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString();

function renderProducts() {
  const s = $("sort").value;
  const list = [...products];
  if (s === "asc") list.sort((a, b) => a.price - b.price);
  if (s === "desc") list.sort((a, b) => b.price - a.price);
  $("grid").innerHTML = list.map((p) => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <p>${fmt(p.price)}৳</p>
      <button onclick="change(${p.id}, 1)">Add to cart</button>
    </div>`).join("");
}

function renderCart() {
  let count = 0, total = 0, html = "";
  for (const p of products) {
    const q = cart[p.id];
    if (!q) continue;
    count += q; total += q * p.price;
    html += `<div class="item">
      <span>${p.name}<br>${fmt(p.price)}৳</span>
      <span><button onclick="change(${p.id}, -1)">-</button>${q}<button onclick="change(${p.id}, 1)">+</button></span>
    </div>`;
  }
  $("count").textContent = count;
  $("total").textContent = fmt(total);
  $("cartItems").innerHTML = html || "<p>Cart khali</p>";
  localStorage.setItem("cart", JSON.stringify(cart));
}

function change(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

$("sort").onchange = renderProducts;
$("cartBtn").onclick = () => $("cart").classList.remove("hidden");
$("closeCart").onclick = () => $("cart").classList.add("hidden");

renderProducts();
renderCart();
