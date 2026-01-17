gsap.registerPlugin(ScrollTrigger);

// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});

// Background Animation with Three.js
const bgCanvas = document.getElementById("bg-canvas");
const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true });
bgRenderer.setSize(window.innerWidth, window.innerHeight);
bgCamera.position.z = 5;

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x6366f1,
  transparent: true,
  opacity: 0.6,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
bgScene.add(particlesMesh);

function animateBg() {
  requestAnimationFrame(animateBg);
  particlesMesh.rotation.y += 0.001;
  particlesMesh.rotation.x += 0.0005;
  bgRenderer.render(bgScene, bgCamera);
}
animateBg();

// 3D Character - Laptop with Math Symbols
const charCanvas = document.getElementById("character-canvas");
const charScene = new THREE.Scene();
const charCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const charRenderer = new THREE.WebGLRenderer({
  canvas: charCanvas,
  alpha: true,
});
charRenderer.setSize(window.innerWidth, window.innerHeight);

const characterGroup = new THREE.Group();

const primaryColor = 0x6366f1;
const accentColor = 0x00d4ff;

// Laptop base
const baseGeom = new THREE.BoxGeometry(1.2, 0.05, 0.9);
const baseMat = new THREE.MeshPhongMaterial({
  color: 0x2a2a2a,
  shininess: 80,
});
const base = new THREE.Mesh(baseGeom, baseMat);
base.position.y = -0.3;
characterGroup.add(base);

// Laptop screen
const screenFrameGeom = new THREE.BoxGeometry(1.15, 0.75, 0.03);
const screenFrameMat = new THREE.MeshPhongMaterial({
  color: 0x1a1a1a,
  shininess: 100,
});
const screenFrame = new THREE.Mesh(screenFrameGeom, screenFrameMat);
screenFrame.position.set(0, 0.1, -0.42);
screenFrame.rotation.x = -0.2;
characterGroup.add(screenFrame);

// Screen display
const screenGeom = new THREE.BoxGeometry(1.05, 0.65, 0.01);
const screenMat = new THREE.MeshBasicMaterial({
  color: primaryColor,
  emissive: primaryColor,
  emissiveIntensity: 0.6,
});
const screen = new THREE.Mesh(screenGeom, screenMat);
screen.position.set(0, 0.1, -0.4);
screen.rotation.x = -0.2;
characterGroup.add(screen);

// Screen glow lines
const glowLines = [];
for (let i = 0; i < 5; i++) {
  const lineGeom = new THREE.PlaneGeometry(0.9, 0.02);
  const lineMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.6,
  });
  const line = new THREE.Mesh(lineGeom, lineMat);
  line.position.set(0, 0.1 + (i - 2) * 0.12, -0.39);
  line.rotation.x = -0.2;
  line.userData = { baseY: 0.1 + (i - 2) * 0.12, index: i };
  glowLines.push(line);
  characterGroup.add(line);
}

// Keyboard
const keyboardGeom = new THREE.BoxGeometry(1, 0.02, 0.7);
const keyboardMat = new THREE.MeshPhongMaterial({
  color: 0x1a1a1a,
});
const keyboard = new THREE.Mesh(keyboardGeom, keyboardMat);
keyboard.position.set(0, -0.27, -0.1);
characterGroup.add(keyboard);

// Trackpad
const trackpadGeom = new THREE.BoxGeometry(0.3, 0.01, 0.2);
const trackpad = new THREE.Mesh(trackpadGeom, baseMat);
trackpad.position.set(0, -0.26, 0.2);
characterGroup.add(trackpad);

// Math symbols floating around
const mathSymbols = [
  "∫",
  "∑",
  "∏",
  "π",
  "∞",
  "√",
  "∂",
  "∇",
  "Δ",
  "Ω",
  "α",
  "β",
  "γ",
  "λ",
  "≈",
  "≠",
  "≤",
  "≥",
  "∈",
  "∀",
];
const symbolMeshes = [];

