/* ══════════════════════════════════════════════════════
   PENTERACT — 5-hipercubo en ℝ⁵
   32 vértices · 80 aristas · 10 planos de rotación
   ══════════════════════════════════════════════════════ */

const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize', resize); resize();

/* ── 32 vértices: todas las combinaciones (±1)⁵ ── */
const V = [];
for(let m=0;m<32;m++)
  V.push([(m&1)?1:-1, (m&2)?1:-1, (m&4)?1:-1, (m&8)?1:-1, (m&16)?1:-1]);

/* ── 80 aristas: vértices que difieren en 1 coordenada ── */
const EDGES = [];
for(let i=0;i<32;i++) for(let j=i+1;j<32;j++){
  let d=0; for(let k=0;k<5;k++) if(V[i][k]!==V[j][k]) d++;
  if(d===1) EDGES.push([i,j]);
}

/* Para cada arista: qué dimensión cambia (para colorear) */
const EDGE_DIM = EDGES.map(([i,j])=>{
  for(let k=0;k<5;k++) if(V[i][k]!==V[j][k]) return k;
  return 0;
});

/* ── Rotación en plano (d1, d2) ── */
function rot(v,d1,d2,a){
  const r=[...v], c=Math.cos(a), s=Math.sin(a);
  r[d1]=v[d1]*c-v[d2]*s;
  r[d2]=v[d1]*s+v[d2]*c;
  return r;
}

/* ── Proyecciones en cascada 5D→4D→3D→2D ── */
function p5to4(v){ const f=2.6/(3.4-v[4]); return[v[0]*f,v[1]*f,v[2]*f,v[3]*f]; }
function p4to3(v){ const f=2.4/(3.2-v[3]); return[v[0]*f,v[1]*f,v[2]*f]; }
function p3to2(v,cx,cy,s){ const f=5/(6-v[2]); return[cx+v[0]*f*s, cy+v[1]*f*s]; }

/* ── 10 ángulos de rotación (uno por plano en ℝ⁵) ── */
/*   planos: XY,XZ,XW,XV, YZ,YW,YV, ZW,ZV, WV          */
const ANG = new Float64Array(10);  /* ángulos actuales */
const SPD = [                      /* velocidades base  */
  .00120, .00090, .00310, .00450,  /* XY XZ XW XV  */
  .00065, .00200, .00380,          /* YZ YW YV      */
  .00155, .00270,                  /* ZW ZV         */
  .00140                           /* WV            */
];

/* ── Estado ── */
let autoSpeed = 1.0;       /* multiplicador velocidad */
let paused    = false;

/* ── Rotación manual (drag) ── */
let drag = false, px0=0, py0=0;
let velDragXY=0, velDragXZ=0;
let dragXY=0, dragXZ=0;

canvas.addEventListener('mousedown', e=>{ drag=true; px0=e.clientX; py0=e.clientY; velDragXY=velDragXZ=0; });
canvas.addEventListener('mousemove', e=>{
  if(!drag) return;
  velDragXY=(e.clientX-px0)*.003; velDragXZ=(e.clientY-py0)*.003;
  dragXY+=velDragXY; dragXZ+=velDragXZ;
  px0=e.clientX; py0=e.clientY;
});
canvas.addEventListener('mouseup',   ()=>{ drag=false; });
canvas.addEventListener('mouseleave',()=>{ drag=false; });

/* Touch */
canvas.addEventListener('touchstart', e=>{ drag=true; px0=e.touches[0].clientX; py0=e.touches[0].clientY; },{ passive:true });
canvas.addEventListener('touchmove',  e=>{
  if(!drag) return; e.preventDefault();
  velDragXY=(e.touches[0].clientX-px0)*.003; velDragXZ=(e.touches[0].clientY-py0)*.003;
  dragXY+=velDragXY; dragXZ+=velDragXZ;
  px0=e.touches[0].clientX; py0=e.touches[0].clientY;
},{ passive:false });
canvas.addEventListener('touchend', ()=>{ drag=false; });

/* Scroll → girar en plano XV (5ª dimensión) */
window.addEventListener('wheel', e=>{
  ANG[3] += e.deltaY * .001;
}, { passive:true });

/* ── Controles ── */
const btnAuto  = document.getElementById('btn-auto');
const btnSlow  = document.getElementById('btn-slow');
const btnReset = document.getElementById('btn-reset');

btnAuto.addEventListener('click', ()=>{
  paused=!paused;
  btnAuto.textContent=paused?'Play':'Auto';
  btnAuto.classList.toggle('active',!paused);
});
btnSlow.addEventListener('click', ()=>{
  autoSpeed = autoSpeed===1.0 ? 0.25 : 1.0;
  btnSlow.classList.toggle('active', autoSpeed<1.0);
});
btnReset.addEventListener('click', ()=>{
  ANG.fill(0); dragXY=dragXZ=0; velDragXY=velDragXZ=0;
});

/* Hint inicial */
setTimeout(()=>{ document.getElementById('drag-hint').classList.add('show'); }, 1200);
setTimeout(()=>{ document.getElementById('drag-hint').classList.remove('show'); }, 4000);

/* Indicadores de planos */
const planeDots = [
  document.getElementById('p-xy'), document.getElementById('p-xz'),
  document.getElementById('p-xw'), document.getElementById('p-xv'),
  document.getElementById('p-yz'), document.getElementById('p-yw'),
  document.getElementById('p-yv'), document.getElementById('p-zw'),
  document.getElementById('p-zv'), document.getElementById('p-wv')
];

