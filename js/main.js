/**
 * Umais Ur Rehman — Main Interactive JavaScript Engine
 * Handles Private Access Gate, Dynamic Profile Details, Canvas Particles,
 * Project Filtering, Modal View, Theme Toggle, Skills Animation, and UX.
 */

// Route to admin if #admin or ?admin appears in URL
if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
  window.location.replace('admin.html');
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initAccessGate();
  loadProfileDetails();
  initParticleCanvas();
  initScrollNav();
  initPortfolioProjects();
  initSkillsAnimation();
  initCounterStats();
  initContactForm();
  initScrollReveals();
});

/* ==========================================================================
   1. Portfolio Access Token Gate (Private Mode)
   ========================================================================== */
function initAccessGate() {
  const gateOverlay = document.getElementById("access-gate-overlay");
  const mainContent = document.getElementById("portfolio-main-content");
  const tokenForm = document.getElementById("access-token-gate-form");
  const tokenInput = document.getElementById("gate-token-input");
  const togglePassBtn = document.getElementById("toggle-admin-pass-unlock");
  const passForm = document.getElementById("gate-passcode-form");
  const passInput = document.getElementById("gate-passcode-input");

  if (!gateOverlay || !mainContent) return;

  // Check if unlocked
  if (isPortfolioUnlocked()) {
    gateOverlay.style.display = "none";
    mainContent.style.display = "block";
  } else {
    gateOverlay.style.display = "flex";
    mainContent.style.display = "none";
  }

  // Token form submission
  if (tokenForm) {
    tokenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredToken = tokenInput?.value.trim();
      if (unlockPortfolioWithToken(enteredToken)) {
        showToast("Access Token authorized. Welcome!");
        unlockAndReveal();
      } else {
        alert("Invalid Access Token. Please verify and try again.");
      }
    });
  }

  // Admin passcode alternative unlock toggle
  if (togglePassBtn && passForm) {
    togglePassBtn.addEventListener("click", () => {
      passForm.style.display = passForm.style.display === "none" ? "block" : "none";
      if (passForm.style.display === "block" && passInput) passInput.focus();
    });
  }

  // Admin passcode unlock submission
  if (passForm) {
    passForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredPass = passInput?.value.trim();
      const success = await unlockPortfolioWithPassword(enteredPass);
      if (success) {
        showToast("Administrator verified. Master access granted!");
        unlockAndReveal();
      } else {
        alert("Incorrect passcode.");
      }
    });
  }

  function unlockAndReveal() {
    gateOverlay.style.transition = "opacity 0.4s ease";
    gateOverlay.style.opacity = "0";
    setTimeout(() => {
      gateOverlay.style.display = "none";
      mainContent.style.display = "block";
      // Re-trigger animations
      initSkillsAnimation();
      initCounterStats();
    }, 400);
  }
}

/* ==========================================================================
   2. Dynamic Profile & Personal Details Loader
   ========================================================================== */
