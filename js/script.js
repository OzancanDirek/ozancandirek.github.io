// Performans için debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performans için throttle utility
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Cihaz tespiti
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// THEME SWITCHER
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

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

// MOBILE MENU
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navLinks = document.getElementById("navLinks");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
  });

  // Menü linklerine tıklandığında menüyü kapat
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
    });
  });
}

// TEXT SCRAMBLE EFFECT (sadece desktop)
if (!isMobile) {
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

  window.addEventListener("load", () => {
    setTimeout(() => {
      const scramble1 = new TextScramble(document.getElementById("scrambleText1"));
      const scramble2 = new TextScramble(document.getElementById("scrambleText2"));
      scramble1.setText("OZANCAN");
      setTimeout(() => scramble2.setText("DIREK"), 200);
    }, 1600);
  });
}

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

// MAGNETIC BUTTONS (sadece desktop ve dokunmatik değilse)
if (!isMobile && !isTouch) {
  const magneticButtons = document.querySelectorAll(".magnetic-btn, .social-item, .project-card");

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

// GITHUB PROJECTS API (optimize edilmiş)
async function fetchGitHubProjects() {
  const username = "OzancanDirek";
  const projectsGrid = document.getElementById("projectsGrid");

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      { cache: 'force-cache' }
    );
    const repos = await response.json();

    if (repos.message === "Not Found") {
      projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Projeler yüklenemedi.</p>';
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
                ${repo.language ? `<div class="project-tags"><span class="tag">${repo.language}</span></div>` : ""}
                <a href="${repo.html_url}" class="project-link" target="_blank">Projeyi Görüntüle</a>
            </div>
        `
      )
      .join("");

    // Yeni eklenen elementleri observe et
    document.querySelectorAll(".project-card").forEach((el) => {
      observer.observe(el);
    });
  } catch (error) {
    console.error("GitHub API Error:", error);
    projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Projeler yüklenirken bir hata oluştu.</p>';
  }
}

// PARALLAX SCROLLING (sadece desktop ve performans optimize edilmiş)
if (!isMobile) {
  let parallaxElements = [];
  let ticking = false;

  window.addEventListener("load", () => {
    parallaxElements = [
      { el: document.querySelector(".grid-background"), speed: 0.5 },
      { el: document.querySelector(".floating-shapes"), speed: 0.3 },
      { el: document.querySelector("#particles-canvas"), speed: 0.2 },
    ];
  });

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach((item) => {
      if (item.el) {
        const yPos = -(scrolled * item.speed);
        item.el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// LOADER
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    fetchGitHubProjects();
  }, 1500);
});

// CUSTOM CURSOR (sadece desktop ve dokunmatik değilse)
if (!isMobile && !isTouch) {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverElements = document.querySelectorAll("a, button, .hobby-card, .interest-card-modern, .project-card");
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
} else {
  // Mobilde cursor elementlerini gizle
  document.querySelector(".cursor")?.remove();
  document.querySelector(".cursor-follower")?.remove();
}

// PARTICLES (optimize edilmiş, mobilde daha az parçacık)
const canvas = document.getElementById("particles-canvas");
if (canvas && !isMobile) {
  const ctx = canvas.getContext("2d", { alpha: true });
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", debounce(resizeCanvas, 250));

  const particleCount = isMobile ? 20 : 60;
  const particles = [];

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

  let animationId;
  function animateParticles() {
    animationId = requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
  animateParticles();

  // Sayfa görünür değilken animasyonu durdur
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animateParticles();
    }
  });
} else if (canvas && isMobile) {
  canvas.remove(); // Mobilde canvas'ı tamamen kaldır
}

// SCROLL PROGRESS (optimize edilmiş)
const updateScrollProgress = throttle(() => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("scrollProgress").style.width = scrollPercent + "%";
}, 50);

window.addEventListener("scroll", updateScrollProgress, { passive: true });

// FORM SUBMISSION
document.getElementById("contactForm").addEventListener("submit", (e) => {
  alert("Mesajın gönderiliyor! En kısa sürede dönüş yapacağım 🚀");
});

// SCROLL REVEAL (optimize edilmiş)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Bir kez göründükten sonra gözlemlemeyi durdur
      }
    });
  },
  { threshold: 0.1, rootMargin: "50px" }
);

document.querySelectorAll(".reveal-element").forEach((el) => observer.observe(el));

// 3D TILT EFFECT (sadece desktop ve dokunmatik değilse)
if (!isMobile && !isTouch) {
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

// 3D TILT EFFECT (sadece desktop ve dokunmatik değilse) - BASIT VE PERFORMANSLI
if (!isMobile && !isTouch) {
  document.querySelectorAll(".hobby-card").forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      card.style.transition = "transform 0.1s ease-out";
    });

    card.addEventListener("mousemove", throttle((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Daha yumuşak rotasyon için değerler düşürüldü
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    }, 16)); // 60fps için throttle
    
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      card.style.transform = "";
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});