/* ══════════════════════════════════════════════════════
   LOOP PRINCIPAL
   ══════════════════════════════════════════════════════ */
let t=0;

function draw(){
  const W=canvas.width, H=canvas.height;
  const cx=W/2, cy=H/2;
  const s=Math.min(W,H)*.22;   /* escala — penteract es más complejo */

  /* ── Fondo con estela ── */
  ctx.fillStyle='rgba(0,0,0,0.86)';
  ctx.fillRect(0,0,W,H);

  /* Viñeta radial */
  const vg=ctx.createRadialGradient(cx,cy,s*.2,cx,cy,s*2.2);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.62)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

  /* ── Actualizar ángulos ── */
  if(!paused){
    for(let i=0;i<10;i++) ANG[i] += SPD[i] * autoSpeed;
  }
  /* Inercia del drag */
  if(!drag){
    dragXY += velDragXY; dragXZ += velDragXZ;
    velDragXY *= 0.94; velDragXZ *= 0.94;
  }

  /* ── Actualizar indicadores de planos ── */
  for(let i=0;i<10;i++){
    const activity = Math.abs(SPD[i]*autoSpeed)*180 + (i===0?Math.abs(velDragXY)*30:0) + (i===1?Math.abs(velDragXZ)*30:0);
    const op = paused ? 0.08 : Math.min(1, 0.08 + activity*800);
    planeDots[i].style.opacity = op.toFixed(2);
    planeDots[i].style.transform = `scale(${1 + op*.8})`;
  }

  /* ── Rotar todos los vértices en los 10 planos 5D ── */
  const pts5 = V.map(v=>{
    /* Planos "internos" (auto-rotación) */
    let p = rot(v,  0,1, ANG[0]);      /* XY */
    p     = rot(p,  0,2, ANG[1]);      /* XZ */
    p     = rot(p,  0,3, ANG[2]);      /* XW */
    p     = rot(p,  0,4, ANG[3]);      /* XV */
    p     = rot(p,  1,2, ANG[4]);      /* YZ */
    p     = rot(p,  1,3, ANG[5]);      /* YW */
    p     = rot(p,  1,4, ANG[6]);      /* YV */
    p     = rot(p,  2,3, ANG[7]);      /* ZW */
    p     = rot(p,  2,4, ANG[8]);      /* ZV */
    p     = rot(p,  3,4, ANG[9]);      /* WV */
    /* Rotación manual superpuesta */
    p     = rot(p,  0,1, dragXY);      /* drag horizontal → XY */
    p     = rot(p,  0,2, dragXZ);      /* drag vertical   → XZ */
    return p;
  });

  /* ── Proyectar: 5D → 4D → 3D → 2D ── */
  const pts4 = pts5.map(p5to4);
  const pts3 = pts4.map(p4to3);
  const pts2 = pts3.map(p=>p3to2(p,cx,cy,s));

  /* ── Ordenar aristas por profundidad media (painter's algorithm) ── */
  const sorted = EDGES.map((e,i)=>({
    e, dim: EDGE_DIM[i],
    z: (pts3[e[0]][2]+pts3[e[1]][2])*.5
  })).sort((a,b)=>a.z-b.z);

  /* ── Dibujar aristas ── */
  for(const {e:[i,j], dim, z} of sorted){
    /* Normalizar profundidad → [0, 1] */
    const d = Math.max(0, Math.min(1, (z+1.6)/3.2));

    /* Las aristas de la 5ª dimensión (dim=4) tienen un halo extra */
    const is5th = (dim===4);

    const alpha = 0.06 + d*.70;
    const lw    = 0.5 + d*.85 + (is5th?.35:0);

    const [x1,y1]=pts2[i], [x2,y2]=pts2[j];

    /* Halo exterior (solo dim 5: color diferenciado levemente) */
    if(is5th){
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle=`rgba(255,80,120,${alpha*.12})`; ctx.lineWidth=lw+14;
      ctx.shadowColor='#ff5070'; ctx.shadowBlur=30; ctx.lineCap='round'; ctx.stroke();
    }

    /* Glow exterior */
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.strokeStyle=`rgba(232,24,74,${alpha*.16})`; ctx.lineWidth=lw+10;
    ctx.shadowColor='#e8184a'; ctx.shadowBlur=20; ctx.lineCap='round'; ctx.stroke();

    /* Glow medio */
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.strokeStyle=`rgba(232,24,74,${alpha*.38})`; ctx.lineWidth=lw+4;
    ctx.shadowBlur=9; ctx.stroke();

    /* Núcleo */
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.strokeStyle=`rgba(232,24,74,${Math.min(1,alpha)})`; ctx.lineWidth=lw;
    ctx.shadowBlur=3; ctx.stroke();
  }

  /* ── Vértices ── */
  for(let i=0;i<32;i++){
    const d=Math.max(0,Math.min(1,(pts3[i][2]+1.6)/3.2));
    const [px,py]=pts2[i];
    ctx.beginPath(); ctx.arc(px,py,1.2+d*1.8,0,Math.PI*2);
    ctx.fillStyle=`rgba(232,24,74,${.12+d*.50})`;
    ctx.shadowColor='#e8184a'; ctx.shadowBlur=10; ctx.fill();
  }

  ctx.shadowBlur=0;
  t += .007;
  requestAnimationFrame(draw);
}

draw();
