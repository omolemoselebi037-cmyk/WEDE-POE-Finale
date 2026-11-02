'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = n => 'R' + n.toLocaleString('en-ZA').replace(/\u00a0/g, ' ');

/* ---------- Data (dynamically loaded content) ---------- */
const SERVICES = [
  { name: "Events", price: R7000, image: "images/pic5.jpg.jpg", desc: 'Full-event coverage from the first guest to the last dance.' },
  { n: 'Unveiling Ceremonies', price: 5000, iamge: 'images/pic6.jpg.jpg', d: 'Respectful, gentle photos of the family gathering and the unveiling.' },
  { n: 'Funerals', p: 3500, per: false, cat: 'Ceremonies', img: 'funeral-service-photography.svg', d: 'Quiet, dignified photography that keeps the memories of a loved one.' },
  { n: 'Tertiary Graduations', p: 3000, per: true, cat: 'Milestones', img: 'graduation-photography-south-africa.svg', d: 'Cap-and-gown portraits and stage moments. Priced per 2 hours.' },
  { n: 'Birthday Celebrations', p: 1000, per: true, cat: 'Celebrations', img: 'birthday-party-photography.svg', d: 'Cake, candles and laughter, all caught on camera. Priced per 2 hours.' },
  { n: 'Baptism', p: 1500, per: false, cat: 'Ceremonies', img: 'baptism-photography-rustenburg.svg', d: 'Soft, bright photos of the blessing and the family afterwards.' },
  { n: 'Pre-school', p: 2000, per: false, cat: 'Milestones', img: 'preschool-class-photography.svg', d: 'Playful class pictures and individual portraits for little ones.' }
];
const REVIEWS = [
  { n: 'Thabo S', r: 5, t: 'Great work, the photos from our graduation were perfect.' },
  { n: 'Sedimonthole M', r: 4, t: 'Lovely pictures. We would just like quicker delivery next time.' },
  { n: 'Lindiwe K', r: 5, t: 'Booked for my son\'s baptism. Calm, friendly and professional.' }
];

/* ---------- Navigation ---------- */
const menuBtn = $('.menu-btn');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = $('nav').classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

/* ---------- Services: render + search + filter + sort ---------- */
function card(s) {
  const el = document.createElement('article'); el.className = 'card';
  const img = Object.assign(document.createElement('img'), { src: 'images/' + s.img, alt: s.n + ' photography by Shooter Snap', loading: 'lazy', width: 400, height: 300 });
  const h = Object.assign(document.createElement('h3'), { textContent: s.n });
  const p = Object.assign(document.createElement('p'), { textContent: s.d });
  const pr = Object.assign(document.createElement('span'), { className: 'price', textContent: rand(s.p) + (s.per ? ' per 2 hrs' : '') });
  const a = Object.assign(document.createElement('a'), { className: 'btn', href: 'enquiry.html?service=' + encodeURIComponent(s.n), textContent: 'Get a quote' });
  el.append(img, h, p, pr, document.createElement('br'), a);
  return el;
}
const grid = $('#service-grid');
if (grid) {
  const q = $('#search'), cat = $('#category'), sort = $('#sort'), count = $('#count');
  const draw = () => {
    const term = q.value.trim().toLowerCase();
    let list = SERVICES.filter(s => (cat.value === 'all' || s.cat === cat.value) && (s.n + ' ' + s.d).toLowerCase().includes(term));
    if (sort.value === 'low') list.sort((a, b) => a.p - b.p);
    if (sort.value === 'high') list.sort((a, b) => b.p - a.p);
    if (sort.value === 'name') list.sort((a, b) => a.n.localeCompare(b.n));
    grid.replaceChildren(...list.map(card));
    count.textContent = list.length ? list.length + ' service(s) found' : 'No services match your search. Try a different word or choose "All".';
  };
  [q, cat, sort].forEach(e => e.addEventListener('input', draw));
  draw();
}

/* ---------- Accordion ---------- */
$$('.acc').forEach(acc => {
  const btn = $('button', acc), panel = $('.panel', acc);
  btn.addEventListener('click', () => {
    const open = acc.classList.toggle('open');
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
    btn.setAttribute('aria-expanded', open);
  });
});

