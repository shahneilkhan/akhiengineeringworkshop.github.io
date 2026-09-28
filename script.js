// ===== Client info: shudhu ekhane bodlalei sob jayga te bodle jabe =====
const SITE = {
  name: "Akhi Engineering Workshop",
  phone: "01XXX-XXXXXX",            // dekhano number
  whatsapp: "8801XXXXXXXXX",        // country code shoho, + chhara
  address: "Apnar address, Dhaka, Bangladesh",
  facebook: "",                     // link thakle boshan
  instagram: ""
};
const CATEGORIES = {
  "Home Furniture": [
    "Dining Table",
    "Dressing Table",
    "Bed Side Table",
    "Computer Table",
    "Reading Table",
    "Study Table"
  ],
  "Office Furniture": [
    "Director Table",
    "WorkStation",
    "Conference Table",
    "Executive Desk",
    "L Shape Table",
    "Reception Desk",
    "Printer Stand",
    "Mobile Drawer Unit"
  ],
  "Chair": [
    "Tulip Chair",
    "Executive Chair",
    "Office Chair"
  ],
  "Desk": [
    "Desk & Table"
  ],
  "Cabinets": [
    "All Cabinets",
    "Wall Cabinet",
    "Kitchen Cabinet"
  ]
};
let sel = { main: "", sub: "" };
let products = [];
let cart = {};
try { cart = JSON.parse(localStorage.getItem("cart")) || {}; } catch (e) {}

const $ = (id) => document.getElementById(id);
const fmt = (n) => Number(n).toLocaleString();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderProducts() {
  let list = products.filter((p) => (!sel.main || p.category === sel.main) && (!sel.sub || p.subcategory === sel.sub));
  $("title").textContent = sel.sub || sel.main || "Our Products";
  const pr = $("price").value;
  if (pr) {
    const [min, max] = pr.split("-").map(Number);
    list = list.filter((p) => p.price >= min && p.price <= max);
  }
  const s = $("sort").value;
  if (s === "asc") list.sort((a, b) => a.price - b.price);
  if (s === "desc") list.sort((a, b) => b.price - a.price);
  $("showing").textContent = `Showing ${list.length} products`;
  $("grid").innerHTML = list.map((p) => `
    <div class="card">
      <div class="imgbox">
        ${p.hot ? '<span class="badge">HOT</span>' : ""}
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
      </div>
      <div class="info">
        <h4>${esc(p.name)}</h4>
        <p class="price">${fmt(p.price)}৳</p>
        <button class="add" data-name="${esc(p.name)}" data-d="1">Add to cart</button>
      </div>
    </div>`).join("") || "<p>No products found.</p>";
}

function renderCats() {
  const chip = (label, main, sub, on) => `<button class="chip${on ? " on" : ""}" data-main="${esc(main)}" data-sub="${esc(sub)}">${esc(label)}</button>`;
  $("mainCats").innerHTML = chip("All Products", "", "", !sel.main) +
    Object.keys(CATEGORIES).map((m) => chip(m, m, "", sel.main === m)).join("");
  const subs = CATEGORIES[sel.main] || [];
  $("subCats").innerHTML = subs.length
    ? chip("All " + sel.main, sel.main, "", !sel.sub) + subs.map((x) => chip(x, sel.main, x, sel.sub === x)).join("")
    : "";
}

function renderCart() {
  let count = 0, total = 0, html = "", msg = encodeURIComponent(`Hello ${SITE.name}, I want to order:`) + "%0A";
  for (const p of products) {
    const q = cart[p.name];
    if (!q) continue;
    count += q; total += q * p.price;
    msg += encodeURIComponent(`- ${p.name} x ${q} = ${fmt(q * p.price)}৳`) + "%0A";
    html += `<div class="item">
      <img src="${esc(p.image)}" alt="">
      <div class="meta">${esc(p.name)}<p>${fmt(p.price)}৳</p>
        <div class="qty"><button data-name="${esc(p.name)}" data-d="-1">−</button><span>${q}</span><button data-name="${esc(p.name)}" data-d="1">+</button></div>
      </div></div>`;
  }
  msg += encodeURIComponent(`Total: ${fmt(total)}৳`);
  $("count").textContent = count;
  $("total").textContent = fmt(total);
  $("cartItems").innerHTML = html || '<p class="muted" style="padding:20px 0">Your cart is empty.</p>';
  $("wa").href = `https://wa.me/${SITE.whatsapp}?text=${msg}`;
  $("wa").classList.toggle("off", count === 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function change(name, d) {
  cart[name] = (cart[name] || 0) + d;
  if (cart[name] <= 0) delete cart[name];
  renderCart();
}

function toggleCart(open) {
  $("cart").classList.toggle("open", open);
  $("overlay").classList.toggle("open", open);
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-name]");
  if (!b) return;
  change(b.dataset.name, Number(b.dataset.d));
  if (b.classList.contains("add")) toggleCart(true);
});
document.addEventListener("click", (e) => {
  const c = e.target.closest(".chip");
  if (!c) return;
  sel = { main: c.dataset.main, sub: c.dataset.sub };
  renderCats();
  renderProducts();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });
$("sort").onchange = renderProducts;
$("price").onchange = renderProducts;
$("cartBtn").onclick = () => toggleCart(true);
$("closeCart").onclick = () => toggleCart(false);
$("overlay").onclick = () => toggleCart(false);

fetch("data/products.json")
  .then((r) => r.json())
  .then((d) => { products = d.products || []; renderCats(); renderProducts(); renderCart(); })
  .catch(() => { $("grid").innerHTML = "<p>Products load hocche na</p>"; });

(function fillSite() {
  const tel = "tel:" + SITE.phone.replace(/[^+\d]/g, "");
  $("phoneTop").textContent = "☎ Call: " + SITE.phone; $("phoneTop").href = tel;
  $("fPhone").textContent = SITE.phone; $("fPhone").href = tel;
  $("addrTop").textContent = SITE.address;
  $("fAddr").textContent = SITE.address;
  const soc = [["Facebook", SITE.facebook], ["Instagram", SITE.instagram]]
    .filter((x) => x[1]).map((x) => `<a href="${esc(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`);
  $("fSocial").innerHTML = soc.join(" · ");
})();