mathSymbols.forEach((symbol, i) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor === 0x6366f1 ? "#6366f1" : "#00d4ff";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.25, 0.25, 1);
  sprite.userData = {
    angle: (i / mathSymbols.length) * Math.PI * 2,
    radius: 0.8 + (i % 3) * 0.3,
    speed: 0.005 + (i % 5) * 0.003,
    heightOffset: (i % 7) * 0.2 - 0.6,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
  };
  symbolMeshes.push(sprite);
  characterGroup.add(sprite);
});

// Code particles
const particles = [];
for (let i = 0; i < 30; i++) {
  const pGeom = new THREE.SphereGeometry(0.015, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({
    color: i % 2 === 0 ? primaryColor : accentColor,
    transparent: true,
    opacity: 0.6,
  });
  const particle = new THREE.Mesh(pGeom, pMat);
  particle.userData = {
    angle: Math.random() * Math.PI * 2,
    radius: 0.5 + Math.random() * 0.5,
    speed: 0.008 + Math.random() * 0.012,
    height: (Math.random() - 0.5) * 1.2,
  };
  particles.push(particle);
  characterGroup.add(particle);
}

// Lights
const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
charScene.add(ambLight);
const keyLight = new THREE.PointLight(primaryColor, 1.5, 100);
keyLight.position.set(0, 2, 2);
charScene.add(keyLight);
const fillLight = new THREE.PointLight(accentColor, 1, 100);
fillLight.position.set(-2, 0, 2);
charScene.add(fillLight);

charScene.add(characterGroup);
charCamera.position.set(0, 0.5, 2.5);
charCamera.lookAt(0, 0, 0);
characterGroup.position.set(0, 0, 0);
characterGroup.rotation.y = 0;

let time = 0;
let currentSection = "hero";

function animateChar() {
  requestAnimationFrame(animateChar);
  time += 0.01;

  // Screen pulsing
  screen.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;

  // Glow lines animation
  glowLines.forEach((line, i) => {
    line.material.opacity = 0.4 + Math.sin(time * 3 + i * 0.5) * 0.3;
    line.position.y = line.userData.baseY + Math.sin(time * 2 + i) * 0.02;
  });

  // Math symbols orbit
  symbolMeshes.forEach((sprite, i) => {
    sprite.userData.angle += sprite.userData.speed;
    sprite.position.set(
      Math.cos(sprite.userData.angle) * sprite.userData.radius,
      sprite.userData.heightOffset + Math.sin(time * 1.5 + i * 0.3) * 0.15,
      Math.sin(sprite.userData.angle) * sprite.userData.radius,
    );
    sprite.material.rotation += sprite.userData.rotationSpeed;
    sprite.material.opacity = 0.6 + Math.sin(time * 2 + i) * 0.3;
  });

  // Particles
  particles.forEach((p, i) => {
    p.userData.angle += p.userData.speed;
    p.position.set(
      Math.cos(p.userData.angle) * p.userData.radius,
      p.userData.height + Math.sin(time * 2 + i * 0.2) * 0.1,
      Math.sin(p.userData.angle) * p.userData.radius,
    );
  });

  // Section animations
  if (currentSection === "hero") {
    characterGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
    symbolMeshes.forEach((s) => (s.userData.speed = 0.008));
  } else if (currentSection === "about") {
    screenFrame.rotation.x = -0.2 + Math.sin(time * 1.5) * 0.05;
    symbolMeshes.forEach((s) => (s.userData.speed = 0.01));
  } else if (currentSection === "philosophy") {
    characterGroup.rotation.x = Math.sin(time) * 0.05;
    symbolMeshes.forEach(
      (s) => (s.userData.radius = 0.8 + (s.userData.angle % 3) * 0.2),
    );
  } else if (currentSection === "values") {
    screen.material.color.setHex(
      Math.sin(time * 2) > 0 ? primaryColor : accentColor,
    );
  } else if (currentSection === "expertise") {
    symbolMeshes.forEach((s, i) => {
      if (i < 5) s.userData.speed = 0.015;
    });
  } else if (currentSection === "process") {
    symbolMeshes.forEach((s, i) => {
      s.userData.heightOffset = Math.sin(time + i * 0.5) * 0.3;
    });
  } else if (currentSection === "tools") {
    symbolMeshes.forEach((s) => {
      s.userData.rotationSpeed = 0.05;
    });
  } else if (currentSection === "projects") {
    characterGroup.rotation.y = time * 0.3;
    symbolMeshes.forEach((s) => (s.userData.speed = 0.02));
  } else if (currentSection === "experience") {
    glowLines.forEach((line, i) => {
      line.material.opacity = (Math.sin(time * 4 + i * 0.8) + 1) / 2;
    });
  } else if (currentSection === "contact") {
    screenFrame.rotation.x = -0.2 + Math.sin(time * 2) * 0.1;
    symbolMeshes.forEach((s) => {
      s.userData.radius = 1 + Math.sin(time * 2 + s.userData.angle) * 0.3;
    });
  }

  charRenderer.render(charScene, charCamera);
}
animateChar();

// Smooth scroll-based character movement with easing
let targetX = 4;
let targetY = 0;
let targetRotY = 0;
let targetScale = 0.8;
let currentX = 4;
let currentY = 0;
let currentRotY = 0;
let currentScale = 0.8;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateCharacterPosition() {
  currentX = lerp(currentX, targetX, 0.05);
  currentY = lerp(currentY, targetY, 0.05);
  currentRotY = lerp(currentRotY, targetRotY, 0.05);
  currentScale = lerp(currentScale, targetScale, 0.05);

  characterGroup.position.set(currentX, currentY, 0);
  characterGroup.rotation.y = currentRotY;
  characterGroup.scale.set(currentScale, currentScale, currentScale);

  requestAnimationFrame(updateCharacterPosition);
}
updateCharacterPosition();

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: true,
  onUpdate: (self) => {
    targetX = -self.progress * 2;
    targetY = self.progress * 0.5;
    targetRotY = self.progress * Math.PI * 0.2;
    currentSection = "hero";
  },
});

