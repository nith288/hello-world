const envelope = document.getElementById('envelope');
const openLetter = document.getElementById('openLetter');
const letterSection = document.getElementById('letterSection');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const answerArea = document.getElementById('answerArea');
const yesMessage = document.getElementById('yesMessage');
const proposalCard = document.getElementById('proposalCard');

function openEnvelope() {
  envelope.classList.add('open');
}
envelope.addEventListener('click', () => envelope.classList.toggle('open'));
openLetter.addEventListener('click', () => {
  letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(openEnvelope, 650);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.tilt-card').forEach(card => {
  const baseRotation = card.classList.contains('photo-landscape') ? 4 : -7;
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotate(${baseRotation}deg) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotate(${baseRotation}deg)`;
  });
});

let lastTrail = 0;
document.addEventListener('pointermove', (event) => {
  const now = Date.now();
  if (now - lastTrail < 65 || event.pointerType === 'touch') return;
  lastTrail = now;
  const particle = document.createElement('span');
  particle.className = Math.random() > 0.28 ? 'heart-particle' : 'sparkle';
  particle.textContent = particle.className === 'heart-particle'
    ? ['❤','💗','💕','♡'][Math.floor(Math.random() * 4)]
    : '✨';
  particle.style.left = `${event.clientX}px`;
  particle.style.top = `${event.clientY}px`;
  particle.style.fontSize = `${12 + Math.random() * 13}px`;
  particle.style.setProperty('--drift', `${-25 + Math.random() * 50}px`);
  particle.style.setProperty('--rotate', `${-35 + Math.random() * 70}deg`);
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 1400);
});

let noScale = 1;
let escapeCount = 0;
function moveNoButton() {
  escapeCount += 1;
  const area = answerArea.getBoundingClientRect();
  const button = noButton.getBoundingClientRect();
  const maxX = Math.max(10, area.width - button.width - 10);
  const maxY = Math.max(10, area.height - button.height - 10);
  const x = 8 + Math.random() * maxX;
  const y = 5 + Math.random() * maxY;
  noScale = Math.max(0.35, noScale - 0.08);
  noButton.style.left = `${x}px`;
  noButton.style.right = 'auto';
  noButton.style.top = `${y}px`;
  noButton.style.transform = `scale(${noScale}) rotate(${(Math.random() - .5) * 18}deg)`;
  if (escapeCount === 3) noButton.textContent = 'Are you sure? 😅';
  if (escapeCount === 6) noButton.textContent = 'Still no? 🥺';
  if (escapeCount >= 9) noButton.textContent = 'Tiny no';
}
['mouseenter','pointerdown','focus'].forEach(type => noButton.addEventListener(type, moveNoButton));
noButton.addEventListener('click', event => {
  event.preventDefault();
  moveNoButton();
});

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];
let animationFrame;
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function burst(x, y, count = 85) {
  const palette = ['#ff9fbd','#ffd6e2','#d7aa67','#ffffff','#ef6d9a','#f8c15f'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.2 + Math.random() * 6.4;
    fireworks.push({x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: .055 + Math.random() * .035, alpha: 1, decay: .009 + Math.random() * .012, size: 1.7 + Math.random() * 3.2, color: palette[Math.floor(Math.random() * palette.length)]});
  }
}
function animateFireworks() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.globalCompositeOperation = 'lighter';
  fireworks.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= .992; p.alpha -= p.decay;
    ctx.globalAlpha = Math.max(0, p.alpha); ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  });
  fireworks = fireworks.filter(p => p.alpha > 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (fireworks.length) animationFrame = requestAnimationFrame(animateFireworks);
  else cancelAnimationFrame(animationFrame);
}
function celebration() {
  let bursts = 0;
  const interval = setInterval(() => {
    burst(innerWidth * (.1 + Math.random() * .8), innerHeight * (.12 + Math.random() * .58), 70 + Math.floor(Math.random()*45));
    if (!animationFrame || fireworks.length < 2) animateFireworks();
    bursts++;
    if (bursts >= 14) clearInterval(interval);
  }, 230);
}

yesButton.addEventListener('click', () => {
  document.querySelector('.proposal-intro').style.display = 'none';
  document.querySelector('.proposal-card h2').style.display = 'none';
  document.querySelector('.proposal-sub').style.display = 'none';
  answerArea.style.display = 'none';
  document.querySelector('.ring').textContent = '💞';
  yesMessage.classList.add('show');
  proposalCard.style.background = 'linear-gradient(145deg, rgba(255,180,205,.2), rgba(255,255,255,.08))';
  celebration();
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const h = document.createElement('span');
      h.className = 'heart-particle';
      h.textContent = ['❤','💖','💕','✨'][Math.floor(Math.random()*4)];
      h.style.left = `${15 + Math.random()*70}vw`;
      h.style.top = `${55 + Math.random()*30}vh`;
      h.style.fontSize = `${18 + Math.random()*28}px`;
      h.style.setProperty('--drift', `${-70 + Math.random()*140}px`);
      h.style.setProperty('--rotate', `${-80 + Math.random()*160}deg`);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }, i * 45);
  }
});

document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const emoji = document.createElement('span');
    emoji.className = 'sparkle';
    emoji.textContent = ['💗','✨','🥰'][Math.floor(Math.random()*3)];
    const rect = card.getBoundingClientRect();
    emoji.style.left = `${rect.left + rect.width/2}px`;
    emoji.style.top = `${rect.top + 20}px`;
    emoji.style.fontSize = '28px';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
  });
});