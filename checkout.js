/* Akhi Engineering Workshop - cart + checkout (COD, bKash, Nagad, Rocket) */
(()=>{
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`
.ckb{position:absolute;top:-6px;right:-8px;background:#a4b81c;color:#111;font:700 11px Barlow,sans-serif;min-width:18px;height:18px;border-radius:9px;display:grid;place-items:center;padding:0 4px}
#bag{position:relative;display:grid;place-items:center;color:inherit}
.ad.add{background:none;border:0;cursor:pointer;margin-left:14px;color:#222}.ad.add:hover{color:#5d6b08}
.cwrap{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.55);display:none;justify-content:flex-end}.cwrap.on{display:flex}
.cdr{background:#fff;width:100%;max-width:460px;height:100%;overflow:auto;display:flex;flex-direction:column;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
.chd{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e6e6e6;position:sticky;top:0;background:#fff;z-index:2}.chd h3{font-size:22px}
.chd button{border:0;background:#f1f1f1;width:36px;height:36px;border-radius:50%;font-size:22px;cursor:pointer}
.cbd{padding:16px 20px;display:flex;flex-direction:column;gap:14px;flex:1}
.ci{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center}.ci img{width:64px;height:64px;object-fit:cover;background:#f4f4f4;border-radius:4px}.ci .ph0{width:64px;height:64px;background:#f4f4f4;border-radius:4px}
.ci b{display:block;font-size:15px;line-height:1.25}.ci small{color:#777}
.qt{display:flex;align-items:center;gap:8px}.qt button{width:28px;height:28px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:16px}
.rm{border:0;background:none;color:#d62828;cursor:pointer;font-size:12px;margin-top:2px;padding:0}
.sum{border-top:1px solid #e6e6e6;padding-top:12px;display:flex;flex-direction:column;gap:6px}.sum div{display:flex;justify-content:space-between}.sum .tot{font-weight:700;font-size:20px}
.ckf{display:flex;flex-direction:column;gap:10px}.ckf label{font-size:13px;font-weight:600;display:flex;flex-direction:column;gap:4px}
.ckf input,.ckf textarea,.ckf select{border:1px solid #ddd;border-radius:4px;padding:11px 12px;font:inherit;width:100%}.ckf textarea{min-height:64px;resize:vertical}
.pm{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pm label{border:1.5px solid #ddd;border-radius:6px;padding:10px;flex-direction:row;align-items:center;gap:8px;cursor:pointer;font-weight:600}.pm label.sel{border-color:#a4b81c;background:#f7faea}.pm input{width:auto}
.pin{background:#f6f6f6;border-left:4px solid #a4b81c;padding:12px 14px;border-radius:4px;font-size:14px;line-height:1.5}.pin b{font-size:17px}
.cbt{background:#a4b81c;color:#111;border:0;font-weight:700;font-size:16px;padding:14px;border-radius:4px;cursor:pointer;width:100%;text-align:center;display:block}.cbt:disabled{opacity:.6}
.cbt.alt{background:#25d366;color:#fff}.lnk{background:none;border:0;color:#5d6b08;cursor:pointer;text-decoration:underline;font:inherit}
.err{color:#d62828;font-size:13px;min-height:16px}.okb{text-align:center;padding:30px 10px;display:flex;flex-direction:column;gap:12px;align-items:center}.okb .ck{width:64px;height:64px;border-radius:50%;background:#a4b81c;color:#111;display:grid;place-items:center;font-size:34px}
@media(max-width:480px){.pm{grid-template-columns:1fr}}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
document.body.insertAdjacentHTML('beforeend','<div class="cwrap" id="cw"><div class="cdr" id="cdr" role="dialog" aria-label="Cart"></div></div>');
let A=null,cart=[];
try{cart=JSON.parse(localStorage.getItem('akcart')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('akcart',JSON.stringify(cart))}catch(e){}};
const tk=v=>'৳'+Number(v||0).toLocaleString('en-US');
const unit=x=>{const o=String(x.offerPrice||'').trim(),p=String(x.price||'').trim();const v=/^\d+$/.test(o)?+o:/^\d+$/.test(p)?+p:null;return v};
const count=()=>cart.reduce((a,c)=>a+c.qty,0);
const sub=()=>cart.reduce((a,c)=>a+(c.price||0)*c.qty,0);
let step='cart',pay='cod',msg='',done=null;

function badge(){const b=$('#bag');if(!b)return;let e=b.querySelector('.ckb');if(!e){e=document.createElement('span');e.className='ckb';b.appendChild(e)}e.textContent=count();e.style.display=count()?'grid':'none'}
function methods(){const S=A.S,m=[];if(S.codEnabled!==false)m.push(['cod','Cash on Delivery']);if(S.bkash)m.push(['bkash','bKash']);if(S.nagad)m.push(['nagad','Nagad']);if(S.rocket)m.push(['rocket','Rocket']);if(!m.length)m.push(['cod','Cash on Delivery']);return m}
const fee=()=>{const f=String(A.S.deliveryFee||'').trim();return /^\d+$/.test(f)?+f:0};
const freeAbove=()=>{const f=String(A.S.freeDeliveryAbove||'').trim();return /^\d+$/.test(f)?+f:0};
const ship=()=>freeAbove()&&sub()>=freeAbove()?0:fee();

function add(i){const x=A.P[i];if(!x)return;const k=x.id||x.title,f=cart.find(c=>c.k==k);if(f)f.qty++;else cart.push({k,title:x.title,price:unit(x),img:x.image||'',qty:1});save();badge();open('cart')}
function open(s){step=s||step;render();$('#cw').classList.add('on');document.body.style.overflow='hidden'}
function close(){$('#cw').classList.remove('on');document.body.style.overflow='';if(step=='done'){step='cart';done=null}}

function render(){const d=$('#cdr');
 if(step=='done'){d.innerHTML=head('Order placed')+`<div class="cbd"><div class="okb"><div class="ck">✓</div><h3>Thank you, ${esc(done.name)}!</h3><p>Your order number is <b>${esc(done.no)}</b>. We will call you to confirm shortly.</p>${done.saved?'':'<p class="err">Order could not be saved online. Please send it on WhatsApp below.</p>'}<a class="cbt alt" target="_blank" rel="noopener" href="${esc(A.wa(done.text))}">Confirm on WhatsApp</a><button class="lnk" id="cc">Continue shopping</button></div></div>`;return bind()}
 if(!cart.length){d.innerHTML=head('Your cart')+`<div class="cbd"><p style="color:#777;padding:30px 0;text-align:center">Your cart is empty.</p><button class="cbt" id="cc">Continue shopping</button></div>`;return bind()}
 const items=cart.map((c,i)=>`<div class="ci">${c.img?`<img src="${esc(c.img)}" alt="">`:'<div class="ph0"></div>'}<div><b>${esc(c.title)}</b><small>${c.price?tk(c.price):'Price on request'}</small><br><button class="rm" data-rm="${i}">Remove</button></div><div class="qt"><button data-m="${i}" aria-label="Less">−</button><span>${c.qty}</span><button data-p="${i}" aria-label="More">+</button></div></div>`).join('');
 const unp=cart.some(c=>!c.price),s=sub(),sh=ship();
 const totals=`<div class="sum"><div><span>Subtotal</span><span>${tk(s)}</span></div><div><span>Delivery</span><span>${sh?tk(sh):(fee()?'Free':'Confirmed on call')}</span></div><div class="tot"><span>Total</span><span>${tk(s+sh)}</span></div>${unp?'<small style="color:#777">Some items have no listed price; we will confirm the final amount.</small>':''}</div>`;
 if(step=='cart'){d.innerHTML=head('Your cart ('+count()+')')+`<div class="cbd">${items}${totals}<button class="cbt" id="go">Proceed to checkout</button><button class="lnk" id="cc">Continue shopping</button></div>`;return bind()}
 const M=methods();if(!M.some(m=>m[0]==pay))pay=M[0][0];
 d.innerHTML=head('Checkout')+`<form class="cbd ckf" id="f" novalidate>${items}${totals}
 <label>Full name<input name="name" autocomplete="name" required></label>
 <label>Mobile number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="01XXXXXXXXX" required></label>
 <label>Delivery address<textarea name="address" autocomplete="street-address" required></textarea></label>
 <label>District / Area<input name="area" placeholder="e.g. Mirpur, Dhaka" required></label>
 <label>Order note (optional)<input name="note"></label>
 <div style="font-size:13px;font-weight:600">Payment method</div>
 <div class="pm">${M.map(m=>`<label class="${pay==m[0]?'sel':''}"><input type="radio" name="pay" value="${m[0]}" ${pay==m[0]?'checked':''}>${m[1]}</label>`).join('')}</div>
 <div id="pi"></div>
 <div class="err" id="er"></div>
 <button class="cbt" id="pl" type="submit">Place order · ${tk(s+sh)}</button>
 <button class="lnk" type="button" id="bk">← Back to cart</button></form>`;
 payInfo();bind()}
function payInfo(){const el=$('#pi');if(!el)return;if(pay=='cod'){el.innerHTML='<div class="pin">Pay in cash when your order is delivered.</div>';return}
 const n=A.S[pay],lbl={bkash:'bKash',nagad:'Nagad',rocket:'Rocket'}[pay],t=sub()+ship();
 el.innerHTML=`<div class="pin">1. Open your ${lbl} app and choose <b>Send Money</b>.<br>2. Send <b>${tk(t)}</b> to <b>${esc(n)}</b>.<br>3. Enter your number and the Transaction ID (TrxID) below.</div><label>Your ${lbl} number<input name="sender" type="tel" inputmode="tel" placeholder="01XXXXXXXXX"></label><label>Transaction ID (TrxID)<input name="trx" autocapitalize="characters" placeholder="e.g. 9A7B6C5D4E"></label>`}
const head=t=>`<div class="chd"><h3>${t}</h3><button id="x" aria-label="Close">&times;</button></div>`;
function bind(){const d=$('#cdr');$('#x').onclick=close;const g=s=>d.querySelector(s);
 if(g('#cc'))g('#cc').onclick=close;if(g('#go'))g('#go').onclick=()=>{step='form';render()};if(g('#bk'))g('#bk').onclick=()=>{step='cart';render()};
 d.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{cart[+b.dataset.p].qty++;save();badge();render()});
 d.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const c=cart[+b.dataset.m];c.qty--;if(c.qty<1)cart.splice(+b.dataset.m,1);save();badge();if(!cart.length)step='cart';render()});
 d.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);save();badge();if(!cart.length)step='cart';render()});
 const f=g('#f');if(f){f.querySelectorAll('input[name=pay]').forEach(r=>r.onchange=()=>{pay=r.value;f.querySelectorAll('.pm label').forEach(l=>l.classList.toggle('sel',l.contains(r)&&r.checked));payInfo()});f.onsubmit=submit}}

async function submit(e){e.preventDefault();const f=e.target,v=n=>(f.elements[n]?.value||'').trim(),er=$('#er');
 const ph=/^(?:\+?880|0)1[3-9]\d{8}$/;
 if(v('name').length<2)return er.textContent='Please enter your name.';
 if(!ph.test(v('phone').replace(/[\s-]/g,'')))return er.textContent='Enter a valid mobile number (01XXXXXXXXX).';
 if(v('address').length<6)return er.textContent='Please enter your full delivery address.';
 if(!v('area'))return er.textContent='Please enter your district or area.';
 if(pay!='cod'){if(!ph.test(v('sender').replace(/[\s-]/g,'')))return er.textContent='Enter the number you paid from.';if(v('trx').length<6)return er.textContent='Enter the Transaction ID (TrxID).'}
 er.textContent='';const btn=$('#pl');btn.disabled=true;btn.textContent='Placing order…';
 const no='AKW-'+Date.now().toString(36).toUpperCase().slice(-6),s=sub(),sh=ship();
 const o={orderNo:no,status:'pending',paymentStatus:pay=='cod'?'cod':'awaiting_verification',paymentMethod:pay,
  customer:{name:v('name'),phone:v('phone'),address:v('address'),area:v('area'),note:v('note')},
  payment:pay=='cod'?{}:{senderNumber:v('sender'),trxId:v('trx').toUpperCase(),paidTo:A.S[pay]||''},
  items:cart.map(c=>({title:c.title,price:c.price,qty:c.qty})),subtotal:s,delivery:sh,total:s+sh};
 let saved=false;try{if(A.db){await A.db.collection('orders').add({...o,createdAt:firebase.firestore.FieldValue.serverTimestamp()});saved=true}}catch(x){}
 const lbl={cod:'Cash on Delivery',bkash:'bKash',nagad:'Nagad',rocket:'Rocket'}[pay];
 const text=`New order ${no}\n`+cart.map(c=>`• ${c.title} x${c.qty}${c.price?' = '+tk(c.price*c.qty):''}`).join('\n')+`\nTotal: ${tk(s+sh)}\nPayment: ${lbl}${pay!='cod'?` (TrxID ${o.payment.trxId}, from ${o.payment.senderNumber})`:''}\nName: ${o.customer.name}\nPhone: ${o.customer.phone}\nAddress: ${o.customer.address}, ${o.customer.area}${o.customer.note?'\nNote: '+o.customer.note:''}`;
 done={no,name:o.customer.name,saved,text};cart=[];save();badge();step='done';render()}

document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b&&A){e.preventDefault();e.stopPropagation();add(+b.dataset.add)}},true);
$('#cw').addEventListener('click',e=>{if(e.target.id=='cw')close()});
addEventListener('keydown',e=>{if(e.key=='Escape'&&$('#cw').classList.contains('on'))close()});
addEventListener('akready',ev=>{A=ev.detail;const b=$('#bag');if(b){b.removeAttribute('target');b.setAttribute('href','#cart');b.addEventListener('click',e=>{e.preventDefault();open('cart')})}badge()});
})();
