// THEME SWITCHER
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeIcon.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// TEXT SCRAMBLE EFFECT
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--gold); opacity: 0.5;">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble effect on load
window.addEventListener("load", () => {
  setTimeout(() => {
    const scramble1 = new TextScramble(
      document.getElementById("scrambleText1"),
    );
    const scramble2 = new TextScramble(
      document.getElementById("scrambleText2"),
    );

    scramble1.setText("OZANCAN");
    setTimeout(() => scramble2.setText("DIREK"), 200);
  }, 1600);
});

// TYPING TEXT EFFECT
const texts = [
  "C#, ASP.NET Core, Java, Spring Boot, React & More",
  "Turning ideas into scalable software",
  "Code · Create · Innovate",
  "Consistency beats motivation",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typingText");

function typeText() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typeSpeed = 500;
  }

  setTimeout(typeText, typeSpeed);
}

setTimeout(typeText, 3000);

// MAGNETIC BUTTONS
const magneticButtons = document.querySelectorAll(
  ".magnetic-btn, .social-item, .project-card",
);

if (window.innerWidth > 768) {
  magneticButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

// GITHUB PROJECTS API
async function fetchGitHubProjects() {
  const username = "OzancanDirek";
  const projectsGrid = document.getElementById("projectsGrid");

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    );
    const repos = await response.json();

    if (repos.message === "Not Found") {
      projectsGrid.innerHTML =
        '<p style="text-align: center; color: var(--text-secondary);">Projeler yüklenemedi.</p>';
      return;
    }

    projectsGrid.innerHTML = repos
      .map(
        (repo) => `
            <div class="project-card reveal-element">
                <div class="project-header">
                    <div class="project-icon">📦</div>
                    <div class="project-stats">
                        <span class="stat-item">⭐ ${repo.stargazers_count}</span>
                        <span class="stat-item">🔀 ${repo.forks_count}</span>
                    </div>
                </div>
                <h3>${repo.name}</h3>
                <p>${repo.description || "Açıklama eklenmemiş."}</p>
                ${
                  repo.language
                    ? `
                    <div class="project-tags">
                        <span class="tag">${repo.language}</span>
                    </div>
                `
                    : ""
                }
                <a href="${repo.html_url}" class="project-link" target="_blank">
                    Projeyi Görüntüle
                </a>
            </div>
        `,
      )
      .join("");

    document.querySelectorAll(".project-card").forEach((el) => {
      observer.observe(el);
    });
  } catch (error) {
    console.error("GitHub API Error:", error);
    projectsGrid.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">Projeler yüklenirken bir hata oluştu.</p>';
  }
}

// PARALLAX SCROLLING
let parallaxElements = [];

window.addEventListener("load", () => {
  parallaxElements = [
    { el: document.querySelector(".grid-background"), speed: 0.5 },
    { el: document.querySelector(".floating-shapes"), speed: 0.3 },
    { el: document.querySelector("#particles-canvas"), speed: 0.2 },
  ];
});

function parallaxScroll() {
  const scrolled = window.pageYOffset;

  parallaxElements.forEach((item) => {
    if (item.el) {
      const yPos = -(scrolled * item.speed);
      item.el.style.transform = `translateY(${yPos}px)`;
    }
  });

  requestAnimationFrame(parallaxScroll);
}

if (window.innerWidth > 768) {
  parallaxScroll();
}

// ORIGINAL CODE (OPTIMIZED)
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    fetchGitHubProjects();
  }, 1500);
});

// Custom Cursor
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = 0,
  mouseY = 0;
let followerX = 0,
  followerY = 0;

if (window.innerWidth > 768) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverElements = document.querySelectorAll(
    "a, button, .hobby-card, .interest-card-modern, .project-card",
  );
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

// Particles
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = window.innerWidth > 768 ? 80 : 40;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles(currentTime) {
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}
animateParticles(0);

// Scroll Progress
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("scrollProgress").style.width = scrollPercent + "%";
});

// Form Submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  // e.preventDefault(); <-- Bu satırın önüne // ekledik, artık mail gidecek.
  alert("Mesajın gönderiliyor! En kısa sürede dönüş yapacağım 🚀");
});

// Scroll Reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".reveal-element")
  .forEach((el) => observer.observe(el));

// 3D Tilt Effect
if (window.innerWidth > 768) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
