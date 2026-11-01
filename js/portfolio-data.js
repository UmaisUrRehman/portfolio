/**
 * Portfolio Data Store - Umais Ur Rehman
 * Manages projects, personal profile details, and art gallery items.
 * Synced with localStorage so the Admin Panel can update everything seamlessly.
 */

// Default Profile Details extracted from CV
const DEFAULT_PROFILE = {
  name: "Umais Ur Rehman",
  title: "Software Developer",
  subtitle: "Flutter, Python & Full-Stack Engineer",
  bio: "IT graduate and software developer specializing in medical telemetry systems, cross-platform mobile apps with Flutter, and high-concurrency backends with Python (FastAPI, Flask). Creator of MediSim, an advanced clinical simulation ecosystem with live vitals, WebSocket telemetry, and AI clinical mentoring.",
  phone: "+92 307 4069818",
  phoneRaw: "923074069818",
  email: "umaisurrehman47@gmail.com",
  location: "Gujranwala, Pakistan",
  githubUrl: "https://github.com/UmaisUrRehman",
  linkedinUrl: "https://www.linkedin.com/in/umaisurrehman",
  statusBadge: "Available for Freelance & Full-Time Projects",
  profileImage: "assets/img/profile.jpeg"
};

// Default Focused Projects: MediSim FYP and Training Monitor App
const DEFAULT_PROJECTS = [
  {
    id: "medisim-fyp",
    title: "MediSim: Full-Scale AI-Powered Clinical Simulation & Telemetry Ecosystem",
    category: "python",
    categoryLabel: "⭐ Flagship FYP",
    subtitle: "Cross-platform emergency training suite with synchronized 60 FPS vital waveforms, WebSockets, Groq API, and custom fine-tuned NLP models",
    description: "🚑 Executive Overview:\nMediSim is an intelligent, multi-tier clinical training ecosystem built as the official University Final Year Project (FYP) to bridge the gap between theoretical medical education and high-stress emergency response. Moving beyond physical mannequins, MediSim combines a live Flask-based Instructor Web Station, a high-performance FastAPI backend, and a native Flutter mobile application into a unified clinical simulation network.\n\nInstructors can remotely orchestrate acute cardiac and respiratory emergencies from the cloud, broadcasting physiological parameter changes across connected student terminals in sub-100ms via WebSockets. The platform integrates a dual-engine AI core: an on-device Retrieval-Augmented Generation (RAG) clinical mentor powered by a fine-tuned Google FLAN-T5 model and Groq Cloud API, alongside a custom T5 sequence-to-sequence quiz generation engine that digests official medical curricula into automated, non-repetitive multiple-choice assessments.\n\n🌟 Key Architectural Highlights:\n• Instructor Web Control Station (Live Production Web App): Deployed Flask web dashboard allowing educators to configure active training rooms, trigger emergency scenarios, and manipulate live vitals (Heart Rate, Blood Pressure, SpO2, EtCO2).\n• Trainee Mobile Terminal (Flutter): High-refresh-rate cross-platform app rendering continuous 60 FPS physiological waveforms (ECG, pulse oximetry plethysmograms, capnography) using custom vector canvas pipelines.\n• Commercial Client Validation: Contracted by iConnecto to design and engineer mobile UI prototypes and vital waveform monitoring components.\n• Sub-100ms WebSocket Synchronization & QR Pairing: Centralized asynchronous SessionManager that serializes and broadcasts multi-parameter physiological states to dozens of concurrent terminals with instant camera QR pairing.\n• Dual-Tier Clinical AI & Fast Inference: Local textbook RAG via Sentence-Transformers and Meta FAISS, locally fine-tuned FLAN-T5 Base (248M) for hallucination-resistant clinical guidance, and Groq Cloud LPU integration for sub-second responses.\n• Automated 3-Tier MCQ Quiz Engine: Dynamic PDF ingestion with sliding windows, fine-tuned T5-small generation, and SHA-256 deduplication.\n• Multi-role RBAC & Security: Bcrypt password hashing, signed JWT tokens, and automated email OTP 2-Factor Authentication.",
    image: "assets/img/MediSim_Ecosystem_Cover.jpg",
    showcaseImage: "assets/img/MediSim_Unified_Showcase.jpg",
    tags: ["FastAPI", "WebSockets (<100ms)", "Groq LPU API", "FLAN-T5 RAG", "Flutter (60 FPS)", "Flask Portal", "Meta FAISS", "MySQL / MariaDB", "iConnecto Pilot"],
    liveUrl: "",
    githubUrl: "https://github.com/Muhammadzubair0341/medisim-fyp",
    docUrl: "assets/docs/MediSim-Documentation.pdf",
    featured: true,
    client: "Punjab University Capstone & iConnecto Commercial Contract",
    date: "2026"
  },
  {
    id: "training-monitor-app",
    title: "Clinical Training Monitor App (Live Telemetry & Instructor Control)",
    category: "flutter",
    categoryLabel: "Commercial Pilot & App",
    subtitle: "High-performance medical monitor with real-time waveform visualization, session pairing, and instructor control dashboard",
    description: "🩺 Project Overview:\nThe Training Monitor App serves as the dedicated clinical monitoring and interactive telemetry display of the medical simulation suite. Engineered in Flutter with native vector rendering, it turns mobile and tablet screens into realistic hospital-grade bedside patient monitors (ECG, SpO2, Blood Pressure, and EtCO2).\n\n🌟 Engineering & Commercial Highlights:\n• Contracted by iConnecto to design and engineer mobile UI prototypes and vital waveform monitoring components.\n• Real-Time Waveform Rendering: Developed custom CustomPainter 60 FPS vector canvas rendering algorithms that plot continuous electrocardiogram sweeps, plethysmographs, and capnography curves without frame drops.\n• Web Instructor Station Synchronization: Pairs instantaneously with the live Flask Instructor Web Control Station via 6-digit room IDs or camera QR code scans.\n• Scenario Execution & Adaptive Response: Students receive immediate dynamic vital changes as instructors manipulate cardiac arrest, severe hypoxia, or anaphylaxis scenarios.\n• Clean Architecture: Modular separation into Presentation, Application (Bloc/Provider), and Telemetry Network layers.",
    image: "assets/img/training_monitor_cover.png",
    showcaseImage: "assets/img/MediSim_Unified_Showcase.jpg",
    tags: ["Flutter", "Dart", "CustomPainter 60FPS", "WebSockets", "Flask Web Portal", "Telemetry", "iConnecto Pilot"],
    liveUrl: "",
    githubUrl: "https://github.com/UmaisUrRehman",
    docUrl: "assets/docs/MediSim-Documentation.pdf",
    featured: true,
    client: "iConnecto Commercial Pilot & Healthcare Training",
    date: "2025 - 2026"
  }
];

