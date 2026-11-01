/**
 * Umais Ur Rehman — Secure Admin Management Engine
 * - SHA-256 Hashed Password Verification (Zero plaintext storage)
 * - Zero Pre-rendered Markup (Admin panels injected ONLY after authentication)
 * - Access Token Generator & Privacy Gate Controls
 * - Profile Picture & Personal Details Management
 * - Project CRUD with Base64 Drag-and-Drop Image Converter
 */

let currentProjects = [];
let uploadedImageDataUrl = "";
let uploadedAvatarDataUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  initThemeSupport();
  initAdminGate();
});

/* ==========================================================================
   1. Admin Authentication & Dynamic Dashboard Injection
   ========================================================================== */
function initAdminGate() {
  const authPanel = document.getElementById("auth-panel");
  const loginForm = document.getElementById("admin-login-form");
  const logoutBtn = document.getElementById("btn-logout");

  if (isAdminAuthenticated()) {
    showDashboard();
  } else {
    showAuth();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredCode = document.getElementById("admin-passcode")?.value || "";
      const isValid = await verifyAdminPasscode(enteredCode);

      if (isValid) {
        setAdminSession("authorized_admin_" + Date.now());
        showToast("Authenticated successfully. Welcome back, Umais!");
        showDashboard();
      } else {
        alert("Access Denied: Invalid passcode.");
      }
    });
  }
}

function showDashboard() {
  document.getElementById("auth-panel").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline-flex";

  // Dynamically inject the complete Admin Dashboard into DOM
  mountAdminDashboard();

  currentProjects = getPortfolioProjects();
  refreshAdminView();
  loadCurrentProfileData();
  renderAccessTokensList();
  initAvatarDropzone();
  initProfileDetailsForm();
  initDropzone();
  initUploadForm();
  initGalleryAdmin();
}

function showAuth() {
  document.getElementById("auth-panel").style.display = "block";
  document.getElementById("btn-logout").style.display = "none";
  const container = document.getElementById("admin-dashboard-container");
  if (container) container.innerHTML = "";
}

window.logoutAdmin = function () {
  clearAdminSession();
  showToast("Session locked and logged out.");
  showAuth();
};

/* ==========================================================================
   2. Theme Support in Admin
   ========================================================================== */
function initThemeSupport() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const savedTheme = localStorage.getItem("umais_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const icon = document.querySelector("#theme-toggle-btn i");
  if (icon) {
    icon.className = savedTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("umais_theme", newTheme);
      if (icon) {
        icon.className = newTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    });
  }
}

/* ==========================================================================
   3. Mount Admin Dashboard Template (Only for Authenticated Users)
   ========================================================================== */
