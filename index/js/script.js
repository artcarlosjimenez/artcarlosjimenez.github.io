const PAINTINGS = [
  { title: "Botellas", src: "images/img-003.jpg", w: 900, h: 599 },
  { title: "Figura en rojo", src: "images/img-004.jpg", w: 664, h: 900 },
  { title: "Vestido amarillo", src: "images/img-005.jpg", w: 505, h: 900 },
  { title: "Movimiento B&W", src: "images/img-006.jpg", w: 643, h: 900 },
  { title: "Contraluz azul", src: "images/img-007.jpg", w: 540, h: 900 },
  { title: "Grito I", src: "images/img-008.jpg", w: 675, h: 900 },
  { title: "Grito II", src: "images/img-009.jpg", w: 642, h: 900 },
  { title: "La galer\u00eda", src: "images/img-010.jpg", w: 900, h: 720 },
  { title: "Caf\u00e9", src: "images/img-011.jpg", w: 900, h: 674 },
  { title: "Y'ai obli\u00e9 quoi?", src: "images/img-012.jpg", w: 579, h: 900 },
  { title: "Figura con sombra", src: "images/img-013.jpg", w: 599, h: 900 },
  { title: "Retrato en rojo", src: "images/img-014.jpg", w: 643, h: 900 },
  { title: "Desnudo rojo", src: "images/img-015.jpg", w: 642, h: 900 },
  { title: "Ventana", src: "images/img-016.jpg", w: 642, h: 900 },
  { title: "Retrato con garabato", src: "images/img-017.jpg", w: 675, h: 900 },
  { title: "Perfil oscuro", src: "images/img-018.jpg", w: 599, h: 900 },
  { title: "Grito III", src: "images/img-019.jpg", w: 599, h: 900 },
  { title: "Sombrero y sangre", src: "images/img-020.jpg", w: 599, h: 900 },
  { title: "Rostro diagonal", src: "images/img-021.jpg", w: 599, h: 900 },
  { title: "Caída", src: "images/img-022.jpg", w: 599, h: 900 },
  { title: "Figura encogida", src: "images/img-023.jpg", w: 599, h: 900 },
  { title: "13", src: "images/img-024.jpg", w: 663, h: 900 },
  { title: "El café", src: "images/img-025.jpg", w: 715, h: 900 },
  { title: "La puerta", src: "images/img-026.jpg", w: 675, h: 900 },
  { title: "Ventana", src: "images/img-027.jpg", w: 680, h: 900 },
  { title: "El muelle", src: "images/img-028.jpg", w: 694, h: 900 },
  { title: "El corredor", src: "images/img-029.jpg", w: 630, h: 900 },
  { title: "Bandas", src: "images/img-030.jpg", w: 683, h: 900 },
  { title: "El tráiler", src: "images/img-031.jpg", w: 900, h: 900 },
  { title: "Interior", src: "images/img-010.jpg", w: 900, h: 720 },
  { title: "El observador", src: "images/img-032.jpg", w: 781, h: 900 },
  { title: "Rojo", src: "images/img-033.jpg", w: 842, h: 900 },
  { title: "El bar", src: "images/img-034.jpg", w: 674, h: 900 },
  { title: "La luz", src: "images/img-035.jpg", w: 720, h: 900 },
  { title: "Horus", src: "images/img-036.jpg", w: 900, h: 900 },
  { title: "Sombra roja", src: "images/img-037.jpg", w: 720, h: 900 },
  { title: "Prometeo", src: "images/img-038.jpg", w: 900, h: 900 },
  { title: "El ángel", src: "images/img-039.jpg", w: 900, h: 900 },
  { title: "Los dioses", src: "images/img-040.jpg", w: 900, h: 675 },
  { title: "Disputa", src: "images/img-041.jpg", w: 900, h: 900 },
  { title: "Ofanim", src: "images/img-042.jpg", w: 900, h: 900 }
];

const VIDEO_B64  = "video/video-001.mp4";
const VIDEO2_B64 = "video/video-002.mp4";
const VIDEO3_B64 = "video/video-003.mp4";
const VIDEO4_B64 = "video/video-004.mp4";

const VIDEO_NAME  = "MILLION LITTLE REASONS.mp4";
const VIDEO2_NAME = "El poema de mi hermana - Carlos Jimenez.mp4";
const VIDEO3_NAME = "Por que tan serio.mp4";
const VIDEO4_NAME = "Los dioses no tenemos que escoger.mp4";