function loadProfileDetails() {
  const profile = getProfileDetails();

  // Profile Picture
  const avatarImg = document.getElementById("hero-avatar-img");
  if (avatarImg) {
    if (profile.profileImage) {
      avatarImg.src = profile.profileImage;
      avatarImg.style.display = "block";
    } else {
      avatarImg.src = "assets/img/profile.jpeg";
    }
  }

  // Personal Names and Titles
  const nameElements = document.querySelectorAll(".profile-name-text");
  nameElements.forEach((el) => (el.textContent = profile.name));

  const titleSub = document.getElementById("hero-title-sub");
  if (titleSub) {
    titleSub.textContent = profile.subtitle || profile.title || "Software Developer";
  }

  const heroBio = document.getElementById("hero-bio-text");
  if (heroBio) {
    heroBio.textContent = profile.bio;
  }

  const statusBadge = document.getElementById("hero-status-badge");
  if (statusBadge) {
    statusBadge.textContent = profile.statusBadge || "Available for Freelance & Full-Time Projects";
  }

  // Contact Details
  const cleanPhoneRaw = (profile.phoneRaw || profile.phone || "923074069818").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhoneRaw}?text=Hi%20${encodeURIComponent(profile.name)},%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!`;

  const heroWa = document.getElementById("hero-whatsapp-btn");
  if (heroWa) heroWa.href = whatsappUrl;

  const floatingWa = document.getElementById("floating-whatsapp-btn");
  if (floatingWa) floatingWa.href = whatsappUrl;

  const contactWa = document.getElementById("contact-whatsapp-link");
  if (contactWa) {
    contactWa.href = whatsappUrl;
    const phoneDisplay = document.getElementById("contact-phone-display");
    if (phoneDisplay) phoneDisplay.textContent = profile.phone;
  }

  const emailDisplay = document.getElementById("contact-email-display");
  if (emailDisplay) emailDisplay.textContent = profile.email;

  const heroEmailBtn = document.getElementById("hero-email-copy-btn");
  if (heroEmailBtn) {
    heroEmailBtn.onclick = () => copyToClipboard(profile.email, "Email Address");
  }

  const heroPhoneBtn = document.getElementById("hero-phone-copy-btn");
  if (heroPhoneBtn) {
    heroPhoneBtn.onclick = () => copyToClipboard(profile.phone, "Phone Number");
    const phoneSpan = heroPhoneBtn.querySelector("span");
    if (phoneSpan) phoneSpan.textContent = profile.phone;
  }

  const copyEmailBtn = document.getElementById("contact-email-copy-btn");
  if (copyEmailBtn) {
    copyEmailBtn.onclick = () => copyToClipboard(profile.email, "Email Address");
  }

  const locationDisplay = document.getElementById("contact-location-display");
  if (locationDisplay) locationDisplay.textContent = profile.location;

  const footerLocation = document.getElementById("footer-location-text");
  if (footerLocation) {
    footerLocation.textContent = `${profile.location} • ${profile.phone} • ${profile.email}`;
  }

  const heroGithub = document.getElementById("hero-github-link");
  if (heroGithub) heroGithub.href = profile.githubUrl;

  const heroLinkedin = document.getElementById("hero-linkedin-link");
  if (heroLinkedin) heroLinkedin.href = profile.linkedinUrl;

  const contactGithub = document.getElementById("contact-github-link");
  if (contactGithub) contactGithub.href = profile.githubUrl;

  const contactLinkedin = document.getElementById("contact-linkedin-link");
  if (contactLinkedin) contactLinkedin.href = profile.linkedinUrl;
}

/* ==========================================================================
   3. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const savedTheme = localStorage.getItem("umais_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("umais_theme", newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#theme-toggle-btn i");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

/* ==========================================================================
   4. Background Particles & Constellation Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("canvas-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
  const particles = [];
  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(0, 240, 255, 0.45)" : "rgba(2, 132, 199, 0.35)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const lineColor = isDark ? "rgba(0, 240, 255, 0.05)" : "rgba(2, 132, 199, 0.05)";

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. Scroll Header & Active Navigation Links
   ========================================================================== */
function initScrollNav() {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileToggle = document.getElementById("mobile-toggle-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = navMenu.classList.contains("open") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   6. Portfolio Showcase & Filtering Engine
   ========================================================================== */
let allProjects = [];

function initPortfolioProjects() {
  allProjects = getPortfolioProjects();
  renderProjectCards(allProjects);
  updateFilterCounters(allProjects);
  bindFilterButtons();
}

function updateFilterCounters(projects) {
  const counts = {
    all: projects.length,
    flutter: 0,
    python: 0,
    web: 0,
    photography: 0,
    documentation: 0
  };

  projects.forEach((p) => {
    if (counts.hasOwnProperty(p.category)) {
      counts[p.category]++;
    }
  });

  document.querySelectorAll("[data-filter-count]").forEach((el) => {
    const cat = el.getAttribute("data-filter-count");
    if (counts[cat] !== undefined) {
      el.textContent = counts[cat];
    }
  });
}

function bindFilterButtons() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      filterProjects(filter);
    });
  });
}

function filterProjects(category) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.style.opacity = "0.2";
  grid.style.transform = "scale(0.98)";

  setTimeout(() => {
    let filtered = allProjects;
    if (category !== "all") {
      filtered = allProjects.filter((p) => p.category === category);
    }
    renderProjectCards(filtered);
    grid.style.opacity = "1";
    grid.style.transform = "scale(1)";
  }, 200);
}

function renderProjectCards(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
        <h3 style="margin-bottom: 8px;">No projects found in this category</h3>
        <p>Portfolio works will appear here once added.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects
    .map((project) => {
      const tagsHtml = project.tags
        .slice(0, 4)
        .map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`)
        .join("");

      const categoryBadges = {
        flutter: { icon: "fa-brands fa-flutter", label: "Flutter Dev" },
        python: { icon: "fa-brands fa-python", label: "Python Backend" },
        web: { icon: "fa-solid fa-globe", label: "Web Dev" },
        photography: { icon: "fa-solid fa-camera-retro", label: "Photography" },
        documentation: { icon: "fa-solid fa-file-lines", label: "Documentation" }
      };

      const meta = categoryBadges[project.category] || { icon: "fa-solid fa-layer-group", label: project.categoryLabel || "Project" };

      return `
        <article class="project-card" data-id="${project.id}">
          <div class="project-thumbnail-wrapper">
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="project-img" loading="lazy" onerror="this.src='assets/img/project-flutter-ui.png'">
            <div class="project-category-pill">
              <i class="${meta.icon}"></i> ${meta.label}
            </div>
            <div class="project-overlay">
              <div class="overlay-actions">
                <button class="overlay-btn view-details-btn" title="View Details" onclick="openProjectModal('${project.id}')">
                  <i class="fa-solid fa-expand"></i>
                </button>
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="overlay-btn" title="Source Code"><i class="fa-brands fa-github"></i></a>` : ""}
                ${project.docUrl ? `<a href="${project.docUrl}" target="_blank" rel="noopener" class="overlay-btn" title="Documentation PDF"><i class="fa-solid fa-file-pdf"></i></a>` : ""}
              </div>
            </div>
          </div>
          <div class="project-body">
            <div class="project-meta-row">
              <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(project.date || "Recent")}</span>
              <span><i class="fa-regular fa-building"></i> ${escapeHtml(project.client || "Client Work")}</span>
            </div>
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-subtitle">${escapeHtml(project.subtitle)}</p>
            <div class="project-tags">
              ${tagsHtml}
            </div>
            <div class="project-card-footer">
              <button class="project-link-action" onclick="openProjectModal('${project.id}')">
                Case Study & Specs <i class="fa-solid fa-arrow-right"></i>
              </button>
              <div class="project-links-row">
                ${project.docUrl ? `<a href="${project.docUrl}" target="_blank" class="project-link-action" title="View PDF Document"><i class="fa-solid fa-file-pdf"></i> PDF</a>` : ""}
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