ScrollTrigger.create({
  trigger: ".about",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -2 - self.progress * 1.5;
    targetY = 0.5 + self.progress * 0.3;
    targetRotY = Math.PI * 0.2 + self.progress * Math.PI * 0.25;
    targetScale = 1 + self.progress * 0.05;
    currentSection = "about";
  },
});

ScrollTrigger.create({
  trigger: ".subsection:nth-of-type(1)",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -3.5 + self.progress * 0.8;
    targetY = 0.8 - self.progress * 0.2;
    targetRotY = Math.PI * 0.45 + self.progress * Math.PI * 0.15;
    currentSection = "philosophy";
  },
});

ScrollTrigger.create({
  trigger: ".subsection:nth-of-type(2)",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -2.7 + self.progress * 0.5;
    targetY = 0.6 + self.progress * 0.3;
    targetRotY = Math.PI * 0.6 + self.progress * Math.PI * 0.2;
    currentSection = "values";
  },
});

ScrollTrigger.create({
  trigger: "#expertise",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -2.2 + self.progress * 1.2;
    targetY = 0.9 - self.progress * 0.4;
    targetRotY = Math.PI * 0.8 + self.progress * Math.PI * 0.2;
    targetScale = 1.05 + self.progress * 0.1;
    currentSection = "expertise";
  },
});

ScrollTrigger.create({
  trigger: ".subsection:has(.process-steps)",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -1 + self.progress * 0.8;
    targetY = 0.5 - self.progress * 0.3;
    targetRotY = Math.PI + self.progress * Math.PI * 0.2;
    currentSection = "process";
  },
});

ScrollTrigger.create({
  trigger: ".subsection:last-of-type",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = -0.2 + self.progress * 1;
    targetY = 0.2 + self.progress * 0.4;
    targetRotY = Math.PI * 1.2 + self.progress * Math.PI * 0.15;
    currentSection = "tools";
  },
});

ScrollTrigger.create({
  trigger: ".projects",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = 0.8 + self.progress * 1.5;
    targetY = 0.6 - self.progress * 1;
    targetRotY = Math.PI * 1.35 - self.progress * Math.PI * 0.3;
    targetScale = 1.15 - self.progress * 0.15;
    currentSection = "projects";
  },
});

