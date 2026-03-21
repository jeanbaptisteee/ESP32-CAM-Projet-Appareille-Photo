/* ── NAV SHRINK ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateProgress();
});

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal, .card');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ── PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docH * 100) + '%';
}

/* ── DARK MODE ── */
const toggleBtn = document.getElementById('theme-toggle');
const moon = document.getElementById('icon-moon');
const sun  = document.getElementById('icon-sun');
const saved = localStorage.getItem('theme');
if (saved === 'dark') { document.body.classList.add('dark'); moon.style.display='none'; sun.style.display=''; }
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  moon.style.display = dark ? 'none' : '';
  sun.style.display  = dark ? '' : 'none';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  cursor.classList.add('visible');
});
document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
document.querySelectorAll('a, button, .img-cell, .etape-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* ── STAT COUNTER ── */
function animateCounter(el, target, duration = 1200) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.textContent);
      animateCounter(e.target, target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterIO.observe(el));

/* ── LIGHTBOX ── */
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lightbox-img');
const lbCaption    = document.getElementById('lightbox-caption');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');

let galleryImgs = [];
let currentIdx  = 0;

function openLightbox(imgs, idx) {
  galleryImgs = imgs;
  currentIdx  = idx;
  showLbImg();
  lightbox.classList.add('open');
  requestAnimationFrame(() => lightbox.classList.add('visible'));
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('visible');
  setTimeout(() => { lightbox.classList.remove('open'); document.body.style.overflow = ''; }, 350);
}
function showLbImg() {
  const el = galleryImgs[currentIdx];
  lbImg.src = el.src;
  lbCaption.textContent = el.closest('.img-cell')?.querySelector('.img-caption')?.textContent
    || el.closest('.etape-img') ? el.closest('.etape-card')?.querySelector('.etape-title')?.textContent : '';
  lbPrev.style.display = galleryImgs.length > 1 ? '' : 'none';
  lbNext.style.display = galleryImgs.length > 1 ? '' : 'none';
}

// Bind all real images
document.querySelectorAll('.img-cell img, .etape-img img').forEach(img => {
  img.style.cursor = 'none';
  img.addEventListener('click', () => {
    const all = Array.from(document.querySelectorAll('.img-cell img, .etape-img img'))
      .filter(i => i.complete && i.naturalWidth > 0);
    openLightbox(all, all.indexOf(img));
  });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lbPrev.addEventListener('click', e => { e.stopPropagation(); currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length; showLbImg(); });
lbNext.addEventListener('click', e => { e.stopPropagation(); currentIdx = (currentIdx + 1) % galleryImgs.length; showLbImg(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length; showLbImg(); }
  if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % galleryImgs.length; showLbImg(); }
});

/* ── COPY CODE ── */
function copyCode() {
  const code = document.getElementById('source-code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.innerHTML = '✓ Copié !';
    setTimeout(() => {
      btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier';
    }, 2000);
  });
}