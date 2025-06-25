const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');

let dropCount;
function updateDropCount() {
  const w = window.innerWidth;
  if (w <= 768) {
    dropCount = 20;
  } else if (w <= 1440) {
    dropCount = 50;
  } else {
    dropCount = 80;
  }
}

updateDropCount();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spacing = canvas.width / dropCount;

let drops = [];

function initDrops() {
  drops = [];
  const w = window.innerWidth;
  for (let i = 0; i < dropCount; i++) {
    if (w <= 768) {
      drops.push({
        x: i * spacing,
        y: Math.random() * -canvas.height,
        length: Math.random() * 3 + 2,
        velocity: Math.random() * 0.7 + 0.3,
      });
    } else if (w <= 1440) {
      drops.push({
        x: i * spacing,
        y: Math.random() * -canvas.height,
        length: Math.random() * 4 + 3,
        velocity: Math.random() * 1 + 0.7,
      });
    } else {
      drops.push({
        x: i * spacing,
        y: Math.random() * -canvas.height,
        length: Math.random() * 5 + 5,
        velocity: Math.random() * 1.5 + 1,
      });
    }
  }
}

initDrops();

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let d of drops) {
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.length);
  }

  ctx.stroke();
  moveRain();
}

function moveRain() {
  const w = window.innerWidth;
  for (let d of drops) {
    d.y += d.velocity;
    if (d.y > canvas.height) {
      d.y = -d.length;
      d.x = Math.random() * canvas.width;

      if (w <= 768) {
        d.length = Math.random() * 3 + 2;
        d.velocity = Math.random() * 0.7 + 0.3;
      } else if (w <= 1440) {
        d.length = Math.random() * 4 + 3;
        d.velocity = Math.random() * 1 + 0.7;
      } else {
        d.length = Math.random() * 5 + 5;
        d.velocity = Math.random() * 1.5 + 1;
      }
    }
  }
}

function animate() {
  drawRain();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateDropCount();
  spacing = canvas.width / dropCount;
  initDrops();
});