function mountAdminDashboard() {
  const container = document.getElementById("admin-dashboard-container");
  if (!container) return;

  container.innerHTML = `
    <!-- Stats Overview -->
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-icon"><i class="fa-solid fa-folder-tree"></i></div>
        <div>
          <h3 id="stat-total" style="font-size: 1.75rem; font-family: var(--font-mono); color: var(--accent-cyan);">0</h3>
          <small style="color: var(--text-muted);">Total Showcases</small>
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="color: #60a5fa;"><i class="fa-brands fa-flutter"></i></div>
        <div>
          <h3 id="stat-flutter" style="font-size: 1.75rem; font-family: var(--font-mono);">0</h3>
          <small style="color: var(--text-muted);">Flutter Dev</small>
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="color: #34d399;"><i class="fa-brands fa-python"></i></div>
        <div>
          <h3 id="stat-python" style="font-size: 1.75rem; font-family: var(--font-mono);">0</h3>
          <small style="color: var(--text-muted);">Python Backend</small>
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="color: #f472b6;"><i class="fa-solid fa-camera-retro"></i></div>
        <div>
          <h3 id="stat-photo" style="font-size: 1.75rem; font-family: var(--font-mono);">0</h3>
          <small style="color: var(--text-muted);">Photography</small>
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="color: #fbbf24;"><i class="fa-solid fa-file-invoice"></i></div>
        <div>
          <h3 id="stat-doc" style="font-size: 1.75rem; font-family: var(--font-mono);">0</h3>
          <small style="color: var(--text-muted);">Documentation</small>
        </div>
      </div>
    </div>

    <!-- Section A: Portfolio Access Token Manager -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-key" style="color: var(--accent-cyan); margin-right: 8px;"></i> Access Token Manager & Privacy Gate</h2>
          <p style="font-size: 0.875rem; color: var(--text-muted);">Control portfolio visibility, generate unique access tokens for clients/recruiters, and share direct unlock links.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); padding: 8px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <input type="checkbox" id="toggle-privacy-gate" style="width: 18px; height: 18px; accent-color: var(--accent-cyan);" ${isGateEnabled() ? "checked" : ""} onchange="handlePrivacyGateToggle(this.checked)">
          <label for="toggle-privacy-gate" style="font-size: 0.875rem; font-weight: 600; cursor: pointer;">Require Access Token to View Portfolio</label>
        </div>
      </div>

      <!-- Generate Token Form -->
      <form id="create-token-form" style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;" onsubmit="handleCreateToken(event)">
        <input type="text" id="token-label-input" class="form-control" style="flex: 1; min-width: 240px;" placeholder="Token Label / Recipient (e.g. Google Recruiter, Client X)" required>
        <button type="submit" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-plus-circle"></i>
          <span>Generate New Access Token</span>
        </button>
      </form>

      <!-- Access Tokens Table -->
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Token Key</th>
              <th>Recipient / Label</th>
              <th>Created Date</th>
              <th>Direct Shareable Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="access-tokens-table-body">
            <!-- Rendered dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section B: Profile Picture Management -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-image-portrait" style="color: var(--accent-cyan); margin-right: 8px;"></i> Profile Picture Management</h2>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Upload a new photo from your PC, enter an image URL, or remove/reset to default.</p>
      </div>

      <div class="profile-photo-container">
        <img id="admin-current-avatar" src="assets/img/profile.jpeg" alt="Current Profile" class="current-avatar-preview">

        <div style="flex-grow: 1; max-width: 540px;">
          <div id="avatar-dropzone" class="dropzone" style="padding: 20px;">
            <i class="fa-solid fa-camera" style="font-size: 1.8rem; color: var(--accent-cyan); margin-bottom: 6px;"></i>
            <p style="font-size: 0.875rem; margin-bottom: 2px;">Click to select or drop a new portrait photo</p>
            <small style="color: var(--text-dim);">JPG, PNG, WEBP (stored in local browser)</small>
            <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
          </div>

          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <input type="text" id="avatar-url-input" class="form-control" placeholder="Or enter image URL (e.g. assets/img/profile.jpeg)">
            <button type="button" class="btn btn-primary btn-sm" onclick="saveProfilePicture()">Update Picture</button>
            <button type="button" class="btn btn-secondary btn-sm" style="color: var(--accent-rose);" onclick="removeProfilePicture()">Remove / Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section C: Personal & Contact Information -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-address-card" style="color: var(--accent-cyan); margin-right: 8px;"></i> Personal & Contact Information</h2>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Modify your name, title, bio summary, WhatsApp, email, links, and status badge.</p>
      </div>

      <form id="profile-details-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label for="detail-name" class="form-label">Full Name *</label>
            <input type="text" id="detail-name" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="detail-title" class="form-label">Professional Role / Title *</label>
            <input type="text" id="detail-title" class="form-control" placeholder="e.g. Software Developer" required>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="detail-subtitle" class="form-label">Hero Tagline / Subtitle *</label>
            <input type="text" id="detail-subtitle" class="form-control" placeholder="e.g. Flutter, Python & Full-Stack Engineer" required>
          </div>
          <div class="form-group">
            <label for="detail-status" class="form-label">Availability Status Badge</label>
            <input type="text" id="detail-status" class="form-control" placeholder="e.g. Available for Freelance & Full-Time Projects">
          </div>
        </div>

        <div class="form-group">
          <label for="detail-bio" class="form-label">Professional Bio / Summary *</label>
          <textarea id="detail-bio" class="form-control" style="min-height: 110px;" required></textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="detail-phone" class="form-label">Phone & WhatsApp Number *</label>
            <input type="text" id="detail-phone" class="form-control" placeholder="e.g. +92 307 4069818" required>
          </div>
          <div class="form-group">
            <label for="detail-email" class="form-label">Email Address *</label>
            <input type="email" id="detail-email" class="form-control" placeholder="e.g. umaisurrehman47@gmail.com" required>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="detail-location" class="form-label">Location</label>
            <input type="text" id="detail-location" class="form-control" placeholder="e.g. Gujranwala, Pakistan">
          </div>
          <div class="form-group">
            <label for="detail-github" class="form-label">GitHub URL</label>
            <input type="url" id="detail-github" class="form-control" placeholder="https://github.com/UmaisUrRehman">
          </div>
        </div>

        <div class="form-group">
          <label for="detail-linkedin" class="form-label">LinkedIn URL</label>
          <input type="url" id="detail-linkedin" class="form-control" placeholder="https://www.linkedin.com/in/umaisurrehman">
        </div>

        <div style="margin-top: 24px; display: flex; gap: 14px;">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i>
            <span>Save Personal & Contact Details</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="resetProfileDetailsToDefault()">
            <span>Reset to Defaults</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Section D: Upload New Work to Showcase -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-cloud-arrow-up" style="color: var(--accent-cyan); margin-right: 8px;"></i> Upload New Work to Showcase</h2>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Categorized as Photography, Documentation, Web Dev, Flutter Dev, or Python Backend.</p>
      </div>

      <form id="upload-project-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label for="proj-title" class="form-label">Project / Work Title *</label>
            <input type="text" id="proj-title" class="form-control" placeholder="e.g. MediSim Patient Portal & Charting" required>
          </div>
          <div class="form-group">
            <label for="proj-category" class="form-label">Category *</label>
            <select id="proj-category" class="form-control" required>
              <option value="flutter">Flutter Dev (Mobile & Desktop)</option>
              <option value="python">Python Backend (FastAPI, Flask, APIs)</option>
              <option value="web">Web Dev (Frontend & Full-Stack)</option>
              <option value="photography">Photography & Creative (Multimedia)</option>
              <option value="documentation">Documentation & System Architecture</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="proj-client" class="form-label">Client / Context</label>
            <input type="text" id="proj-client" class="form-control" placeholder="e.g. iConnecto, Freelance Client, Academic">
          </div>
          <div class="form-group">
            <label for="proj-date" class="form-label">Year / Timeframe</label>
            <input type="text" id="proj-date" class="form-control" placeholder="e.g. 2026" value="2026">
          </div>
        </div>

        <div class="form-group">
          <label for="proj-subtitle" class="form-label">Short Subtitle / Tagline *</label>
          <input type="text" id="proj-subtitle" class="form-control" placeholder="e.g. High-performance RESTful API with automated JWT authentication" required>
        </div>

        <div class="form-group">
          <label for="proj-description" class="form-label">Full Description & Technical Architecture *</label>
          <textarea id="proj-description" class="form-control" style="min-height: 120px;" placeholder="Explain project objectives, technologies used, problems solved, and engineering results..." required></textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Project Image / Screenshot / Photo *</label>
            <div id="dropzone" class="dropzone">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2rem; color: var(--accent-cyan); margin-bottom: 8px;"></i>
              <p style="font-size: 0.9rem; margin-bottom: 4px;">Click to select or drag & drop an image</p>
              <small style="color: var(--text-dim);">Supports JPG, PNG, WEBP, JFIF</small>
              <input type="file" id="proj-image-file" accept="image/*" style="display: none;">
            </div>
            <img id="image-preview" class="image-preview-box" alt="Image preview">
          </div>

          <div class="form-group">
            <label for="proj-image-url" class="form-label">Or Custom Image URL / Path</label>
            <input type="text" id="proj-image-url" class="form-control" placeholder="e.g. assets/img/profile.jpeg or https://...">
            <small style="color: var(--text-dim); display: block; margin-top: 6px;">If uploading a local file, it automatically converts to base64 DataURL.</small>

            <div style="margin-top: 18px;">
              <label for="proj-tags" class="form-label">Tech Stack Tags (Comma separated)</label>
              <input type="text" id="proj-tags" class="form-control" placeholder="e.g. Flutter, Dart, FastAPI, MySQL, Nginx">
            </div>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="proj-live-url" class="form-label">Live Demo / Showcase URL (Optional)</label>
            <input type="url" id="proj-live-url" class="form-control" placeholder="https://example.com">
          </div>
          <div class="form-group">
            <label for="proj-github-url" class="form-label">GitHub Repository URL (Optional)</label>
            <input type="url" id="proj-github-url" class="form-control" placeholder="https://github.com/UmaisUrRehman/...">
          </div>
        </div>

        <div class="form-group">
          <label for="proj-doc-url" class="form-label">Documentation PDF / Link (Optional)</label>
          <input type="text" id="proj-doc-url" class="form-control" placeholder="e.g. assets/docs/MediSim-Documentation.pdf">
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <input type="checkbox" id="proj-featured" style="width: 18px; height: 18px; accent-color: var(--accent-cyan);" checked>
          <label for="proj-featured" style="font-size: 0.95rem; cursor: pointer;">Mark as Featured Project on Portfolio</label>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 16px;">
          <button type="submit" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-plus-circle"></i>
            <span>Publish Work to Portfolio</span>
          </button>
          <button type="reset" class="btn btn-secondary btn-lg" onclick="resetFormPreview()">
            <span>Clear Form</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Section E: Manage Existing Projects Table -->
    <div class="admin-section-box">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-list-check" style="color: var(--accent-cyan); margin-right: 8px;"></i> Manage Existing Clinical Projects</h2>
          <p style="font-size: 0.875rem; color: var(--text-muted);">Inspect, edit, or delete active portfolio engineering projects.</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <select id="table-filter-cat" class="form-control" style="width: auto;" onchange="renderAdminTable()">
            <option value="all">All Categories</option>
            <option value="python">MediSim Flagship</option>
            <option value="flutter">Training Monitor App</option>
          </select>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title & Subtitle</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Section E2: Art Gallery Upload & Management -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <h2 style="font-size: 1.4rem;"><i class="fa-solid fa-palette" style="color: var(--accent-cyan); margin-right: 8px;"></i> Art Gallery Upload & Media Management</h2>
          <p style="font-size: 0.875rem; color: var(--text-muted);">Upload photos, before & after Photoshop comparisons (2 images: before & after), or creative digital branding designs.</p>
        </div>
        <a href="gallery.html" target="_blank" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Gallery
        </a>
      </div>

      <form id="upload-gallery-form" style="margin-bottom: 32px;">
        <div class="form-grid-2">
          <div class="form-group">
            <label for="gal-category" class="form-label">Gallery Category *</label>
            <select id="gal-category" class="form-control" required>
              <option value="photography" selected>Photography & Portraiture</option>
              <option value="digital-design">Creative Digital Designs & Branding</option>
            </select>
          </div>
          <div class="form-group">
            <label for="gal-title" class="form-label">Title / Caption *</label>
            <input type="text" id="gal-title" class="form-control" placeholder="e.g. Cinematic Atmosphere Portrait" required>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="gal-subtitle" class="form-label">Subtitle / Badge</label>
            <input type="text" id="gal-subtitle" class="form-control" placeholder="e.g. Nikon RAW or 3D Brand Mark">
          </div>
          <div class="form-group">
            <label for="gal-tags" class="form-label">Tags (comma separated)</label>
            <input type="text" id="gal-tags" class="form-control" placeholder="e.g. Nikon DSLR, RAW .NEF, Portrait">
          </div>
        </div>

        <div class="form-group">
          <label for="gal-desc" class="form-label">Technique & Description</label>
          <textarea id="gal-desc" class="form-control" style="min-height: 80px;" placeholder="Explain the lighting, camera settings, concept, or design motif..."></textarea>
        </div>

        <!-- Single Image Dropzone for Photo & Design Uploads -->
        <div id="gal-single-image-inputs">
          <div class="form-group">
            <label class="form-label">Showcase Image *</label>
            <div id="gal-single-dropzone" class="dropzone" style="padding: 24px;">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2rem; color: var(--accent-cyan); margin-bottom: 6px;"></i>
              <p style="font-size: 0.9rem; margin-bottom: 2px;">Click or drop photo / design file</p>
              <small style="color: var(--text-dim);">Supports JPG, PNG, WEBP</small>
              <input type="file" id="gal-single-file" accept="image/*" style="display: none;">
            </div>
            <input type="text" id="gal-single-url" class="form-control" style="margin-top: 10px;" placeholder="Or image path / URL (e.g. assets/img/gallary/photography/DSC_0153_1.jpg)">
            <img id="gal-single-preview" class="image-preview-box" alt="Single Preview">
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; gap: 14px;">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-upload"></i>
            <span>Add to Art Gallery</span>
          </button>
          <button type="reset" class="btn btn-secondary" onclick="resetGalleryUploadForm()">
            <span>Clear</span>
          </button>
        </div>
      </form>

      <!-- Manage Existing Gallery Items Table -->
      <h3 style="font-size: 1.15rem; margin-bottom: 14px;"><i class="fa-solid fa-images"></i> Active Gallery Items</h3>
      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title & Subtitle</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-gallery-table-body"></tbody>
        </table>
      </div>
    </div>

    <!-- Section F: JSON Data Backup & Deployment Sync -->
    <div class="admin-section-box">
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="font-size: 1.3rem;"><i class="fa-solid fa-cloud-arrow-down" style="color: var(--accent-cyan); margin-right: 8px;"></i> Data Export & Backup</h2>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Download current portfolio JSON to commit to GitHub repository or reset anytime.</p>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 14px;">
        <button class="btn btn-outline" onclick="exportProjectsJson()">
          <i class="fa-solid fa-download"></i>
          <span>Export Data as projects.json</span>
        </button>

        <label class="btn btn-secondary" style="cursor: pointer;">
          <i class="fa-solid fa-upload"></i>
          <span>Import projects.json</span>
          <input type="file" id="import-json-file" accept=".json" style="display: none;" onchange="importProjectsJson(event)">
        </label>

        <button class="btn btn-secondary" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.4);" onclick="confirmResetDefaults()">
          <i class="fa-solid fa-rotate-left"></i>
          <span>Reset Portfolio Items to Default</span>
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. Access Token Management Handlers
   ========================================================================== */
window.handlePrivacyGateToggle = function (isChecked) {
  setGateEnabled(isChecked);
  showToast(`Portfolio Privacy Gate ${isChecked ? "ENABLED (Access token required)" : "DISABLED (Public access)"}`);
};

window.handleCreateToken = function (e) {
  e.preventDefault();
  const labelInput = document.getElementById("token-label-input");
  const label = labelInput?.value.trim() || "Guest Access";

  const newToken = createAccessToken(label);
  showToast(`Generated token: ${newToken.token}`);
  if (labelInput) labelInput.value = "";
  renderAccessTokensList();
};

window.renderAccessTokensList = function () {
  const tbody = document.getElementById("access-tokens-table-body");
  if (!tbody) return;

  const tokens = getAccessTokens();
  const currentBaseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/index.html");

  tbody.innerHTML = tokens
    .map((t) => {
      const shareUrl = `${currentBaseUrl}?token=${encodeURIComponent(t.token)}`;
      return `
        <tr>
          <td>
            <span class="token-pill-badge">${escapeHtml(t.token)}</span>
            ${t.isMaster ? '<span style="font-size: 0.7rem; color: #10b981; margin-left: 6px;"><i class="fa-solid fa-crown"></i> Master</span>' : ''}
          </td>
          <td><strong>${escapeHtml(t.label)}</strong></td>
          <td><small style="color: var(--text-dim);">${escapeHtml(t.createdAt || "2026")}</small></td>
          <td>
            <button class="token-copy-btn" onclick="copyToClipboard('${shareUrl}', 'Direct Invite Link')">
              <i class="fa-solid fa-link"></i> Copy Direct Unlock Link
            </button>
          </td>
          <td>
            ${
              t.isMaster
                ? '<small style="color: var(--text-dim);">Protected</small>'
                : `<button class="btn btn-outline btn-sm" style="color: var(--accent-rose); border-color: rgba(244,63,94,0.4);" onclick="handleRevokeToken('${t.token}')" title="Revoke Token"><i class="fa-solid fa-trash-can"></i> Revoke</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
};

window.handleRevokeToken = function (tokenString) {
  if (confirm(`Revoke access token "${tokenString}"? Anyone using this token will lose access.`)) {
    revokeAccessToken(tokenString);
    showToast(`Token "${tokenString}" revoked.`);
    renderAccessTokensList();
  }
};

/* ==========================================================================
   5. Profile Picture Management (Change or Remove Picture)
   ========================================================================== */
function initAvatarDropzone() {
  const dropzone = document.getElementById("avatar-dropzone");
  const fileInput = document.getElementById("avatar-file-input");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      processAvatarFile(fileInput.files[0]);
    }
  });
}

function processAvatarFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedAvatarDataUrl = e.target.result;
    const preview = document.getElementById("admin-current-avatar");
    if (preview) {
      preview.src = uploadedAvatarDataUrl;
    }
    const urlInput = document.getElementById("avatar-url-input");
    if (urlInput) urlInput.value = "";
    showToast("Profile image loaded! Click 'Update Picture' to save.");
  };
  reader.readAsDataURL(file);
}

window.saveProfilePicture = function () {
  const urlInput = document.getElementById("avatar-url-input")?.value.trim();
  const newImage = uploadedAvatarDataUrl || urlInput;

  if (!newImage) {
    alert("Please upload a picture or provide an image URL first.");
    return;
  }

  const profile = getProfileDetails();
  profile.profileImage = newImage;
  saveProfileDetails(profile);

  const preview = document.getElementById("admin-current-avatar");
  if (preview) preview.src = newImage;

  showToast("Profile picture updated and saved!");
};

window.removeProfilePicture = function () {
  if (confirm("Reset profile picture to default?")) {
    const profile = getProfileDetails();
    profile.profileImage = "assets/img/profile.jpeg";
    saveProfileDetails(profile);

    uploadedAvatarDataUrl = "";
    const preview = document.getElementById("admin-current-avatar");
    if (preview) preview.src = profile.profileImage;
    const urlInput = document.getElementById("avatar-url-input");
    if (urlInput) urlInput.value = "";

    showToast("Profile picture reset to default.");
  }
};

/* ==========================================================================
   6. Personal & Contact Details Editor
   ========================================================================== */
function loadCurrentProfileData() {
  const profile = getProfileDetails();

  const preview = document.getElementById("admin-current-avatar");
  if (preview && profile.profileImage) {
    preview.src = profile.profileImage;
  }

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setVal("detail-name", profile.name);
  setVal("detail-title", profile.title);
  setVal("detail-subtitle", profile.subtitle);
  setVal("detail-status", profile.statusBadge);
  setVal("detail-bio", profile.bio);
  setVal("detail-phone", profile.phone);
  setVal("detail-email", profile.email);
  setVal("detail-location", profile.location);
  setVal("detail-github", profile.githubUrl);
  setVal("detail-linkedin", profile.linkedinUrl);
}

function initProfileDetailsForm() {
  const form = document.getElementById("profile-details-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const profile = getProfileDetails();
    profile.name = document.getElementById("detail-name")?.value.trim() || profile.name;
    profile.title = document.getElementById("detail-title")?.value.trim() || profile.title;
    profile.subtitle = document.getElementById("detail-subtitle")?.value.trim() || profile.subtitle;
    profile.statusBadge = document.getElementById("detail-status")?.value.trim() || profile.statusBadge;
    profile.bio = document.getElementById("detail-bio")?.value.trim() || profile.bio;
    profile.phone = document.getElementById("detail-phone")?.value.trim() || profile.phone;
    profile.phoneRaw = profile.phone.replace(/\D/g, "");
    profile.email = document.getElementById("detail-email")?.value.trim() || profile.email;
    profile.location = document.getElementById("detail-location")?.value.trim() || profile.location;
    profile.githubUrl = document.getElementById("detail-github")?.value.trim() || profile.githubUrl;
    profile.linkedinUrl = document.getElementById("detail-linkedin")?.value.trim() || profile.linkedinUrl;

    saveProfileDetails(profile);
    showToast("Personal and contact information updated successfully!");
  });
}

window.resetProfileDetailsToDefault = function () {
  if (confirm("Reset personal details and contacts back to default CV values?")) {
    resetProfileDetails();
    loadCurrentProfileData();
    showToast("Profile details reset to defaults.");
  }
};

/* ==========================================================================
   7. Drag-and-Drop Project Image Uploader (Base64 Converter)
   ========================================================================== */
function initDropzone() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("proj-image-file");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processProjectImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      processProjectImageFile(fileInput.files[0]);
    }
  });
}

function processProjectImageFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageDataUrl = e.target.result;
    const preview = document.getElementById("image-preview");
    if (preview) {
      preview.src = uploadedImageDataUrl;
      preview.style.display = "block";
    }
    const urlInput = document.getElementById("proj-image-url");
    if (urlInput) urlInput.value = "";
    showToast("Project image loaded!");
  };
  reader.readAsDataURL(file);
}

window.resetFormPreview = function () {
  uploadedImageDataUrl = "";
  const preview = document.getElementById("image-preview");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
};

/* ==========================================================================
   8. Upload New Work Submission
   ========================================================================== */
function initUploadForm() {
  const form = document.getElementById("upload-project-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("proj-title").value.trim();
    const category = document.getElementById("proj-category").value;
    const client = document.getElementById("proj-client").value.trim() || "Independent Work";
    const date = document.getElementById("proj-date").value.trim() || "2026";
    const subtitle = document.getElementById("proj-subtitle").value.trim();
    const description = document.getElementById("proj-description").value.trim();
    const manualUrl = document.getElementById("proj-image-url").value.trim();
    const tagsRaw = document.getElementById("proj-tags").value.trim();
    const liveUrl = document.getElementById("proj-live-url").value.trim();
    const githubUrl = document.getElementById("proj-github-url").value.trim();
    const docUrl = document.getElementById("proj-doc-url").value.trim();
    const featured = document.getElementById("proj-featured").checked;

    const finalImage = uploadedImageDataUrl || manualUrl || "assets/img/project-flutter-ui.png";

    const categoryLabels = {
      flutter: "Flutter Dev",
      python: "Python Backend",
      web: "Web Dev",
      photography: "Photography",
      documentation: "Documentation"
    };

    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [categoryLabels[category]];

    const newProject = {
      id: "proj-" + Date.now(),
      title,
      category,
      categoryLabel: categoryLabels[category] || category,
      subtitle,
      description,
      image: finalImage,
      tags,
      liveUrl,
      githubUrl,
      docUrl,
      featured,
      client,
      date
    };

    currentProjects.unshift(newProject);
    savePortfolioProjects(currentProjects);

    showToast(`"${title}" published successfully to ${categoryLabels[category]}!`);
    form.reset();
    resetFormPreview();
    refreshAdminView();
  });
}

/* ==========================================================================
   9. Refresh Admin Statistics & Projects Table
   ========================================================================== */
function refreshAdminView() {
  updateStats();
  renderAdminTable();
}

function updateStats() {
  const totalEl = document.getElementById("stat-total");
  const flutterEl = document.getElementById("stat-flutter");
  const pythonEl = document.getElementById("stat-python");
  const photoEl = document.getElementById("stat-photo");
  const docEl = document.getElementById("stat-doc");

  let flutterCount = 0;
  let pythonCount = 0;
  let photoCount = 0;
  let docCount = 0;

  currentProjects.forEach((p) => {
    if (p.category === "flutter") flutterCount++;
    if (p.category === "python") pythonCount++;
    if (p.category === "photography") photoCount++;
    if (p.category === "documentation") docCount++;
  });

  if (totalEl) totalEl.textContent = currentProjects.length;
  if (flutterEl) flutterEl.textContent = flutterCount;
  if (pythonEl) pythonEl.textContent = pythonCount;
  if (photoEl) photoEl.textContent = photoCount;
  if (docEl) docEl.textContent = docCount;
}

window.renderAdminTable = function () {
  const tbody = document.getElementById("admin-table-body");
  const filterCat = document.getElementById("table-filter-cat")?.value || "all";
  if (!tbody) return;

  let filtered = currentProjects;
  if (filterCat !== "all") {
    filtered = currentProjects.filter((p) => p.category === filterCat);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 30px; color: var(--text-dim);">No showcase projects found in this category.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map((p) => {
      const tagsList = p.tags.slice(0, 3).join(", ");
      return `
        <tr>
          <td style="width: 80px;">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src='assets/img/project-flutter-ui.png'">
          </td>
          <td>
            <strong>${escapeHtml(p.title)}</strong>
            <small style="display: block; color: var(--text-muted);">${escapeHtml(p.subtitle)}</small>
            <small style="color: var(--text-dim); font-size: 0.75rem;">${escapeHtml(p.client || "Client")} &bull; ${escapeHtml(p.date || "2026")}</small>
          </td>
          <td>
            <span class="badge-cat">${escapeHtml(p.categoryLabel || p.category)}</span>
          </td>
          <td>
            <small style="color: var(--text-dim);">${escapeHtml(tagsList)}</small>
          </td>
          <td>
            <div class="action-btn-group">
              <button class="btn btn-secondary btn-sm" onclick="editProject('${p.id}')" title="Edit Item">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-outline btn-sm" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.4);" onclick="deleteProject('${p.id}')" title="Delete Item">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

/* ==========================================================================
   10. Delete & Edit Projects
   ========================================================================== */
window.deleteProject = function (projectId) {
  const p = currentProjects.find((item) => item.id === projectId);
  if (!p) return;

  if (confirm(`Are you sure you want to remove "${p.title}" from your portfolio?`)) {
    currentProjects = currentProjects.filter((item) => item.id !== projectId);
    savePortfolioProjects(currentProjects);
    showToast(`Removed "${p.title}"`);
    refreshAdminView();
  }
};

window.editProject = function (projectId) {
  const p = currentProjects.find((item) => item.id === projectId);
  if (!p) return;

  const newTitle = prompt("Edit Project Title:", p.title);
  if (newTitle === null) return;

  const newSubtitle = prompt("Edit Short Subtitle:", p.subtitle);
  if (newSubtitle === null) return;

  const newTags = prompt("Edit Tags (comma separated):", p.tags.join(", "));
  if (newTags === null) return;

  p.title = newTitle.trim() || p.title;
  p.subtitle = newSubtitle.trim() || p.subtitle;
  p.tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);

  savePortfolioProjects(currentProjects);
  showToast("Project updated successfully!");
  refreshAdminView();
};

/* ==========================================================================
   11. JSON Export, Import, & Reset Defaults
   ========================================================================== */
window.exportProjectsJson = function () {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProjects, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "projects.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Downloaded projects.json for Netlify / GitHub Pages deployment!");
};

