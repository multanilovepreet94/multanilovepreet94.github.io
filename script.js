/* Shared behaviour for every page. */

/* reveal-on-scroll */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold:.12 });
document.querySelectorAll('.rise').forEach(el=>io.observe(el));

/* lightbox — only runs on pages that include it (Research, Collection) */
const lb = document.getElementById('lightbox');
if(lb){
  const lbClose = document.getElementById('lbClose');
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent = val || ''; };
  function openLightbox({title,desc,acc,origin,medium,imgSrc}){
    set('lbTitle',title); set('lbDesc',desc); set('lbAcc',acc);
    const dl = document.getElementById('lbDl');
    if(origin || medium){ dl.style.display=''; set('lbOrigin',origin||'—'); set('lbMedium',medium||'—'); }
    else { dl.style.display='none'; }
    const plate = document.getElementById('lbPlate');
    plate.setAttribute('data-no', acc || '');
    plate.style.backgroundImage = imgSrc ? 'url('+imgSrc+')' : '';
    plate.style.backgroundSize='cover'; plate.style.backgroundPosition='center';
    lb.classList.add('open'); document.body.style.overflow='hidden'; lbClose.focus();
  }
  const closeLb = ()=>{ lb.classList.remove('open'); document.body.style.overflow=''; };
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e=>{ if(e.target===lb) closeLb(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLb(); });

  document.querySelectorAll('.item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const d = item.dataset; const img = item.querySelector('img.plate');
      openLightbox({ title:d.title, desc:d.desc, acc:d.acc, origin:d.origin, medium:d.medium, imgSrc:img?img.src:'' });
    });
  });
  document.querySelectorAll('.record .plate.zoomable').forEach(p=>{
    const rec = p.closest('.record');
    const open = ()=>{
      const h = rec.querySelector('h3'); const blurb = rec.querySelector('.body > p');
      const src = p.tagName === 'IMG' ? p.src : (p.querySelector('img') ? p.querySelector('img').src : '');
      openLightbox({ title:h?h.textContent:'', desc:blurb?blurb.textContent:'', acc:p.dataset.acc, imgSrc:src });
    };
    p.addEventListener('click', open);
    p.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } });
  });
}

/* theme toggle (system default already applied in <head> to avoid a flash) */
const root = document.documentElement;
const tt = document.getElementById('themeToggle');
if(tt) tt.addEventListener('click', ()=>{
  const dark = root.getAttribute('data-theme') === 'dark';
  if(dark) root.removeAttribute('data-theme'); else root.setAttribute('data-theme','dark');
  try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch(e){}
});
