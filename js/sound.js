const Sound = (() => {
  let ctx;
  let master;
  let musicGain;
  let sfxGain;
  let muted = false;
  let musicTimer = 0;
  let musicStep = 0;
  let unlocked = false;

  function ensure() {
    if (ctx) {
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.045;
    musicGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.28;
    sfxGain.connect(master);
  }

  function unlock() {
    ensure();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    unlocked = true;
    if (!muted) {
      startMusic();
    }
  }

  function now() {
    return ctx.currentTime;
  }

  function envGain(start, peak, attack, hold, release) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + attack);
    g.gain.setValueAtTime(peak, start + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, start + attack + hold + release);
    return g;
  }

  function tone(freq, type, start, dur, peak, dest) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    const g = envGain(start, peak, 0.01, Math.max(0.01, dur - 0.08), 0.08);
    o.connect(g);
    g.connect(dest);
    o.start(start);
    o.stop(start + dur + 0.05);
  }

  function noiseBurst(start, dur, peak, hpFreq, lpFreq) {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = hpFreq;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = lpFreq;
    const g = envGain(start, peak, 0.005, dur * 0.25, dur * 0.7);
    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    g.connect(sfxGain);
    src.start(start);
    src.stop(start + dur);
  }

  function tap() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    tone(880, "triangle", t, 0.08, 0.4, sfxGain);
    tone(1320, "sine", t + 0.02, 0.07, 0.2, sfxGain);
  }

  function pickup() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    tone(392, "sine", t, 0.1, 0.35, sfxGain);
    tone(523, "triangle", t + 0.04, 0.12, 0.25, sfxGain);
  }

  function snap() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    noiseBurst(t, 0.06, 0.35, 400, 1800);
    tone(240, "square", t, 0.05, 0.12, sfxGain);
  }

  function bump() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    tone(90, "sine", t, 0.14, 0.55, sfxGain);
    noiseBurst(t, 0.08, 0.2, 80, 400);
  }

  function drive() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(70, t);
    o.frequency.linearRampToValueAtTime(140, t + 0.9);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(280, t);
    f.frequency.linearRampToValueAtTime(700, t + 0.9);
    const g = envGain(t, 0.22, 0.05, 0.7, 0.35);
    o.connect(f);
    f.connect(g);
    g.connect(sfxGain);
    o.start(t);
    o.stop(t + 1.15);
  }

  function horn() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    tone(392, "square", t, 0.22, 0.22, sfxGain);
    tone(523, "square", t, 0.22, 0.18, sfxGain);
    tone(392, "square", t + 0.28, 0.28, 0.2, sfxGain);
    tone(523, "square", t + 0.28, 0.28, 0.16, sfxGain);
  }

  function win() {
    if (!unlocked || muted) {
      return;
    }
    const t = now();
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      tone(freq, "triangle", t + i * 0.12, 0.28, 0.4, sfxGain);
      tone(freq * 2, "sine", t + i * 0.12, 0.2, 0.12, sfxGain);
    });
    horn();
  }

  const MELODY = [
    392, 523, 659, 523,
    392, 523, 659, 784,
    659, 587, 523, 440,
    392, 523, 392, 0,
  ];

  function startMusic() {
    ensure();
    stopMusic();
    if (muted || !unlocked) {
      return;
    }
    musicStep = 0;
    const beat = 0.28;
    function tick() {
      if (muted || !unlocked) {
        return;
      }
      const t = now();
      const note = MELODY[musicStep % MELODY.length];
      if (note) {
        tone(note, "triangle", t, 0.22, 0.9, musicGain);
        tone(note / 2, "sine", t, 0.22, 0.35, musicGain);
      }
      const bass = musicStep % 8 < 4 ? 196 : 147;
      tone(bass, "sine", t, 0.24, 0.45, musicGain);
      musicStep += 1;
      musicTimer = window.setTimeout(tick, beat * 1000);
    }
    tick();
  }

  function stopMusic() {
    if (musicTimer) {
      window.clearTimeout(musicTimer);
      musicTimer = 0;
    }
  }

  function setMuted(value) {
    muted = value;
    ensure();
    master.gain.setTargetAtTime(muted ? 0.0001 : 0.7, now(), 0.05);
    if (muted) {
      stopMusic();
    } else if (unlocked) {
      startMusic();
    }
  }

  function isMuted() {
    return muted;
  }

  return { unlock, tap, pickup, snap, bump, drive, horn, win, setMuted, isMuted };
})();