ScrollTrigger.create({
  trigger: ".experience",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = 2.3 - self.progress * 0.8;
    targetY = -0.4 + self.progress * 0.5;
    targetRotY = Math.PI * 1.05 + self.progress * Math.PI * 0.25;
    targetScale = 1 + self.progress * 0.05;
    currentSection = "experience";
  },
});

ScrollTrigger.create({
  trigger: ".contact",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: (self) => {
    targetX = 1.5 - self.progress * 3.5;
    targetY = 0.1 - self.progress * 0.4;
    targetRotY = Math.PI * 1.3 + self.progress * Math.PI * 1.2;
    targetScale = 1.05 - self.progress * 0.15;
    currentSection = "contact";
  },
});

// Loader Animation (6 seconds)
const loader = document.querySelector(".loader");
const loaderBar = document.querySelector(".loader-progress-bar");
const loaderPercentage = document.querySelector(".loader-percentage");
const codeLines = document.querySelectorAll(".code-line");

gsap.to(codeLines, {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: 0.15,
  ease: "power2.out",
});

let percentage = 0;
const loadDuration = 6000;
const startTime = Date.now();

function updateLoader() {
  const elapsed = Date.now() - startTime;
  percentage = Math.min((elapsed / loadDuration) * 100, 100);
  loaderPercentage.textContent = Math.floor(percentage) + "%";
  loaderBar.style.width = percentage + "%";

  if (percentage < 100) {
    requestAnimationFrame(updateLoader);
  } else {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      onComplete: () => {
        loader.style.display = "none";
        document.body.style.overflow = "auto";
        initAnimations();
      },
    });
  }
}
updateLoader();