window.importProjectsJson = function (event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentProjects = parsed;
        savePortfolioProjects(currentProjects);
        showToast(`Successfully imported ${parsed.length} projects!`);
        refreshAdminView();
      } else {
        alert("Invalid projects JSON format.");
      }
    } catch (err) {
      alert("Failed to parse JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
};

window.confirmResetDefaults = function () {
  if (confirm("Reset all portfolio items to the original CV defaults? Custom uploaded projects will be reset.")) {
    currentProjects = resetPortfolioProjects();
    showToast("Reset to default CV portfolio data.");
    refreshAdminView();
  }
};

/* Helper Toast Notification */
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

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   12. Art Gallery Upload & Management Engine
   ========================================================================== */
let uploadedGalSingleUrl = "";

function initGalleryAdmin() {
  renderGalleryAdminTable();
  initGalleryDropzones();
  initGalleryUploadForm();
}

function initGalleryDropzones() {
  // Single Showcase Dropzone
  setupFileDropzone(
    "gal-single-dropzone",
    "gal-single-file",
    "gal-single-preview",
    (dataUrl) => (uploadedGalSingleUrl = dataUrl)
  );
}

function setupFileDropzone(dropzoneId, fileInputId, previewImgId, onLoaded) {
  const dropzone = document.getElementById(dropzoneId);
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewImgId);

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (preview) {
        preview.src = result;
        preview.style.display = "block";
      }
      onLoaded(result);
    };
    reader.readAsDataURL(file);
  }
}