// Stars
const desktop = document.getElementById('desktop');
for (let i = 0; i < 90; i++) {
  const s = document.createElement('div'); s.className = 'star';
  const sz = Math.random()*1.6+0.3;
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;--a:${.08+Math.random()*.45};--d:${2+Math.random()*7}s;animation-delay:${Math.random()*6}s`;
  desktop.appendChild(s);
}

// Clock
function tick() {
  const n = new Date();
  document.getElementById('clock').textContent =
    String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');
}
tick(); setInterval(tick,10000);

// ── AUDIO ENGINE ──────────────────────────────────────────
let actx = null, master = null;
let hornLo, hornPeak, hornHi, reverbBus, wsDrive, crackleG;
let audioReady = false, muted = false;

const toggleBtn = document.getElementById('audio-toggle');

function audioMute(m) {
  if (!actx || !master) return;
  master.gain.linearRampToValueAtTime(m ? 0 : 0.54, actx.currentTime + 1.2);
}

function buildChain() {
  // Tomar el MP3 del elemento <audio> embebido
  const mp3src = document.getElementById('bgaudio').querySelector('source').src;
  const MP3B64 = mp3src.split(',')[1];

  master = actx.createGain();
  master.gain.setValueAtTime(0, actx.currentTime);
  master.gain.linearRampToValueAtTime(0.54, actx.currentTime + 3); // 0.72 × 0.75
  master.connect(actx.destination);

  // Horn filter chain
  hornLo = actx.createBiquadFilter(); hornLo.type = "highpass";
  hornLo.frequency.value = 190; hornLo.Q.value = 1.1;
  const wm = actx.createBiquadFilter(); wm.type = "peaking";
  wm.frequency.value = 440; wm.gain.value = 4; wm.Q.value = 2;
  hornPeak = actx.createBiquadFilter(); hornPeak.type = "peaking";
  hornPeak.frequency.value = 880; hornPeak.gain.value = 8; hornPeak.Q.value = 1.6;
  hornHi = actx.createBiquadFilter(); hornHi.type = "lowpass";
  hornHi.frequency.value = 3600; hornHi.Q.value = 0.85;
  hornLo.connect(wm); wm.connect(hornPeak); hornPeak.connect(hornHi); hornHi.connect(master);

  // Waveshaper distortion
  const ws = actx.createWaveShaper();
  const crv = new Float32Array(512);
  for (let i = 0; i < 512; i++) {
    const x = i * 2 / 512 - 1;
    crv[i] = (x >= 0 ? 1 - Math.pow(1 - x, 2.5) : -(1 - Math.pow(1 + x, 2.2))) * 0.86;
  }
  ws.curve = crv; ws.oversample = "4x";
  wsDrive = actx.createGain(); wsDrive.gain.value = 1;
  wsDrive.connect(ws); ws.connect(hornLo);

  // Multi-tap reverb
  reverbBus = actx.createGain(); reverbBus.gain.value = 0.85;
  [[0.019,0.52],[0.031,0.48],[0.049,0.44],[0.073,0.40],[0.107,0.36],[0.157,0.32]].forEach(([dt,fb]) => {
    const d = actx.createDelay(0.4); d.delayTime.value = dt;
    const g = actx.createGain(); g.gain.value = fb;
    const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2000;
    reverbBus.connect(d); d.connect(f); f.connect(g); g.connect(d); g.connect(wsDrive);
  });

  // Vinyl crackle noise
  const cbuf = actx.createBuffer(1, actx.sampleRate * 4, actx.sampleRate);
  const cd = cbuf.getChannelData(0);
  for (let i = 0; i < cd.length; i++) cd[i] = Math.random() * 2 - 1;
  const cs = actx.createBufferSource(); cs.buffer = cbuf; cs.loop = true;
  const cbp = actx.createBiquadFilter(); cbp.type = "bandpass";
  cbp.frequency.value = 5000; cbp.Q.value = 0.4;
  const chp = actx.createBiquadFilter(); chp.type = "highpass"; chp.frequency.value = 3400;
  crackleG = actx.createGain(); crackleG.gain.value = 0.016;
  cs.connect(cbp); cbp.connect(chp); chp.connect(crackleG); crackleG.connect(master);
  cs.start();

  // Random low-frequency pops
  (function pop() {
    if (!actx) return;
    setTimeout(() => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine"; o.frequency.value = 85 + Math.random() * 110;
      g.gain.setValueAtTime(0, actx.currentTime);
      g.gain.linearRampToValueAtTime(0.14 + Math.random() * 0.1, actx.currentTime + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.04 + Math.random() * 0.05);
      o.connect(g); g.connect(master); o.start(); o.stop(actx.currentTime + 0.08);
      pop();
    }, 800 + Math.random() * 3200);
  })();

  // Sub rumble
  const rum = actx.createOscillator(); rum.type = "sine"; rum.frequency.value = 27;
  const rg = actx.createGain(); rg.gain.value = 0.03;
  rum.connect(rg); rg.connect(master); rum.start();

  // Decode & play MP3 with wow/flutter
  const bin = atob(MP3B64);
  const ab2 = new ArrayBuffer(bin.length);
  const ua = new Uint8Array(ab2);
  for (let i = 0; i < bin.length; i++) ua[i] = bin.charCodeAt(i);
  actx.decodeAudioData(ab2).then(buf => {
    const bufSrc = actx.createBufferSource();
    bufSrc.buffer = buf; bufSrc.loop = true;
    const tg = actx.createGain(); tg.gain.value = 1;
    bufSrc.connect(tg); tg.connect(reverbBus); tg.connect(wsDrive);
    bufSrc.start(0); window._tg = tg;
    // Wow & flutter pitch modulation
    let wt = 0;
    function wowTick() {
      requestAnimationFrame(wowTick);
      wt += 0.032;
      bufSrc.playbackRate.value = 1 + Math.sin(wt) * 0.004 + Math.sin(wt * 14) * 0.001;
    }
    wowTick();
    audioReady = true;
    toggleBtn.textContent = '▐▐';
  }).catch(e => console.warn("audio decode:", e));
}

toggleBtn.addEventListener('click', () => {
  if (!audioReady) return;
  muted = !muted;
  audioMute(muted);
  toggleBtn.textContent = muted ? '▶' : '▐▐';
});

// Splash — inicia audio y entra a la galería
const splash = document.getElementById('splash');
splash.addEventListener('click', () => {
  try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  if (actx) {
    const p = actx.state === "suspended" ? actx.resume() : Promise.resolve();
    p.then(() => buildChain()).catch(e => console.warn(e));
  }
  splash.classList.add('fade');
  buildIcons();
  buildDownloadsFolder();
  buildPodcastFolder();
  buildObrasFolder();
  buildTarotFolder();
  setTimeout(() => { splash.style.display='none'; }, 950);
});

// State
let zTop=100, winList=[];
const iconsEl=document.getElementById('icons'), winsEl=document.getElementById('windows'), tbWins=document.getElementById('tb-wins');

function buildIcons() {
  PAINTINGS.forEach((p,idx) => {
    const el=document.createElement('div'); el.className='icon';
    el.innerHTML=`<div class="icon-thumb"><img src="${p.src}" draggable="false"></div><span class="icon-label">${p.title}</span>`;
    el.addEventListener('click',e=>{ document.querySelectorAll('.icon').forEach(i=>i.classList.remove('selected')); el.classList.add('selected'); e.stopPropagation(); });
    el.addEventListener('dblclick',()=>openWin(idx));
    iconsEl.appendChild(el);
  });
  desktop.addEventListener('click',()=>document.querySelectorAll('.icon').forEach(i=>i.classList.remove('selected')));
}
function buildDownloadsFolder() {
  const desktop = document.getElementById('desktop');
  const folder = document.createElement('div');
  folder.className = 'dl-folder-icon';
  folder.innerHTML = `
    <div class="folder-img dl-folder-img" style="
      width:54px;height:46px;
      background:linear-gradient(145deg,#8b5cf6,#4c1d95);
      border-radius:0 6px 6px 6px;position:relative;
      box-shadow:0 3px 10px rgba(109,40,217,0.4);
    ">
      <div style="position:absolute;top:-8px;left:0;width:22px;height:10px;
        background:linear-gradient(145deg,#a78bfa,#7c3aed);border-radius:4px 4px 0 0;"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        font-size:18px;padding-top:4px;">⬇</div>
    </div>
    <span class="folder-label">Descargas</span>`;
  folder.style.cssText = 'position:absolute;right:20px;top:20px;';
  folder.addEventListener('dblclick', openDownloadsWin);
  desktop.appendChild(folder);
}

function openDownloadsWin() {
  const existing = winList.find(w => w.id === 'downloads' && !w.closed);
  if (existing) { if(existing.minimized) restore(existing); front(existing); return; }

  const el = document.createElement('div');
  el.className = 'xp-win active';
  el.style.cssText = `left:200px;top:80px;width:480px;height:370px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">Descargas</span>
    </div>
    <div class="xp-body dl-win-body">
      <div class="video-file-icon" id="video-file-btn">
        <div class="vf-thumb">▶</div>
        <span class="vf-label">MILLION LITTLE REASONS.mp4</span>
      </div>
      <div class="video-file-icon" id="video2-file-btn">
        <div class="vf-thumb">▶</div>
        <span class="vf-label">El poema de mi hermana.mp4</span>
      </div>
      <div class="video-file-icon" id="video3-file-btn">
        <div class="vf-thumb">▶</div>
        <span class="vf-label">Por que tan serio.mp4</span>
      </div>
      <div class="video-file-icon" id="video4-file-btn">
        <div class="vf-thumb">▶</div>
        <span class="vf-label">Los dioses no tenemos que escoger.mp4</span>
      </div>
    </div>
    <div class="xp-resize"></div>`;

  winsEl.appendChild(el);
  const tbBtn = document.createElement('div');
  tbBtn.className = 'tb-btn active';
  tbBtn.innerHTML = '<span>Descargas</span>';
  tbWins.appendChild(tbBtn);

  const win = { el, tbBtn, id: 'downloads', closed: false, minimized: false, maxed: false, prevCSS: null };
  winList.push(win);

  el.querySelector('[data-action="close"]').addEventListener('click', e => { e.stopPropagation(); closeWin(win); });
  el.querySelector('[data-action="min"]').addEventListener('click',   e => { e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click',   e => { e.stopPropagation(); toggleMax(win); });

  el.addEventListener('mousedown', e => {
    if (!e.target.closest('[data-action]') && !e.target.closest('.xp-resize')) front(win);
  });

  tbBtn.addEventListener('click', () => {
    win.minimized ? (restore(win), front(win)) : parseInt(el.style.zIndex) === zTop ? minimize(win) : front(win);
  });

  drag(el, el.querySelector('.xp-title'));
  resize(el, el.querySelector('.xp-resize'));

  el.querySelector('#video-file-btn').addEventListener('click', openVideoPlayer);
  el.querySelector('#video2-file-btn').addEventListener('click', openVideo2Player);
  el.querySelector('#video3-file-btn').addEventListener('click', openVideo3Player);
  el.querySelector('#video4-file-btn').addEventListener('click', openVideo4Player);

  front(win);
}

function openVideoPlayer() {
  const existing = winList.find(w => w.id === 'videoplayer' && !w.closed);
  if (existing) { if(existing.minimized) restore(existing); front(existing); return; }

  const el = document.createElement('div');
  el.className = 'xp-win active';
  el.style.cssText = `left:80px;top:40px;width:680px;height:520px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">MILLION LITTLE REASONS</span>
    </div>
    <div class="xp-body video-player-wrap">
      <video id="gallery-video" controls src="${VIDEO_B64}"></video>
      <button class="dl-btn" id="dl-video-btn">⬇ Descargar</button>
    </div>
    <div class="xp-resize"></div>`;

  winsEl.appendChild(el);
  const tbBtn = document.createElement('div');
  tbBtn.className = 'tb-btn active';
  tbBtn.innerHTML = '<span>▶ MILLION LITTLE REASONS</span>';
  tbWins.appendChild(tbBtn);

  const win = { el, tbBtn, id: 'videoplayer', closed: false, minimized: false, maxed: false, prevCSS: null };
  winList.push(win);

  el.querySelector('[data-action="close"]').addEventListener('click', e => {
    e.stopPropagation();
    const vid = el.querySelector('video');
    if (vid) { vid.pause(); if (audioReady) audioMute(false); }
    closeWin(win);
  });
  el.querySelector('[data-action="min"]').addEventListener('click', e => { e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click', e => { e.stopPropagation(); toggleMax(win); });

  el.addEventListener('mousedown', e => {
    if (!e.target.closest('[data-action]') && !e.target.closest('.xp-resize')) front(win);
  });

  tbBtn.addEventListener('click', () => {
    win.minimized ? (restore(win), front(win)) : parseInt(el.style.zIndex) === zTop ? minimize(win) : front(win);
  });

  // Audio mute/unmute tied to video playback
  const vid = el.querySelector('video');
  vid.addEventListener('play',  () => { if (audioReady) audioMute(true); });
  vid.addEventListener('pause', () => { if (audioReady) audioMute(false); });
  vid.addEventListener('ended', () => { if (audioReady) audioMute(false); });

  // Download button
  el.querySelector('#dl-video-btn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = VIDEO_B64; a.download = VIDEO_NAME; a.click();
  });

  drag(el, el.querySelector('.xp-title'));
  resize(el, el.querySelector('.xp-resize'));

  front(win);
}


function openVideo2Player() {
  const existing = winList.find(w => w.id === 'video2player' && !w.closed);
  if (existing) { if(existing.minimized) restore(existing); front(existing); return; }

  const el = document.createElement('div');
  el.className = 'xp-win active';
  el.style.cssText = `left:120px;top:60px;width:680px;height:520px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">El poema de mi hermana — Pablo Neruda</span>
    </div>
    <div class="xp-body video-player-wrap">
      <video id="gallery-video2" controls src="${VIDEO2_B64}"></video>
      <button class="dl-btn" id="dl-video2-btn">⬇ Descargar</button>
    </div>
    <div class="xp-resize"></div>`;

  winsEl.appendChild(el);
  const tbBtn = document.createElement('div');
  tbBtn.className = 'tb-btn active';
  tbBtn.innerHTML = '<span>▶ El poema de mi hermana</span>';
  tbWins.appendChild(tbBtn);

  const win = { el, tbBtn, id: 'video2player', closed: false, minimized: false, maxed: false, prevCSS: null };
  winList.push(win);

  el.querySelector('[data-action="close"]').addEventListener('click', e => {
    e.stopPropagation();
    const vid = el.querySelector('video');
    if (vid) { vid.pause(); if (audioReady) audioMute(false); }
    closeWin(win);
  });
  el.querySelector('[data-action="min"]').addEventListener('click', e => { e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click', e => { e.stopPropagation(); toggleMax(win); });

  el.addEventListener('mousedown', e => {
    if (!e.target.closest('[data-action]') && !e.target.closest('.xp-resize')) front(win);
  });
  tbBtn.addEventListener('click', () => {
    win.minimized ? (restore(win), front(win)) : parseInt(el.style.zIndex) === zTop ? minimize(win) : front(win);
  });

  const vid = el.querySelector('video');
  vid.addEventListener('play',  () => { if (audioReady) audioMute(true); });
  vid.addEventListener('pause', () => { if (audioReady) audioMute(false); });
  vid.addEventListener('ended', () => { if (audioReady) audioMute(false); });

  el.querySelector('#dl-video2-btn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = VIDEO2_B64; a.download = VIDEO2_NAME; a.click();
  });

  drag(el, el.querySelector('.xp-title'));
  resize(el, el.querySelector('.xp-resize'));
  front(win);
}
function openVideo3Player() {
  const existing = winList.find(w => w.id === 'video3player' && !w.closed);
  if (existing) { if(existing.minimized) restore(existing); front(existing); return; }
  const el = document.createElement('div');
  el.className = 'xp-win active';
  el.style.cssText = `left:160px;top:80px;width:680px;height:520px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">Por que tan serio</span>
    </div>
    <div class="xp-body video-player-wrap">
      <video id="gallery-video3" controls src="${VIDEO3_B64}"></video>
      <button class="dl-btn" id="dl-video3-btn">⬇ Descargar</button>
    </div>
    <div class="xp-resize"></div>`;
  winsEl.appendChild(el);
  const tbBtn = document.createElement('div');
  tbBtn.className = 'tb-btn active';
  tbBtn.innerHTML = '<span>▶ Por que tan serio</span>';
  tbWins.appendChild(tbBtn);
  const win = { el, tbBtn, id: 'video3player', closed: false, minimized: false, maxed: false, prevCSS: null };
  winList.push(win);
  el.querySelector('[data-action="close"]').addEventListener('click', e => { e.stopPropagation(); const vid=el.querySelector('video'); if(vid){vid.pause(); if(audioReady)audioMute(false);} closeWin(win); });
  el.querySelector('[data-action="min"]').addEventListener('click', e => { e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click', e => { e.stopPropagation(); toggleMax(win); });
  el.addEventListener('mousedown', e => { if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize')) front(win); });
  tbBtn.addEventListener('click', () => { win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win); });
  const vid=el.querySelector('video');
  vid.addEventListener('play',()=>{ if(audioReady)audioMute(true); });
  vid.addEventListener('pause',()=>{ if(audioReady)audioMute(false); });
  vid.addEventListener('ended',()=>{ if(audioReady)audioMute(false); });
  el.querySelector('#dl-video3-btn').addEventListener('click',()=>{ const a=document.createElement('a'); a.href=VIDEO3_B64; a.download='Por que tan serio.mp4'; a.click(); });
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
}

function openVideo4Player() {
  const existing = winList.find(w => w.id === 'video4player' && !w.closed);
  if (existing) { if(existing.minimized) restore(existing); front(existing); return; }
  const el = document.createElement('div');
  el.className = 'xp-win active';
  el.style.cssText = `left:200px;top:100px;width:680px;height:520px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">Los dioses no tenemos que escoger</span>
    </div>
    <div class="xp-body video-player-wrap">
      <video id="gallery-video4" controls src="${VIDEO4_B64}"></video>
      <button class="dl-btn" id="dl-video4-btn">⬇ Descargar</button>
    </div>
    <div class="xp-resize"></div>`;
  winsEl.appendChild(el);
  const tbBtn = document.createElement('div');
  tbBtn.className = 'tb-btn active';
  tbBtn.innerHTML = '<span>▶ Los dioses no tenemos que escoger</span>';
  tbWins.appendChild(tbBtn);
  const win = { el, tbBtn, id: 'video4player', closed: false, minimized: false, maxed: false, prevCSS: null };
  winList.push(win);
  el.querySelector('[data-action="close"]').addEventListener('click', e => { e.stopPropagation(); const vid=el.querySelector('video'); if(vid){vid.pause(); if(audioReady)audioMute(false);} closeWin(win); });
  el.querySelector('[data-action="min"]').addEventListener('click', e => { e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click', e => { e.stopPropagation(); toggleMax(win); });
  el.addEventListener('mousedown', e => { if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize')) front(win); });
  tbBtn.addEventListener('click', () => { win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win); });
  const vid=el.querySelector('video');
  vid.addEventListener('play',()=>{ if(audioReady)audioMute(true); });
  vid.addEventListener('pause',()=>{ if(audioReady)audioMute(false); });
  vid.addEventListener('ended',()=>{ if(audioReady)audioMute(false); });
  el.querySelector('#dl-video4-btn').addEventListener('click',()=>{ const a=document.createElement('a'); a.href=VIDEO4_B64; a.download='Los dioses no tenemos que escoger.mp4'; a.click(); });
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
}

function openWin(idx) {
  const p=PAINTINGS[idx];
  const ex=winList.find(w=>w.idx===idx&&!w.closed);
  if(ex){ if(ex.minimized)restore(ex); front(ex); return; }
  const spread=winList.filter(w=>!w.closed).length%9;
  const left=130+spread*28, top=22+spread*24;
  const maxW=Math.min(560,window.innerWidth-160), maxH=Math.min(520,window.innerHeight-100);
  const ratio=p.w/p.h;
  let ww=ratio>=1?maxW:Math.min(maxW,Math.round((maxH-108)*ratio));
  let wh=ratio>=1?Math.min(maxH,Math.round(maxW/ratio)+108):maxH;
  ww=Math.max(280,ww); wh=Math.max(220,wh);
  const el=document.createElement('div'); el.className='xp-win active';
  el.style.cssText=`left:${left}px;top:${top}px;width:${ww}px;height:${wh}px;z-index:${++zTop}`;
  el.innerHTML=`
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"   data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">${p.title}</span>
    </div>
    <div class="xp-menubar">
      <span class="xp-mi">Archivo</span><span class="xp-mi">Ver</span><span class="xp-mi">Ayuda</span>
    </div>
    <div class="xp-addr">
      <span>Ruta</span>
      <div class="xp-addr-field">~/Galería/${p.title}.jpg</div>
    </div>
    <div class="xp-body"><img src="${p.src}" draggable="false"></div>
    <div class="xp-status"><span class="xp-status-p">${p.title}</span><span>${p.w} × ${p.h} px</span></div>
    <div class="xp-resize"></div>`;
  winsEl.appendChild(el);
  const win={idx,el,tbBtn:null,minimized:false,closed:false,maxed:false,prevCSS:null};

  // Dot actions
  el.querySelector('[data-action="close"]').addEventListener('click', e=>{ e.stopPropagation(); closeWin(win); });
  el.querySelector('[data-action="min"]').addEventListener('click',   e=>{ e.stopPropagation(); minimize(win); });
  el.querySelector('[data-action="max"]').addEventListener('click',   e=>{ e.stopPropagation(); toggleMax(win); });

  // Taskbar button
  const tbBtn=document.createElement('div'); tbBtn.className='tb-btn active';
  tbBtn.innerHTML=`<div class="tb-ico"><img src="${p.src}" draggable="false"></div><span>${p.title}</span>`;
  tbWins.appendChild(tbBtn);
  win.tbBtn=tbBtn;
  winList.push(win);

  tbBtn.addEventListener('click',()=>{ win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win); });
  el.addEventListener('mousedown',e=>{ if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize')) front(win); });
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
  Object.assign(el.style,{transform:'scale(.88)',opacity:'0',transition:'transform .15s ease,opacity .15s ease'});
  requestAnimationFrame(()=>{ Object.assign(el.style,{transform:'scale(1)',opacity:'1'}); setTimeout(()=>{el.style.transition='';},160); });
}

function closeWin(w) {
  Object.assign(w.el.style,{transition:'transform .12s ease,opacity .12s ease',transform:'scale(.88)',opacity:'0'});
  setTimeout(()=>{ w.el.remove(); w.tbBtn.remove(); w.closed=true; promoteTop(); },130);
}
function minimize(w) { w.minimized=true; w.el.style.display='none'; w.tbBtn.classList.remove('active'); promoteTop(); }
function restore(w) {
  w.minimized=false; w.el.style.display='';
  Object.assign(w.el.style,{transform:'scale(.92)',opacity:'.5',transition:'transform .12s ease,opacity .12s ease'});
  requestAnimationFrame(()=>{ Object.assign(w.el.style,{transform:'scale(1)',opacity:'1'}); setTimeout(()=>{w.el.style.transition='';},130); });
}
function toggleMax(w) {
  if(w.maxed){
    Object.assign(w.el.style,w.prevCSS);
    w.el.style.borderRadius='10px 10px 6px 6px';
    w.maxed=false;
  } else {
    w.prevCSS={left:w.el.style.left,top:w.el.style.top,width:w.el.style.width,height:w.el.style.height};
    Object.assign(w.el.style,{left:'0px',top:'0px',width:window.innerWidth+'px',height:(window.innerHeight-36)+'px',borderRadius:'0'});
    w.maxed=true;
  }
}
function front(w) {
  w.el.style.zIndex=++zTop;
  w.el.classList.remove('inactive'); w.el.classList.add('active');
  w.tbBtn.classList.add('active');
  winList.forEach(x=>{ if(x!==w&&!x.closed){ x.el.classList.remove('active'); x.el.classList.add('inactive'); x.tbBtn.classList.remove('active'); } });
}
function promoteTop() {
  const t=winList.filter(w=>!w.closed&&!w.minimized).sort((a,b)=>parseInt(b.el.style.zIndex)-parseInt(a.el.style.zIndex))[0];
  if(t) front(t);
}
function drag(el,handle) {
  let ox,oy,on=false;
  handle.addEventListener('mousedown',e=>{ if(e.target.closest('[data-action]'))return; on=true; ox=e.clientX-el.offsetLeft; oy=e.clientY-el.offsetTop; e.preventDefault(); });
  document.addEventListener('mousemove',e=>{ if(!on)return; el.style.left=Math.max(-el.offsetWidth+80,Math.min(e.clientX-ox,window.innerWidth-80))+'px'; el.style.top=Math.max(0,Math.min(e.clientY-oy,window.innerHeight-72))+'px'; });
  document.addEventListener('mouseup',()=>{on=false;});
}
function resize(el,handle) {
  let sx,sy,sw,sh,on=false;
  handle.addEventListener('mousedown',e=>{ on=true; sx=e.clientX; sy=e.clientY; sw=el.offsetWidth; sh=el.offsetHeight; e.preventDefault(); e.stopPropagation(); });
  document.addEventListener('mousemove',e=>{ if(!on)return; el.style.width=Math.max(260,sw+e.clientX-sx)+'px'; el.style.height=Math.max(180,sh+e.clientY-sy)+'px'; });
  document.addEventListener('mouseup',()=>{on=false;});
}


// ======================================================
// GRAVITY GRID
// ======================================================
(function(){
  const cvs=document.getElementById('gravity-canvas');
  if(!cvs)return;
  const ctx=cvs.getContext('2d');
  let W=0,H=0,mx=0,my=0,entered=false;
  const COLS=42,ROWS=30,R=180;
  function resize(){ W=cvs.width=cvs.offsetWidth; H=cvs.height=cvs.offsetHeight; }
  window.addEventListener('resize',resize); resize();
  const desk=document.getElementById('desktop');
  desk.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;entered=true;});
  desk.addEventListener('mouseleave',()=>{entered=false;});
  desk.addEventListener('touchmove',e=>{const t=e.touches[0];mx=t.clientX;my=t.clientY;entered=true;},{passive:true});
  desk.addEventListener('touchend',()=>{entered=false;});
  function warp(px,py){
    if(!entered)return{x:px,y:py};
    const dx=mx-px,dy=my-py,r=Math.sqrt(dx*dx+dy*dy);
    if(r<0.5)return{x:px,y:py};
    const t=Math.max(0,1-r/R),sm=t*t*(3-2*t);
    const depth=Math.sqrt(Math.max(0,1-(r/R)*(r/R)));
    const f=0.46*sm*depth;
    return{x:px+dx*f,y:py+dy*f};
  }
  function draw(){
    if(!W||!H){requestAnimationFrame(draw);return;}
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(140,0,0,0.12)';ctx.lineWidth=0.8;
    for(let c=0;c<=COLS;c++){
      const xB=c/COLS*W; ctx.beginPath();
      for(let r=0;r<=ROWS;r++){const yB=r/ROWS*H,p=warp(xB,yB);r===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
      ctx.stroke();
    }
    for(let r=0;r<=ROWS;r++){
      const yB=r/ROWS*H; ctx.beginPath();
      for(let c=0;c<=COLS;c++){const xB=c/COLS*W,p=warp(xB,yB);c===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ======================================================
// START MENU
// ======================================================
function toggleStartMenu(e){
  e.stopPropagation();
  document.getElementById('start-menu').classList.toggle('open');
}
document.addEventListener('click',()=>document.getElementById('start-menu').classList.remove('open'));

// ======================================================
// GENERIC WINDOW OPENER
// ======================================================
function openGenWin(id, title, bodyHTML, w, h, onCloseCb){
  const ex=winList.find(wn=>wn.id===id&&!wn.closed);
  if(ex){if(ex.minimized)restore(ex);front(ex);return;}
  const spread=winList.filter(wn=>!wn.closed).length%9;
  const left=60+spread*28,top=22+spread*24;
  const el=document.createElement('div');
  el.className='xp-win active';
  el.innerHTML=`
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">${title}</span>
    </div>
    <div class="xp-body" style="flex:1;overflow:hidden;">${bodyHTML}</div>
    <div class="xp-resize" style="width:20px;height:20px;"></div>`;
  Object.assign(el.style,{position:'absolute',left:left+'px',top:top+'px',width:w+'px',height:h+'px',zIndex:++zTop,minWidth:'260px',minHeight:'180px'});
  winsEl.appendChild(el);
  const tbBtn=document.createElement('div');
  tbBtn.className='tb-btn active';
  tbBtn.innerHTML=`<span>${title}</span>`;
  tbWins.appendChild(tbBtn);
  const win={el,tbBtn,id,closed:false,minimized:false,maxed:false,prevCSS:{}};
  winList.push(win);
  tbBtn.addEventListener('click',()=>{win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win);});
  el.querySelector('[data-action="close"]').addEventListener('click',e=>{e.stopPropagation();closeWin(win);if(onCloseCb)onCloseCb();});
  el.querySelector('[data-action="min"]').addEventListener('click',e=>{e.stopPropagation();minimize(win);});
  el.querySelector('[data-action="max"]').addEventListener('click',e=>{e.stopPropagation();toggleMax(win);});
  // Double-click title bar to maximize/restore
  el.querySelector('.xp-title').addEventListener('dblclick',e=>{if(!e.target.closest('[data-action]'))toggleMax(win);});
  el.addEventListener('mousedown',e=>{if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize'))front(win);});
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
  Object.assign(el.style,{transform:'scale(.88)',opacity:'0',transition:'transform .15s ease,opacity .15s ease'});
  requestAnimationFrame(()=>{Object.assign(el.style,{transform:'scale(1)',opacity:'1'});setTimeout(()=>{el.style.transition='';},160);});
}

// ======================================================
// PODCAST
// ======================================================
const PODCAST_VIDEOS=[
  {id:"wEWf4Knz5UU",title:"Episodio 1"},
  {id:"DHWYwQq3ouM",title:"Episodio 2"},
  {id:"tlald9B-1d8",title:"Episodio 3"},
  {id:"JgOjshcgiVE",title:"Episodio 4"},
  {id:"0lRKsM8jAeA",title:"Episodio 5"},
  {id:"y65CXyo7SJ0",title:"Episodio 6"},
  {id:"uevB73cbQQU",title:"Episodio 7"},
  {id:"btQcXth-P0s",title:"Episodio 8"},
  {id:"1B6cXiSmqjE",title:"Episodio 9"},
  {id:"BeVRKSn5gr0",title:"Episodio 10"},
  {id:"R3Yw5p_ShSU",title:"Episodio 11"},
  {id:"hPYhi6VESa0",title:"Episodio 12"},
  {id:"_8-PLu1T5RI",title:"Episodio 13"},
  {id:"FSOX6HM4iRc",title:"Episodio 14"},
  {id:"li7HFLiPrgg",title:"Episodio 15"},
  {id:"zJRxSScQZ1k",title:"Episodio 16"},
];
const LOGO_B64='images/img-043.png';

function buildPodcastFolder(){
  const desk=document.getElementById('desktop');
  const folder=document.createElement('div');
  folder.id='podcast-folder-icon';
  folder.className='dl-folder-icon';
  folder.innerHTML=`
    <div style="position:relative;width:54px;height:46px;flex-shrink:0;">
      <div style="width:54px;height:46px;background:linear-gradient(145deg,#cc2222,#7a0000);border-radius:0 6px 6px 6px;position:relative;box-shadow:0 3px 10px rgba(180,0,0,0.4);">
        <div style="position:absolute;top:-8px;left:0;width:22px;height:10px;background:linear-gradient(145deg,#dd4444,#aa0000);border-radius:4px 4px 0 0;"></div>
      </div>
      <img src="${LOGO_B64}" style="position:absolute;inset:0;width:54px;height:46px;pointer-events:none;">
    </div>
    <span class="folder-label">Esto No Es Arte</span>`;
  let lastTap=0;
  folder.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTap<400){openPodcastWin();e.preventDefault();}lastTap=now;});
  folder.addEventListener('dblclick',openPodcastWin);
  desk.appendChild(folder);
}

function openPodcastWin(){
  document.getElementById('start-menu').classList.remove('open');
  const body=`<div style="background:#0a0000;height:100%;overflow-y:auto;padding:12px;">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
      ${PODCAST_VIDEOS.map(v=>`<div onclick="openYTPlayer('${v.id}','${v.title}')" style="cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid rgba(200,0,0,0.2);border-radius:6px;overflow:hidden;" onmouseover="this.style.borderColor='rgba(200,0,0,0.5)'" onmouseout="this.style.borderColor='rgba(200,0,0,0.2)'">
          <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" style="width:100%;display:block;" loading="lazy">
          <div style="padding:6px;color:#ccc;font-size:10px;">${v.title}</div></div>`).join('')}
    </div></div>`;
  openGenWin('podcast','🎙 Esto No Es Arte',body,640,480);
}

function openYTPlayer(vid,title){
  if(typeof audioMute==='function')audioMute(true);
  const body=`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="display:block;"></iframe>`;
  openGenWin('yt-'+vid,'▶ '+title,body,560,380,()=>{
    setTimeout(()=>{
      if(typeof audioMute==='function'&&!winList.some(w=>!w.closed&&w.id&&w.id.startsWith('yt-')))
        audioMute(false);
    },150);
  });
}

// ======================================================
// OBRAS GALLERY
// ======================================================
const OBRAS=[
  {src:"images/img-044.jpg",title:"Figura arrodillada I",meta:"Lápiz sobre papel"},
  {src:"images/img-045.jpg",title:"Figura sentada",meta:"Lápiz sobre papel"},
  {src:"images/img-046.jpg",title:"Desnudo rojo I",meta:"Óleo sobre lienzo"},
  {src:"images/img-047.jpg",title:"Desnudo rojo II",meta:"Óleo sobre lienzo"},
];

function buildObrasFolder(){
  const desk=document.getElementById('desktop');
  const folder=document.createElement('div');
  folder.id='obras-folder-icon';
  folder.className='dl-folder-icon';
  folder.innerHTML=`
    <div class="folder-img" style="width:54px;height:46px;background:linear-gradient(145deg,#c07020,#7a4000);border-radius:0 6px 6px 6px;position:relative;box-shadow:0 3px 10px rgba(180,100,0,0.4);">
      <div style="position:absolute;top:-8px;left:0;width:22px;height:10px;background:linear-gradient(145deg,#e09040,#aa6000);border-radius:4px 4px 0 0;"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:20px;padding-top:4px;">🖼</div>
    </div>
    <span class="folder-label">Obras</span>`;
  let lastTap=0;
  folder.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTap<400){openObrasWin();e.preventDefault();}lastTap=now;});
  folder.addEventListener('dblclick',openObrasWin);
  desk.appendChild(folder);
}

let obrasLBIdx=0;

// Open the thumbnail grid
function openObrasWin(){
  document.getElementById('start-menu').classList.remove('open');
  const ex=winList.find(w=>w.id==='obras'&&!w.closed);
  if(ex){if(ex.minimized)restore(ex);front(ex);return;}
  const spread=winList.filter(w=>!w.closed).length%9;
  const left=60+spread*28, top=22+spread*24;
  const el=document.createElement('div'); el.className='xp-win active';
  el.style.cssText=`left:${left}px;top:${top}px;width:620px;height:500px;z-index:${++zTop}`;
  el.innerHTML=`
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">🖼 Obras</span>
    </div>
    <div class="xp-menubar">
      <span class="xp-mi">Archivo</span><span class="xp-mi">Ver</span><span class="xp-mi">Ayuda</span>
    </div>
    <div class="xp-addr">
      <span>Ruta</span>
      <div class="xp-addr-field">~/Obras/</div>
    </div>
    <div class="xp-body" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:16px;overflow-y:auto;align-content:start;justify-content:start;">
      ${OBRAS.map((o,i)=>`
        <div ondblclick="openObraViewer(${i})" onclick="obrasSelectThumb(this)"
          style="cursor:pointer;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px;overflow:hidden;transition:border-color .15s,background .15s;"
          onmouseover="if(!this.classList.contains('obra-selected'))this.style.borderColor='rgba(200,160,80,0.4)'"
          onmouseout="if(!this.classList.contains('obra-selected'))this.style.borderColor='rgba(255,255,255,0.08)'">
          <img src="${o.src}" style="width:100%;height:120px;object-fit:cover;display:block;" draggable="false">
          <div style="padding:6px 8px;">
            <div style="color:#ddd;font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.title}</div>
            <div style="color:#666;font-size:9px;margin-top:2px;">${o.meta}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="xp-status">
      <span class="xp-status-p" id="obras-status">${OBRAS.length} obras</span>
      <span>Doble clic para ver</span>
    </div>
    <div class="xp-resize"></div>`;
  winsEl.appendChild(el);
  const tbBtn=document.createElement('div'); tbBtn.className='tb-btn active';
  tbBtn.innerHTML=`<div class="tb-ico" style="font-size:11px;display:flex;align-items:center;justify-content:center;">🖼</div><span>Obras</span>`;
  tbWins.appendChild(tbBtn);
  const win={el,tbBtn,id:'obras',closed:false,minimized:false,maxed:false,prevCSS:null};
  winList.push(win);
  tbBtn.addEventListener('click',()=>{ win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win); });
  el.querySelector('[data-action="close"]').addEventListener('click',e=>{e.stopPropagation();closeWin(win);});
  el.querySelector('[data-action="min"]').addEventListener('click',e=>{e.stopPropagation();minimize(win);});
  el.querySelector('[data-action="max"]').addEventListener('click',e=>{e.stopPropagation();toggleMax(win);});
  el.querySelector('.xp-title').addEventListener('dblclick',e=>{if(!e.target.closest('[data-action]'))toggleMax(win);});
  el.addEventListener('mousedown',e=>{if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize'))front(win);});
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
  Object.assign(el.style,{transform:'scale(.88)',opacity:'0',transition:'transform .15s ease,opacity .15s ease'});
  requestAnimationFrame(()=>{Object.assign(el.style,{transform:'scale(1)',opacity:'1'});setTimeout(()=>{el.style.transition='';},160);});
}

function obrasSelectThumb(el){
  document.querySelectorAll('.obra-selected').forEach(e=>{
    e.classList.remove('obra-selected');
    e.style.borderColor='rgba(255,255,255,0.08)';
    e.style.background='rgba(255,255,255,0.03)';
  });
  el.classList.add('obra-selected');
  el.style.borderColor='rgba(200,160,80,0.7)';
  el.style.background='rgba(200,160,80,0.08)';
}

// Open individual obra in an OS-style viewer window with zoom/pan
function openObraViewer(i){
  const o=OBRAS[i];
  const winId='obra-'+i;
  const ex=winList.find(w=>w.id===winId&&!w.closed);
  if(ex){if(ex.minimized)restore(ex);front(ex);return;}
  const spread=winList.filter(w=>!w.closed).length%9;
  const left=100+spread*28, top=30+spread*24;
  const el=document.createElement('div'); el.className='xp-win active';
  el.style.cssText=`left:${left}px;top:${top}px;width:560px;height:520px;z-index:${++zTop}`;
  let scale=1, ox=0, oy=0, dragging=false, lx=0, ly=0;
  el.innerHTML=`
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">${o.title}</span>
    </div>
    <div class="xp-menubar">
      <span class="xp-mi" onclick="obraZoomIn(this)">＋ Acercar</span>
      <span class="xp-mi" onclick="obraZoomOut(this)">－ Alejar</span>
      <span class="xp-mi" onclick="obraZoomFit(this)">Ajustar</span>
      <span class="xp-mi" style="margin-left:auto;color:#555;cursor:default;" id="obra-zoom-label-${i}">100%</span>
    </div>
    <div class="xp-addr">
      <span>Ruta</span>
      <div class="xp-addr-field">~/Obras/${o.title}.jpg</div>
    </div>
    <div class="xp-body" id="obra-body-${i}" style="overflow:hidden;cursor:zoom-in;position:relative;">
      <img id="obra-img-${i}" src="${o.src}" draggable="false"
        style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);transform-origin:center;transition:none;max-width:none;user-select:none;">
    </div>
    <div class="xp-status">
      <span class="xp-status-p">${o.title}</span>
      <span>${o.meta}</span>
    </div>
    <div class="xp-resize"></div>`;
  winsEl.appendChild(el);

  const body   = el.querySelector('#obra-body-'+i);
  const img    = el.querySelector('#obra-img-'+i);
  const label  = el.querySelector('#obra-zoom-label-'+i);

  function applyT(){
    img.style.transform=`translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${scale})`;
    body.style.cursor = scale>1 ? 'grab' : 'zoom-in';
    label.textContent = Math.round(scale*100)+'%';
  }
  function clamp(){
    if(scale<=1){ox=0;oy=0;}
  }
  // make zoom funcs accessible via menu spans
  el._zIn  = ()=>{ scale=Math.min(6,scale+0.25); clamp(); applyT(); };
  el._zOut = ()=>{ scale=Math.max(0.25,scale-0.25); clamp(); applyT(); };
  el._zFit = ()=>{ scale=1; ox=0; oy=0; applyT(); };
  // Menu button wiring
  el.querySelector('[onclick="obraZoomIn(this)"]').onclick  = ()=>el._zIn();
  el.querySelector('[onclick="obraZoomOut(this)"]').onclick = ()=>el._zOut();
  el.querySelector('[onclick="obraZoomFit(this)"]').onclick = ()=>el._zFit();

  // Wheel zoom
  body.addEventListener('wheel',e=>{
    e.preventDefault(); e.stopPropagation();
    scale=Math.max(0.25,Math.min(6,scale+(e.deltaY<0?0.15:-0.15)));
    clamp(); applyT();
  },{passive:false});

  // Click-to-zoom (single)
  body.addEventListener('click',e=>{
    if(e.target===img||e.target===body){
      if(scale===1) el._zIn(); else el._zFit();
    }
  });

  // Drag to pan
  body.addEventListener('mousedown',e=>{
    if(scale<=1)return;
    dragging=true; lx=e.clientX; ly=e.clientY;
    body.style.cursor='grabbing'; e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!dragging)return;
    ox+=(e.clientX-lx)/scale; oy+=(e.clientY-ly)/scale;
    lx=e.clientX; ly=e.clientY; applyT();
  });
  document.addEventListener('mouseup',()=>{
    if(dragging){dragging=false; applyT();}
  });

  // Pinch-to-zoom (touch)
  let lDist=0;
  body.addEventListener('touchstart',e=>{
    if(e.touches.length===2) lDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
  },{passive:true});
  body.addEventListener('touchmove',e=>{
    if(e.touches.length===2){
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      if(lDist>0){scale=Math.max(0.25,Math.min(6,scale+(d-lDist)*0.005));clamp();applyT();}
      lDist=d; e.preventDefault();
    }
  },{passive:false});

  const tbBtn=document.createElement('div'); tbBtn.className='tb-btn active';
  tbBtn.innerHTML=`<div class="tb-ico"><img src="${o.src}" draggable="false"></div><span>${o.title}</span>`;
  tbWins.appendChild(tbBtn);
  const win={el,tbBtn,id:winId,closed:false,minimized:false,maxed:false,prevCSS:null};
  winList.push(win);
  tbBtn.addEventListener('click',()=>{ win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win); });
  el.querySelector('[data-action="close"]').addEventListener('click',e=>{e.stopPropagation();closeWin(win);});
  el.querySelector('[data-action="min"]').addEventListener('click',e=>{e.stopPropagation();minimize(win);});
  el.querySelector('[data-action="max"]').addEventListener('click',e=>{e.stopPropagation();toggleMax(win);});
  el.querySelector('.xp-title').addEventListener('dblclick',e=>{if(!e.target.closest('[data-action]'))toggleMax(win);});
  el.addEventListener('mousedown',e=>{if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize'))front(win);});
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
  Object.assign(el.style,{transform:'scale(.88)',opacity:'0',transition:'transform .15s ease,opacity .15s ease'});
  requestAnimationFrame(()=>{Object.assign(el.style,{transform:'scale(1)',opacity:'1'});setTimeout(()=>{el.style.transition='';},160);});
}
function obraZoomIn(btn){}
function obraZoomOut(btn){}
function obraZoomFit(btn){}

// ======================================================
// PENTERACT 5D
// ======================================================
function openPenteract(){
  document.getElementById('start-menu').classList.remove('open');
  const body=`<iframe src="misc/embed-001.html" style="width:100%;height:100%;border:none;display:block;"></iframe>`;
  openGenWin('penteract','⬡ Penteract 5D',body,600,460);
}


// ======================================================
// TAROT
// ======================================================
function buildTarotFolder(){
  const desk=document.getElementById('desktop');
  const folder=document.createElement('div');
  folder.id='tarot-folder-icon';
  folder.className='dl-folder-icon';
  folder.innerHTML=`
    <div class="folder-img" style="width:54px;height:46px;background:linear-gradient(145deg,#3a0060,#1a0030);border-radius:0 6px 6px 6px;position:relative;box-shadow:0 3px 10px rgba(100,0,180,0.4);">
      <div style="position:absolute;top:-8px;left:0;width:22px;height:10px;background:linear-gradient(145deg,#6a20a0,#3a0070);border-radius:4px 4px 0 0;"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:20px;padding-top:4px;">🔮</div>
    </div>
    <span class="folder-label">Tarot</span>`;
  let lastTap=0;
  folder.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTap<400){openTarotWin();e.preventDefault();}lastTap=now;});
  folder.addEventListener('dblclick',openTarotWin);
  desk.appendChild(folder);
}

function openTarotWin(){
  document.getElementById('start-menu').classList.remove('open');
  const ex=winList.find(w=>w.id==='tarot'&&!w.closed);
  if(ex){if(ex.minimized)restore(ex);front(ex);return;}
  const spread=winList.filter(w=>!w.closed).length%9;
  const left=80+spread*28, top=30+spread*24;
  const el=document.createElement('div'); el.className='xp-win active';
  el.style.cssText=`left:${left}px;top:${top}px;width:720px;height:560px;z-index:${++zTop}`;
  el.innerHTML=`
    <div class="xp-title">
      <div class="win-dots">
        <div class="mac-dot red"    data-action="close"></div>
        <div class="mac-dot yellow" data-action="min"></div>
        <div class="mac-dot green"  data-action="max"></div>
      </div>
      <span class="xp-title-txt">🔮 No puedo predecir el futuro, solo el pasado</span>
    </div>
    <div class="xp-menubar">
      <span class="xp-mi">Archivo</span><span class="xp-mi">Ver</span><span class="xp-mi">Ayuda</span>
    </div>
    <div class="xp-addr">
      <span>Ruta</span>
      <div class="xp-addr-field">~/Tarot/tarot.html</div>
    </div>
    <div class="xp-body" style="flex:1;overflow:hidden;padding:0;">
      <iframe src="tarot.html" style="width:100%;height:100%;border:none;display:block;"
        allow="autoplay" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
    <div class="xp-status">
      <span class="xp-status-p">No puedo predecir el futuro, solo el pasado</span>
    </div>
    <div class="xp-resize" style="width:20px;height:20px;"></div>`;
  winsEl.appendChild(el);
  const tbBtn=document.createElement('div'); tbBtn.className='tb-btn active';
  tbBtn.innerHTML=`<div class="tb-ico" style="font-size:11px;display:flex;align-items:center;justify-content:center;">🔮</div><span>Tarot</span>`;
  tbWins.appendChild(tbBtn);
  const win={el,tbBtn,id:'tarot',closed:false,minimized:false,maxed:false,prevCSS:null};
  winList.push(win);
  tbBtn.addEventListener('click',()=>{win.minimized?(restore(win),front(win)):parseInt(el.style.zIndex)===zTop?minimize(win):front(win);});
  el.querySelector('[data-action="close"]').addEventListener('click',e=>{e.stopPropagation();closeWin(win);});
  el.querySelector('[data-action="min"]').addEventListener('click',e=>{e.stopPropagation();minimize(win);});
  el.querySelector('[data-action="max"]').addEventListener('click',e=>{e.stopPropagation();toggleMax(win);});
  el.querySelector('.xp-title').addEventListener('dblclick',e=>{if(!e.target.closest('[data-action]'))toggleMax(win);});
  el.addEventListener('mousedown',e=>{if(!e.target.closest('[data-action]')&&!e.target.closest('.xp-resize'))front(win);});
  drag(el,el.querySelector('.xp-title')); resize(el,el.querySelector('.xp-resize')); front(win);
  Object.assign(el.style,{transform:'scale(.88)',opacity:'0',transition:'transform .15s ease,opacity .15s ease'});
  requestAnimationFrame(()=>{Object.assign(el.style,{transform:'scale(1)',opacity:'1'});setTimeout(()=>{el.style.transition='';},160);});
}