/* ==========================================================================
   7. Project Detail Modal / Lightbox
   ========================================================================== */
window.openProjectModal = function (projectId) {
  const project = allProjects.find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("project-modal-body");
  if (!modal || !modalBody) return;

  const tagsHtml = project.tags
    .map((tag) => `<span class="project-tag" style="font-size: 0.8rem; padding: 5px 12px;">${escapeHtml(tag)}</span>`)
    .join("");

  modalBody.innerHTML = `
    <div style="position: relative; max-height: 420px; overflow: hidden; background: #0b1120; border-top-left-radius: 20px; border-top-right-radius: 20px;">
      <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" style="width: 100%; max-height: 420px; object-fit: contain; margin: 0 auto;" onerror="this.src='assets/img/project-flutter-ui.png'">
    </div>
    <div style="padding: 32px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="section-tag" style="margin-bottom: 0;">${escapeHtml(project.categoryLabel || project.category)}</span>
        <span style="font-size: 0.85rem; color: var(--text-dim);"><i class="fa-regular fa-clock"></i> ${escapeHtml(project.date || "2026")}</span>
      </div>
      <h2 style="font-size: 1.75rem; margin-bottom: 12px;">${escapeHtml(project.title)}</h2>
      <h4 style="color: var(--accent-cyan); font-weight: 500; font-size: 1.05rem; margin-bottom: 18px;">${escapeHtml(project.subtitle)}</h4>
      
      <p style="font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 24px; white-space: pre-line;">
        ${escapeHtml(project.description)}
      </p>

      <div style="margin-bottom: 28px;">
        <h5 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); margin-bottom: 10px;">Tech Stack & Methodologies</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${tagsHtml}
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 14px; padding-top: 20px; border-top: 1px solid var(--border-color);">
        ${
          project.liveUrl
            ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo / Link</a>`
            : ""
        }
        ${
          project.githubUrl
            ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> View GitHub Repo</a>`
            : ""
        }
        ${
          project.docUrl
            ? `<a href="${project.docUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="fa-solid fa-file-pdf"></i> Read Documentation PDF</a>`
            : ""
        }
        <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()" style="margin-left: auto;">Close</button>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeProjectModal = function () {
  const modal = document.getElementById("project-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

window.addEventListener("click", (e) => {
  const modal = document.getElementById("project-modal");
  if (modal && e.target === modal) {
    closeProjectModal();
  }
});

/* ==========================================================================
   8. Skills Animation on Scroll
   ========================================================================== */
function initSkillsAnimation() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  let animated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          document.querySelectorAll(".skill-fill").forEach((bar) => {
            const targetWidth = bar.getAttribute("data-width") || "80%";
            bar.style.width = targetWidth;
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(skillsSection);
}

/* ==========================================================================
   9. Counter Stats Animation
   ========================================================================== */
function initCounterStats() {
  const counterElements = document.querySelectorAll(".metric-number[data-count]");
  if (counterElements.length === 0) return;

  let counted = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counterElements.forEach((el) => {
            const target = parseFloat(el.getAttribute("data-count"));
            const suffix = el.getAttribute("data-suffix") || "";
            const isDecimal = target % 1 !== 0;
            let current = 0;
            const increment = target / 50;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
                clearInterval(timer);
              } else {
                el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
              }
            }, 30);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const metricsStrip = document.querySelector(".metrics-strip");
  if (metricsStrip) observer.observe(metricsStrip);
}

/* ==========================================================================
   10. Contact Form & Clipboard Helpers
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const name = document.getElementById("contact-name")?.value || "";
      const email = document.getElementById("contact-email")?.value || "";
      const subject = document.getElementById("contact-subject")?.value || "Project Inquiry";
      const message = document.getElementById("contact-message")?.value || "";

      if (!name || !email || !message) {
        showToast("Please fill in all required fields.");
        e.preventDefault();
        return;
      }

      if (window.location.protocol === "file:" || window.location.hostname === "localhost") {
        e.preventDefault();
        showToast("Message recorded! Launching your mail client...");
        const profile = getProfileDetails();
        const mailtoUri = `mailto:${profile.email}?subject=${encodeURIComponent(
          subject + " — " + name
        )}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        window.location.href = mailtoUri;
        form.reset();
      } else {
        showToast("Sending message to Umais...");
      }
    });
  }
}

window.copyToClipboard = function (text, label) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast(`Copied ${label || text} to clipboard!`);
    })
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(`Copied ${label || text} to clipboard!`);
    });
};

/* ==========================================================================
   11. Toast Notification Engine
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan);"></i> <span>${escapeHtml(
    message
  )}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ==========================================================================
   12. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll(".reveal-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