function initGalleryUploadForm() {
  const form = document.getElementById("upload-gallery-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = document.getElementById("gal-category").value;
    const title = document.getElementById("gal-title").value.trim();
    const subtitle = document.getElementById("gal-subtitle").value.trim() || "";
    const description = document.getElementById("gal-desc").value.trim() || "";
    const tagsRaw = document.getElementById("gal-tags").value.trim();
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    let newItem = {
      id: "gal-" + Date.now(),
      category,
      title,
      subtitle,
      description,
      tags
    };

    const manualSingle = document.getElementById("gal-single-url")?.value.trim() || "";
    const singleImg = uploadedGalSingleUrl || manualSingle;
    if (!singleImg) {
      alert("Please provide or upload a showcase image.");
      return;
    }
    newItem.image = singleImg;

    const currentGallery = getGalleryItems();
    currentGallery.unshift(newItem);
    saveGalleryItems(currentGallery);

    showToast(`"${title}" added to Art Gallery!`);
    form.reset();
    resetGalleryUploadForm();
    renderGalleryAdminTable();
  });
}

window.resetGalleryUploadForm = function () {
  uploadedGalSingleUrl = "";
  const el = document.getElementById("gal-single-preview");
  if (el) {
    el.src = "";
    el.style.display = "none";
  }
};

