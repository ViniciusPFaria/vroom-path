const Draw = (() => {
  function canvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return { c, ctx: c.getContext("2d") };
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function add(scene, key, c) {
    if (scene.textures.exists(key)) {
      return;
    }
    scene.textures.addCanvas(key, c);
  }

  function truck(cell) {
    const w = cell * 2;
    const h = cell;
    const { c, ctx } = canvas(w, h);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgba(40, 50, 20, 0.22)";
    roundRect(ctx, 8, 14, w - 10, h - 18, 18);
    ctx.fill();

    const wheels = [
      [28, 18],
      [28, h - 18],
      [w - 70, 18],
      [w - 70, h - 18],
    ];
    wheels.forEach(([x, y]) => {
      ctx.fillStyle = "#2b2f33";
      ctx.beginPath();
      ctx.ellipse(x, y, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6d737a";
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#e0a800";
    roundRect(ctx, 18, 20, w - 48, h - 40, 16);
    ctx.fill();
    ctx.fillStyle = "#ffd54f";
    roundRect(ctx, 22, 22, w - 56, h - 50, 14);
    ctx.fill();

    ctx.fillStyle = "#9e9e9e";
    roundRect(ctx, w - 42, 32, 28, h - 64, 6);
    ctx.fill();
    ctx.fillStyle = "#cfd8dc";
    roundRect(ctx, w - 38, 36, 20, h - 72, 4);
    ctx.fill();

    ctx.fillStyle = "#00695c";
    roundRect(ctx, 36, 26, 58, h - 52, 12);
    ctx.fill();
    ctx.fillStyle = "#26a69a";
    roundRect(ctx, 40, 28, 50, h - 62, 10);
    ctx.fill();
    ctx.fillStyle = "#b2ebf2";
    roundRect(ctx, 48, 34, 34, 16, 6);
    ctx.fill();

    ctx.fillStyle = "#ef6c00";
    ctx.beginPath();
    ctx.arc(65, 28, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcc80";
    ctx.beginPath();
    ctx.arc(63, 26, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5d4037";
    ctx.beginPath();
    ctx.arc(92, 48, 5, 0, Math.PI * 2);
    ctx.fill();

    return c;
  }

  function crate(cell, count) {
    const w = cell;
    const h = cell * count;
    const { c, ctx } = canvas(w, h);
    ctx.fillStyle = "rgba(40, 20, 20, 0.22)";
    roundRect(ctx, 8, 10, w - 10, h - 12, 16);
    ctx.fill();
    ctx.fillStyle = "#c62828";
    roundRect(ctx, 6, 6, w - 14, h - 14, 18);
    ctx.fill();
    ctx.fillStyle = "#ef5350";
    roundRect(ctx, 10, 8, w - 22, h - 22, 16);
    ctx.fill();
    ctx.fillStyle = "#ff8a80";
    roundRect(ctx, 16, 12, w - 36, 10, 6);
    ctx.fill();

    const holeH = Math.min(28, (h - 40) / count - 6);
    for (let i = 0; i < count; i++) {
      const y = 28 + i * ((h - 48) / count);
      ctx.fillStyle = "#c62828";
      roundRect(ctx, 22, y, w - 50, holeH, 8);
      ctx.fill();
      ctx.fillStyle = "#b71c1c";
      roundRect(ctx, 26, y + 4, w - 58, holeH - 8, 6);
      ctx.fill();
    }
    return c;
  }

  function plank(cell, count) {
    const w = cell * count;
    const h = cell;
    const { c, ctx } = canvas(w, h);
    ctx.fillStyle = "rgba(60, 30, 10, 0.22)";
    roundRect(ctx, 8, 12, w - 10, h - 16, 16);
    ctx.fill();
    ctx.fillStyle = "#ef6c00";
    roundRect(ctx, 6, 8, w - 14, h - 18, 18);
    ctx.fill();
    ctx.fillStyle = "#ffa726";
    roundRect(ctx, 10, 10, w - 22, h - 26, 16);
    ctx.fill();
    ctx.fillStyle = "#ffcc80";
    roundRect(ctx, 18, 14, w - 38, 8, 5);
    ctx.fill();
    ctx.strokeStyle = "#f57c00";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = 1; i < count; i++) {
      const x = i * cell;
      ctx.beginPath();
      ctx.moveTo(x, 22);
      ctx.lineTo(x, h - 22);
      ctx.stroke();
    }
    return c;
  }

  function pipe(cell, count) {
    const w = cell * count;
    const h = cell;
    const { c, ctx } = canvas(w, h);
    ctx.fillStyle = "rgba(80, 20, 40, 0.2)";
    roundRect(ctx, 8, 16, w - 10, h - 22, h / 2);
    ctx.fill();
    ctx.fillStyle = "#c2185b";
    roundRect(ctx, 4, 14, w - 8, h - 28, h / 2);
    ctx.fill();
    ctx.fillStyle = "#ec407a";
    roundRect(ctx, 8, 16, w - 16, h - 36, h / 2);
    ctx.fill();
    ctx.fillStyle = "#f8bbd0";
    roundRect(ctx, 28, 20, w - 56, 10, 8);
    ctx.fill();

    function cap(x) {
      ctx.fillStyle = "#ad1457";
      ctx.beginPath();
      ctx.ellipse(x, h / 2, 16, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#880e4f";
      ctx.beginPath();
      ctx.ellipse(x, h / 2, 9, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f8bbd0";
      ctx.beginPath();
      ctx.ellipse(x - 2, h / 2 - 4, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    cap(22);
    cap(w - 22);
    return c;
  }

  function tree() {
    const { c, ctx } = canvas(90, 110);
    ctx.fillStyle = "#6d4c41";
    roundRect(ctx, 38, 70, 14, 32, 4);
    ctx.fill();
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.arc(45, 48, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#43a047";
    ctx.beginPath();
    ctx.arc(30, 58, 22, 0, Math.PI * 2);
    ctx.arc(60, 58, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#81c784";
    ctx.beginPath();
    ctx.arc(40, 36, 12, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function bush() {
    const { c, ctx } = canvas(70, 44);
    ctx.fillStyle = "#33691e";
    ctx.beginPath();
    ctx.arc(20, 26, 16, 0, Math.PI * 2);
    ctx.arc(38, 22, 20, 0, Math.PI * 2);
    ctx.arc(54, 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e53935";
    [[18, 22], [34, 16], [50, 24], [40, 30]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    return c;
  }

  function flower() {
    const { c, ctx } = canvas(28, 28);
    ctx.fillStyle = "#fffde7";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(14 + Math.cos(a) * 6, 14 + Math.sin(a) * 6, 5, 3.5, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.arc(14, 14, 4, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function cloud() {
    const { c, ctx } = canvas(180, 90);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(50, 50, 28, 0, Math.PI * 2);
    ctx.arc(90, 40, 36, 0, Math.PI * 2);
    ctx.arc(130, 52, 26, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function star() {
    const { c, ctx } = canvas(48, 48);
    ctx.translate(24, 24);
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 20 : 8;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    return c;
  }

  function button(bg, icon) {
    const { c, ctx } = canvas(88, 88);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.arc(46, 48, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(44, 44, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    icon(ctx);
    return c;
  }

  function resetIcon(ctx) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(44, 44, 14, Math.PI * 0.15, Math.PI * 1.7);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(58, 28);
    ctx.lineTo(66, 44);
    ctx.lineTo(48, 42);
    ctx.fill();
  }

  function musicIcon(ctx) {
    ctx.fillStyle = "#fff";
    roundRect(ctx, 32, 50, 10, 14, 3);
    ctx.fill();
    roundRect(ctx, 50, 46, 10, 18, 3);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(42, 52);
    ctx.lineTo(42, 28);
    ctx.lineTo(60, 24);
    ctx.lineTo(60, 48);
    ctx.stroke();
  }

  function nextIcon(ctx) {
    ctx.beginPath();
    ctx.moveTo(34, 28);
    ctx.lineTo(62, 44);
    ctx.lineTo(34, 60);
    ctx.closePath();
    ctx.fill();
  }

  function muteSlash(ctx) {
    ctx.strokeStyle = "#c62828";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(26, 62);
    ctx.lineTo(62, 26);
    ctx.stroke();
  }

  function hand() {
    const { c, ctx } = canvas(70, 80);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    roundRect(ctx, 22, 36, 28, 36, 12);
    ctx.fill();
    ctx.fillStyle = "#ffe0b2";
    roundRect(ctx, 24, 30, 22, 38, 11);
    ctx.fill();
    roundRect(ctx, 30, 12, 14, 28, 7);
    ctx.fill();
    ctx.fillStyle = "#ffcc80";
    roundRect(ctx, 32, 12, 10, 16, 5);
    ctx.fill();
    return c;
  }

  function world(scene, width, height, board) {
    const { c, ctx } = canvas(width, height);
    const grd = ctx.createLinearGradient(0, 0, 0, height);
    grd.addColorStop(0, "#9ae66e");
    grd.addColorStop(1, "#6fcf4a");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc((i * 97) % width, (i * 53) % height, 40 + (i % 5) * 10, 0, Math.PI * 2);
      ctx.fill();
    }

    const left = board.x - 10;
    const top = board.y - 10;
    const right = board.x + board.w + 10;
    const bottom = board.y + board.h + 10;

    function outside(x, y) {
      return x < left - 20 || x > right + 20 || y < top - 20 || y > bottom + 20;
    }

    const spots = [
      [70, 90], [160, 50], [880, 80], [820, 140],
      [60, 400], [120, 620], [860, 620], [780, 660],
      [200, 680], [40, 240], [920, 540],
    ];
    spots.forEach(([x, y], i) => {
      if (!outside(x, y)) {
        return;
      }
      if (x > right - 40 && y > top + board.h * 0.2 && y < bottom - board.h * 0.25) {
        return;
      }
      const img = i % 3 === 0 ? scene.textures.get("bush").getSourceImage()
        : i % 3 === 1 ? scene.textures.get("tree").getSourceImage()
          : scene.textures.get("flower").getSourceImage();
      ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
    });

    const extraFlowers = [
      [90, 180], [150, 300], [880, 220], [840, 400], [200, 80], [760, 80], [100, 520],
    ];
    extraFlowers.forEach(([x, y]) => {
      if (x > right - 40 && y > top + board.h * 0.2 && y < bottom - board.h * 0.25) {
        return;
      }
      const img = scene.textures.get("flower").getSourceImage();
      ctx.drawImage(img, x, y);
    });

    add(scene, "world", c);
  }

  function register(scene, cell) {
    add(scene, "truck", truck(cell));
    add(scene, "crate2", crate(cell, 2));
    add(scene, "plank2", plank(cell, 2));
    add(scene, "plank3", plank(cell, 3));
    add(scene, "pipe2", pipe(cell, 2));
    add(scene, "pipe3", pipe(cell, 3));
    add(scene, "tree", tree());
    add(scene, "bush", bush());
    add(scene, "flower", flower());
    add(scene, "cloud", cloud());
    add(scene, "star", star());
    add(scene, "hand", hand());
    add(scene, "btn-reset", button("#42a5f5", resetIcon));
    add(scene, "btn-music", button("#7e57c2", musicIcon));
    add(scene, "btn-muted", button("#7e57c2", (ctx) => {
      musicIcon(ctx);
      muteSlash(ctx);
    }));
    add(scene, "btn-next", button("#66bb6a", nextIcon));
  }

  return { register, world, roundRect };
})();