// Default Art Gallery Data (Photography, Creative Digital Designs & Commercial Branding)
const DEFAULT_GALLERY = [
  // Real Nikon Photography & Portraiture
  {
    id: "photo-1",
    category: "photography",
    title: "Cinematic Atmosphere Portrait (Smoke & Cold Tones)",
    subtitle: "Nikon RAW Capture",
    description: "High-contrast character portraiture featuring atmospheric vapor, razor-sharp facial details, and moody cyan-slate color temperature.",
    image: "assets/img/gallary/photography/DSC_0153_1.jpg",
    tags: ["Nikon DSLR", "RAW .NEF", "Atmospheric Portrait"]
  },
  {
    id: "photo-2",
    category: "photography",
    title: "Environmental Field Portrait — Natural Golden Hour",
    subtitle: "Outdoor RAW Capture",
    description: "Crisp outdoor male portrait showcasing shallow depth-of-field, organic foreground bokeh, and warm natural rim lighting.",
    image: "assets/img/gallary/photography/DSC_0257.jpg",
    tags: ["Natural Light", "Shallow DOF", "Bokeh"]
  },
  {
    id: "photo-3",
    category: "photography",
    title: "Candid Outdoor Profile — Daylight Precision",
    subtitle: "Sharp Focus Portrait",
    description: "Direct daylight portraiture with balanced dynamic range, rich skin tonality, and high-resolution textural sharpness.",
    image: "assets/img/gallary/photography/DSC_0259.jpg",
    tags: ["Candid", "High Definition", "Nikon RAW"]
  },
  {
    id: "photo-4",
    category: "photography",
    title: "Traditional Elegance Portraiture",
    subtitle: "Field Depth Framing",
    description: "Environmental portrait framed against organic foliage with soft shadow roll-off and rich fabric detail reproduction.",
    image: "assets/img/gallary/photography/DSC_0260.jpg",
    tags: ["Environmental", "Color Harmony", "DSLR"]
  },
  {
    id: "photo-5",
    category: "photography",
    title: "Canopy Sunburst & Forest Geometry",
    subtitle: "Nature & High Dynamic Range",
    description: "Wide dynamic range woodland photography with radiant sunbeams piercing through lush canopy foliage.",
    image: "assets/img/gallary/photography/Nature.jpg",
    tags: ["HDR", "Landscape", "Sunburst"]
  },
  {
    id: "photo-6",
    category: "photography",
    title: "Twilight Moonrise Over Rural Horizon",
    subtitle: "Low-Light Night Capture",
    description: "Atmospheric night photography capturing the luminous moon suspended over a rural silhouette with deep twilight gradient skies.",
    image: "assets/img/gallary/photography/DSC_0649.jpg",
    tags: ["Low Light", "Night Sky", "Twilight"]
  },
  {
    id: "photo-7",
    category: "photography",
    title: "Sunset Solitude — Water Reflections & Silhouette",
    subtitle: "Golden Hour Grading",
    description: "Golden hour sunset landscape featuring a lone figure mirrored across the tranquil waterway during peak atmospheric haze.",
    image: "assets/img/gallary/photography/DSC_0503.jpg",
    tags: ["Golden Hour", "Silhouette", "Water Reflections"]
  },
  {
    id: "photo-8",
    category: "photography",
    title: "Pastel Sunset Cloudscape & Warm Horizon",
    subtitle: "Color Science & Skies",
    description: "Delicate evening skies showcasing pastel lavender and amber cloud gradients captured with precise exposure preservation.",
    image: "assets/img/gallary/photography/DSC_0523.jpg",
    tags: ["Skyscape", "Pastel Tones", "Exposure Control"]
  },
  {
    id: "photo-9",
    category: "photography",
    title: "Flora Macro Framing & Morning Dew Drops",
    subtitle: "Botanical Detail",
    description: "Close-up botanical photography with microscopic droplet clarity, delicate leaf veining, and rich emerald green tones.",
    image: "assets/img/gallary/photography/DSC_0029_2.jpg",
    tags: ["Botanical", "Macro Framing", "Vivid Green"]
  },
  {
    id: "photo-10",
    category: "photography",
    title: "Rural Architecture & Architectural Framing",
    subtitle: "Cultural Landscape",
    description: "Compositional landscape capturing traditional structures nestled within verdant rural topographies.",
    image: "assets/img/gallary/photography/DSC_0020.jpg",
    tags: ["Composition", "Cultural Landscape", "Perspective"]
  },
  {
    id: "photo-11",
    category: "photography",
    title: "Dramatic Cloud Formations Over Farmland",
    subtitle: "Atmospheric Weather",
    description: "Expansive landscape capturing towering cumulus cloud formations rolling over open agricultural fields.",
    image: "assets/img/gallary/photography/DSC_0103.jpg",
    tags: ["Cloudscapes", "Dynamic Sky", "Wide Angle"]
  },

  // Creative Digital Designs & Commercial Branding
  {
    id: "design-1",
    category: "digital-design",
    title: "RS Computers — 3D Monogram Corporate Identity",
    subtitle: "Logo & Brand Mark",
    description: "Modern isometric 3D brand logo combining initials 'RZ' and 'RS', tailored for tech retail, hardware engineering, and digital presence.",
    image: "assets/img/gallary/designs/RZ logo.png",
    tags: ["Adobe Illustrator", "Photoshop", "3D Monogram", "Branding"]
  },
  {
    id: "design-2",
    category: "digital-design",
    title: "Rizwan Sajid Mobile & Computers — Commercial Retail Banner",
    subtitle: "Outdoor Flex & Shop Signage",
    description: "High-impact bilingual (Urdu & English) outdoor commercial banner with product showcases, high-contrast typography, and CMYK color profiles.",
    image: "assets/img/gallary/designs/17 36 Accessories.jpg",
    tags: ["Large Format Flex", "CMYK Print", "Commercial Branding"]
  },
  {
    id: "design-3",
    category: "digital-design",
    title: "Hardware Repairing & Tech Services Promotional Billboard",
    subtitle: "Retail Service Signage",
    description: "Professional shopfront flex design detailing hardware diagnostics, laptop/desktop maintenance, and mobile accessories.",
    image: "assets/img/gallary/designs/38 54 Repairing.jpg",
    tags: ["Signage Design", "Retail Promotion", "Visual Hierarchy"]
  },
  {
    id: "design-4",
    category: "digital-design",
    title: "Big League CBD — Creative Product Advertisement",
    subtitle: "Social Media & Product Ad",
    description: "\"Don't Panic, It's Organic\" — Creative consumer product ad campaign featuring dynamic smoke textures, cannabis leaf vectoring, and bold typography.",
    image: "assets/img/gallary/designs/01.jpg",
    tags: ["Product Campaign", "Social Ad", "Visual Composition"]
  },
  {
    id: "design-5",
    category: "digital-design",
    title: "Premium Digital Brand Flyer & Social Campaign",
    subtitle: "Marketing Poster",
    description: "Engaging commercial digital flyer optimized for high-conversion social media engagement and print distribution.",
    image: "assets/img/gallary/designs/02.jpg",
    tags: ["Social Media Flyer", "Typography", "Digital Marketing"]
  },
  {
    id: "design-6",
    category: "digital-design",
    title: "Creative Geometric Promotional Poster",
    subtitle: "Creative Design",
    description: "Modern promotional layout integrating geometric framing, balanced negative space, and vibrant brand accents.",
    image: "assets/img/gallary/designs/03.jpg",
    tags: ["Geometric Layout", "Brand Collateral", "Photoshop"]
  },
  {
    id: "design-7",
    category: "digital-design",
    title: "High-Format Studio Print & Exhibition Layout",
    subtitle: "8x10 Large Format Print",
    description: "Precision-measured print-ready layout calibrated for razor-sharp exhibition printing and client wall displays.",
    image: "assets/img/gallary/designs/8X10.jpg",
    tags: ["8x10 Print", "Print Ready", "High DPI"]
  },
  {
    id: "design-8",
    category: "digital-design",
    title: "Digital Product Showcase & E-Commerce Poster",
    subtitle: "Commercial Poster",
    description: "Polished product visualization banner with realistic shadow casting, vibrant badge accents, and clear CTA callouts.",
    image: "assets/img/gallary/designs/04.jpg",
    tags: ["E-Commerce", "Product Highlight", "Visual Balance"]
  },
  {
    id: "design-9",
    category: "digital-design",
    title: "Brand Storytelling & Marketing Creative",
    subtitle: "Digital Creative",
    description: "Story-driven promotional visual combining photo composite layers with sleek corporate typography.",
    image: "assets/img/gallary/designs/06.jpg",
    tags: ["Photo Manipulation", "Corporate Design", "Ad Creative"]
  }
];

const STORAGE_PROJECTS_KEY = "umais_portfolio_projects_v3";
const STORAGE_PROFILE_KEY = "umais_portfolio_profile_v2";
const STORAGE_GALLERY_KEY = "umais_portfolio_gallery_v3";

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
   Gallery Storage Helpers
   ========================================================================== */
function getGalleryItems() {
  try {
    const stored = localStorage.getItem(STORAGE_GALLERY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read gallery from localStorage, using defaults.", err);
  }
  saveGalleryItems(DEFAULT_GALLERY);
  return DEFAULT_GALLERY;
}

function saveGalleryItems(items) {
  try {
    localStorage.setItem(STORAGE_GALLERY_KEY, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error("Failed to save gallery to localStorage:", err);
    return false;
  }
}

function resetGalleryItems() {
  saveGalleryItems(DEFAULT_GALLERY);
  return DEFAULT_GALLERY;
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