window.renderGalleryAdminTable = function () {
  const tbody = document.getElementById("admin-gallery-table-body");
  if (!tbody) return;

  const items = getGalleryItems();
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--text-dim);">No gallery items found.</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map((item) => {
      let previewHtml = `<img src="${escapeHtml(item.image || item.afterImage || '')}" alt="${escapeHtml(item.title)}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;">`;

      const catBadges = {
        "photography": "Photography",
        "digital-design": "Digital Design"
      };

      return `
        <tr>
          <td style="width: 100px;">${previewHtml}</td>
          <td>
            <strong>${escapeHtml(item.title)}</strong>
            <small style="display: block; color: var(--text-muted);">${escapeHtml(item.subtitle || "")}</small>
          </td>
          <td>
            <span class="badge-cat">${escapeHtml(catBadges[item.category] || item.category)}</span>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.4);" onclick="deleteGalleryItem('${item.id}')" title="Delete Gallery Item">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
};

window.deleteGalleryItem = function (itemId) {
  const items = getGalleryItems();
  const target = items.find((i) => i.id === itemId);
  if (!target) return;

  if (confirm(`Delete "${target.title}" from the Art Gallery?`)) {
    const updated = items.filter((i) => i.id !== itemId);
    saveGalleryItems(updated);
    showToast(`Removed "${target.title}" from Art Gallery.`);
    renderGalleryAdminTable();
  }
};

