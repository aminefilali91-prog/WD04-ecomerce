const WHATSAPP_NUMBER = '212650268184'; // << REPLACE WITH YOUR NUMBER
const PRICES = { full: 1500, discounted: 1200 };

let currentLang = 'ar';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-fr', lang === 'fr');
  document.querySelectorAll('[data-ar]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll('[data-placeholder-ar]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });
  document.getElementById('btn-ar').classList.toggle('active', lang === 'ar');
  document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
  renderReviews();
}

function changeImg(el) {
  document.getElementById('mainImg').src = el.src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function scrollToOrder() {
  document.getElementById('order-section').scrollIntoView({ behavior: 'smooth' });
}

function orderWhatsApp(type) {
  const waOrderId = Date.now().toString().slice(-6);
  const confirmLink = `https://sprightly-tartufo-573c77.netlify.app/admin.html?confirm=${waOrderId}`;
  // save preliminary order
  const orders = JSON.parse(localStorage.getItem('wd04_orders') || '[]');
  orders.unshift({
    id: waOrderId,
    date: new Date().toLocaleDateString('ar-MA'),
    name: '—', phone: '—', city: '—', address: '—',
    payment: type === 'virement' ? 'virement_bank' : 'cod',
    price: type === 'virement' ? PRICES.discounted : PRICES.full,
    status: 'new', notes: 'طلب عبر واتساب'
  });
  localStorage.setItem('wd04_orders', JSON.stringify(orders));

  const messages = {
    ar: {
      cod: `مرحبا، بغيت نطلب قفل SmartLook 🔐\n\n- الثمن: ${PRICES.full} درهم\n- طريقة الدفع: عند الاستلام\n- التوصيل: مجاني\n\nالاسم: \nالعنوان: \nرقم الهاتف: \n\nرقم الطلب: #${waOrderId}\n✅ تأكيد الطلب: ${confirmLink}`,
      virement: `مرحبا، بغيت نطلب قفل SmartLook بالتحويل البنكي 🔐💳\n\n- الثمن النهائي: ${PRICES.discounted} درهم\n- التوصيل: مجاني\n\nالاسم: \nالعنوان: \nرقم الهاتف: \n\nرقم الطلب: #${waOrderId}\n✅ تأكيد الطلب: ${confirmLink}`
    },
    fr: {
      cod: `Bonjour, je voudrais commander la serrure SmartLook 🔐\n\n- Prix: ${PRICES.full} DH\n- Paiement: à la livraison\n- Livraison: gratuite\n\nNom: \nAdresse: \nTéléphone: \n\nN° commande: #${waOrderId}\n✅ Confirmer: ${confirmLink}`,
      virement: `Bonjour, je voudrais commander la serrure SmartLook par virement 🔐💳\n\n- Prix final: ${PRICES.discounted} DH\n- Livraison: gratuite\n\nNom: \nAdresse: \nTéléphone: \n\nN° commande: #${waOrderId}\n✅ Confirmer: ${confirmLink}`
    }
  };
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messages[currentLang][type])}`, '_blank');
}

// ===== ORDER FORM =====
let selectedPayment = 'cod';
let selectedVirementType = 'bank';

function openVirementModal() {
  document.getElementById('vir-modal-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function _loadBankSettings() {
  const s = JSON.parse(localStorage.getItem('wd04_bank_settings') || '{}');
  document.querySelector('#bank-modal-overlay .bank-row:nth-child(1) .bank-val').textContent = s.bankName   || 'CIH Bank';
  document.querySelector('#bank-modal-overlay .bank-row:nth-child(2) .bank-val').textContent = s.bankHolder || 'SmartLook';
  const ribEl = document.getElementById('bank-rib-number');
  if (ribEl) ribEl.innerHTML = (s.bankRib || '230 780 0000000000000000 00') + ' <i class="fas fa-copy"></i>';
  const amountEl = document.querySelector('#bank-modal-overlay .bank-amount');
  if (amountEl) amountEl.innerHTML = (s.bankAmount || '1200') + ' <small>درهم</small>';
}

function closeVirementModal(e) {
  if (e && e.target !== document.getElementById('vir-modal-overlay')) return;
  document.getElementById('vir-modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

function confirmVirement(type) {
  if (type === 'bank') {
    document.getElementById('vir-modal-overlay').classList.remove('show');
    _loadBankSettings();
    document.getElementById('bank-modal-overlay').classList.add('show');
    return;
  }
  selectedVirementType = 'cashplus';
  selectPayment('virement');
  document.getElementById('vir-modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
  const nameEl = document.querySelector('#opt-virement .pay-name');
  if (nameEl) nameEl.textContent = 'Cash Plus';
}

function copyRIB() {
  const el = document.getElementById('bank-rib-number');
  const text = el ? el.textContent.replace(/\s+/g,' ').trim().replace(' ', '') : '';
  navigator.clipboard.writeText(text).then(() => {
    if (el) { el.style.color = '#4caf50'; setTimeout(() => { el.style.color = ''; }, 1500); }
  });
}

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}

function printBankDetails() {
  window.print();
}

function closeBankModal(e) {
  if (e && e.target !== document.getElementById('bank-modal-overlay')) return;
  document.getElementById('bank-modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

function confirmBankOrder() {
  selectedVirementType = 'bank';
  selectPayment('virement');
  document.getElementById('bank-modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
  const nameEl = document.querySelector('#opt-virement .pay-name');
  if (nameEl) nameEl.textContent = 'تحويل بنكي';
  _saveOrder();
}

function selectPayment(type) {
  selectedPayment = type;
  document.getElementById('opt-cod').classList.toggle('selected', type === 'cod');
  document.getElementById('opt-virement').classList.toggle('selected', type === 'virement');
}

function _saveOrder() {
  const name    = document.getElementById('ord-name').value.trim();
  const phone   = document.getElementById('ord-phone').value.trim();
  const city    = document.getElementById('ord-city').value.trim();
  const address = document.getElementById('ord-address').value.trim();
  if (!name || !phone || !city) {
    document.getElementById('order-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    const el = document.getElementById('ord-phone');
    el.style.borderColor = '#ff6b6b';
    el.focus();
    setTimeout(() => { el.style.borderColor = ''; }, 2500);
    return;
  }
  const price = selectedPayment === 'virement' ? PRICES.discounted : PRICES.full;
  const orderId = Date.now().toString().slice(-6);
  const orders = JSON.parse(localStorage.getItem('wd04_orders') || '[]');
  orders.unshift({
    id: orderId,
    date: new Date().toLocaleDateString('ar-MA'),
    name, phone, city, address,
    payment: selectedPayment === 'virement' ? `virement_${selectedVirementType}` : selectedPayment,
    price,
    status: 'new',
    notes: ''
  });
  localStorage.setItem('wd04_orders', JSON.stringify(orders));
  showThankyou({ name, phone, city, payment: selectedPayment, price, orderId });
}

function submitOrder(e) {
  e.preventDefault();
  _saveOrder();
}

// ===== FAQ =====
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = answer.classList.contains('show');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('show'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('show');
    el.classList.add('open');
  }
}

// ===== THANK YOU =====
function showThankyou({ name, phone, city, payment, price, orderId }) {
  const isAr = currentLang === 'ar';
  const virLabel = selectedVirementType === 'cashplus' ? 'Cash Plus' : 'تحويل بنكي';
  const payLabel = isAr
    ? (payment === 'virement' ? `${virLabel} (خصم 20%)` : 'الدفع عند الاستلام')
    : (payment === 'virement' ? `${selectedVirementType === 'cashplus' ? 'Cash Plus' : 'Virement bancaire'} (-20%)` : 'À la livraison');

  document.getElementById('ty-details').innerHTML = isAr
    ? `🔖 <b>رقم الطلب:</b> #${orderId}<br>👤 <b>الاسم:</b> ${name}<br>📞 <b>الهاتف:</b> ${phone}<br>🏙️ <b>المدينة:</b> ${city}<br>💳 <b>الدفع:</b> ${payLabel}<br>💰 <b>الثمن:</b> ${price} درهم`
    : `🔖 <b>N° commande:</b> #${orderId}<br>👤 <b>Nom:</b> ${name}<br>📞 <b>Tél:</b> ${phone}<br>🏙️ <b>Ville:</b> ${city}<br>💳 <b>Paiement:</b> ${payLabel}<br>💰 <b>Prix:</b> ${price} DH`;

  const isBank = payment === 'virement' && selectedVirementType === 'bank';
  const reminder = document.getElementById('ty-vir-reminder');
  reminder.style.display = isBank ? 'block' : 'none';
  if (isBank) {
    const bankS = JSON.parse(localStorage.getItem('wd04_bank_settings') || '{}');
    const bankAmt = bankS.bankAmount || '1200';
    const msg = encodeURIComponent(`السلام عليكم 👋\nاسمي ${name} من ${city}.\nقمت بالتحويل البنكي بمبلغ ${bankAmt} درهم.\nرقم طلبي: #${orderId}\nأرسل لكم وصل التحويل لتأكيد الطلب. 🔐`);
    document.getElementById('ty-vir-wa-btn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }

  document.getElementById('thankyou-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeThankyou() {
  document.getElementById('thankyou-overlay').classList.remove('show');
  document.body.style.overflow = '';
  const form = document.getElementById('order-form');
  form.reset();
  form.style.opacity = '1';
  form.style.pointerEvents = 'auto';
  document.getElementById('form-success').style.display = 'none';
  selectPayment('cod');
}

// ===== REVIEWS =====
const REVIEW_IMGS = [
  'A056f6363dd6543eb9f175fc0ff0ece9b6.jpg_960x960q75.jpg_.avif',
  'A0e592507a6b6469fac4dbfb7e397ed36D.jpg_960x960q75.jpg_.avif',
  'A12eba5855777480baa828df02b2fb5c5U.jpg_960x960q75.jpg_.avif',
  'A2928fbf4a2684c21bd8801117cf56f7c8.jpg_960x960q75.jpg_.avif',
  'A29a40b40d07d4764b9ad05cbd2eec91ev.jpg_960x960q75.jpg_.avif',
  'A4b24740568b449a4ab71f5aa921821f0o.jpg_960x960q75.jpg_.avif',
  'A543cb54c48fa47a690984f7d4f505747E.jpg_960x960q75.jpg_.avif',
  'A6724f70a606f42d1baac96f9f11d4df1N.jpg_960x960q75.jpg_.avif',
  'A71795c82db7242aebabdff31572c3e46Y.jpg_960x960q75.jpg_.avif',
  'A76c56a6440a94eb589c0a9a1814384cdq.jpg_960x960q75.jpg_.avif',
  'A77497e259ce044f4afb3291fb5f484c1X.jpg_960x960q75.jpg_.avif',
  'A7c61226095c046299c52cca517ef321cB.jpg_960x960q75.jpg_.avif',
  'A7c7f182b0a584ef1a4821331ea112505u.jpg_960x960q75.jpg_.avif',
  'A8c0bf43e1f5a454abc8156c019c6f0082.jpg_960x960q75.jpg_.avif',
  'Acffab13aca6648819cfbf1290747d901Z.jpg_960x960q75.jpg_.avif',
  'Ade77a6c0df7d428fa7769957315c4e71V.jpg_960x960q75.jpg_.avif',
  'Ae6646e96d2774058a5e0e0413bd5464cZ.jpg_960x960q75.jpg_.avif',
  'Aed6c8d1172124264ad60f40f56b2bd77g.jpg_960x960q75.jpg_.avif',
  'Af84dab19d4bd41ffa20c94aaddf1aae4j.jpg_960x960q75.jpg_.avif',
];

const REVIEWS = [
  { name: 'أحمد المنصوري', city: 'الدار البيضاء', color: '#c9a84c', ar: 'البصمة كتشتغل بسرعة مجنونة، ف أقل من ثانية. التركيب كان سهل والتوصيل جاء فبكري. أنصح به بزاف!', fr: 'L\'empreinte fonctionne à une vitesse incroyable. Installation facile, livraison rapide. Je recommande vivement!', date: 'منذ يومين' },
  { name: 'فاطمة الزهراء', city: 'الرباط', color: '#e8789a', ar: 'شريت بالتحويل البنكي وجابتلي خصم 20%. القفل فاخر بزاف ومظهره حلو على الباب. راضية 100%', fr: 'J\'ai payé par virement avec 20% de réduction. La serrure est très luxueuse. Satisfaite à 100%', date: 'منذ 3 أيام' },
  { name: 'محمد الإدريسي', city: 'مراكش', color: '#78b4e8', ar: 'كاميرا عين القطة هي أحسن ميزة، نشوف شكون جاي قبل ما نحل الباب. خدمة الزبائن مزيانة بزاف', fr: 'La caméra œil de chat est la meilleure fonctionnalité. Je vois qui vient avant d\'ouvrir. Excellent service', date: 'منذ أسبوع' },
  { name: 'خديجة بنعلي', city: 'فاس', color: '#78e8a0', ar: 'منتج راقي جداً، الألومنيوم متين ومظهره يبان غالي. ولادي كيفرحو بالبصمة ديالهم', fr: 'Produit très haut de gamme, l\'aluminium est solide. Mes enfants adorent leur empreinte digitale', date: 'منذ أسبوع' },
  { name: 'يوسف الطاهري', city: 'طنجة', color: '#e8a078', ar: 'دفعت كاش مسبق وجابتلي 1200 درهم بدل 1500. التوصيل جاء في يومين. ما توقعتش بالسرعة هاذي', fr: 'Payé en avance, 1200 DH au lieu de 1500. Livraison en 2 jours. Je ne m\'attendais pas à cette rapidité', date: 'منذ 10 أيام' },
  { name: 'سلمى الحسني', city: 'أكادير', color: '#b478e8', ar: 'القفل مقاوم للماء، كنوصي على بابي الخارجي والحمد لله ماعندو مشكل. شكراً SmartLook!', fr: 'La serrure est imperméable, je l\'utilise sur ma porte extérieure sans problème. Merci SmartLook!', date: 'منذ 2 أسبوع' },
  { name: 'عمر بنشريف', city: 'الدار البيضاء', color: '#e87878', ar: 'عندي شركة والمفاتيح كانت مشكلة كبيرة، دابا كل موظف عندو بصمة ديالو. راحة بالية!', fr: 'J\'avais un problème avec les clés pour mon entreprise, maintenant chaque employé a son empreinte. Parfait!', date: 'منذ 2 أسبوع' },
  { name: 'نوال العمراني', city: 'مكناس', color: '#78e8e0', ar: 'التطبيق Tuya سهل جداً، نقدر نفتح القفل من بعيد. مرة غاب ولدي المفتاح فتحتلو من الهاتف', fr: 'L\'application Tuya est très simple, je peux ouvrir à distance. Mon fils a oublié sa clé, j\'ai ouvert depuis mon téléphone', date: 'منذ 3 أسابيع' },
  { name: 'كريم البوعزاوي', city: 'وجدة', color: '#e8d078', ar: 'جودة ممتازة بالنسبة للثمن. كنت خايف يكون غير مزيان بالصورة لكن جاء أحسن بكثير!', fr: 'Excellente qualité par rapport au prix. J\'avais peur que ce soit moins bien qu\'en photo, mais c\'est encore mieux!', date: 'منذ شهر' },
  { name: 'حنان الفاسي', city: 'الرباط', color: '#e8789a', ar: 'البطاريات دامت مزيان، وكين تنضاو كيتنبهني التطبيق. التركيب تا ما خدت غير نص ساعة', fr: 'Les batteries durent longtemps, l\'application me notifie quand elles sont faibles. Installation en seulement 30 minutes', date: 'منذ شهر' },
  { name: 'رشيد الصباح', city: 'طنجة', color: '#78b4e8', ar: 'شريت 3 قفلات للفيلا ديالي. كل شي تمام، التركيب سهل والجودة فاخرة. سعر معقول بزاف', fr: 'J\'ai acheté 3 serrures pour ma villa. Tout est parfait, installation facile et qualité luxueuse. Prix très raisonnable', date: 'منذ شهر' },
  { name: 'مريم القادري', city: 'مراكش', color: '#78e8a0', ar: 'أختي قالت ليا عليه وما ندمتش. كاميرا عين القطة والبصمة، راحة بال كاملة للعيلة', fr: 'Ma sœur me l\'a recommandé et je ne regrette pas. Caméra et empreinte, tranquillité totale pour la famille', date: 'منذ شهر' },
  { name: 'طارق المهدي', city: 'فاس', color: '#c9a84c', ar: 'الدعم التقني جاوبني بسرعة على واتساب وعاونني فالتركيب. خدمة ما شاء الله!', fr: 'Le support technique m\'a répondu rapidement sur WhatsApp et m\'a aidé pour l\'installation. Service excellent!', date: 'منذ شهر' },
  { name: 'زينب المرابط', city: 'أكادير', color: '#b478e8', ar: 'زوجي فرح بيه بزاف، قال ليا هادا أحسن هدية. مظهره فاخر على باب الدار', fr: 'Mon mari en est très content, il dit que c\'est le meilleur cadeau. Look très luxueux sur la porte de la maison', date: 'منذ 5 أسابيع' },
  { name: 'إسماعيل الوزاني', city: 'الدار البيضاء', color: '#e8a078', ar: 'كنعمل فلعقار والزبائن كيعجبهم القفل الذكي. كنوصي بيه لجميع العمارات', fr: 'Je travaille dans l\'immobilier et les clients adorent la serrure intelligente. Je le recommande pour tous les immeubles', date: 'منذ 6 أسابيع' },
  { name: 'آمنة الشرقاوي', city: 'مكناس', color: '#78e8e0', ar: 'استعملتو فالمكتب ديالي وكل الموظفين عجبهم. ما عادش كاين مشكل المفاتيح الضايعة', fr: 'Je l\'utilise au bureau et tous les employés l\'apprécient. Fini les problèmes de clés perdues', date: 'منذ 6 أسابيع' },
  { name: 'نبيل الأزهر', city: 'وجدة', color: '#e87878', ar: 'الثمن مزيان مقارنة بالجودة. القفل متين وما خسرتش من جهة الشكل ولا من جهة الأداء', fr: 'Le prix est bon par rapport à la qualité. La serrure est solide et ne déçoit ni en apparence ni en performance', date: 'منذ 7 أسابيع' },
  { name: 'لطيفة بنمسعود', city: 'الرباط', color: '#e8d078', ar: 'البصمة دقيقة جداً، ما كتخطاش حتى لما يدي باردة. الشكل الذهبي زين بزاف على البيب', fr: 'L\'empreinte est très précise, même avec les mains froides. Le design doré est magnifique sur la porte', date: 'منذ شهرين' },
  { name: 'سعيد الكنتاوي', city: 'طنجة', color: '#78b4e8', ar: 'ولدي كيحب التكنولوجيا وفرح بيه بزاف. أنا كنستعملو بالبطاقة وهو بالبصمة. لكلينا مريح', fr: 'Mon fils adore la technologie et en est très content. Moi j\'utilise la carte et lui l\'empreinte. Pratique pour tous', date: 'منذ شهرين' },
  { name: 'هند الصديقي', city: 'مراكش', color: '#78e8a0', ar: 'منتج محترم بحال ما تصورته. التوصيل جاء معبأ مليح وكل شي سليم. خصم 20% هو الي جذبني', fr: 'Produit professionnel comme imaginé. Livraison bien emballée, tout intact. La réduction de 20% m\'a attiré', date: 'منذ شهرين' },
  { name: 'العربي الحجامي', city: 'فاس', color: '#c9a84c', ar: 'عندي ريادة وعملت حساب لكل موظف. أحسن من المفاتيح بكثير، كنعرف شكون دخل وملى', fr: 'J\'ai un local commercial et créé un compte pour chaque employé. Bien mieux que les clés, je sais qui est entré et quand', date: 'منذ شهرين' },
  { name: 'وفاء التازي', city: 'أكادير', color: '#b478e8', ar: 'كنت خايفة من الشراء أونلاين لكن الخدمة كانت ممتازة. القفل تخطى التوقعات ديالي', fr: 'J\'avais peur d\'acheter en ligne mais le service était excellent. La serrure a dépassé mes attentes', date: 'منذ شهرين' },
  { name: 'مصطفى الغزواني', city: 'الدار البيضاء', color: '#e8a078', ar: 'أحسن استثمار درت في البيت ديالي. الأمان والراحة في نفس الوقت. شكراً SmartLook', fr: 'Meilleur investissement fait pour ma maison. Sécurité et confort en même temps. Merci SmartLook', date: 'منذ 3 أشهر' },
  { name: 'رجاء البكوري', city: 'مكناس', color: '#e87878', ar: 'الكاميرا واضحة والصورة ديالها حسنة بزاف. زوجي مسافر وأنا وحدي، كنحس بأمان أكثر دابا', fr: 'La caméra est claire et l\'image est très bonne. Mon mari est en voyage et je me sens plus en sécurité maintenant', date: 'منذ 3 أشهر' },
  { name: 'أنس الخمليشي', city: 'الرباط', color: '#78e8e0', ar: 'قفل SmartLook WD04 منتج يستاهل. التركيب ما خدش وقت وكل شي يشتغل مليح من الأول', fr: 'La serrure SmartLook WD04 est un produit qui vaut le coup. Installation rapide et tout fonctionne dès le début', date: 'منذ 3 أشهر' },
  { name: 'سناء الدرهم', city: 'طنجة', color: '#e8d078', ar: 'اشتريت للبيت ديال والدتي، فرحت بيه بزاف. دابا مرتاحة على السلامة ديالها', fr: 'Je l\'ai acheté pour la maison de ma mère, elle en est très contente. Je suis maintenant tranquille pour sa sécurité', date: 'منذ 3 أشهر' },
  { name: 'جمال الدين المسعودي', city: 'فاس', color: '#c9a84c', ar: 'جودة خيرة والثمن معقول مقارنة بالمتاجر التقليدية. التوصيل مجاني هو الفايدة الأخرى', fr: 'Très bonne qualité et prix raisonnable comparé aux magasins. La livraison gratuite est un autre avantage', date: 'منذ 4 أشهر' },
  { name: 'إيمان الرزيني', city: 'أكادير', color: '#b478e8', ar: 'ما عندي غير كلمة شكراً. منتج ممتاز وخدمة من الدرجة الأولى. نوصي بيه لكل واحد', fr: 'Je n\'ai qu\'un seul mot: merci. Produit excellent et service de première classe. Je le recommande à tout le monde', date: 'منذ 4 أشهر' },
  { name: 'بدر الزياني', city: 'وجدة', color: '#78b4e8', ar: 'البطاريات دامت 6 شهور حتى دبا. ولا تنضاو يتنبهني التطبيق بكري. فكرة ذكية!', fr: 'Les batteries ont duré 6 mois jusqu\'à maintenant. Quand elles se vident, l\'application me notifie à l\'avance. Idée intelligente!', date: 'منذ 4 أشهر' },
  { name: 'نجلاء بنيحيى', city: 'الدار البيضاء', color: '#78e8a0', ar: 'آخر منتج شريتو أونلاين وما ندمتش. الجودة حقيقية والخدمة محترمة. سعر عادل بزاف', fr: 'Dernier produit acheté en ligne et je ne regrette pas. Qualité réelle et service respectable. Prix très juste', date: 'منذ 4 أشهر' },
];

let testitCurrentIndex = 0;

function getVisibleCount() {
  return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
}

function renderReviews() {
  const grid = document.getElementById('testi-grid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map((r, i) => `
    <div class="testi-card">
      <img class="testi-photo" src="image/reviews/${REVIEW_IMGS[i % REVIEW_IMGS.length]}" alt="${r.name}" onclick="openLightbox(this.src)">
      <div class="testi-header">
        <div class="testi-avatar" style="background:${r.color}20;border:2px solid ${r.color}50;color:${r.color}">${r.name.charAt(0)}</div>
        <div class="testi-info">
          <div class="testi-name">${r.name}</div>
          <div class="testi-location"><i class="fas fa-map-marker-alt" style="font-size:10px;color:${r.color}"></i> ${r.city}</div>
          <div class="testi-date">${r.date}</div>
        </div>
      </div>
      <div class="stars">★★★★★</div>
      <p>«${currentLang === 'fr' ? r.fr : r.ar}»</p>
    </div>
  `).join('');
  testitCurrentIndex = 0;
  updateSlider();
  renderDots();
}

function updateSlider() {
  const grid = document.getElementById('testi-grid');
  if (!grid) return;
  const card = grid.querySelector('.testi-card');
  if (!card) return;
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, REVIEWS.length - visible);
  testitCurrentIndex = Math.min(testitCurrentIndex, maxIndex);
  const rtl = document.documentElement.dir === 'rtl';
  grid.style.transform = `translateX(${(rtl ? 1 : -1) * testitCurrentIndex * (card.offsetWidth + 18)}px)`;

  const prev = document.querySelector('.testi-prev');
  const next = document.querySelector('.testi-next');
  if (prev) prev.disabled = testitCurrentIndex === 0;
  if (next) next.disabled = testitCurrentIndex >= maxIndex;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === testitCurrentIndex));
}

function slideReviews(dir) {
  const maxIndex = Math.max(0, REVIEWS.length - getVisibleCount());
  testitCurrentIndex = Math.max(0, Math.min(testitCurrentIndex + dir, maxIndex));
  updateSlider();
}

function renderDots() {
  const dotsEl = document.getElementById('testi-dots');
  if (!dotsEl) return;
  const total = Math.ceil(REVIEWS.length / getVisibleCount());
  dotsEl.innerHTML = Array.from({length: total}, (_, i) =>
    `<button class="testi-dot${i === 0 ? ' active' : ''}" onclick="jumpToSlide(${i})"></button>`
  ).join('');
}

function jumpToSlide(i) {
  const visible = getVisibleCount();
  testitCurrentIndex = Math.min(i * visible, REVIEWS.length - visible);
  updateSlider();
}

let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => { renderDots(); updateSlider(); }, 200);
});

document.addEventListener('DOMContentLoaded', () => { renderReviews(); });

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .payment-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

const styleAnim = document.createElement('style');
styleAnim.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleAnim);
