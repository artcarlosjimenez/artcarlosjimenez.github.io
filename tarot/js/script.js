/* ── Infinite scroll columns ── */
(function(){
  var colEls=[
    document.getElementById('col0'),
    document.getElementById('col1'),
    document.getElementById('col2'),
    document.getElementById('col3')
  ];
  // 1=up (negative Y), -1=down (positive Y)
  var dirs   = [1, -1,  1, -1];
  var speeds = [0.55, 0.42, 0.50, 0.47];
  var pos    = [0, 0, 0, 0];
  var h      = [0, 0, 0, 0];
  var inited = false;

  function init(){
    for(var i=0;i<4;i++){
      // Each col has 3 copies; one-third of scroll height = one loop
      h[i] = colEls[i].scrollHeight / 3;
    }
    // Seed downward columns mid-loop so they don't start blank
    for(var i=0;i<4;i++){
      if(dirs[i] === -1){
        pos[i] = h[i];
      }
    }
    inited = true;
  }

  function tick(){
    requestAnimationFrame(tick);
    if(!inited) return;
    for(var i=0;i<4;i++){
      if(h[i]<=0) continue;
      pos[i] += speeds[i] * dirs[i];
      if(pos[i] >= h[i]) pos[i] -= h[i];
      if(pos[i] < 0)     pos[i] += h[i];
      colEls[i].style.transform = 'translateY(-'+pos[i].toFixed(2)+'px)';
    }
  }

  window.addEventListener('load', function(){
    setTimeout(init, 200);
  });
  setTimeout(function(){ if(!inited) init(); }, 2500);
  tick();
})();
