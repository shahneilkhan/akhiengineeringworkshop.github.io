/* AKHI Cart + Checkout v2 */
(function () {
  "use strict";

  /* ====== শুধু এই অংশ বদলান ====== */
  var CFG = {
    whatsapp: "8801950471247",   // fallback WhatsApp নম্বর (Settings-এ থাকলে সেটাই চলবে)
    bkash: "01950471247",        // আপনার bKash নম্বর
    nagad: "01950471247",        // আপনার Nagad নম্বর
    key: "akhi_cart_v2"
  };

  var D = { P: [], S: {}, NAME: "Akhi Engineering Workshop", db: null };
  window.addEventListener("akready", function (e) {
    var d = e.detail || {};
    D.P = d.P || [];
    D.S = d.S || {};
    D.NAME = d.NAME || D.NAME;
    D.db = d.db || null;
  });

  /* ====== Helpers ====== */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function numv(v) {
    var s = String(v == null ? "" : v).replace(/,/g, "").trim();
    return /^\d+(\.\d+)?$/.test(s) ? Number(s) : 0;
  }
  function taka(n) { return "৳" + Number(n).toLocaleString("en-US"); }
  function unit(p) { return numv(p.offerPrice) || numv(p.price); }
  function $(id) { return document.getElementById(id); }

  /* ====== Cart data ====== */
  var cart = [];
  try {
    var saved = JSON.parse(localStorage.getItem(CFG.key));
    if (Array.isArray(saved)) cart = saved;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(CFG.key, JSON.stringify(cart)); } catch (e) {}
    badge();
  }
  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function subtotal() { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
  function hasAsk() { return cart.some(function (i) { return !i.price; }); }

  function add(index) {
    var p = D.P[index];
    if (!p) return;
    var found = cart.filter(function (x) { return x.id === p.title; })[0];
    if (found) found.qty++;
    else cart.push({ id: p.title, name: p.title, price: unit(p), image: p.image || "", qty: 1 });
    save();
    var md = $("md"), mx = $("mx");
    if (md && !md.hidden && mx) mx.click();
    openCart();
  }

  /* ====== Styles ====== */
  var st = document.createElement("style");
  st.textContent =
    ".cwrap{position:fixed;inset:0;z-index:9999;visibility:hidden}" +
    ".cwrap.on{visibility:visible}" +
    ".cbk{position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:0;transition:opacity .3s}" +
    ".cwrap.on .cbk{opacity:1}" +
    ".cpn{position:absolute;top:0;right:0;bottom:0;width:min(440px,100%);background:#fff;color:#222;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .35s cubic-bezier(.2,.75,.2,1);font-family:Barlow,system-ui,sans-serif}" +
    ".cwrap.on .cpn{transform:none}" +
    ".chd{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid #eee}" +
    ".chd h3{margin:0;font-size:21px}" +
    ".cxb{width:38px;height:38px;border:0;border-radius:50%;background:#f1f1f1;font-size:22px;cursor:pointer}" +
    ".cls{flex:1;overflow:auto;padding:8px 20px}" +
    ".cit{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #f0f0f0}" +
    ".cit img{width:64px;height:64px;object-fit:cover;border-radius:6px;background:#f4f4f4;flex:none}" +
    ".cif{flex:1;min-width:0}.cif b{display:block;font-size:16px}.cif span{color:#777;font-size:14px}" +
    ".crm{display:block;margin-top:4px;background:none;border:0;color:#d62828;font-size:12px;cursor:pointer;padding:0}" +
    ".cq{display:flex;align-items:center;gap:10px;align-self:center}" +
    ".cq button{width:28px;height:28px;border:1px solid #ddd;border-radius:50%;background:#fff;cursor:pointer;font-size:16px;line-height:1}" +
    ".cem{padding:50px 20px;text-align:center;color:#777}" +
    ".cft{padding:16px 20px 20px;border-top:1px solid #eee}" +
    ".crow{display:flex;justify-content:space-between;padding:4px 0;font-size:15px;color:#555}" +
    ".crow.t{font-size:20px;font-weight:700;color:#222;margin-top:4px}" +
    ".cnote{font-size:12px;color:#777;margin-top:6px}" +
    ".cbtn{width:100%;margin-top:14px;padding:15px;border:0;border-radius:6px;background:#a4b81c;color:#111;font-weight:700;font-size:16px;cursor:pointer;display:block;text-align:center;text-decoration:none;font-family:inherit}" +
    ".cbtn:disabled{opacity:.6;cursor:default}" +
    ".cbtn.gh{background:none;font-weight:500;text-decoration:underline;color:#5d6b08;margin-top:8px}" +
    "#ckov{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:14px}" +
    "#ckov.on{display:flex}" +
    "#ckb{background:#fff;color:#222;width:100%;max-width:480px;max-height:92vh;overflow:auto;border-radius:14px;padding:22px;font-family:Barlow,system-ui,sans-serif}" +
    "#ckb h3{margin:0 0 4px;font-size:22px}#ckb .sub{color:#777;font-size:13px;margin-bottom:14px}" +
    "#ckb label.l{display:block;font-size:13px;font-weight:600;margin:12px 0 5px}" +
    "#ckb input[type=text],#ckb input[type=tel],#ckb textarea{width:100%;padding:11px 12px;border:1px solid #ddd;border-radius:8px;font:inherit;background:#fff;color:#222}" +
    "#ckb textarea{min-height:70px;resize:vertical}" +
    ".ksum{background:#faf8f4;border:1px solid #eee;border-radius:10px;padding:10px 12px;font-size:14px}" +
    ".ksum div{display:flex;justify-content:space-between;gap:10px;padding:3px 0}" +
    ".ksum .t{border-top:1px solid #e6e6e6;margin-top:6px;padding-top:8px;font-weight:700;font-size:16px}" +
    ".kpay{display:flex;gap:8px;flex-wrap:wrap}" +
    ".kpay label{flex:1;min-width:110px;border:1px solid #ddd;border-radius:8px;padding:10px;text-align:center;cursor:pointer;font-weight:600;font-size:14px}" +
    ".kpay input{display:none}.kpay label.sel{border-color:#a4b81c;background:#f6f9e3}" +
    ".kinfo{display:none;background:#f6f9e3;border:1px solid #d9e394;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:10px}" +
    ".kinfo.on{display:block}.kinfo b{font-size:16px}" +
    "#kerr{color:#d0262d;font-size:13px;margin-top:10px;min-height:16px}" +
    ".kx{float:right;border:0;background:#eee;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer}" +
    ".kok{text-align:center;padding:14px 0}.kok h3{color:#3b7a1a}" +
    "#bag{position:relative}.cbd{position:absolute;top:-7px;right:-9px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#a4b81c;color:#111;font:700 11px/18px Barlow,sans-serif;text-align:center}";
  document.head.appendChild(st);

  /* ====== Cart drawer ====== */
  var cw = document.createElement("div");
  cw.className = "cwrap";
  cw.id = "cw";
  document.body.appendChild(cw);

  var ck = document.createElement("div");
  ck.id = "ckov";
  document.body.appendChild(ck);

  function badge() {
    var b = $("bag");
    if (!b) return;
    var el = b.querySelector(".cbd");
    var n = count();
    if (!n) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement("span"); el.className = "cbd"; b.appendChild(el); }
    el.textContent = n;
  }

  function renderCart() {
    var h = '<div class="cbk" data-cx></div><aside class="cpn"><div class="chd"><h3>Your cart (' + count() + ')</h3><button class="cxb" data-cx aria-label="Close">×</button></div>';
    if (!cart.length) {
      h += '<div class="cem">Your cart is empty.</div><div class="cft"><button class="cbtn gh" data-cx>Continue shopping</button></div>';
    } else {
      h += '<div class="cls">' + cart.map(function (i, k) {
        return '<div class="cit">' +
          (i.image ? '<img src="' + esc(i.image) + '" alt="" onerror="this.remove()">' : '<img alt="">') +
          '<div class="cif"><b>' + esc(i.name) + '</b><span>' + (i.price ? taka(i.price) : "Price on request") + '</span>' +
          '<button class="crm" data-act="rm" data-k="' + k + '">Remove</button></div>' +
          '<div class="cq"><button data-act="dec" data-k="' + k + '">−</button><span>' + i.qty + '</span><button data-act="inc" data-k="' + k + '">+</button></div></div>';
      }).join("") + '</div>';
      h += '<div class="cft"><div class="crow"><span>Subtotal</span><span>' + taka(subtotal()) + '</span></div>' +
        '<div class="crow"><span>Delivery</span><span>Confirmed on call</span></div>' +
        '<div class="crow t"><span>Total</span><span>' + taka(subtotal()) + '</span></div>' +
        (hasAsk() ? '<div class="cnote">Some items have no listed price; we will confirm it on call.</div>' : '') +
        '<button class="cbtn" data-act="co">Proceed to checkout</button>' +
        '<button class="cbtn gh" data-cx>Continue shopping</button></div>';
    }
    h += '</aside>';
    cw.innerHTML = h;
  }

  function openCart() {
    renderCart();
    cw.classList.add("on");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cw.classList.remove("on");
    var md = $("md");
    if (!ck.classList.contains("on") && (!md || md.hidden)) document.body.style.overflow = "";
  }

  cw.addEventListener("click", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-cx")) return closeCart();
    var act = t.getAttribute("data-act");
    if (!act) return;
    var k = Number(t.getAttribute("data-k"));
    if (act === "inc") cart[k].qty++;
    else if (act === "dec") { cart[k].qty--; if (cart[k].qty < 1) cart.splice(k, 1); }
    else if (act === "rm") cart.splice(k, 1);
    else if (act === "co") { closeCart(); return openCheckout(); }
    save();
    renderCart();
  });

  /* ====== Checkout ====== */
  function waNumber() {
    var n = String(D.S.whatsapp || D.S.phone || CFG.whatsapp).replace(/\D/g, "");
    if (n.charAt(0) === "0") n = "880" + n.slice(1);
    return n;
  }

  function openCheckout() {
    if (!cart.length) return openCart();
    var rows = cart.map(function (i) {
      return "<div><span>" + esc(i.name) + " × " + i.qty + "</span><span>" + (i.price ? taka(i.price * i.qty) : "TBC") + "</span></div>";
    }).join("");
    ck.innerHTML =
      '<div id="ckb"><button class="kx" data-kx aria-label="Close">×</button>' +
      '<h3>Checkout</h3><div class="sub">Fill in your details to place the order. Delivery charge is confirmed on call.</div>' +
      '<div class="ksum">' + rows + '<div class="t"><span>Total</span><span>' + taka(subtotal()) + '</span></div></div>' +
      '<form id="kf" novalidate>' +
      '<label class="l">Your name *</label><input type="text" id="kn" autocomplete="name">' +
      '<label class="l">Phone number *</label><input type="tel" id="kp" inputmode="numeric" placeholder="01XXXXXXXXX" autocomplete="tel">' +
      '<label class="l">Full address *</label><textarea id="ka" autocomplete="street-address"></textarea>' +
      '<label class="l">Payment method *</label>' +
      '<div class="kpay">' +
      '<label class="sel"><input type="radio" name="km" value="COD" checked>Cash on Delivery</label>' +
      '<label><input type="radio" name="km" value="bKash">bKash</label>' +
      '<label><input type="radio" name="km" value="Nagad">Nagad</label></div>' +
      '<div class="kinfo" id="ki"><div id="kit"></div>' +
      '<label class="l">Your bKash/Nagad number *</label><input type="tel" id="ks" inputmode="numeric">' +
      '<label class="l">Transaction ID (TrxID) *</label><input type="text" id="kt" style="text-transform:uppercase"></div>' +
      '<label class="l">Note (optional)</label><input type="text" id="kno">' +
      '<div id="kerr"></div>' +
      '<button class="cbtn" id="kgo" type="submit">Place order · ' + taka(subtotal()) + '</button></form></div>';
    ck.classList.add("on");
    document.body.style.overflow = "hidden";
    bindForm();
  }
  function closeCheckout() {
    ck.classList.remove("on");
    var md = $("md");
    if (!cw.classList.contains("on") && (!md || md.hidden)) document.body.style.overflow = "";
  }

  function validPhone(v) { return /^01[3-9]\d{8}$/.test(v); }
  function cleanPhone(v) { return String(v).replace(/[\s-]/g, "").replace(/^\+?88/, ""); }

  function bindForm() {
    var f = $("kf"), info = $("ki"), it = $("kit");
    function method() { return f.querySelector('input[name="km"]:checked').value; }

    f.addEventListener("change", function () {
      var m = method();
      f.querySelectorAll(".kpay label").forEach(function (l) {
        l.classList.toggle("sel", l.querySelector("input").checked);
      });
      if (m === "COD") { info.classList.remove("on"); return; }
      var num = m === "bKash" ? CFG.bkash : CFG.nagad;
      it.innerHTML = "First send <b>" + taka(subtotal()) + "</b> to:<br><b>" + esc(num) + "</b> (" + m + " Personal, Send Money)<br>Then enter your number and TrxID below.";
      info.classList.add("on");
    });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("kerr"), btn = $("kgo"), m = method();
      var d = {
        name: $("kn").value.trim(),
        phone: cleanPhone($("kp").value),
        address: $("ka").value.trim(),
        note: $("kno").value.trim(),
        sender: cleanPhone($("ks").value),
        trx: $("kt").value.trim().toUpperCase()
      };
      if (d.name.length < 2) { err.textContent = "আপনার নাম লিখুন।"; return; }
      if (!validPhone(d.phone)) { err.textContent = "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)।"; return; }
      if (d.address.length < 6) { err.textContent = "পুরো ঠিকানা লিখুন।"; return; }
      if (m !== "COD") {
        if (!validPhone(d.sender)) { err.textContent = "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটা দিন।"; return; }
        if (d.trx.length < 6) { err.textContent = "সঠিক TrxID দিন।"; return; }
      }
      err.textContent = "";
      btn.disabled = true;
      btn.textContent = "Placing order...";

      var order = {
        customer: { name: d.name, phone: d.phone, address: d.address },
        items: cart.map(function (i) { return { name: i.name, price: i.price, qty: i.qty }; }),
        total: subtotal(),
        paymentMethod: m,
        senderNumber: m === "COD" ? "" : d.sender,
        trxId: m === "COD" ? "" : d.trx,
        note: d.note,
        status: "pending",
        paymentStatus: m === "COD" ? "cod" : "unverified",
        createdAtMs: Date.now()
      };
      saveOrder(order).then(function (id) { done(order, id); });
    });
  }

  function saveOrder(order) {
    var p = new Promise(function (resolve) {
      try {
        var db = D.db || (window.firebase && firebase.apps && firebase.apps.length ? firebase.firestore() : null);
        if (!db) return resolve("");
        var data = JSON.parse(JSON.stringify(order));
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        db.collection("orders").add(data).then(function (r) { resolve(r.id); }).catch(function (e) {
          console.warn("[AKHI] order save failed:", e);
          resolve("");
        });
      } catch (e) { console.warn("[AKHI]", e); resolve(""); }
    });
    var timeout = new Promise(function (r) { setTimeout(function () { r(""); }, 8000); });
    return Promise.race([p, timeout]);
  }

  function waText(o, id) {
    var L = ["*New Order*" + (id ? " #" + id.slice(0, 6).toUpperCase() : ""), ""];
    o.items.forEach(function (i) {
      L.push("• " + i.name + " × " + i.qty + (i.price ? " = " + taka(i.price * i.qty) : ""));
    });
    L.push("", "*Total:* " + taka(o.total), "*Payment:* " + o.paymentMethod);
    if (o.paymentMethod !== "COD") L.push("*Sender:* " + o.senderNumber, "*TrxID:* " + o.trxId);
    L.push("", "*Name:* " + o.customer.name, "*Phone:* " + o.customer.phone, "*Address:* " + o.customer.address);
    if (o.note) L.push("*Note:* " + o.note);
    return L.join("\n");
  }

  function done(o, id) {
    var wa = "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(waText(o, id));
    var saved = !!id;
    ck.innerHTML =
      '<div id="ckb"><div class="kok">' +
      (saved
        ? '<h3>✓ Order received!</h3><p>Thank you, ' + esc(o.customer.name) + '. We will call you soon to confirm.</p>'
        : '<h3>Almost done!</h3><p>Please tap the button below to send your order on WhatsApp.</p>') +
      '<a class="cbtn" id="kwa" target="_blank" rel="noopener" href="' + wa + '">Send order on WhatsApp</a>' +
      '<button class="cbtn gh" data-kdone>Close</button></div></div>';
    if (saved) { cart = []; save(); }
    var a = $("kwa");
    if (a) a.addEventListener("click", function () { setTimeout(function () { cart = []; save(); }, 300); });
  }

  ck.addEventListener("click", function (e) {
    var t = e.target;
    if (t === ck || t.hasAttribute("data-kx") || t.hasAttribute("data-kdone")) closeCheckout();
  });

  /* ====== Site buttons ====== */
  document.addEventListener("click", function (e) {
    var bag = e.target.closest && e.target.closest("#bag");
    if (bag) { e.preventDefault(); e.stopPropagation(); openCart(); return; }
    var b = e.target.closest && e.target.closest("[data-add]");
    if (b) { e.preventDefault(); add(Number(b.getAttribute("data-add"))); }
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeCart(); closeCheckout(); }
  });

  badge();
  window.AKHICart = { open: openCart, checkout: openCheckout };
})();