/* ---------- Gallery + lightbox ---------- */
const gal = $('.gallery');
if (gal) {
  SERVICES.forEach(s => {
    const f = document.createElement('figure');
    f.tabIndex = 0;
    f.innerHTML = '<img loading="lazy" width="400" height="300"><figcaption></figcaption>';
    $('img', f).src = 'images/' + s.img; $('img', f).alt = s.n + ' photography sample';
    $('figcaption', f).textContent = s.n;
    gal.append(f);
  });
  const lb = document.createElement('div'); lb.id = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button id="lb-close" aria-label="Close">✕</button><button id="lb-prev" aria-label="Previous">‹</button><img alt=""><p></p><button id="lb-next" aria-label="Next">›</button>';
  document.body.append(lb);
  const figs = $$('figure', gal); let i = 0;
  const show = n => { i = (n + figs.length) % figs.length; const im = $('img', figs[i]); $('img', lb).src = im.src; $('img', lb).alt = im.alt; $('p', lb).textContent = im.alt; lb.classList.add('show'); };
  const hide = () => lb.classList.remove('show');
  figs.forEach((f, n) => { f.addEventListener('click', () => show(n)); f.addEventListener('keydown', e => e.key === 'Enter' && show(n)); });
  $('#lb-close').onclick = hide; $('#lb-prev').onclick = () => show(i - 1); $('#lb-next').onclick = () => show(i + 1);
  lb.addEventListener('click', e => e.target === lb && hide());
  document.addEventListener('keydown', e => { if (!lb.classList.contains('show')) return; if (e.key === 'Escape') hide(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
}

/* ---------- Form helpers ---------- */
const setErr = (el, msg) => { el.classList.toggle('invalid', !!msg); const s = el.parentElement.querySelector('.err'); if (s) s.textContent = msg; return !msg; };
const phoneOk = v => /^(\+27|0)[1-9][0-9]{8}$/.test(v.replace(/[\s()-]/g, ''));
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const nameOk = v => /^[A-Za-zÀ-ÿ' -]{2,60}$/.test(v.trim());

/* ---------- Enquiry form: validate + calculate quote ---------- */
const enq = $('#enquiry-form');
if (enq) {
  const sel = $('#service'); SERVICES.forEach(s => sel.add(new Option(s.n + ' (' + rand(s.p) + (s.per ? ' per 2 hrs' : '') + ')', s.n)));
  const pre = new URLSearchParams(location.search).get('service'); if (pre) sel.value = pre;
  const date = $('#date'); date.min = new Date().toISOString().split('T')[0];
  const f = id => $('#' + id, enq);
  const checks = {
    name: () => setErr(f('name'), nameOk(f('name').value) ? '' : 'Enter your name using letters only (2 to 60 characters).'),
    email: () => setErr(f('email'), emailOk(f('email').value) ? '' : 'Enter a valid email, for example name@email.com.'),
    phone: () => setErr(f('phone'), phoneOk(f('phone').value) ? '' : 'Enter a South African number, for example 071 786 6950 or +27 71 786 6950.'),
    service: () => setErr(sel, sel.value ? '' : 'Choose a service.'),
    date: () => setErr(date, date.value && date.value >= date.min ? '' : 'Choose today or a future date.'),
    hours: () => setErr(f('hours'), f('hours').value >= 1 && f('hours').value <= 12 ? '' : 'Enter hours between 1 and 12.')
  };
  Object.keys(checks).forEach(k => f(k).addEventListener('blur', checks[k]));
  enq.addEventListener('submit', e => {
    e.preventDefault();
    const out = $('#quote'); const ok = Object.values(checks).map(c => c()).every(Boolean);
    out.hidden = false; out.className = 'result' + (ok ? '' : ' bad'); out.setAttribute('tabindex', '-1');
    if (!ok) { out.textContent = 'Please fix the highlighted fields and send again.'; return; }
    const s = SERVICES.find(x => x.n === sel.value), hrs = +f('hours').value;
    let total = s.per ? s.p * Math.ceil(hrs / 2) : s.p;
    if (!s.per && hrs > 4) total += (hrs - 4) * 250;
    const extras = $$('input[name=extra]:checked', enq); extras.forEach(x => total += +x.value);
    const day = new Date(date.value + 'T00:00').getDay();
    const avail = day === 0 ? 'Sundays are limited. We will call you within 24 hours to confirm.' : 'Good news, that date is open.';
    out.innerHTML = '';
    const h = document.createElement('h3'); h.textContent = 'Thank you, ' + f('name').value.trim() + '!';
    const p1 = document.createElement('p'); p1.textContent = 'Estimated cost for ' + s.n + ' (' + hrs + ' hrs): ' + rand(total) + (extras.length ? ' including ' + extras.length + ' extra(s)' : '') + '.';
    const p2 = document.createElement('p'); p2.textContent = avail + ' A confirmation will be sent to ' + f('email').value.trim() + '.';
    out.append(h, p1, p2); out.focus();
  });
}

/* ---------- Contact form: validate + AJAX email ---------- */
const con = $('#contact-form');
if (con) {
  const f = id => $('#' + id, con);
  const checks = {
    name: () => setErr(f('name'), nameOk(f('name').value) ? '' : 'Enter your name using letters only.'),
    email: () => setErr(f('email'), emailOk(f('email').value) ? '' : 'Enter a valid email address.'),
    phone: () => setErr(f('phone'), !f('phone').value || phoneOk(f('phone').value) ? '' : 'Use a South African number or leave this empty.'),
    message: () => setErr(f('message'), f('message').value.trim().length >= 10 && f('message').value.length <= 500 ? '' : 'Write between 10 and 500 characters.')
  };
  Object.keys(checks).forEach(k => f(k).addEventListener('blur', checks[k]));
  f('message').addEventListener('input', () => $('#chars').textContent = f('message').value.length + '/500');
  con.addEventListener('submit', async e => {
    e.preventDefault();
    const out = $('#sent'); out.hidden = false;
    if (!Object.values(checks).map(c => c()).every(Boolean)) { out.className = 'result bad'; out.textContent = 'Please fix the highlighted fields.'; return; }
    out.className = 'result'; out.textContent = 'Sending your message...';
    try {
      const res = await fetch(con.action, { method: 'POST', body: new FormData(con), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Request failed');
      out.textContent = 'Message sent! We will reply by email soon.'; con.reset(); $('#chars').textContent = '0/500';
    } catch (err) {
      out.className = 'result bad'; out.textContent = 'We could not send your message. Please email info@shootersnap.co.za or call 071 786 6950.';
    }
  });
}

/* ---------- Reviews: render + add ---------- */
const list = $('#review-list');
if (list) {
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const add = r => {
    const d = document.createElement('div'); d.className = 'review';
    const a = Object.assign(document.createElement('div'), { className: 'avatar', textContent: r.n[0].toUpperCase() });
    const b = document.createElement('div');
    const n = Object.assign(document.createElement('strong'), { textContent: r.n });
    const s = Object.assign(document.createElement('div'), { className: 'stars', textContent: stars(r.r) });
    const t = Object.assign(document.createElement('p'), { textContent: r.t });
    b.append(n, s, t); d.append(a, b); list.prepend(d);
  };
  const avg = () => { const all = REVIEWS; $('#avg').textContent = (all.reduce((x, y) => x + y.r, 0) / all.length).toFixed(1) + ' / 5 from ' + all.length + ' reviews'; };
  REVIEWS.slice().reverse().forEach(add); avg();
  $('#review-form').addEventListener('submit', e => {
    e.preventDefault();
    const n = $('#rname'), t = $('#rtext'), r = $('#rstars');
    const ok = [setErr(n, nameOk(n.value) ? '' : 'Enter your name.'), setErr(t, t.value.trim().length >= 5 ? '' : 'Write at least 5 characters.')].every(Boolean);
    if (!ok) return;
    const rev = { n: n.value.trim(), r: +r.value, t: t.value.trim() }; REVIEWS.push(rev); add(rev); avg(); e.target.reset();
  });
}

/* ---------- Interactive map (Leaflet) ---------- */
if ($('#map') && window.L) {
  const pos = [-25.6676, 27.2421];
  const map = L.map('map').setView(pos, 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  L.marker(pos).addTo(map).bindPopup('<b>Shooter Snap</b><br>Sediba Street, Rustenburg 5112').openPopup();
}
