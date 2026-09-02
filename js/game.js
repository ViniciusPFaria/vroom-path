const GAME_W = 960;
const GAME_H = 720;
const CELL = 96;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
const BOARD_X = Math.round((GAME_W - BOARD_W) / 2);
const BOARD_Y = 118;

class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
  }

  create() {
    Draw.register(this, CELL);
    Draw.world(this, GAME_W, GAME_H, { x: BOARD_X, y: BOARD_Y, w: BOARD_W, h: BOARD_H });

    this.add.image(GAME_W / 2, GAME_H / 2, "world");
    this.add.image(210, 620, "cloud").setAlpha(0.7);
    this.add.image(760, 80, "cloud").setScale(0.7).setAlpha(0.55);

    this.drawBoard();
    this.drawFence();

    this.levelIndex = 0;
    this.locked = false;
    this.pieces = [];
    this.hint = null;
    this.fxSprites = [];

    this.titleText = this.add.text(GAME_W / 2, 36, "VROOM PATH", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "40px",
      color: "#1b5e20",
    }).setOrigin(0.5, 0).setStroke("#e8f5e9", 8);

    this.levelText = this.add.text(GAME_W / 2, 78, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#2e7d32",
    }).setOrigin(0.5, 0);

    this.resetBtn = this.add.image(GAME_W - 70, 58, "btn-reset").setInteractive({ useHandCursor: true });
    this.musicBtn = this.add.image(70, 58, "btn-music").setInteractive({ useHandCursor: true });
    this.resetBtn.on("pointerdown", () => {
      Sound.unlock();
      Sound.tap();
      if (!this.locked) {
        this.loadLevel(this.levelIndex);
      }
    });
    this.musicBtn.on("pointerdown", () => {
      Sound.unlock();
      Sound.setMuted(!Sound.isMuted());
      this.musicBtn.setTexture(Sound.isMuted() ? "btn-muted" : "btn-music");
      Sound.tap();
    });

    this.winLayer = this.add.container(GAME_W / 2, GAME_H / 2).setDepth(20).setVisible(false);
    const winBg = this.add.rectangle(0, 0, 460, 280, 0xfff8e1, 0.94).setStrokeStyle(8, 0xffd54f);
    this.winTitle = this.add.text(0, -70, "YAY!", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "72px",
      color: "#ef6c00",
    }).setOrigin(0.5);
    this.winSub = this.add.text(0, 10, "The truck is free!", {
      fontFamily: "Arial, sans-serif",
      fontSize: "26px",
      color: "#5d4037",
    }).setOrigin(0.5);
    this.nextBtn = this.add.image(0, 90, "btn-next").setInteractive({ useHandCursor: true });
    this.nextBtn.on("pointerdown", () => {
      Sound.unlock();
      Sound.tap();
      this.winLayer.setVisible(false);
      this.levelIndex = (this.levelIndex + 1) % LEVELS.length;
      this.loadLevel(this.levelIndex);
    });
    this.winLayer.add([winBg, this.winTitle, this.winSub, this.nextBtn]);

    this.input.on("pointerdown", () => Sound.unlock());
    this.input.on("dragstart", (_p, obj) => this.onDragStart(obj));
    this.input.on("drag", (_p, obj, x, y) => this.onDrag(obj, x, y));
    this.input.on("dragend", (_p, obj) => this.onDragEnd(obj));

    this.loadLevel(0);
  }

  drawBoard() {
    const g = this.add.graphics();
    g.fillStyle(0xd7c48a, 1);
    g.fillRoundedRect(BOARD_X - 10, BOARD_Y - 10, BOARD_W + 20, BOARD_H + 20, 18);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const light = (r + c) % 2 === 0;
        g.fillStyle(light ? 0xf3e6b8 : 0xe8d59a, 1);
        g.fillRoundedRect(BOARD_X + c * CELL + 4, BOARD_Y + r * CELL + 4, CELL - 8, CELL - 8, 10);
      }
    }
    g.fillStyle(0xfff176, 0.35);
    g.fillRoundedRect(BOARD_X + 4, BOARD_Y + EXIT_ROW * CELL + 4, BOARD_W - 8, CELL - 8, 10);
  }

  drawFence() {
    const g = this.add.graphics();
    const color = 0x42a5f5;
    const dark = 0x1e88e5;
    const post = (x, y, w, h) => {
      g.fillStyle(dark, 1);
      g.fillRoundedRect(x + 2, y + 3, w, h, 4);
      g.fillStyle(color, 1);
      g.fillRoundedRect(x, y, w, h, 4);
    };

    const left = BOARD_X - 22;
    const top = BOARD_Y - 22;
    const right = BOARD_X + BOARD_W + 8;
    const bottom = BOARD_Y + BOARD_H + 8;

    for (let x = left; x < right; x += 16) {
      post(x, top, 10, 22);
      post(x, bottom, 10, 22);
    }
    for (let y = top; y < bottom; y += 16) {
      post(left, y, 10, 22);
      const exitTop = BOARD_Y + EXIT_ROW * CELL - 6;
      const exitBot = BOARD_Y + (EXIT_ROW + 1) * CELL + 6;
      if (y > exitTop && y < exitBot) {
        continue;
      }
      post(right, y, 10, 22);
    }

    g.fillStyle(0x81d4fa, 1);
    g.fillTriangle(right + 28, BOARD_Y + EXIT_ROW * CELL + CELL / 2, right + 4, BOARD_Y + EXIT_ROW * CELL + 18, right + 4, BOARD_Y + EXIT_ROW * CELL + CELL - 18);
    this.add.text(right + 36, BOARD_Y + EXIT_ROW * CELL + CELL / 2, "GO", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "18px",
      color: "#0d47a1",
    }).setOrigin(0, 0.5);
  }

  cellToX(col, w) {
    return BOARD_X + (col + w / 2) * CELL;
  }

  cellToY(row, h) {
    return BOARD_Y + (row + h / 2) * CELL;
  }

  textureFor(piece) {
    if (piece.isTruck) {
      return "truck";
    }
    if (piece.axis === "v") {
      return "crate2";
    }
    if (piece.kind === "pipe") {
      return piece.w >= 3 ? "pipe3" : "pipe2";
    }
    return piece.w >= 3 ? "plank3" : "plank2";
  }

  loadLevel(index) {
    this.pieces.forEach((p) => p.sprite.destroy());
    this.fxSprites.forEach((s) => s.destroy());
    this.fxSprites = [];
    if (this.hint) {
      this.hint.destroy();
      this.hint = null;
    }
    this.tweens.killAll();
    this.time.removeAllEvents();
    this.winLayer.setVisible(false);
    this.locked = false;
    this.levelIndex = index;
    this.levelText.setText("Puzzle " + (index + 1));

    const data = LEVELS[index];
    this.pieces = [];

    const truck = {
      id: "truck",
      col: data.truck.c,
      row: data.truck.r,
      w: 2,
      h: 1,
      axis: "h",
      isTruck: true,
    };
    this.pieces.push(truck);

    data.pieces.forEach((raw, i) => {
      this.pieces.push({
        id: "p" + i,
        col: raw.c,
        row: raw.r,
        w: raw.w,
        h: raw.h,
        axis: raw.w > raw.h ? "h" : "v",
        kind: raw.kind || (raw.w >= 3 ? "pipe" : raw.h > 1 ? "crate" : "plank"),
        isTruck: false,
      });
    });

    this.pieces.forEach((p) => {
      const sprite = this.add.image(this.cellToX(p.col, p.w), this.cellToY(p.row, p.h), this.textureFor(p));
      sprite.setData("piece", p);
      sprite.setInteractive({ useHandCursor: true, pixelPerfect: false });
      this.input.setDraggable(sprite);
      sprite.setDepth(p.isTruck ? 6 : 5);
      p.sprite = sprite;
    });

    if (index === 0) {
      const blocker = this.pieces.find((p) => !p.isTruck);
      this.hint = this.add.image(blocker.sprite.x + 36, blocker.sprite.y + 10, "hand").setDepth(12);
      this.tweens.add({
        targets: this.hint,
        y: this.hint.y + 18,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }
  }

  occupancy(ignore) {
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.pieces.forEach((p) => {
      if (p === ignore) {
        return;
      }
      for (let r = p.row; r < p.row + p.h; r++) {
        for (let c = p.col; c < p.col + p.w; c++) {
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            grid[r][c] = p.id;
          }
        }
      }
    });
    return grid;
  }

  canPlace(p, col, row, grid) {
    for (let r = row; r < row + p.h; r++) {
      for (let c = col; c < col + p.w; c++) {
        if (r < 0 || r >= ROWS) {
          return false;
        }
        if (c < 0) {
          return false;
        }
        if (c >= COLS) {
          return p.isTruck && r === EXIT_ROW && col <= COLS;
        }
        if (grid[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  slideLimits(p) {
    const grid = this.occupancy(p);
    if (p.axis === "h") {
      let min = p.col;
      while (this.canPlace(p, min - 1, p.row, grid)) {
        min -= 1;
      }
      let max = p.col;
      while (this.canPlace(p, max + 1, p.row, grid)) {
        max += 1;
      }
      return { minCol: min, maxCol: max, minRow: p.row, maxRow: p.row };
    }
    let min = p.row;
    while (this.canPlace(p, p.col, min - 1, grid)) {
      min -= 1;
    }
    let max = p.row;
    while (this.canPlace(p, p.col, max + 1, grid)) {
      max += 1;
    }
    return { minCol: p.col, maxCol: p.col, minRow: min, maxRow: max };
  }

  onDragStart(obj) {
    const p = obj.getData("piece");
    if (this.locked) {
      obj.x = this.cellToX(p.col, p.w);
      obj.y = this.cellToY(p.row, p.h);
      return;
    }
    p.limits = this.slideLimits(p);
    p.startCol = p.col;
    p.startRow = p.row;
    p.bumped = false;
    obj.setDepth(10);
    obj.setScale(1.04);
    Sound.pickup();
    if (this.hint) {
      this.hint.destroy();
      this.hint = null;
    }
  }

  onDrag(obj, dragX, dragY) {
    const p = obj.getData("piece");
    if (this.locked) {
      obj.x = this.cellToX(p.col, p.w);
      obj.y = this.cellToY(p.row, p.h);
      return;
    }
    const lim = p.limits;
    if (p.axis === "h") {
      const minX = this.cellToX(lim.minCol, p.w);
      const maxX = this.cellToX(lim.maxCol, p.w);
      const next = Phaser.Math.Clamp(dragX, minX, maxX);
      if ((dragX < minX - 8 || dragX > maxX + 8) && !p.bumped) {
        p.bumped = true;
        Sound.bump();
        this.tweens.add({ targets: obj, x: next + (dragX < minX ? -6 : 6), duration: 50, yoyo: true });
      }
      obj.x = next;
      obj.y = this.cellToY(p.row, p.h);
    } else {
      const minY = this.cellToY(lim.minRow, p.h);
      const maxY = this.cellToY(lim.maxRow, p.h);
      const next = Phaser.Math.Clamp(dragY, minY, maxY);
      if ((dragY < minY - 8 || dragY > maxY + 8) && !p.bumped) {
        p.bumped = true;
        Sound.bump();
        this.tweens.add({ targets: obj, y: next + (dragY < minY ? -6 : 6), duration: 50, yoyo: true });
      }
      obj.y = next;
      obj.x = this.cellToX(p.col, p.w);
    }
  }

  onDragEnd(obj) {
    const p = obj.getData("piece");
    if (this.locked) {
      obj.x = this.cellToX(p.col, p.w);
      obj.y = this.cellToY(p.row, p.h);
      return;
    }
    obj.setScale(1);
    obj.setDepth(p.isTruck ? 6 : 5);

    if (p.axis === "h") {
      const col = Math.round((obj.x - BOARD_X) / CELL - p.w / 2);
      p.col = Phaser.Math.Clamp(col, p.limits.minCol, p.limits.maxCol);
    } else {
      const row = Math.round((obj.y - BOARD_Y) / CELL - p.h / 2);
      p.row = Phaser.Math.Clamp(row, p.limits.minRow, p.limits.maxRow);
    }

    this.tweens.add({
      targets: obj,
      x: this.cellToX(p.col, p.w),
      y: this.cellToY(p.row, p.h),
      duration: 80,
      ease: "Sine.out",
    });
    Sound.snap();

    if (p.isTruck && p.col + p.w > COLS) {
      this.celebrate();
      return;
    }
    this.time.delayedCall(90, () => this.checkWin());
  }

  pathClear() {
    const truck = this.pieces.find((p) => p.isTruck);
    const grid = this.occupancy(truck);
    for (let c = truck.col + truck.w; c < COLS; c++) {
      if (grid[truck.row][c]) {
        return false;
      }
    }
    return true;
  }

  checkWin() {
    if (this.locked || !this.pathClear()) {
      return;
    }
    this.locked = true;
    const truck = this.pieces.find((p) => p.isTruck);
    Sound.horn();
    Sound.drive();
    this.tweens.add({
      targets: truck.sprite,
      x: BOARD_X + BOARD_W + 160,
      duration: 900,
      ease: "Cubic.in",
      onComplete: () => this.celebrate(),
    });
  }

  celebrate() {
    this.locked = true;
    Sound.win();
    for (let i = 0; i < 18; i++) {
      const star = this.add.image(GAME_W / 2, GAME_H / 2, "star").setDepth(19).setScale(0.4);
      this.fxSprites.push(star);
      this.tweens.add({
        targets: star,
        x: GAME_W / 2 + Phaser.Math.Between(-280, 280),
        y: GAME_H / 2 + Phaser.Math.Between(-200, 200),
        rotation: Phaser.Math.Between(-3, 3),
        scale: 0.1,
        alpha: 0,
        duration: 900,
        delay: i * 20,
        onComplete: () => star.destroy(),
      });
    }
    this.winTitle.setText(this.levelIndex === LEVELS.length - 1 ? "ALL DONE!" : "YAY!");
    this.winSub.setText(this.levelIndex === LEVELS.length - 1 ? "More puzzles next time!" : "The truck is free!");
    this.winLayer.setVisible(true);
    this.winLayer.setScale(0.7);
    this.tweens.add({ targets: this.winLayer, scale: 1, duration: 280, ease: "Back.out" });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_W,
  height: GAME_H,
  backgroundColor: "#6fcf4a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: MainScene,
  input: { activePointers: 3 },
});
