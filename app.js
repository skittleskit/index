const scenes = Array.from(document.querySelectorAll(".scene"));
const chapterNav = document.getElementById("chapterNav");
const progressLabel = document.getElementById("progressLabel");
const progressMeta = document.getElementById("progressMeta");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const toggleDoodlesBtn = document.getElementById("toggleDoodlesBtn");
const openOverviewBtn = document.getElementById("openOverviewBtn");
const stickerZoomBtn = document.getElementById("stickerZoomBtn");
const finalPrepBtn = document.getElementById("finalPrepBtn");
const countdownText = document.getElementById("countdownText");
const replayFinalBtn = document.getElementById("replayFinalBtn");
const jumpStartBtn = document.getElementById("jumpStartBtn");
const letterToggleBtn = document.getElementById("letterToggleBtn");
const letterSheet = document.getElementById("letterSheet");
const memoryPanel = document.getElementById("memoryPanel");
const wishResult = document.getElementById("wishResult");
const typeTarget = document.getElementById("typeTarget");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

let activeIndex = 0;
let typingDone = false;

function buildNav() {
  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.className = "chapter-link";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `
      <span class="chapter-link__index">${String(index + 1).padStart(2, "0")}</span>
      <span class="chapter-link__label">${scene.dataset.title}</span>
    `;
    button.addEventListener("click", () => updateScene(index));
    chapterNav.appendChild(button);
  });
}

function updateScene(nextIndex) {
  if (nextIndex < 0 || nextIndex >= scenes.length) {
    return;
  }

  activeIndex = nextIndex;

  scenes.forEach((scene, index) => {
    const isActive = index === activeIndex;
    scene.classList.toggle("is-active", isActive);
    scene.setAttribute("aria-hidden", String(!isActive));
  });

  Array.from(chapterNav.children).forEach((link, index) => {
    link.classList.toggle("is-active", index === activeIndex);
  });

  const activeScene = scenes[activeIndex];
  progressLabel.textContent = activeScene.dataset.title;
  progressMeta.textContent = `${activeIndex + 1} / ${scenes.length}`;
  backBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === scenes.length - 1;

  if (activeScene.dataset.scene === "opening" && !typingDone) {
    runTypewriter();
  }

  if (activeScene.dataset.final === "true") {
    runCelebration();
  }
}

function runTypewriter() {
  if (!typeTarget || typingDone) {
    return;
  }

  const fullText = typeTarget.textContent.trim();
  typeTarget.textContent = "";
  typeTarget.classList.add("is-typing");

  if (reducedMotion) {
    typeTarget.textContent = fullText;
    typeTarget.classList.remove("is-typing");
    typingDone = true;
    return;
  }

  let cursor = 0;

  function step() {
    cursor += 1;
    typeTarget.textContent = fullText.slice(0, cursor);

    if (cursor < fullText.length) {
      window.setTimeout(step, 18 + Math.random() * 20);
      return;
    }

    typeTarget.classList.remove("is-typing");
    typingDone = true;
  }

  step();
}

function toggleModal(modalId, shouldOpen) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }

  modal.hidden = !shouldOpen;
  document.body.classList.toggle("modal-open", shouldOpen);
}

function runCountdown() {
  const steps = ["3...", "2...", "1...", "Wish locked in."];
  let current = 0;
  countdownText.textContent = steps[current];

  if (reducedMotion) {
    countdownText.textContent = steps[steps.length - 1];
    updateScene(scenes.length - 1);
    return;
  }

  const timer = window.setInterval(() => {
    current += 1;
    countdownText.textContent = steps[current];

    if (current === steps.length - 1) {
      window.clearInterval(timer);
      window.setTimeout(() => updateScene(scenes.length - 1), 380);
    }
  }, 650);
}

function runCelebration() {
  if (typeof window.confetti !== "function") {
    return;
  }

  const burst = (particleCount, spread, originY) => {
    window.confetti({
      particleCount,
      spread,
      startVelocity: 32,
      scalar: 0.95,
      origin: { y: originY },
      colors: ["#bb5c45", "#ffd0b4", "#f6d7bd", "#8f3d2d"]
    });
  };

  burst(reducedMotion ? 40 : 90, 110, 0.65);
  window.setTimeout(() => burst(reducedMotion ? 24 : 70, 180, 0.55), 200);
  window.setTimeout(() => burst(reducedMotion ? 12 : 50, 240, 0.4), 420);
}

buildNav();
updateScene(0);

nextBtn.addEventListener("click", () => updateScene(activeIndex + 1));
backBtn.addEventListener("click", () => updateScene(activeIndex - 1));

document.addEventListener("keydown", (event) => {
  const isTypingField = ["input", "textarea"].includes(
    document.activeElement?.tagName?.toLowerCase() || ""
  );

  if (isTypingField) {
    return;
  }

  if (event.key === "ArrowRight") {
    updateScene(activeIndex + 1);
  }

  if (event.key === "ArrowLeft") {
    updateScene(activeIndex - 1);
  }

  if (event.key === "Escape") {
    toggleModal("overviewModal", false);
    toggleModal("stickerModal", false);
  }
});

document.querySelector(".slide-deck").addEventListener("click", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest(".modal") ||
    event.target.closest(".letter-sheet")
  ) {
    return;
  }

  updateScene(Math.min(activeIndex + 1, scenes.length - 1));
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-night");
});

toggleDoodlesBtn.addEventListener("click", () => {
  document.body.classList.toggle("doodles-off");
});

openOverviewBtn.addEventListener("click", () => toggleModal("overviewModal", true));
stickerZoomBtn.addEventListener("click", () => toggleModal("stickerModal", true));

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modalName = button.getAttribute("data-close-modal");
    toggleModal(`${modalName}Modal`, false);
  });
});

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((item) => item.classList.remove("is-selected"));
    pill.classList.add("is-selected");
  });
});

document.querySelectorAll(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    const nextMemory = Number(card.dataset.memory || 0);
    document
      .querySelectorAll(".memory-card")
      .forEach((item) => item.classList.toggle("is-active", item === card));
    memoryPanel.textContent = memoryCopy[nextMemory];
  });
});

letterToggleBtn.addEventListener("click", () => {
  const willOpen = letterSheet.hidden;
  letterSheet.hidden = !willOpen;
  letterToggleBtn.setAttribute("aria-expanded", String(willOpen));
  letterToggleBtn.textContent = willOpen ? "Fold the note back up" : "Open the folded note";
});

document.querySelectorAll(".wish-card").forEach((card) => {
  card.addEventListener("click", () => {
    const wish = card.dataset.wish;
    document
      .querySelectorAll(".wish-card")
      .forEach((item) => item.classList.toggle("is-selected", item === card));
    wishResult.textContent = wishCopy[wish] || wishCopy.peace;
  });
});

finalPrepBtn.addEventListener("click", runCountdown);
replayFinalBtn.addEventListener("click", runCelebration);
jumpStartBtn.addEventListener("click", () => updateScene(0));
