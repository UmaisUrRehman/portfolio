/**
 * Portfolio Data Store - Umais Ur Rehman
 * Manages projects, personal profile details, and profile photo.
 * Synced with localStorage so the Admin Panel can update everything seamlessly.
 */

// Default Profile Details extracted from CV
const DEFAULT_PROFILE = {
  name: "Umais Ur Rehman",
  title: "Software Developer",
  subtitle: "Flutter, Python & Full-Stack Engineer",
  bio: "IT graduate and full-stack software engineer with proven hands-on expertise building cross-platform applications using Flutter and developing robust, high-concurrency backend services with Python (FastAPI, Flask). Experienced in managing full product lifecycles, configuring Ubuntu Linux servers, and deploying production solutions with Nginx and Gunicorn.",
  phone: "+92 307 4069818",
  phoneRaw: "923074069818",
  email: "umaisurrehman47@gmail.com",
  location: "Gujranwala, Pakistan",
  githubUrl: "https://github.com/UmaisUrRehman",
  linkedinUrl: "https://www.linkedin.com/in/umaisurrehman",
  statusBadge: "Available for Freelance & Full-Time Projects",
  profileImage: "assets/img/profile.jpeg"
};

// Default Projects extracted from CV and real files
const DEFAULT_PROJECTS = [
  {
    id: "medisim-platform",
    title: "MediSim — Medical Learning & Simulation Platform",
    category: "python",
    categoryLabel: "Python Backend",
    subtitle: "Real-time vitals simulation, AI chatbot & teacher session controllers",
    description: "Final Year University Project (2026). Engineered an advanced medical simulation platform featuring interactive vital graph simulations, live quizzes, teacher-student session controllers, and AI diagnostic chat integration. Built high-throughput backend services using FastAPI and MySQL alongside Flutter mobile client interfaces.",
    image: "assets/img/project-medisim-erd.jpg",
    tags: ["FastAPI", "Python", "Flutter", "MySQL", "WebSockets", "AI Integration"],
    liveUrl: "",
    githubUrl: "https://github.com/UmaisUrRehman",
    docUrl: "assets/docs/MediSim-Documentation.pdf",
    featured: true,
    client: "Punjab University Capstone",
    date: "2026"
  },
  {
    id: "flutter-foundations-ui",
    title: "Flutter Foundations & Dynamic Form UI Suite",
    category: "flutter",
    categoryLabel: "Flutter Dev",
    subtitle: "Robust input validation engine, reactive forms & widget architecture",
    description: "A comprehensive implementation of Flutter widget architecture, dynamic forms, FocusNode lifecycle management, real-time Regex validation, and custom feedback alerts (SnackBars & modal dialogs). Features modular code architecture and automated widget test suites.",
    image: "assets/img/project-flutter-ui.png",
    tags: ["Flutter", "Dart", "Clean Architecture", "Widget Testing", "State Management"],
    liveUrl: "https://github.com/UmaisUrRehman/flutter_foundations_ui",
    githubUrl: "https://github.com/UmaisUrRehman/flutter_foundations_ui",
    docUrl: "assets/docs/Flutter-Foundations-Documentation.pdf",
    featured: true,
    client: "Open Source & Academic",
    date: "2026"
  },
  {
    id: "iconnecto-web-portal",
    title: "iConnecto Full-Stack Web Portal & IT Operations",
    category: "web",
    categoryLabel: "Web Dev",
    subtitle: "Enterprise full-stack web applications with Flask, SQLite & responsive UI",
    description: "Engineered and maintained full-stack web applications for iConnecto using Python (Flask) and SQLite. Designed responsive, secure user portals, streamlined hardware inventory tracking, automated internal workflows, and guaranteed optimal performance.",
    image: "assets/img/project-flutter-arch.png",
    tags: ["Python", "Flask", "SQLite", "JavaScript", "HTML5", "CSS3", "REST APIs"],
    liveUrl: "",
    githubUrl: "https://github.com/UmaisUrRehman",
    docUrl: "",
    featured: true,
    client: "iConnecto",
    date: "2025 - 2026"
  },
  {
    id: "ubuntu-server-deployment",
    title: "Ubuntu Production Deployment & Nginx Reverse Proxy",
    category: "python",
    categoryLabel: "Python Backend",
    subtitle: "High-uptime Linux application serving with Gunicorn, Nginx & DNS management",
    description: "Engineered end-to-end production server infrastructure on Ubuntu Server. Configured Gunicorn WSGI application servers, Nginx reverse proxy routing, SSL/TLS certificate automation, DNS record propagation, and network throughput optimization for client apps.",
    image: "assets/img/project-state-transition.jpeg",
    tags: ["Ubuntu Server", "Nginx", "Gunicorn", "Linux CLI", "SSL/TLS", "DevOps"],
    liveUrl: "",
    githubUrl: "https://github.com/UmaisUrRehman",
    docUrl: "",
    featured: false,
    client: "iConnecto Infrastructure",
    date: "2025 - 2026"
  },
  {
    id: "medisim-architecture-docs",
    title: "MediSim Architectural Blueprints & UML Specification",
    category: "documentation",
    categoryLabel: "Documentation",
    subtitle: "Complete system blueprints: UML Class diagrams, ERD, and state machine models",
    description: "Authored end-to-end technical documentation for the MediSim simulation platform. Formulated relational entity-relationship diagrams (ERD), comprehensive UML class specifications, state transition workflows, and automated test strategies.",
    image: "assets/img/project-uml-class.jpg",
    tags: ["UML", "ER Diagrams", "System Architecture", "Technical Writing", "Database Design"],
    liveUrl: "",
    githubUrl: "https://github.com/UmaisUrRehman",
    docUrl: "assets/docs/MediSim-Documentation.pdf",
    featured: true,
    client: "Medical Simulation Group",
    date: "2026"
  },
  {
    id: "creative-portrait-photography",
    title: "Studio & Outdoor Portraiture Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "High-dynamic range Nikon DSLR RAW capture, creative lighting & color grading",
    description: "Creative portrait and event photography captured on Nikon DSLR cameras in RAW (.NEF) format. Processed with precision Adobe Camera Raw color grading, dynamic range balancing, and bespoke Photoshop skin retouching.",
    image: "assets/img/photo-portrait-sample.jpeg",
    tags: ["Nikon DSLR", "Portrait Photography", "Adobe Photoshop", "RAW Processing", "Color Grading"],
    liveUrl: "",
    githubUrl: "",
    docUrl: "",
    featured: true,
    client: "Private Clients",
    date: "2024 - 2026"
  },
  {
    id: "bespoke-graphic-branding",
    title: "Bespoke Commercial Branding & Promotional Design",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Custom flex banners, promotional brochures & digital marketing assets",
    description: "Delivered premium graphic assets, bespoke templates, digital flyers, and social media creative packages for local businesses and private clients during 4 years as a self-employed multimedia producer. Certified by Aptech Institute in Graphic Design.",
    image: "assets/img/creative-design-sample.jpg",
    tags: ["Graphic Design", "Adobe Photoshop", "Adobe Premiere Pro", "Branding", "Aptech Certified"],
    liveUrl: "",
    githubUrl: "",
    docUrl: "",
    featured: false,
    client: "Local Businesses & Brands",
    date: "2021 - 2024"
  }
];

const STORAGE_PROJECTS_KEY = "umais_portfolio_projects_v1";
const STORAGE_PROFILE_KEY = "umais_portfolio_profile_v1";

/* ==========================================================================
   Project Storage Helpers
   ========================================================================== */
function getPortfolioProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read projects from localStorage, using default data.", err);
  }
  savePortfolioProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
}

function savePortfolioProjects(projects) {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error("Failed to save projects to localStorage:", err);
    return false;
  }
}

function resetPortfolioProjects() {
  savePortfolioProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
}

/* ==========================================================================
   Profile & Personal Details Storage Helpers
   ========================================================================== */
function getProfileDetails() {
  try {
    const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    }
  } catch (err) {
    console.warn("Could not read profile from localStorage, using defaults.", err);
  }
  saveProfileDetails(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

function saveProfileDetails(profile) {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error("Failed to save profile to localStorage:", err);
    return false;
  }
}

function resetProfileDetails() {
  saveProfileDetails(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}
