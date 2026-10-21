/**
 * Umais Ur Rehman — Security & Authentication Engine
 * - SHA-256 Password Verification (Zero plaintext storage)
 * - Static Access Token Generation & Authorization
 * - URL Token Query Handler (?token=...)
 */

// Stored SHA-256 Hash of the password (NEVER plaintext)
const ADMIN_PASSCODE_HASH = "2f5bd7bf2172d27f432cf442c35a9cdad7e65d06ef8fba249dd113b0c610b0b1";

const STORAGE_GATE_ENABLED_KEY = "umais_gate_enabled_v1";
const STORAGE_ACCESS_TOKENS_KEY = "umais_access_tokens_v1";
const STORAGE_PORTFOLIO_UNLOCKED_KEY = "umais_portfolio_unlocked_token_v1";
const SESSION_ADMIN_AUTH_KEY = "umais_admin_session_auth_v1";

// Default Authorized Access Tokens
const DEFAULT_ACCESS_TOKENS = [
  {
    token: "UMAIS-MASTER-ACCESS",
    label: "Master Personal Access Token",
    createdAt: "2026-10-21",
    isMaster: true
  },
  {
    token: "CLIENT-VIP-2026",
    label: "Client VIP Shareable Token",
    createdAt: "2026-10-21",
    isMaster: false
  },
  {
    token: "RECRUITER-ACCESS-2026",
    label: "Recruiter / Interviewer Token",
    createdAt: "2026-10-21",
    isMaster: false
  }
];

/* ==========================================================================
   1. Cryptographic SHA-256 Hashing (Web Crypto API)
   ========================================================================== */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify entered password against the stored SHA-256 hash
 */
async function verifyAdminPasscode(passcode) {
  if (!passcode) return false;
  const hash = await sha256(passcode);
  return hash === ADMIN_PASSCODE_HASH;
}

/* ==========================================================================
   2. Admin Session Token Handling
   ========================================================================== */
function setAdminSession(token) {
  sessionStorage.setItem(SESSION_ADMIN_AUTH_KEY, token || "authorized_" + Date.now());
}

function isAdminAuthenticated() {
  const session = sessionStorage.getItem(SESSION_ADMIN_AUTH_KEY);
  return Boolean(session && session.startsWith("authorized_"));
}

function clearAdminSession() {
  sessionStorage.removeItem(SESSION_ADMIN_AUTH_KEY);
}

/* ==========================================================================
   3. Portfolio Access Token Management
   ========================================================================== */
function isGateEnabled() {
  const val = localStorage.getItem(STORAGE_GATE_ENABLED_KEY);
  // Default to false so portfolio and profile picture are immediately visible;
  // Can be activated anytime via the Admin Portal token toggle.
  return val === "true";
}

function setGateEnabled(enabled) {
  localStorage.setItem(STORAGE_GATE_ENABLED_KEY, enabled ? "true" : "false");
}

function getAccessTokens() {
  try {
    const raw = localStorage.getItem(STORAGE_ACCESS_TOKENS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read access tokens from localStorage", err);
  }
  saveAccessTokens(DEFAULT_ACCESS_TOKENS);
  return DEFAULT_ACCESS_TOKENS;
}

function saveAccessTokens(tokens) {
  try {
    localStorage.setItem(STORAGE_ACCESS_TOKENS_KEY, JSON.stringify(tokens));
    return true;
  } catch (err) {
    console.error("Failed to save access tokens", err);
    return false;
  }
}

function createAccessToken(label) {
  const randomSuffix = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");

  const newToken = {
    token: `ACCESS-${randomSuffix}-${new Date().getFullYear()}`,
    label: label || "Guest Client Token",
    createdAt: new Date().toISOString().split("T")[0],
    isMaster: false
  };

  const tokens = getAccessTokens();
  tokens.unshift(newToken);
  saveAccessTokens(tokens);
  return newToken;
}

function revokeAccessToken(tokenString) {
  let tokens = getAccessTokens();
  tokens = tokens.filter((t) => t.token !== tokenString);
  saveAccessTokens(tokens);
}

function isValidAccessToken(tokenCandidate) {
  if (!tokenCandidate) return false;
  const clean = tokenCandidate.trim();
  const tokens = getAccessTokens();
  return tokens.some((t) => t.token === clean);
}

function isPortfolioUnlocked() {
  // 1. If gate is disabled, anyone can view
  if (!isGateEnabled()) return true;

  // 2. If unlocked in session or local storage
  const unlockedToken = localStorage.getItem(STORAGE_PORTFOLIO_UNLOCKED_KEY) || sessionStorage.getItem(STORAGE_PORTFOLIO_UNLOCKED_KEY);
  if (unlockedToken && isValidAccessToken(unlockedToken)) {
    return true;
  }

  // 3. If admin session is active
  if (isAdminAuthenticated()) return true;

  // 4. Check URL parameter ?token=... or ?access=...
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get("token") || urlParams.get("access");
  if (urlToken && isValidAccessToken(urlToken)) {
    unlockPortfolioWithToken(urlToken);
    return true;
  }

  return false;
}

function unlockPortfolioWithToken(tokenCandidate) {
  if (isValidAccessToken(tokenCandidate)) {
    localStorage.setItem(STORAGE_PORTFOLIO_UNLOCKED_KEY, tokenCandidate.trim());
    return true;
  }
  return false;
}

async function unlockPortfolioWithPassword(passcode) {
  const isValid = await verifyAdminPasscode(passcode);
  if (isValid) {
    // Save master unlock token
    localStorage.setItem(STORAGE_PORTFOLIO_UNLOCKED_KEY, "UMAIS-MASTER-ACCESS");
    setAdminSession("authorized_master_" + Date.now());
    return true;
  }
  return false;
}
