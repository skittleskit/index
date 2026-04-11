// --- Application State and Data ---
const memoryCopy = [
  "Looking back, those calls have a soft kind of nostalgia now. Not loud, not cinematic, just the kind that makes life feel temporarily calm again.",
  "Even the rougher moments matter because they proved the bond could survive discomfort without collapsing into bitterness.",
  "That steady background presence is easy to miss while it is happening, but it becomes obvious when you imagine it gone."
];

const wishCopy = {
  peace: "Current pick: peace. May this year feel lighter, steadier, and kinder than the last one.",
  luck: "Current pick: luck. May absurdly well-timed opportunities keep landing in your lap this year.",
  clarity: "Current pick: clarity. May the fog leave quickly whenever you need to choose what matters.",
  chaos: "Current pick: controlled chaos. May life stay fun, surprising, and mostly harmless."
};

let typeWriterTriggered = false;

// --- Initialize GSAP and ScrollTrigger ---
gsap.registerPlugin(ScrollTrigger);

// Remove preload class after a short delay to allow loader animation
document.addEventListener("DOMContentLoaded", () => {
  // Loading Sequence
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');

  // Simulate loading
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    loaderBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.classList.remove('preload');
          initAnimations();
        }, 1000);
      }, 500);
    }
  }, 100);

  // Build ODM Rail Navigation
  buildNavigation();

  // Setup Interactions
  setupInteractions();

  // Setup Particles
  createSparks();
});

// --- Core Animations Setup ---
function initAnimations() {
  const scenes = document.querySelectorAll('.scene');

  // Scroll Progress tied to Gas Level
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      document.getElementById('scrollProgress').style.height = `${self.progress * 100}%`;
    }
  });

  // Scene Reveal Animations
  scenes.forEach((scene, index) => {
    // Highlight nav dot
    ScrollTrigger.create({
      trigger: scene,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if(self.isActive) {
          document.querySelectorAll('.chapter-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });

          // Trigger typewriter on Opening Note scene
          if(scene.id === 'scene-opening' && !typeWriterTriggered) {
            runTypewriter();
            typeWriterTriggered = true;
          }
        }
      }
    });

    // Elements reveal within scene
    const card = scene.querySelector('.dossier-card');
    if (card) {
      gsap.fromTo(card,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scene,
            start: "top 80%",
          }
        }
      );
    }
  });

  // Parallax on Doodles
  gsap.utils.toArray('.doodle').forEach(doodle => {
    gsap.to(doodle, {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: doodle.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}

// --- Navigation Builder ---
function buildNavigation() {
  const chapterNav = document.getElementById('chapterNav');
  const scenes = document.querySelectorAll('.scene');

  scenes.forEach((scene, index) => {
    const dot = document.createElement('div');
    dot.className = 'chapter-dot';
    dot.title = scene.getAttribute('data-title');
    dot.addEventListener('click', () => {
      scene.scrollIntoView({ behavior: 'smooth' });
    });
    chapterNav.appendChild(dot);
  });
}

// --- Interaction Handlers ---
function setupInteractions() {
  // Target Pills (Bond section)
  const pills = document.querySelectorAll('.target-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Small glitch effect on click
      gsap.fromTo(pill,
        { x: -5 }, { x: 0, duration: 0.1, yoyo: true, repeat: 3 }
      );
    });
  });

  // Timeline Nodes (Archive section)
  const tNodes = document.querySelectorAll('.t-node');
  const memoryPanel = document.getElementById('memoryPanel');
  tNodes.forEach(node => {
    node.addEventListener('click', () => {
      tNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const index = parseInt(node.getAttribute('data-index'));

      // Typewriter-ish reveal for memory
      gsap.to(memoryPanel, {opacity: 0, duration: 0.2, onComplete: () => {
        memoryPanel.textContent = memoryCopy[index];
        gsap.to(memoryPanel, {opacity: 1, duration: 0.2});
      }});
    });
  });

  // Wish Tactical Grid
  const tacCards = document.querySelectorAll('.tac-card');
  const wishResult = document.getElementById('wishResult');
  tacCards.forEach(card => {
    card.addEventListener('click', () => {
      tacCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const wish = card.getAttribute('data-wish');
      const text = wishCopy[wish] || wishCopy.peace;

      wishResult.innerHTML = `<span class="readout-label">SYSTEM MESSAGE:</span> ${text}`;

      // flash effect
      gsap.fromTo(wishResult, { backgroundColor: '#d94141' }, { backgroundColor: '#050505', duration: 0.5 });
    });
  });

  // Titan Shift Button
  const shiftBtn = document.getElementById('shiftBtn');
  shiftBtn.addEventListener('click', triggerTitanShift);

  // Coordinate Button (Finale)
  const coordinateBtn = document.getElementById('coordinateBtn');
  coordinateBtn.addEventListener('click', activateCoordinate);
}

// --- Special Effects ---

function runTypewriter() {
  const target = document.getElementById('typeTarget');
  if (!target) return;

  const text = target.textContent.trim();
  target.textContent = '';

  let i = 0;
  const speed = 30;

  function type() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed + (Math.random() * 20));
    }
  }
  type();
}

function triggerTitanShift() {
  const flash = document.getElementById('lightningFlash');

  // Lightning strike sequence
  const tl = gsap.timeline();
  tl.to(flash, { opacity: 1, background: '#ffd700', duration: 0.05 })
    .to(flash, { opacity: 0, duration: 0.1 })
    .to(flash, { opacity: 0.8, duration: 0.05 })
    .to(flash, { opacity: 0, duration: 0.5 });

  // Shake body
  gsap.fromTo(document.body,
    { x: -10, y: 5 },
    { x: 10, y: -5, duration: 0.05, yoyo: true, repeat: 10, ease: "none", onComplete: () => {
      gsap.set(document.body, {x:0, y:0});
    }}
  );
}

function activateCoordinate() {
  // Show Paths Background
  const pathsBg = document.getElementById('pathsBg');
  gsap.to(pathsBg, { opacity: 1, duration: 2 });

  // Confetti (Coordinate Light style)
  if (window.confetti) {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#93c5fd', '#f2e8c9']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#93c5fd', '#f2e8c9']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

function createSparks() {
  const container = document.getElementById('sparksContainer');
  if(!container) return;

  for(let i=0; i<30; i++) {
    const spark = document.createElement('div');
    spark.style.position = 'absolute';
    spark.style.width = Math.random() * 3 + 1 + 'px';
    spark.style.height = spark.style.width;
    spark.style.backgroundColor = '#d94141';
    spark.style.borderRadius = '50%';
    spark.style.filter = 'blur(1px)';
    spark.style.opacity = Math.random();

    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight + window.innerHeight;

    spark.style.left = startX + 'px';
    spark.style.top = startY + 'px';

    container.appendChild(spark);

    // Animate upward
    gsap.to(spark, {
      y: - (window.innerHeight * 1.5),
      x: `+=${Math.random() * 200 - 100}`,
      opacity: 0,
      duration: Math.random() * 10 + 5,
      repeat: -1,
      ease: "none",
      delay: Math.random() * 5
    });
  }
}
