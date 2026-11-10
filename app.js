/* Blue Wave 2026 genuine local storefront: interactive merchandise bag, no payment collection.
   IMPORTANT: displayed amounts are UNAPPROVED PLANNING ESTIMATES. Browser prices never trusted.
   Checkout cannot run until a server payment provider, tax/shipping, and verified inventory exist. */
(()=>{'use strict';
// Older Fonsora preview links use :18765 and do not run the PayPal checkout server.
// Forward ONLY the legacy local Blue Wave preview to the actual integrated storefront.
if(false && (location.hostname==='127.0.0.1'||location.hostname==='localhost') && location.port==='18765' && location.pathname.startsWith('/sites/blue-wave-2026/')){
  location.replace('http://127.0.0.1:18930/');return;
}
const products={
 tee:{title:'The Tide Tee',es:'La camiseta de la marea',photo:'assets/printful_tee.jpg',choices:{XS:25.99,S:25.99,M:25.99,L:25.99,XL:25.99,'2XL':28.99,'3XL':31.99,'4XL':34.99,'5XL':37.99}},
 hoodie:{title:'Blue Hour Hoodie',es:'Sudadera de la ola',photo:'assets/printful_hoodie.jpg',choices:{S:49.99,M:49.99,L:49.99,XL:49.99,'2XL':54.99,'3XL':59.99}},
 bluecap:{title:'The Tide 2026 Cap',es:'Gorra La Marea 2026',photo:'assets/printful_royal_hat_v5_mockup.png',choices:{'One size':34.99}},
 blackcap:{title:'Vintage 2026 Cap',es:'Gorra Vintage 2026',photo:'assets/printful_vintage_hat_v7_white_mockup.png',choices:{'One size':34.99}},
 tote:{title:'Carry the Tide',es:'Bolsa de la marea',photo:'assets/printful_tote.jpg',choices:{'One size':32.99}},
 mug:{title:'Morning Blue',es:'Taza azul',photo:'assets/printful_mug.jpg',choices:{'11 oz':22.99}},
 sticker:{title:'The Wave Sticker',es:'Pegatina de la ola',photo:'assets/printful_sticker.jpg',choices:{'3 × 3':8.99}}
};
const translations={
 privateNotice:['BLUE WAVE 2026 · LAUNCH PREVIEW · SALES OFF','BLUE WAVE 2026 · VISTA PREVIA · VENTAS DESACTIVADAS'],
 shopNav:['THE DROP','LA COLECCIÓN'],newsNav:['THE WINS','LAS VICTORIAS'],aboutNav:['ABOUT','ACERCA DE'],bag:['BAG','BOLSA'],
 heroDescription:['A new chapter. A bold wave. Wear the moment with a collection built around the 2026 midterm elections.','Un nuevo capítulo. Una ola poderosa. Recuerda las elecciones de 2026 con esta colección.'],
 shopCollection:['SHOP THE COLLECTION','VER LA COLECCIÓN'],
 introFootnote:['Printful supplier previews · Final production approval pending','Vistas de Printful · Pendiente de aprobación de producción'],
 draftNotice:['PRINTFUL PRODUCT PROOFS · ITEMS NOT YET LIVE','PRUEBAS DE PRINTFUL · PRODUCTOS AÚN NO ACTIVOS'],
 collectionIntro:['Seven product concepts, with final production approval pending. Explore the collection and test the shopping bag.','Siete productos pendientes de aprobación final. Explora la colección y prueba la bolsa.'],
 size:['SIZE','TALLA'],oneSize:['ONE SIZE','TALLA ÚNICA'],addBag:['ADD TO BAG +','AÑADIR +'],
 pricingNote:['* Prices shown are internal planning estimates, not approved retail quotes. This is a private preview; no purchases can be completed yet.','* Los precios son estimaciones internas, no precios finales aprobados. Esta vista es privada y todavía no permite comprar.'],
 verifiedCoverage:['INDEPENDENT REPORTING · NOVEMBER 2026','INFORMACIÓN INDEPENDIENTE · NOVIEMBRE DE 2026'],
 storiesIntro:['A few reports behind the wave. Read the original reporting from trusted newsrooms.','Las noticias detrás de la ola. Lee las fuentes periodísticas originales.'],
 article1:['AP reports Democratic gains in the House and Senate, including major upsets in states long considered Republican strongholds.','AP informa de las victorias demócratas en ambas cámaras del Congreso y resultados sorprendentes en estados tradicionalmente republicanos.'],
 article2:['Beyond Washington, Democratic candidates won governorships and state legislatures, shifting the balance of power across several states.','Además de Washington, los demócratas ganaron gobernaciones y legislaturas estatales, alterando el equilibrio de poder.'],
 article3:['The National Conference of State Legislatures tracks party control changes in state chambers while more races are being finalized.','La Conferencia Nacional de Legislaturas Estatales registra los cambios de control partidista mientras se confirman más resultados.'],
 readAP:['READ AT AP ↗','LEER EN AP ↗'],readReuters:['READ AT REUTERS ↗','LEER EN REUTERS ↗'],readNCSL:['READ AT NCSL ↗','LEER EN NCSL ↗'],
 sourceDisclaimer:['Independent articles are linked for context. Blue Wave 2026 is not affiliated with or endorsed by the publishers.','Enlaces a artículos independientes para contexto. Blue Wave 2026 no está afiliado ni respaldado por los medios.'],
 footerDescription:['An independent commemorative merchandise collection. Not affiliated with, sponsored by, or endorsed by any political party, candidate, campaign or news organization.','Colección conmemorativa independiente. No afiliada, patrocinada ni respaldada por partidos, candidatos, campañas ni medios.'],
 footerPrivate:['Private preview · Live purchases disabled','Vista privada · Compras reales desactivadas'],
 yourBag:['YOUR BAG','TU BOLSA'],estimatedSubtotal:['Estimated subtotal','Subtotal estimado'],
 cartDisclaimer:['Planning prices only. Taxes, shipping and final product prices are not verified. No payment information is collected.','Precios de planificación solamente. Impuestos, envío y precios finales sin verificar. No recogemos datos de pago.'],
 checkoutPending:['REVIEW PAYPAL SANDBOX CHECKOUT','REVISAR PAGO DE PRUEBA PAYPAL'],
 checkoutExplanation:['Sandbox checkout is available for testing. Real sales remain disabled until production pricing, tax, shipping, and fulfillment are approved.','El pago de prueba está disponible. Las ventas reales permanecen desactivadas hasta aprobar precios, impuestos, envíos y producción.']
};
const $=sel=>document.querySelector(sel);
const drawer=$('#cartDrawer'),backdrop=$('#cartBackdrop'),cartItems=$('#cartItems'),subtotal=$('#cartSubtotal'),bagCount=$('#bagCount'),announcement=$('#announcement');
let locale='en',cart=[],toastTimeout=null,previousFocus=null;
function safeLocale(){try{return localStorage.getItem('blue_wave_2026_locale')==='es'?'es':'en'}catch(_){return'en'}}
locale=safeLocale();
function price(v){return new Intl.NumberFormat(locale==='es'?'es-US':'en-US',{style:'currency',currency:'USD'}).format(v)}
function value(key){const t=translations[key];return t?t[locale==='en'?0:1]:key}
function safeLoad(){try{const saved=JSON.parse(localStorage.getItem('bw26_private_cart_v1')||'[]');if(!Array.isArray(saved))return[];return saved.filter(x=>x&&products[x.id]&&Object.hasOwn(products[x.id].choices,x.size)&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=10).slice(0,25)}catch(_){return[]}}
cart=safeLoad().filter(x=>x.id!=='bluecap'&&x.id!=='blackcap');
function save(){try{localStorage.setItem('bw26_private_cart_v1',JSON.stringify(cart))}catch(_){}}
save();
function notification(message){announcement.textContent=message;announcement.classList.add('visible');if(toastTimeout)clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>announcement.classList.remove('visible'),2200)}
function updatePrices(){for(const element of document.querySelectorAll('[data-estimate]')){const id=element.dataset.estimate;if(id==='bluecap'||id==='blackcap'){element.textContent=locale==='es'?'PRECIO PENDIENTE':'PRICE PENDING';continue;}const select=document.querySelector('select[data-size="'+id+'"]');const size=select?select.value:Object.keys(products[id].choices)[0];const amt=products[id].choices[size];element.textContent=price(amt);const note=document.createElement('small');note.textContent=locale==='es'?'ESTIMADO':'ESTIMATE';element.append(note)}}
function translate(){document.documentElement.lang=locale;for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=value(el.dataset.i18n);$('#languageButton').textContent=locale==='en'?'ES':'EN';const sectionTitles=[['#shopHeading',locale==='en'?'WEAR THE ':'VISTE LA ',locale==='en'?'WAVE.':'OLA.'],['#storiesHeading',locale==='en'?'THE NIGHT':'LA NOCHE',locale==='en'?'THE MAP MOVED.':'EN QUE TODO CAMBIÓ.']];for(const [sel,one,two] of sectionTitles){const el=$(sel);if(sel==='#storiesHeading'){el.textContent=one;el.append(document.createElement('br'))}else el.textContent=one;const em=document.createElement('em');em.textContent=two;el.append(em)}for(const [id,p] of Object.entries(products)){const el=document.querySelector('[data-key="'+id+'"] .item-meta h3');if(el)el.textContent=locale==='es'?p.es:p.title}
const hs=document.querySelectorAll('.story-card h3');const a=locale==='en'?['Democrats win both chambers of Congress','Statehouses turn toward blue','The legislative flips behind the headlines']:['Los demócratas ganan ambas cámaras del Congreso','El mapa estatal se torna azul','Los cambios en las legislaturas estatales'];hs.forEach((x,i)=>x.textContent=a[i]);updatePrices();renderCart()}
function chosenSize(id){const selector=document.querySelector('select[data-size="'+id+'"]');return selector?selector.value:Object.keys(products[id].choices)[0]}
function add(id){if(id==='bluecap'||id==='blackcap'){notification(locale==='es'?'Bordado pendiente de aprobación':'Embroidery awaiting Printful approval');return;}const size=chosenSize(id);const old=cart.find(x=>x.id===id&&x.size===size);if(old){old.quantity=Math.min(10,old.quantity+1)}else{cart.push({id,size,quantity:1})}save();renderCart();notification(locale==='es'?'Añadido a tu bolsa':'Added to your bag')}
function cartOpen(){previousFocus=document.activeElement;backdrop.hidden=false;drawer.hidden=false;document.body.classList.add('cart-open');$('#checkoutInfo').hidden=true;drawer.focus()}
function cartClose(){backdrop.hidden=true;drawer.hidden=true;document.body.classList.remove('cart-open');if(previousFocus?.focus)previousFocus.focus()}
function make(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function renderCart(){cartItems.textContent='';let amount=0,qty=0;for(let i=0;i<cart.length;i++){const line=cart[i],item=products[line.id];if(!item)continue;const rate=item.choices[line.size];qty+=line.quantity;amount+=rate*line.quantity;const row=make('div','cart-line');const img=make('img');img.src=item.photo;img.alt=item.title;row.append(img);const info=make('div');info.append(make('h3','',locale==='es'?item.es:item.title));info.append(make('p','',line.size));const bottom=make('div','line-footer');const group=make('div','qty-controls');const minus=make('button','','−');minus.type='button';minus.setAttribute('aria-label','Decrease quantity');minus.addEventListener('click',()=>change(i,-1));const q=make('span','',String(line.quantity));const plus=make('button','', '+');plus.type='button';plus.setAttribute('aria-label','Increase quantity');plus.addEventListener('click',()=>change(i,1));group.append(minus,q,plus);bottom.append(group,make('span','line-price',price(rate*line.quantity)));info.append(bottom);const remove=make('button','remove-button',locale==='es'?'Eliminar':'Remove');remove.type='button';remove.addEventListener('click',()=>{cart.splice(i,1);save();renderCart()});info.append(remove);row.append(info);cartItems.append(row)}
if(!cart.length)cartItems.append(make('p','empty-cart',locale==='es'?'Tu bolsa está vacía.':'Your bag is empty.'));subtotal.textContent=price(amount);bagCount.textContent=String(qty);$('#checkoutButton').disabled=true}
function change(index,delta){const x=cart[index];if(!x)return;x.quantity=Math.min(10,x.quantity+delta);if(x.quantity<1)cart.splice(index,1);save();renderCart()}
for(const card of document.querySelectorAll('.item-card[data-key]')){const id=card.dataset.key;const photo=card.querySelector('.item-photo');const title=card.querySelector('.item-meta h3');if(photo&&title){const a=document.createElement('a');a.href='details.html?item='+encodeURIComponent(id);a.className='product-detail-link';a.setAttribute('aria-label','View product details: '+products[id].title);photo.parentNode.insertBefore(a,photo);a.append(photo);title.style.cursor='pointer';title.addEventListener('click',()=>location.assign(a.href));}}
for(const button of document.querySelectorAll('[data-add]')){if(button.dataset.add==='bluecap'||button.dataset.add==='blackcap'){button.disabled=true;continue;}button.addEventListener('click',()=>add(button.dataset.add));}
for(const select of document.querySelectorAll('select[data-size]'))select.addEventListener('change',updatePrices);
$('#languageButton').addEventListener('click',()=>{locale=locale==='en'?'es':'en';try{localStorage.setItem('blue_wave_2026_locale',locale)}catch(_){}translate()});
$('#bagButton').addEventListener('click',cartOpen);$('#cartClose').addEventListener('click',cartClose);backdrop.addEventListener('click',cartClose);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)cartClose();if(e.key==='Tab'&&!drawer.hidden){const tabbable=[...drawer.querySelectorAll('button:not(:disabled),a,select')];const first=tabbable[0],last=tabbable.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
$('#checkoutButton').addEventListener('click',()=>{
 if(false){
   location.assign('/checkout.html');return;
 }
 $('#checkoutInfo').hidden=false;
 notification(locale==='es'?'Abre la tienda con el sistema de PayPal.':'Open the PayPal-enabled storefront to review checkout.');
});
translate();
})();