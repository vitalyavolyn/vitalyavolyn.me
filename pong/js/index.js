const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cw = canvas.width;
const ch = canvas.height;

const score = [0, 0];

let pause = false;

function Ball() {
  this.x = cw / 2;
  this.y = ch / 2;
  this.radius = 5;
  this.vx = cw * 0.005;
  this.vy = 0;
  this.a = 0.5;
  console.log(this.vx);
}

const ball = new Ball();

function Platform(direction) {
  this.w = 7;
  this.h = ch * 0.15;

  this.dh = 0.5;

  this.y = ch / 2 - this.h / 2;
  this.x = direction == "left" ? 3 : cw - 3 - this.w;

  this.up = false;
  this.down = false;
}
Platform.v = 7;

const platforms = [new Platform("left"), new Platform("right")];

function drawPlatform(p) {
  if (p.up && p.y > 0) p.y -= Platform.v;
  if (p.down && p.y + p.h < ch) p.y += Platform.v;

  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.rect(p.x, p.y, p.w, p.h);
  ctx.fill();
  ctx.closePath();
}

function drawLine() {
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.moveTo(cw / 2, 0);
  ctx.lineTo(cw / 2, ch);
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function drawBall() {
  if (ball.y + ball.radius >= ch || ball.y - ball.radius <= 0) {
    // отскок от верха и низа
    ball.vy = -ball.vy;
  }

  let p = ball.x < cw / 2 ? platforms[0] : platforms[1];
  let bx = ball.x < cw / 2 ? ball.x - ball.radius : ball.x + ball.radius;
  if (
    ((ball.x < cw / 2 && bx <= p.x) || (ball.x > cw / 2 && bx >= p.x)) &&
    (ball.y > p.y && ball.y < p.y + p.h)
  ) {
    //if (ball.x < cw / 2) ball.x = p.x + p.w + 1
    //if (ball.x > cw / 2) ball.x = p.x + p.w - 2
    if (Math.abs(ball.vx) < 5) {
      ball.vx = -(ball.vx + (ball.vx < 0 ? -ball.a : ball.a));
    } else {
      ball.vx = -ball.vx;
    }

    platforms.forEach(p => (p.h = p.h > ch * 0.05 ? p.h - p.dh : p.h));
    console.log(platforms[0].h);

    ball.vy = ball.vy == 0 ? ball.vx : Math.random() * ball.vx;
  }

  if (ball.x > cw) {
    score[0] += 1;

    ball.x = cw / 2;
    ball.y = ch / 2;
    //    ball.vx = -ball.vx
    ball.vy = 0;
    platforms.forEach(p => (p.y = ch / 2 - p.h / 2));
    return;
  }

  if (ball.x < 0) {
    score[1] += 1;

    ball.x = cw / 2;
    ball.y = ch / 2;
    //    ball.vx = -ball.vx
    ball.vy = 0;
    platforms.forEach(p => (p.y = ch / 2 - p.h / 2));
    return;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '30px "Press Start 2P"';
  ctx.fillStyle = "#fff";
  ctx.fillText(String(score[0]).padStart(2, "0"), cw / 2 - 100, 40);
  ctx.fillText(String(score[1]).padStart(2, "0"), cw / 2 + 40, 40);
}

function draw() {
  if (!pause) {
    ctx.clearRect(0, 0, cw, ch);

    platforms.forEach(p => drawPlatform(p));
    drawLine();
    drawBall();
    drawScore();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("keydown", e => {
  //console.log(e.keyCode)
  switch (e.keyCode) {
    case 38:
      platforms[1].up = true;
      break;
    case 40:
      platforms[1].down = true;
      break;
    case 87:
      platforms[0].up = true;
      break;
    case 83:
      platforms[0].down = true;
      break;
    case 80:
      pause = !pause;
      break;
  }
});

window.addEventListener("keyup", e => {
  //console.log(e.keyCode)
  switch (e.keyCode) {
    case 38:
      platforms[1].up = false;
      break;
    case 40:
      platforms[1].down = false;
      break;
    case 87:
      platforms[0].up = false;
      break;
    case 83:
      platforms[0].down = false;
      break;
  }
});

WebFont.load({
  google: {
    families: ["Press Start 2P"]
  },
  active: () => {
    draw();
  }
});