function initAnimations() {
  // Rotating text
  const rotatingText = document.querySelector(".rotating-text");
  const texts = [
    "UI/UX Developer",
    "Creative Developer",
    "Animation Specialist",
    "Web Designer",
    "Front-End Expert",
  ];
  let textIndex = 0;

  function rotateText() {
    gsap.to(rotatingText, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        textIndex = (textIndex + 1) % texts.length;
        rotatingText.textContent = texts[textIndex];
        gsap.to(rotatingText, { opacity: 1, y: 0, duration: 0.3 });
      },
    });
  }
  setInterval(rotateText, 3000);

  // Cursor
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      gsap.to(cursor, { scale: 1.5, duration: 0.3 }),
    );
    el.addEventListener("mouseleave", () =>
      gsap.to(cursor, { scale: 1, duration: 0.3 }),
    );
  });

  // Magnetic effect on cards and interactive elements
  const magneticElements = document.querySelectorAll(
    ".card, .cta-button, .project-card, .process-number, .contact-email, .social-links a",
  );

  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });

  // Parallax effect on sections
  const parallaxSections = document.querySelectorAll(
    ".subsection, .projects, .about",
  );

  parallaxSections.forEach((section) => {
    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const cards = section.querySelectorAll(".card, .project-image, .card h3");
      cards.forEach((card, i) => {
        gsap.to(card, {
          x: x * (20 + i * 5),
          y: y * (20 + i * 5),
          rotationY: x * 5,
          rotationX: -y * 5,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });

    section.addEventListener("mouseleave", () => {
      const cards = section.querySelectorAll(".card, .project-image, .card h3");
      cards.forEach((card) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  });

  // Project cards special hover
  document.querySelectorAll(".project-card").forEach((card) => {
    const image = card.querySelector(".project-image");
    const title = card.querySelector("h3");

    card.addEventListener("mouseenter", () => {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(title, {
        x: 10,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(title, {
        x: 0,
        duration: 0.3,
      });
    });
  });

  // Timeline animations
  gsap.from(".timeline-item", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
    scrollTrigger: {
      trigger: ".timeline",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  // Timeline items hover effect
  document.querySelectorAll(".timeline-content").forEach((content) => {
    content.addEventListener("mouseenter", () => {
      gsap.to(content, {
        scale: 1.05,
        boxShadow: "0 30px 80px rgba(99, 102, 241, 0.3)",
        duration: 0.3,
      });
    });

    content.addEventListener("mouseleave", () => {
      gsap.to(content, {
        scale: 1,
        boxShadow: "0 0 0 rgba(99, 102, 241, 0)",
        duration: 0.3,
      });
    });
  });

  // About section animations
  gsap.from(".about-placeholder video", {
    x: -100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".about-placeholder",
      start: "top 70%",
      end: "top 30%",
      toggleActions: "play none none reverse",
    },
  });
  // Timeline progress
  ScrollTrigger.create({
    trigger: ".timeline",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onUpdate: (self) => {
      document.querySelector(".timeline-progress").style.height =
        self.progress * 100 + "%";
    },
  });

  gsap.from(".about-content h2", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".about-content",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".about-content p", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".about-content",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".skill-tag", {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".skills",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // Contact section
  gsap.from(".contact h2", {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".contact",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".contact p", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    scrollTrigger: {
      trigger: ".contact",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  });

  // Process steps rotation on hover
  document.querySelectorAll(".process-number").forEach((num) => {
    num.addEventListener("mouseenter", () => {
      gsap.to(num, {
        rotation: 360,
        scale: 1.2,
        duration: 0.6,
        ease: "back.out(2)",
      });
    });

    num.addEventListener("mouseleave", () => {
      gsap.to(num, {
        rotation: 0,
        scale: 1,
        duration: 0.4,
      });
    });
  });

  // Footer tech badges wave effect
  const techBadges = document.querySelectorAll(".tech-badge");
  document.querySelector(".footer-tech")?.addEventListener("mouseenter", () => {
    techBadges.forEach((badge, i) => {
      gsap.to(badge, {
        y: -5,
        duration: 0.3,
        delay: i * 0.05,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    });
  });

  // Hero image 3D tilt effect
  const heroImage = document.querySelector(".developer-image");
  if (heroImage) {
    heroImage.addEventListener("mousemove", (e) => {
      const rect = heroImage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(heroImage, {
        rotationY: x * 20,
        rotationX: -y * 20,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    heroImage.addEventListener("mouseleave", () => {
      gsap.to(heroImage, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  }

  // Section title underline animation on scroll
  gsap.utils.toArray(".section-title, .subsection-title").forEach((title) => {
    ScrollTrigger.create({
      trigger: title,
      start: "top 80%",
      onEnter: () => {
        gsap.from(title, {
          backgroundPosition: "0% 0%",
          duration: 1,
          ease: "power2.out",
        });
      },
    });
  });

  // Hero animations
  gsap.from(".hero h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });
  gsap.from(".hero-subtitle", { y: 50, opacity: 0, duration: 1, delay: 0.3 });
  gsap.from(".hero-description", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
  });
  gsap.from(".cta-button", { y: 30, opacity: 0, duration: 0.8, delay: 0.7 });

  // Developer image animations
  gsap.from(".developer-image", {
    scale: 0,
    opacity: 0,
    rotation: 180,
    duration: 1.5,
    delay: 0.4,
    ease: "back.out(1.7)",
  });
  gsap.from(".ring", {
    scale: 0,
    opacity: 0,
    duration: 1.2,
    delay: 0.8,
    stagger: 0.15,
    ease: "power2.out",
  });

  // Section animations
  gsap.utils.toArray(".card").forEach((card) => {
    gsap.from(card, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils.toArray(".process-step").forEach((step) => {
    gsap.from(step, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: step,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // About section with stagger
  gsap.from(".about-content h2", {
    x: -100,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: ".about", start: "top 70%" },
  });
  gsap.from(".about-content p", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: { trigger: ".about", start: "top 70%" },
  });
  gsap.from(".skill-tag", {
    scale: 0,
    rotation: 360,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    scrollTrigger: { trigger: ".skills", start: "top 80%" },
  });
}

window.addEventListener("resize", () => {
  bgCamera.aspect = window.innerWidth / window.innerHeight;
  bgCamera.updateProjectionMatrix();
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  charCamera.aspect = window.innerWidth / window.innerHeight;
  charCamera.updateProjectionMatrix();
  charRenderer.setSize(window.innerWidth, window.innerHeight);
});
