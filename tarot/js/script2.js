/* ── Lightbox ── */
(function(){
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lb-img');
  var lbName  = document.getElementById('lb-name');
  var lbClose = document.getElementById('lb-close');
  var lbPrev  = document.getElementById('lb-prev');
  var lbNext  = document.getElementById('lb-next');
  var curIdx  = 0;

  // Gather all source images (first set only), sorted by data-idx
  var gallery = [];
  document.querySelectorAll('.tarot-img[data-set="0"]').forEach(function(img){
    gallery.push({ src: img.src, name: img.getAttribute('data-name'), idx: parseInt(img.getAttribute('data-idx')) });
  });
  // Sort so gallery[0]=idx0, gallery[1]=idx1 — images are scattered across columns in DOM
  gallery.sort(function(a,b){ return a.idx - b.idx; });

  function showControls(on){
    var d = on ? 'block' : 'none';
    lbClose.style.display = d;
    lbPrev.style.display  = d;
    lbNext.style.display  = d;
  }

  function openAt(idx){
    curIdx = ((idx % gallery.length) + gallery.length) % gallery.length;
    lbImg.style.opacity = '0';
    lb.style.display = 'flex';
    showControls(true);
    setTimeout(function(){
      lbImg.src = gallery[curIdx].src;
      lbName.textContent = gallery[curIdx].name;
      lbImg.style.opacity = '1';
    }, 60);
  }

  function close(){
    lb.style.display = 'none';
    showControls(false);
    lbImg.src = '';
  }

  function prev(){ openAt(curIdx - 1); }
  function next(){ openAt(curIdx + 1); }

  // Double click → open in lightbox fullscreen
  document.addEventListener('dblclick', function(e){
    if(e.target.closest('#lightbox')) return;
    var wrap = e.target.closest('.card-wrap');
    if(!wrap) return;
    e.preventDefault();
    // Find the front face image
    var frontImg = wrap.querySelector('.card-front .tarot-img');
    if(!frontImg) frontImg = wrap.querySelector('.tarot-img');
    if(!frontImg) return;
    var imgIdx = parseInt(frontImg.getAttribute('data-idx') || 0);
    var set    = frontImg.getAttribute('data-set') || '0';
    // Flip the card if not already flipped, then open lightbox
    if(!wrap.classList.contains('flipped')) wrap.classList.add('flipped');
    openAt(imgIdx);
  });

  // Single click on card-wrap (non-double) → just flip
  document.addEventListener('click', function(e){
    if(e.target.closest('#lightbox')) return;
    var wrap = e.target.closest('.card-wrap');
    if(wrap){ wrap.classList.toggle('flipped'); }
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });

  document.addEventListener('keydown', function(e){
    if(lb.style.display !== 'flex') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });
})();
