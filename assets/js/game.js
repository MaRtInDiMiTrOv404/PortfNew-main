// =============================================
//  SUPER MARTIN - 2D Platformer
//  Pixel-art sprites drawn on offscreen canvas
// =============================================

(function() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ---- PIXEL ART SPRITE BUILDER ----
  function makeSprite(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const cx = c.getContext('2d');
    cx.imageSmoothingEnabled = false;
    drawFn(cx, w, h);
    return c;
  }

  function px(cx, x, y, color) {
    cx.fillStyle = color;
    cx.fillRect(x, y, 1, 1);
  }

  // ---- SPRITE SHEETS ----

  // Player sprite sheet: 4 walk frames + 1 jump frame, each 16x24
  const PLAYER_W = 16, PLAYER_H = 24;
  const playerSheet = makeSprite(PLAYER_W * 5, PLAYER_H, (cx) => {
    const skin = '#F4C48B', hair = '#4A2C0A', shirt = '#E63946', pants = '#264653', shoe = '#1D1D1B', eye = '#1D1D1B';
    // frames 0-3 walk, frame 4 jump
    for (let f = 0; f < 5; f++) {
      const ox = f * PLAYER_W;
      const isJump = f === 4;
      // Hair / hat
      for (let i = 2; i < 14; i++) { px(cx, ox+i, 0, hair); px(cx, ox+i, 1, hair); }
      // Face
      for (let i = 2; i < 14; i++) for (let j = 2; j < 8; j++) px(cx, ox+i, j, skin);
      px(cx, ox+4, 3, eye); px(cx, ox+11, 3, eye);
      // Nose
      px(cx, ox+7, 5, '#D4916B'); px(cx, ox+8, 5, '#D4916B');
      // Shirt
      for (let i = 2; i < 14; i++) for (let j = 8; j < 16; j++) px(cx, ox+i, j, shirt);
      // Arms
      for (let j = 8; j < 14; j++) { px(cx, ox+0, j, shirt); px(cx, ox+1, j, shirt); px(cx, ox+14, j, shirt); px(cx, ox+15, j, shirt); }
      px(cx, ox+0, 14, skin); px(cx, ox+1, 14, skin); px(cx, ox+14, 14, skin); px(cx, ox+15, 14, skin);
      // Pants
      for (let i = 2; i < 14; i++) for (let j = 16; j < 20; j++) px(cx, ox+i, j, pants);
      // Legs walk animation
      if (!isJump) {
        const legOff = [0, 2, 0, -2][f] || 0;
        for (let j = 20; j < 24; j++) {
          px(cx, ox+2, j + (legOff > 0 ? 0 : 0), shoe);
          px(cx, ox+3, j, shoe);
          px(cx, ox+4, j, shoe);
          px(cx, ox+11, j, shoe);
          px(cx, ox+12, j, shoe);
          px(cx, ox+13, j, shoe);
        }
        if (legOff > 0) { for (let j = 19; j < 22; j++) { px(cx, ox+2, j, shoe); px(cx, ox+3, j, shoe); } }
        if (legOff < 0) { for (let j = 19; j < 22; j++) { px(cx, ox+11, j, shoe); px(cx, ox+12, j, shoe); } }
      } else {
        for (let j = 18; j < 24; j++) {
          px(cx, ox+1, j, shoe); px(cx, ox+2, j, shoe); px(cx, ox+3, j, shoe);
          px(cx, ox+12, j, shoe); px(cx, ox+13, j, shoe); px(cx, ox+14, j, shoe);
        }
      }
    }
  });

  // Coin sprite: 8x8, 4 frames spin
  const COIN_SIZE = 16;
  const coinSheet = makeSprite(COIN_SIZE * 4, COIN_SIZE, (cx) => {
    const gold = '#FFD700', shine = '#FFF7A0', dark = '#B8860B';
    const frames = [
      [[1,6],[1,6]],[[2,5],[2,5]],[[3,4],[3,4]],[[4,4],[3,4]]
    ];
    for (let f = 0; f < 4; f++) {
      const ox = f * COIN_SIZE;
      const w = [12, 8, 4, 2][f];
      const startX = ox + (COIN_SIZE - w) / 2;
      for (let j = 2; j < 14; j++) {
        for (let i = startX; i < startX + w; i++) {
          cx.fillStyle = (i === startX || j === 2 || j === 13) ? dark : (i === startX+1 ? shine : gold);
          cx.fillRect(i, j, 1, 1);
        }
      }
    }
  });

  // Ground tile: 16x16
  const TILE = 32;
  const groundTile = makeSprite(TILE, TILE, (cx) => {
    // Top grass
    cx.fillStyle = '#4CAF50';
    cx.fillRect(0, 0, TILE, 8);
    cx.fillStyle = '#388E3C';
    cx.fillRect(0, 6, TILE, 4);
    // Dirt
    cx.fillStyle = '#8B5E3C';
    cx.fillRect(0, 8, TILE, TILE - 8);
    // Dirt texture
    cx.fillStyle = '#7A4F2F';
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      cx.fillRect(4 + i*10, 12 + j*10, 4, 4);
    }
    // Grass detail
    cx.fillStyle = '#66BB6A';
    for (let i = 2; i < TILE; i += 5) { cx.fillRect(i, 0, 2, 3); }
  });

  // Brick tile: 16x16
  const brickTile = makeSprite(TILE, TILE, (cx) => {
    cx.fillStyle = '#C0522B';
    cx.fillRect(0, 0, TILE, TILE);
    cx.fillStyle = '#A0421B';
    // Mortar
    cx.fillRect(0, TILE/2-1, TILE, 2);
    cx.fillRect(0, TILE-2, TILE, 2);
    for (let i = 0; i < 4; i++) {
      const xOff = i % 2 === 0 ? 0 : TILE/2;
      cx.fillRect(xOff, i < 2 ? 0 : TILE/2, 2, TILE/2);
    }
    cx.fillStyle = '#D4633A';
    cx.fillRect(2, 2, TILE/2-3, TILE/2-3);
    cx.fillRect(TILE/2+2, 2, TILE/2-4, TILE/2-3);
    cx.fillRect(4, TILE/2+2, TILE/2-5, TILE/2-3);
    cx.fillRect(TILE/2, TILE/2+2, TILE/2-2, TILE/2-3);
  });

  // Question block: 16x16
  const qBlock = makeSprite(TILE, TILE, (cx) => {
    cx.fillStyle = '#F5A623';
    cx.fillRect(0, 0, TILE, TILE);
    cx.fillStyle = '#D4860F';
    cx.fillRect(0, TILE-3, TILE, 3); cx.fillRect(TILE-3, 0, 3, TILE);
    cx.fillStyle = '#FFC947';
    cx.fillRect(0, 0, 3, 3);
    ctx.fillStyle = '#fff';
    // Draw "?"
    cx.fillStyle = '#fff';
    cx.font = `bold ${TILE*0.7}px monospace`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('?', TILE/2, TILE/2+1);
  });

  // Used block
  const usedBlock = makeSprite(TILE, TILE, (cx) => {
    cx.fillStyle = '#8B6914';
    cx.fillRect(0, 0, TILE, TILE);
    cx.fillStyle = '#6B4F10';
    cx.fillRect(0, TILE-3, TILE, 3); cx.fillRect(TILE-3, 0, 3, TILE);
  });

  // Pipe: 32x48
  const pipeSprite = makeSprite(48, 64, (cx) => {
    // Pipe head
    cx.fillStyle = '#2E7D32';
    cx.fillRect(0, 0, 48, 16);
    cx.fillStyle = '#1B5E20';
    cx.fillRect(0, 12, 48, 4);
    cx.fillStyle = '#43A047';
    cx.fillRect(2, 2, 8, 10);
    // Pipe body
    cx.fillStyle = '#388E3C';
    cx.fillRect(4, 16, 40, 48);
    cx.fillStyle = '#2E7D32';
    cx.fillRect(4, 16, 6, 48);
    cx.fillStyle = '#43A047';
    cx.fillRect(8, 18, 4, 44);
    cx.fillStyle = '#1B5E20';
    cx.fillRect(40, 16, 4, 48);
  });

  // Goomba: 24x24, 2 walk frames
  const goombaTile = makeSprite(32*2, 32, (cx) => {
    const brown = '#7B3F00', dark = '#3E1F00', tan = '#C68642', red = '#CC0000';
    for (let f = 0; f < 2; f++) {
      const ox = f * 32;
      // Body
      for (let i = 4; i < 28; i++) for (let j = 8; j < 28; j++) {
        cx.fillStyle = (i < 7 || i > 24 || j > 24) ? dark : brown;
        cx.fillRect(ox+i, j, 1, 1);
      }
      // Head
      for (let i = 2; i < 30; i++) for (let j = 0; j < 12; j++) {
        cx.fillStyle = (j < 2 || i < 3 || i > 28) ? dark : brown;
        cx.fillRect(ox+i, j, 1, 1);
      }
      // Eyes
      cx.fillStyle = '#fff';
      cx.fillRect(ox+6, 3, 6, 5); cx.fillRect(ox+19, 3, 6, 5);
      cx.fillStyle = red;
      cx.fillRect(ox+8, 4, 3, 3); cx.fillRect(ox+20, 4, 3, 3);
      cx.fillStyle = dark;
      cx.fillRect(ox+9, 5, 2, 2); cx.fillRect(ox+21, 5, 2, 2);
      // Eyebrows (angry)
      cx.fillStyle = dark;
      cx.fillRect(ox+5, 2, 8, 2); cx.fillRect(ox+18, 2, 8, 2);
      // Feet
      const fOff = f === 0 ? 0 : 3;
      cx.fillStyle = dark;
      cx.fillRect(ox+4, 27, 10, 5); cx.fillRect(ox+18+fOff, 27, 10, 5);
    }
  });

  // Flag pole
  const flagSprite = makeSprite(16, 200, (cx) => {
    cx.fillStyle = '#888';
    cx.fillRect(6, 0, 4, 200);
    cx.fillStyle = '#27ae60';
    cx.fillRect(2, 0, 14, 20);
    cx.fillRect(2, 0, 2, 30);
  });

  // Cloud sprite
  const cloudSprite = makeSprite(80, 40, (cx) => {
    cx.fillStyle = 'rgba(255,255,255,0.9)';
    cx.beginPath();
    cx.ellipse(30, 30, 30, 18, 0, 0, Math.PI*2);
    cx.ellipse(55, 30, 22, 14, 0, 0, Math.PI*2);
    cx.ellipse(15, 32, 16, 12, 0, 0, Math.PI*2);
    cx.fill();
    cx.fillStyle = 'rgba(255,255,255,0.6)';
    cx.beginPath();
    cx.ellipse(30, 18, 22, 18, 0, 0, Math.PI*2);
    cx.fill();
  });

  // Mountain sprite
  const mountainSprite = makeSprite(120, 80, (cx) => {
    cx.fillStyle = '#7E57C2';
    cx.beginPath(); cx.moveTo(0, 80); cx.lineTo(60, 0); cx.lineTo(120, 80); cx.closePath(); cx.fill();
    cx.fillStyle = '#9575CD';
    cx.beginPath(); cx.moveTo(20, 80); cx.lineTo(60, 5); cx.lineTo(100, 80); cx.closePath(); cx.fill();
    cx.fillStyle = '#fff';
    cx.beginPath(); cx.moveTo(45, 15); cx.lineTo(60, 0); cx.lineTo(75, 15); cx.lineTo(60, 20); cx.closePath(); cx.fill();
  });

  // =============================================
  // GAME STATE
  // =============================================
  const GRAVITY = 0.5;
  const JUMP_FORCE = -13;
  const MOVE_SPEED = 4;
  const CANVAS_H = canvas.height;
  const CANVAS_W = canvas.width;
  const GROUND_Y = CANVAS_H - TILE;

  // World width in pixels
  const WORLD_W = 6400;

  let gameState = 'start'; // start, playing, dead, win, gameover
  let score = 0;
  let lives = 3;
  let camera = { x: 0 };

  const keys = {};
  let touchLeft = false, touchRight = false, touchJump = false;

  // Player
  let player = {};
  function resetPlayer() {
    player = {
      x: 80, y: GROUND_Y - PLAYER_H,
      vx: 0, vy: 0,
      onGround: false,
      frame: 0, frameTimer: 0,
      facing: 1, // 1=right, -1=left
      dead: false,
      invincible: 0,
    };
  }
  resetPlayer();

  // ---- LEVEL DESIGN ----
  // platforms: {x, y, w, type: 'ground'|'brick'|'question'|'used'}
  // coins, enemies, pipes

  function buildLevel() {
    const P = TILE;
    const platforms = [];
    const coins = [];
    const enemies = [];
    const pipes = [];
    const decorations = [];

    // Helper: add ground row
    function ground(startX, endX, y) {
      for (let x = startX; x < endX; x += P) {
        platforms.push({ x, y, w: P, h: P, type: 'ground' });
      }
    }
    function bricks(startX, endX, y) {
      for (let x = startX; x < endX; x += P) {
        platforms.push({ x, y, w: P, h: P, type: 'brick' });
      }
    }
    function qblock(x, y, hasCoin = true) {
      platforms.push({ x, y, w: P, h: P, type: 'question', hasCoin, activated: false });
    }
    function coinRow(startX, endX, y) {
      for (let x = startX; x < endX; x += P) {
        coins.push({ x: x+P/2, y, collected: false, frame: 0, frameTimer: 0 });
      }
    }
    function goomba(x) {
      enemies.push({ x, y: GROUND_Y - 32, vx: -1.2, vy: 0, onGround: true, dead: false, frame: 0, frameTimer: 0, deadTimer: 0 });
    }
    function pipe(x, h) {
      pipes.push({ x, y: GROUND_Y - h, w: 48, h });
    }

    // Main ground
    ground(0, 1280, GROUND_Y);
    // Gap
    ground(1376, 2048, GROUND_Y);
    // Small gap then continue
    ground(2144, 3200, GROUND_Y);
    // Wider gap
    ground(3360, 4480, GROUND_Y);
    // Final run
    ground(4576, WORLD_W, GROUND_Y);

    // Stepping stones over gap 1
    platforms.push({ x: 1280, y: GROUND_Y - P, w: P*3, h: P, type: 'ground' });
    platforms.push({ x: 1312+P, y: GROUND_Y - P*2, w: P*2, h: P, type: 'ground' });

    // Platforms above
    bricks(200, 200+P*5, GROUND_Y - P*5);
    bricks(480, 480+P*3, GROUND_Y - P*4);
    bricks(700, 700+P*4, GROUND_Y - P*6);

    // Question blocks zone 1
    qblock(256, GROUND_Y - P*5);
    qblock(320, GROUND_Y - P*5);
    qblock(384, GROUND_Y - P*5);
    qblock(448, GROUND_Y - P*8);

    // Coins
    coinRow(160, 160+P*6, GROUND_Y - P*3);
    coinRow(700, 700+P*5, GROUND_Y - P*3);

    // Pipes
    pipe(600, 64);
    pipe(900, 80);
    pipe(1100, 96);

    // Zone 2 platforms
    bricks(1500, 1500+P*6, GROUND_Y - P*4);
    qblock(1600, GROUND_Y - P*4);
    qblock(1664, GROUND_Y - P*4, false);
    qblock(1728, GROUND_Y - P*4);
    bricks(1800, 1800+P*4, GROUND_Y - P*7);
    coinRow(1820, 1820+P*3, GROUND_Y - P*9);
    pipe(2000, 80);

    // Staircase zone
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j <= i; j++) {
        platforms.push({ x: 2200 + i*P, y: GROUND_Y - P*(j+1), w: P, h: P, type: 'ground' });
      }
    }
    // Down staircase
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6-i; j++) {
        platforms.push({ x: 2400 + i*P, y: GROUND_Y - P*(j+1), w: P, h: P, type: 'ground' });
      }
    }

    // Zone 3 - elevated platforms
    bricks(2600, 2600+P*3, GROUND_Y - P*5);
    bricks(2720, 2720+P*3, GROUND_Y - P*7);
    bricks(2840, 2840+P*3, GROUND_Y - P*5);
    qblock(2656, GROUND_Y - P*5);
    qblock(2784, GROUND_Y - P*7);
    coinRow(2600, 2600+P*8, GROUND_Y - P*3);

    // Pipes zone 3
    pipe(2900, 64);
    pipe(3050, 96);
    pipe(3150, 112);

    // Zone 4 - long platforms
    bricks(3400, 3400+P*10, GROUND_Y - P*4);
    coinRow(3408, 3408+P*9, GROUND_Y - P*6);
    for (let i = 0; i < 5; i++) qblock(3424 + i*P*2, GROUND_Y - P*4);
    bricks(3600, 3600+P*6, GROUND_Y - P*8);
    coinRow(3608, 3608+P*5, GROUND_Y - P*10);

    // Zone 5 - final gauntlet
    bricks(4600, 4600+P*4, GROUND_Y - P*5);
    bricks(4700, 4700+P*4, GROUND_Y - P*8);
    bricks(4800, 4800+P*4, GROUND_Y - P*5);
    qblock(4640, GROUND_Y - P*5);
    qblock(4740, GROUND_Y - P*8);
    coinRow(4600, 4600+P*15, GROUND_Y - P*3);

    // Enemies scattered
    goomba(350);
    goomba(550);
    goomba(800);
    goomba(1050);
    goomba(1550);
    goomba(1700);
    goomba(1900);
    goomba(2250);
    goomba(2650);
    goomba(2800);
    goomba(3000);
    goomba(3100);
    goomba(3450);
    goomba(3650);
    goomba(3800);
    goomba(4000);
    goomba(4200);
    goomba(4650);
    goomba(4800);
    goomba(5000);
    goomba(5200);
    goomba(5500);

    // Final flag area - stairs then castle
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j <= i; j++) {
        platforms.push({ x: 5800 + i*P, y: GROUND_Y - P*(j+1), w: P, h: P, type: 'ground' });
      }
    }

    // Decorations (clouds, mountains)
    for (let x = 200; x < WORLD_W; x += 400 + Math.sin(x)*100) {
      decorations.push({ type: 'cloud', x, y: 30 + Math.random()*60 });
    }
    for (let x = 100; x < WORLD_W; x += 500) {
      decorations.push({ type: 'mountain', x: x + (x%200), y: GROUND_Y - 80 });
    }

    // Flag
    const flagX = WORLD_W - 200;
    return { platforms, coins, enemies, pipes, decorations, flagX,
      flagY: GROUND_Y - 200, flag: { collected: false } };
  }

  let level = buildLevel();

  // ---- UPDATE SCORE UI ----
  function updateUI() {
    const el = document.getElementById('score-display');
    const el2 = document.getElementById('lives-display');
    const el3 = document.getElementById('coins-display');
    if (el) el.textContent = score;
    if (el2) el2.textContent = lives;
    if (el3) el3.textContent = coinsCollected;
  }
  let coinsCollected = 0;

  // ---- COLLISION ----
  function rectOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
  }

  function resolvePlayerPlatform(p, plat) {
    const pw = PLAYER_W, ph = PLAYER_H;
    if (!rectOverlap(p.x, p.y, pw, ph, plat.x, plat.y, plat.w, plat.h)) return false;
    const overlapX = Math.min(p.x+pw, plat.x+plat.w) - Math.max(p.x, plat.x);
    const overlapY = Math.min(p.y+ph, plat.y+plat.h) - Math.max(p.y, plat.y);
    if (overlapX < overlapY) {
      if (p.x < plat.x) p.x = plat.x - pw; else p.x = plat.x + plat.w;
      p.vx = 0;
    } else {
      if (p.y < plat.y) {
        p.y = plat.y - ph;
        p.vy = 0;
        p.onGround = true;
      } else {
        // Hit from below
        p.y = plat.y + plat.h;
        p.vy = 1;
        // Activate question block
        if (plat.type === 'question' && !plat.activated) {
          plat.activated = true;
          plat.type = 'used';
          if (plat.hasCoin) {
            score += 100;
            coinsCollected++;
            spawnCoinEffect(plat.x + TILE/2, plat.y);
          }
        }
      }
    }
    return true;
  }

  // Coin pop effects
  const coinEffects = [];
  function spawnCoinEffect(x, y) {
    coinEffects.push({ x, y, vy: -5, life: 40 });
  }

  // ---- GAME UPDATE ----
  let animFrame;
  let lastTime = 0;

  function update(dt) {
    if (gameState !== 'playing') return;

    // Input
    const left = keys['ArrowLeft'] || keys['a'] || keys['A'] || touchLeft;
    const right = keys['ArrowRight'] || keys['d'] || keys['D'] || touchRight;
    const jump = keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' '] || touchJump;

    if (!player.dead) {
      // Horizontal
      if (left) { player.vx = -MOVE_SPEED; player.facing = -1; }
      else if (right) { player.vx = MOVE_SPEED; player.facing = 1; }
      else player.vx *= 0.8;

      // Jump
      if (jump && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
      }
    }

    // Gravity
    player.vy += GRAVITY;
    if (player.vy > 15) player.vy = 15;

    player.onGround = false;
    player.x += player.vx;
    player.y += player.vy;

    // Clamp left
    if (player.x < 0) { player.x = 0; player.vx = 0; }
    // Clamp right
    if (player.x + PLAYER_W > WORLD_W) { player.x = WORLD_W - PLAYER_W; }

    // Platform collisions
    for (const plat of level.platforms) {
      resolvePlayerPlatform(player, plat);
    }
    // Pipe collisions
    for (const pipe of level.pipes) {
      resolvePlayerPlatform(player, { ...pipe, w: pipe.w, h: pipe.h });
    }

    // Fall death
    if (player.y > CANVAS_H + 100) {
      playerDie();
      return;
    }

    // Coin collection
    for (const coin of level.coins) {
      if (!coin.collected && rectOverlap(player.x, player.y, PLAYER_W, PLAYER_H, coin.x - 6, coin.y - 6, 12, 12)) {
        coin.collected = true;
        score += 50;
        coinsCollected++;
        spawnCoinEffect(coin.x, coin.y);
      }
      coin.frameTimer++;
      if (coin.frameTimer > 6) { coin.frameTimer = 0; coin.frame = (coin.frame+1)%4; }
    }

    // Enemy update
    for (const en of level.enemies) {
      if (en.dead) {
        en.deadTimer--;
        if (en.deadTimer <= 0) en.remove = true;
        continue;
      }
      en.vy += GRAVITY;
      en.x += en.vx;
      en.y += en.vy;

      // Enemy platform collision (simplified - just ground + platforms)
      en.onGround = false;
      for (const plat of level.platforms) {
        if (rectOverlap(en.x, en.y, 32, 32, plat.x, plat.y, plat.w, plat.h)) {
          const overlapY = Math.min(en.y+32, plat.y+plat.h) - Math.max(en.y, plat.y);
          const overlapX = Math.min(en.x+32, plat.x+plat.w) - Math.max(en.x, plat.x);
          if (overlapY < overlapX) {
            if (en.y < plat.y) { en.y = plat.y - 32; en.vy = 0; en.onGround = true; }
          } else {
            en.vx *= -1;
          }
        }
      }
      // Bounce off pipes
      for (const pipe of level.pipes) {
        if (rectOverlap(en.x, en.y, 32, 32, pipe.x, pipe.y, pipe.w, pipe.h)) en.vx *= -1;
      }
      // Bounce off world edges
      if (en.x < 0 || en.x + 32 > WORLD_W) en.vx *= -1;
      if (en.y > CANVAS_H + 50) en.remove = true;

      en.frameTimer++;
      if (en.frameTimer > 10) { en.frameTimer = 0; en.frame = 1 - en.frame; }

      // Player-enemy collision
      if (!player.dead && !player.invincible && rectOverlap(player.x, player.y, PLAYER_W, PLAYER_H, en.x+4, en.y+4, 24, 24)) {
        // Stomp?
        if (player.vy > 0 && player.y + PLAYER_H < en.y + 20) {
          en.dead = true;
          en.deadTimer = 30;
          player.vy = JUMP_FORCE * 0.5;
          score += 200;
        } else {
          playerDie();
          return;
        }
      }
    }
    level.enemies = level.enemies.filter(e => !e.remove);

    // Coin effects
    for (const ef of coinEffects) {
      ef.y += ef.vy;
      ef.vy += 0.3;
      ef.life--;
    }
    coinEffects.splice(0, coinEffects.filter(e => e.life <= 0).length);

    // Player animation
    if (!player.onGround) {
      player.frame = 4;
    } else if (Math.abs(player.vx) > 0.5) {
      player.frameTimer++;
      if (player.frameTimer > 6) { player.frameTimer = 0; player.frame = (player.frame + 1) % 4; }
    } else {
      player.frame = 0;
    }

    // Invincibility
    if (player.invincible > 0) player.invincible--;

 // Camera
    const targetX = player.x - CANVAS_W * 0.35;
    camera.x = Math.max(0, Math.min(targetX, WORLD_W - CANVAS_W));

    // Flag
    if (!level.flag.collected && Math.abs(player.x - level.flagX) < 40 && player.y + PLAYER_H > level.flagY) {
      level.flag.collected = true;
      score += 2000;
      setTimeout(() => { gameState = 'win'; }, 800);
    }

    updateUI();
  }

  function playerDie() {
    if (player.dead) return;
    player.dead = true;
    player.vy = JUMP_FORCE;
    lives--;
    updateUI();
    setTimeout(() => {
      if (lives <= 0) { gameState = 'gameover'; }
      else {
        resetPlayer();
        camera.x = 0;
        gameState = 'dead_wait';
        setTimeout(() => { gameState = 'playing'; }, 100);
      }
    }, 1200);
  }

  // ---- DRAW ----
  function drawTile(sprite, x, y) {
    const sx = x - camera.x;
    if (sx < -TILE || sx > CANVAS_W + TILE) return;
    ctx.drawImage(sprite, sx, y);
  }

  function draw() {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    sky.addColorStop(0, '#5c94fc');
    sky.addColorStop(1, '#9ec5fe');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Decorations (clouds, mountains)
    for (const d of level.decorations) {
      const sx = d.x - camera.x * 0.4; // parallax
      if (sx < -120 || sx > CANVAS_W + 120) continue;
      if (d.type === 'cloud') ctx.drawImage(cloudSprite, sx, d.y);
      if (d.type === 'mountain') ctx.drawImage(mountainSprite, sx, d.y);
    }

    // Platforms
    for (const plat of level.platforms) {
      const sx = plat.x - camera.x;
      if (sx < -TILE || sx > CANVAS_W + TILE) continue;
      if (plat.type === 'ground') ctx.drawImage(groundTile, sx, plat.y);
      else if (plat.type === 'brick') ctx.drawImage(brickTile, sx, plat.y);
      else if (plat.type === 'question') ctx.drawImage(qBlock, sx, plat.y);
      else if (plat.type === 'used') ctx.drawImage(usedBlock, sx, plat.y);
    }

    // Pipes
    for (const pipe of level.pipes) {
      const sx = pipe.x - camera.x;
      if (sx < -50 || sx > CANVAS_W + 50) continue;
      ctx.drawImage(pipeSprite, sx, pipe.y);
    }

    // Coins
    for (const coin of level.coins) {
      if (coin.collected) continue;
      const sx = coin.x - camera.x;
      if (sx < -20 || sx > CANVAS_W + 20) continue;
      ctx.drawImage(coinSheet, coin.frame * COIN_SIZE, 0, COIN_SIZE, COIN_SIZE, sx - COIN_SIZE/2, coin.y - COIN_SIZE/2, COIN_SIZE, COIN_SIZE);
    }

    // Coin effects
    for (const ef of coinEffects) {
      if (ef.life > 0) {
        ctx.globalAlpha = ef.life / 40;
        ctx.drawImage(coinSheet, 0, 0, COIN_SIZE, COIN_SIZE, ef.x - camera.x - COIN_SIZE/2, ef.y - COIN_SIZE/2, COIN_SIZE, COIN_SIZE);
        ctx.globalAlpha = 1;
      }
    }

    // Enemies
    for (const en of level.enemies) {
      const sx = en.x - camera.x;
      if (sx < -40 || sx > CANVAS_W + 40) continue;
      if (en.dead) {
        // Squished goomba
        ctx.drawImage(goombaTile, 0, 0, 32, 32, sx, en.y + 20, 32, 12);
      } else {
        ctx.drawImage(goombaTile, en.frame * 32, 0, 32, 32, sx, en.y, 32, 32);
      }
    }

    // Flag
    {
      const sx = level.flagX - camera.x;
      if (sx > -20 && sx < CANVAS_W + 20) {
        ctx.drawImage(flagSprite, sx, level.flagY);
      }
    }

    // Player
    if (!player.dead || Math.floor(Date.now() / 100) % 2 === 0) {
      if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) {
        // blink
      } else {
        const sx = player.x - camera.x;
        const frame = player.frame;
        ctx.save();
        if (player.facing === -1) {
          ctx.translate(sx + PLAYER_W, player.y);
          ctx.scale(-1, 1);
          ctx.drawImage(playerSheet, frame * PLAYER_W, 0, PLAYER_W, PLAYER_H, 0, 0, PLAYER_W, PLAYER_H);
        } else {
          ctx.drawImage(playerSheet, frame * PLAYER_W, 0, PLAYER_W, PLAYER_H, sx, player.y, PLAYER_W, PLAYER_H);
        }
        ctx.restore();
      }
    }

    // Score particles
    for (const ef of coinEffects) {
      if (ef.life > 0) {
        ctx.fillStyle = `rgba(255,215,0,${ef.life/40})`;
        ctx.font = 'bold 12px monospace';
        ctx.fillText('+50', ef.x - camera.x - 10, ef.y - (40 - ef.life) * 1.5);
      }
    }

    // Overlays
    if (gameState === 'start') {
      drawOverlay('🍄 SUPER MARTIN', 'Натисни ENTER или докосни екрана', '#FFD700');
    } else if (gameState === 'dead_wait') {
      drawOverlay('💀 ЗАГУБИ ЖИВОТ!', `Останали животи: ${lives}`, '#FF6B6B');
    } else if (gameState === 'gameover') {
      drawOverlay('GAME OVER', 'Натисни ENTER за рестарт', '#FF3838');
    } else if (gameState === 'win') {
      drawOverlay('🎉 ПОБЕДА!', `Резултат: ${score}`, '#FFD700');
    }
  }

  function drawOverlay(title, sub, color) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(title, CANVAS_W/2, CANVAS_H/2 - 20);
    ctx.font = '18px "Courier New", monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(sub, CANVAS_W/2, CANVAS_H/2 + 20);
    ctx.textAlign = 'left';
  }

  // ---- MAIN LOOP ----
  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 16.67, 3);
    lastTime = ts;
    update(dt);
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  // ---- INPUT ----
  window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if ((e.key === 'Enter' || e.key === ' ') && gameState === 'start') {
      gameState = 'playing';
      e.preventDefault();
    }
    if (e.key === 'Enter' && gameState === 'gameover') {
      restartGame();
    }
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => { keys[e.key] = false; });

  canvas.addEventListener('click', () => {
    if (gameState === 'start') gameState = 'playing';
    if (gameState === 'gameover') restartGame();
  });

  function restartGame() {
    score = 0; lives = 3; coinsCollected = 0;
    level = buildLevel();
    resetPlayer();
    camera.x = 0;
    gameState = 'playing';
    updateUI();
  }

  // Mobile buttons
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnJump = document.getElementById('btn-jump');
  if (btnLeft) {
    btnLeft.addEventListener('touchstart', e => { touchLeft = true; e.preventDefault(); }, { passive: false });
    btnLeft.addEventListener('touchend', e => { touchLeft = false; e.preventDefault(); }, { passive: false });
    btnRight.addEventListener('touchstart', e => { touchRight = true; e.preventDefault(); }, { passive: false });
    btnRight.addEventListener('touchend', e => { touchRight = false; e.preventDefault(); }, { passive: false });
    btnJump.addEventListener('touchstart', e => {
      touchJump = true;
      if (gameState === 'start') gameState = 'playing';
      e.preventDefault();
    }, { passive: false });
    btnJump.addEventListener('touchend', e => { touchJump = false; e.preventDefault(); }, { passive: false });
  }

  // Resize canvas for mobile
  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    const maxW = Math.min(wrapper.clientWidth - 8, 800);
    canvas.style.width = maxW + 'px';
    canvas.style.height = (maxW * 400 / 800) + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Start loop
  requestAnimationFrame(loop);
})();
          
