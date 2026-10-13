/* AKHI Manual Checkout v1 */
(function () {
  "use strict";

  /* ====== শুধু এই ৪টা বদলান ====== */
  var CFG = {
    whatsapp: "8801950471247",     // order এই নম্বরে WhatsApp-এ যাবে
    bkash: "01950471247",          // আপনার bKash নম্বর (Personal)
    nagad: "01950471247",          // আপনার Nagad নম্বর
    cartKey: ""                    // cart-এর localStorage key জানা থাকলে লিখুন, না জানলে ফাঁকা রাখুন
  };

  /* ====== Cart পড়া ====== */
  function normalize(arr) {
    return arr.map(function (i) {
      return {
        name: i.name || i.title || "Item",
        price: Number(i.price) || 0,
        qty: Number(i.qty || i.quantity || i.q || 1) || 1
      };
    });
  }
  function isCartArray(a) {
    return Array.isArray(a) && a.length && a.every(function (i) {
      return i && typeof i === "object" && (i.name || i.title) && i.price !== undefined;
    });
  }
  function getCart() {
    try {
      if (typeof window.getCart === "function") {
        var g = window.getCart();
        if (isCartArray(g)) return normalize(g);
      }
      if (isCartArray(window.cart)) return normalize(window.cart);
      var keys = CFG.cartKey ? [CFG.cartKey] : Object.keys(localStorage);
      for (var k = 0; k < keys.length; k++) {
        var raw = localStorage.getItem(keys[k]);
        if (!raw) continue;
        var v = JSON.parse(raw);
        if (isCartArray(v)) return normalize(v);
        if (v && isCartArray(v.items)) return normalize(v.items);
      }
    } catch (e) {}
    return [];
  }
  function total(items) {
    return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }
  function taka(n) { return "৳" + Number(n).toLocaleString("en-US"); }

  /* ====== Style ====== */
  var css = "\
#akc-ov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:none;align-items:center;justify-content:center;padding:14px}\
#akc-ov.on{display:flex}\
#akc-box{background:#fff;color:#222;width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:14px;padding:22px;font-family:Barlow,system-ui,sans-serif}\
#akc-box h3{margin:0 0 4px;font-size:22px}\
#akc-box .sub{color:#777;font-size:13px;margin-bottom:14px}\
#akc-box label{display:block;font-size:13px;font-weight:600;margin:12px 0 5px}\
#akc-box input,#akc-box textarea{width:100%;padding:11px 12px;border:1px solid #ddd;border-radius:8px;font:inherit;background:#fff;color:#222}\
#akc-box textarea{min-height:70px;resize:vertical}\
.akc-sum{background:#faf8f4;border:1px solid #eee;border-radius:10px;padding:10px 12px;font-size:14px}\
.akc-sum div{display:flex;justify-content:space-between;padding:3px 0}\
.akc-sum .t{border-top:1px solid #e6e6e6;margin-top:6px;padding-top:8px;font-weight:700;font-size:16px}\
.akc-pay{display:flex;gap:8px;flex-wrap:wrap}\
.akc-pay label{flex:1;min-width:110px;margin:0;border:1px solid #ddd;border-radius:8px;padding:10px;text-align:center;cursor:pointer;font-weight:600}\
.akc-pay input{display:none}\
.akc-pay input:checked+span{color:#5d6b08}\
.akc-pay label.sel{border-color:#a4b81c;background:#f6f9e3}\
.akc-info{display:none;background:#f6f9e3;border:1px solid #d9e394;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:10px}\
.akc-info.on{display:block}\
.akc-info b{font-size:16px}\
#akc-err{color:#d0262d;font-size:13px;margin-top:10px;min-height:16px}\
.akc-btn{width:100%;margin-top:12px;padding:14px;border:0;border-radius:10px;background:#a4b81c;color:#111;font-weight:700;font-size:16px;cursor:pointer}\
.akc-btn[disabled]{opacity:.6}\
.akc-x{float:right;border:0;background:#eee;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer}\
.akc-ok{text-align:center;padding:20px 0}\
.akc-ok h3{color:#3b7a1a}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ====== Modal ====== */
  var ov = document.createElement("div");
  ov.id = "akc-ov";
  document.body.appendChild(ov);

  function render() {
    var items = getCart();
    if (!items.length) {
      ov.innerHTML = '<div id="akc-box"><button class="akc-x" data-x>×</button><h3>Cart খালি</h3><p class="sub">আগে কিছু product cart-এ যোগ করুন।</p></div>';
      return;
    }
    var rows = items.map(function (i) {
      return "<div><span>" + esc(i.name) + " × " + i.qty + "</span><span>" + taka(i.price * i.qty) + "</span></div>";
    }).join("");
    ov.innerHTML =
      '<div id="akc-box"><button class="akc-x" data-x>×</button>' +
      '<h3>Checkout</h3><div class="sub">তথ্য দিয়ে order confirm করুন। Delivery charge ফোনে জানানো হবে।</div>' +
      '<div class="akc-sum">' + rows + '<div class="t"><span>Total</span><span>' + taka(total(items)) + "</span></div></div>" +
      '<form id="akc-f" novalidate>' +
      '<label>আপনার নাম *</label><input id="akc-n" autocomplete="name">' +
      '<label>ফোন নম্বর *</label><input id="akc-p" type="tel" inputmode="numeric" placeholder="01XXXXXXXXX" autocomplete="tel">' +
      '<label>ঠিকানা *</label><textarea id="akc-a" autocomplete="street-address"></textarea>' +
      '<label>Payment method *</label>' +
      '<div class="akc-pay">' +
      '<label class="sel"><input type="radio" name="akm" value="COD" checked><span>Cash on Delivery</span></label>' +
      '<label><input type="radio" name="akm" value="bKash"><span>bKash</span></label>' +
      '<label><input type="radio" name="akm" value="Nagad"><span>Nagad</span></label>' +
      "</div>" +
      '<div class="akc-info" id="akc-i">' +
      '<div id="akc-it"></div>' +
      '<label>আপনার bKash/Nagad নম্বর *</label><input id="akc-sn" type="tel" inputmode="numeric">' +
      '<label>Transaction ID (TrxID) *</label><input id="akc-tx" style="text-transform:uppercase">' +
      "</div>" +
      '<label>অতিরিক্ত নোট (ঐচ্ছিক)</label><input id="akc-no">' +
      '<div id="akc-err"></div>' +
      '<button class="akc-btn" id="akc-go" type="submit">Place order · ' + taka(total(items)) + "</button>" +
      "</form></div>";
    bindForm(items);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function bindForm(items) {
    var f = ov.querySelector("#akc-f");
    var info = ov.querySelector("#akc-i");
    var it = ov.querySelector("#akc-it");
    var labels = ov.querySelectorAll(".akc-pay label");

    function method() { return f.querySelector('input[name="akm"]:checked').value; }

    f.addEventListener("change", function () {
      var m = method();
      labels.forEach(function (l) {
        l.classList.toggle("sel", l.querySelector("input").checked);
      });
      if (m === "COD") {
        info.classList.remove("on");
      } else {
        var num = m === "bKash" ? CFG.bkash : CFG.nagad;
        it.innerHTML = "প্রথমে এই নম্বরে <b>" +
