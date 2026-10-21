# Umais Ur Rehman — Professional Developer Portfolio

> A modern, lightning-fast developer portfolio website engineered with clean **HTML5, CSS3, and JavaScript**. Zero build steps, zero npm dependencies, and ready to deploy instantly to **Netlify** or **GitHub Pages**.

---

## 🌟 Security & Access Token Protection (Static Architecture)

### 1. Private Portfolio Access Gate
* The portfolio is protected by an **Access Token Gate** so only you or people with authorized tokens can view it.
* **Pre-authorized Tokens**:
  * `UMAIS-MASTER-ACCESS` (Your master token)
  * `CLIENT-VIP-2026` (For clients)
  * `RECRUITER-ACCESS-2026` (For recruiters/interviewers)
* **Direct Invite Links**: You can share a direct unlock link with any client, e.g.:
  ```
  https://your-portfolio.netlify.app/?token=CLIENT-VIP-2026
  ```
  When opened, the portfolio unlocks automatically without prompting the visitor!
* **Owner Unlock**: On the access gate, you can also click *"Owner / Administrator? Unlock with Passcode"* and enter your passcode (`umais202634101`) to grant permanent master access to your browser.
* In the Admin Portal, you can generate unlimited new tokens (e.g. for specific clients) or turn off the gate anytime with a single toggle.

---

### 2. Admin Portal Security & SHA-256 Hashed Password
* **Zero Pre-rendered Markup**: When someone types `admin.html` or `/admin` into the address bar, **no admin dashboard, forms, or controls exist in the HTML**. They only see a clean authentication screen.
* **Cryptographic SHA-256 Hashing**:
  * Your password (`umais202634101`) is **never stored in plaintext**.
  * Only its cryptographic SHA-256 hash (`2f5bd7bf2172d27f432cf442c35a9cdad7e65d06ef8fba249dd113b0c610b0b1`) is stored in the code.
  * When you enter your passcode, the browser's native Web Crypto API computes the hash and validates it before dynamically injecting the admin dashboard into memory.
  * When you lock/logout, the session is cleared and the dashboard is completely removed from the DOM.

---

## 🛠️ Admin Portal Features (`/admin` or `admin.html`)

1. **Access Token Manager**:
   * Toggle the Portfolio Privacy Gate ON/OFF.
   * View all active access tokens.
   * Generate new tokens with custom labels (e.g. "Google Interviewer", "Upwork Client").
   * One-click "Copy Direct Unlock Link".
   * Revoke tokens anytime.

2. **Profile Picture Management**:
   * Drag & drop any photo from your computer (`.jpg`, `.png`, `.webp`) or enter a URL.
   * Click **Update Picture** to save immediately across the website.
   * Click **Remove / Reset** to restore the default photo.

3. **Personal & Contact Details Editor**:
   * Edit Full Name, Role/Title, Subtitle, Bio Summary, WhatsApp/Phone, Email, Location, GitHub, and LinkedIn links.
   * Click **Save Personal Details** to update your website in real-time.

4. **Upload Work to Portfolio**:
   * Upload projects categorized into **Flutter Dev**, **Python Backend**, **Web Dev**, **Photography**, and **Documentation**.
   * Drag & drop project screenshots (automatically converted to base64 Data URLs).
   * Edit or delete existing showcases.

5. **Netlify & GitHub Sync**:
   * Click **Export Data as projects.json** to save a permanent file for version control.

---

## 🚀 Quick Deployment Guide

### Option A: Deploy to Netlify (Drag & Drop in 30 Seconds)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the **`umais-portfolio`** folder directly into the browser.
3. Your site is live immediately!
4. The included `_redirects` file automatically handles `/admin` and `/admin/` routing.

### Option B: Deploy to GitHub Pages
1. Open PowerShell in `c:\Users\Umais\Downloads\umais-portfolio`:
   ```powershell
   git init
   git add .
   git commit -m "Secure portfolio release"
   git remote add origin https://github.com/UmaisUrRehman/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In GitHub, go to **Settings > Pages** &rarr; select branch `main` and root `/` &rarr; click **Save**.
3. Both `/admin` and `/` work out of the box thanks to `admin/index.html`.

---

## 📂 File Directory Structure

```
umais-portfolio/
│
├── index.html                 # Main portfolio with Access Token Gate
├── admin.html                 # Zero-rendered admin authentication portal
├── projects.json              # Standalone JSON database of projects
├── _redirects                 # Netlify /admin routing rule
├── README.md                  # Documentation and security guide
│
├── admin/
│   └── index.html             # Static redirect for /admin URL visits
│
├── css/
│   └── style.css              # Cyber dark theme, glassmorphism, responsive
│
├── js/
│   ├── auth.js                # SHA-256 verification & static token engine
│   ├── portfolio-data.js      # Project & profile data synced with localStorage
│   ├── main.js                # Access gate controller & UI animations
│   └── admin.js               # Dynamic admin dashboard injector & token manager
│
└── assets/
    ├── img/                   # Profile image and project screenshots
    └── docs/                  # Project documentation PDFs
```
