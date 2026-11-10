// ========================================================
// VIBELY AUTHENTICATION CONTROLLER
// Handles Login, Sign Up, Google, Facebook & Guest Mode
// ========================================================

(function () {
    // Current user and registered accounts helpers
    const STORAGE_KEY_USER = "vibely_user";
    const STORAGE_KEY_ACCOUNTS = "vibely_accounts";

    // Initialize default demo accounts if none exist
    function getStoredAccounts() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
            if (!raw) {
                const defaultAccounts = [
                    {
                        name: "Alex Johnson",
                        email: "alex@vibely.com",
                        password: "password123",
                        provider: "email",
                        avatar: "A"
                    }
                ];
                localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(defaultAccounts));
                return defaultAccounts;
            }
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    function saveAccount(account) {
        const accounts = getStoredAccounts();
        accounts.push(account);
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_USER);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        if (user) {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY_USER);
        }
        window.dispatchEvent(new CustomEvent("vibely-auth-change", { detail: user }));
        updatePageAuthUI();
    }

    // Toast notification
    function showToast(message, icon = "✓") {
        let toast = document.getElementById("vibelyToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "vibelyToast";
            toast.className = "vibely-toast";
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

    // Inject Auth Modal DOM
    function injectAuthModal() {
        if (document.getElementById("vibelyAuthOverlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "vibelyAuthOverlay";
        overlay.className = "vibely-auth-overlay";
        overlay.innerHTML = `
            <div class="vibely-auth-modal welcome-auth-modal" role="dialog" aria-modal="true">
                <button type="button" class="auth-close-btn" id="authCloseBtn" aria-label="Close modal">✕</button>

                <div class="auth-header">
                    <div class="auth-brand-badge">♫</div>
                    <h2 id="authModalTitle">Welcome to Vibely</h2>
                    <p id="authModalSubtitle">Sign in to save your favorite songs & customize your music vibe.</p>
                </div>

                <div class="auth-tabs">
                    <button type="button" class="auth-tab-btn active" id="tabLoginBtn">Log In</button>
                    <button type="button" class="auth-tab-btn" id="tabSignupBtn">Sign Up</button>
                </div>

                <div id="authAlert" class="auth-alert"></div>

                <!-- Fast Social & Guest Logins -->
                <div class="auth-social-buttons">
                    <button type="button" class="social-auth-btn google-btn" id="btnGoogleAuth">
                        <span class="social-icon-svg">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                        </span>
                        <span>Continue with Google</span>
                    </button>

                    <button type="button" class="social-auth-btn facebook-btn" id="btnFacebookAuth">
                        <span class="social-icon-svg">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </span>
                        <span>Continue with Facebook</span>
                    </button>

                    <button type="button" class="social-auth-btn guest-btn" id="btnGuestAuth">
                        <span style="font-size: 18px;">🎧</span>
                        <span>Continue as Guest <small style="opacity: 0.8; font-weight: normal;">(No password)</small></span>
                    </button>
                </div>

                <div class="auth-divider">
                    <span>OR WITH EMAIL</span>
                </div>

                <!-- Email/Password Form -->
                <form id="vibelyAuthForm" class="auth-form" autocomplete="on">
                    <div class="auth-input-group" id="groupName" style="display: none;">
                        <label for="authName">Full Name</label>
                        <div class="auth-input-wrapper">
                            <input type="text" id="authName" placeholder="e.g. Alex Johnson" autocomplete="name">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="authEmail">Email Address</label>
                        <div class="auth-input-wrapper">
                            <input type="email" id="authEmail" placeholder="yourname@example.com" required autocomplete="email">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="authPassword">Password</label>
                        <div class="auth-input-wrapper">
                            <input type="password" id="authPassword" placeholder="••••••••" required autocomplete="current-password">
                            <button type="button" class="auth-eye-btn" id="togglePasswordBtn" aria-label="Toggle password view">👁</button>
                        </div>
                    </div>

                    <div class="auth-input-group" id="groupConfirmPassword" style="display: none;">
                        <label for="authConfirmPassword">Confirm Password</label>
                        <div class="auth-input-wrapper">
                            <input type="password" id="authConfirmPassword" placeholder="••••••••" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="auth-options" id="authOptionsRow">
                        <label class="auth-remember">
                            <input type="checkbox" id="authRemember" checked>
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="auth-forgot-link" id="authForgotLink">Forgot?</a>
                    </div>

                    <button type="submit" class="auth-submit-btn" id="authSubmitBtn">Log In</button>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);

        attachModalEvents();
    }

    let currentMode = "login"; // 'login' or 'signup'

    function setAuthMode(mode) {
        currentMode = mode;
        const tabLoginBtn = document.getElementById("tabLoginBtn");
        const tabSignupBtn = document.getElementById("tabSignupBtn");
        const groupName = document.getElementById("groupName");
        const groupConfirmPassword = document.getElementById("groupConfirmPassword");
        const authSubmitBtn = document.getElementById("authSubmitBtn");
        const authOptionsRow = document.getElementById("authOptionsRow");
        const authModalTitle = document.getElementById("authModalTitle");
        const authModalSubtitle = document.getElementById("authModalSubtitle");
        const authAlert = document.getElementById("authAlert");

        if (authAlert) {
            authAlert.style.display = "none";
            authAlert.className = "auth-alert";
        }

        if (mode === "signup") {
            tabLoginBtn.classList.remove("active");
            tabSignupBtn.classList.add("active");
            groupName.style.display = "flex";
            groupConfirmPassword.style.display = "flex";
            authOptionsRow.style.display = "none";
            authSubmitBtn.textContent = "Create Account";
            authModalTitle.textContent = "Create an Account";
            authModalSubtitle.textContent = "Join Vibely to explore, favorite, and stream your favorite tracks.";
        } else {
            tabSignupBtn.classList.remove("active");
            tabLoginBtn.classList.add("active");
            groupName.style.display = "none";
            groupConfirmPassword.style.display = "none";
            authOptionsRow.style.display = "flex";
            authSubmitBtn.textContent = "Log In";
            authModalTitle.textContent = "Welcome Back";
            authModalSubtitle.textContent = "Sign in to save your playlists, favorite tracks & listening vibe.";
        }
    }

    function openAuthModal(initialMode = "login") {
        injectAuthModal();
        setAuthMode(initialMode);
        const overlay = document.getElementById("vibelyAuthOverlay");
        if (overlay) {
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeAuthModal() {
        const overlay = document.getElementById("vibelyAuthOverlay");
        if (overlay) {
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    function setAlert(type, message) {
        const alertBox = document.getElementById("authAlert");
        if (!alertBox) return;
        alertBox.className = `auth-alert ${type}`;
        alertBox.innerHTML = `<span>${type === "error" ? "⚠️" : "✓"}</span> <span>${message}</span>`;
        alertBox.style.display = "flex";
    }

    function attachModalEvents() {
        const closeBtn = document.getElementById("authCloseBtn");
        const overlay = document.getElementById("vibelyAuthOverlay");
        const tabLoginBtn = document.getElementById("tabLoginBtn");
        const tabSignupBtn = document.getElementById("tabSignupBtn");
        const form = document.getElementById("vibelyAuthForm");
        const togglePasswordBtn = document.getElementById("togglePasswordBtn");
        const authPassword = document.getElementById("authPassword");

        const btnGoogleAuth = document.getElementById("btnGoogleAuth");
        const btnFacebookAuth = document.getElementById("btnFacebookAuth");
        const btnGuestAuth = document.getElementById("btnGuestAuth");
        const authForgotLink = document.getElementById("authForgotLink");

        if (closeBtn) closeBtn.addEventListener("click", closeAuthModal);

        if (overlay) {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) closeAuthModal();
            });
        }

        if (tabLoginBtn) tabLoginBtn.addEventListener("click", () => setAuthMode("login"));
        if (tabSignupBtn) tabSignupBtn.addEventListener("click", () => setAuthMode("signup"));

        if (togglePasswordBtn && authPassword) {
            togglePasswordBtn.addEventListener("click", () => {
                if (authPassword.type === "password") {
                    authPassword.type = "text";
                    togglePasswordBtn.textContent = "🙈";
                } else {
                    authPassword.type = "password";
                    togglePasswordBtn.textContent = "👁";
                }
            });
        }

        if (authForgotLink) {
            authForgotLink.addEventListener("click", (e) => {
                e.preventDefault();
                alert("Demo recovery: You can log in using demo account:\nEmail: alex@vibely.com\nPassword: password123\n\nOr click 'Continue as Guest' or 'Continue with Google'.");
            });
        }

        // GOOGLE AUTH
        if (btnGoogleAuth) {
            btnGoogleAuth.addEventListener("click", () => {
                // Interactive simulation of Google Sign-In
                const googleNames = ["Alex Johnson", "Taylor Swift Fan", "Music Explorer"];
                const randomName = googleNames[Math.floor(Math.random() * googleNames.length)];
                const promptName = prompt("Sign in with Google Account Name (or click OK for default):", randomName);
                if (promptName === null) return; // User cancelled

                const finalName = promptName.trim() || randomName;
                const user = {
                    name: finalName,
                    email: `${finalName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
                    provider: "Google",
                    avatar: finalName.charAt(0).toUpperCase()
                };

                setCurrentUser(user);
                closeAuthModal();
                showToast(`Signed in with Google as ${user.name}! 🎵`, "🚀");
            });
        }

        // FACEBOOK AUTH
        if (btnFacebookAuth) {
            btnFacebookAuth.addEventListener("click", () => {
                const promptName = prompt("Sign in with Facebook Name (or click OK for default):", "Facebook Music Lover");
                if (promptName === null) return;

                const finalName = promptName.trim() || "Facebook Listener";
                const user = {
                    name: finalName,
                    email: `${finalName.toLowerCase().replace(/\s+/g, "")}@facebook.com`,
                    provider: "Facebook",
                    avatar: "f"
                };

                setCurrentUser(user);
                closeAuthModal();
                showToast(`Connected with Facebook as ${user.name}! 🎵`, "📘");
            });
        }

        // GUEST AUTH
        if (btnGuestAuth) {
            btnGuestAuth.addEventListener("click", () => {
                const guestUser = {
                    name: "Guest Listener",
                    email: "guest@vibely.app",
                    provider: "Guest",
                    avatar: "🎧"
                };

                setCurrentUser(guestUser);
                closeAuthModal();
                showToast("Welcome! Enjoy Vibely as a Guest 🎧", "✨");
            });
        }

        // FORM SUBMIT (EMAIL/PASSWORD)
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const emailInput = document.getElementById("authEmail");
                const passwordInput = document.getElementById("authPassword");
                const nameInput = document.getElementById("authName");
                const confirmPasswordInput = document.getElementById("authConfirmPassword");

                const email = emailInput.value.trim().toLowerCase();
                const password = passwordInput.value;

                if (currentMode === "signup") {
                    const name = nameInput.value.trim();
                    const confirmPass = confirmPasswordInput.value;

                    if (!name) {
                        setAlert("error", "Please enter your full name.");
                        return;
                    }
                    if (password.length < 6) {
                        setAlert("error", "Password must be at least 6 characters.");
                        return;
                    }
                    if (password !== confirmPass) {
                        setAlert("error", "Passwords do not match. Please re-type.");
                        return;
                    }

                    const accounts = getStoredAccounts();
                    if (accounts.some(acc => acc.email === email)) {
                        setAlert("error", "An account with this email already exists. Please log in.");
                        return;
                    }

                    // Create new account
                    const newAccount = {
                        name: name,
                        email: email,
                        password: password,
                        provider: "Email",
                        avatar: name.charAt(0).toUpperCase()
                    };

                    saveAccount(newAccount);
                    setCurrentUser(newAccount);
                    closeAuthModal();
                    showToast(`Welcome to Vibely, ${newAccount.name}! Account created.`, "🎉");

                } else {
                    // Log In
                    const accounts = getStoredAccounts();
                    const matched = accounts.find(acc => acc.email === email && acc.password === password);

                    if (matched) {
                        setCurrentUser(matched);
                        closeAuthModal();
                        showToast(`Welcome back, ${matched.name}! 🎵`, "👋");
                    } else if (accounts.some(acc => acc.email === email)) {
                        setAlert("error", "Incorrect password. Please try again.");
                    } else {
                        // Helpful message allowing quick instant creation or check
                        setAlert("error", "No account found with this email. Switch to 'Sign Up' tab to create one!");
                    }
                }
            });
        }
    }

    // Update UI on Welcome Page or Index Main Page
    function updatePageAuthUI() {
        const user = getCurrentUser();

        // 1. WELCOME PAGE NAVBAR & HERO
        const welcomeNavAuth = document.getElementById("welcomeNavAuth");
        if (welcomeNavAuth) {
            if (user) {
                welcomeNavAuth.innerHTML = `
                    <div class="user-logged-pill" id="welcomeUserPill" title="Logged in as ${user.name}">
                        <div class="user-pill-avatar">${user.avatar || user.name.charAt(0)}</div>
                        <span class="user-pill-name">${user.name}</span>
                        <span class="user-pill-provider">${user.provider}</span>
                    </div>
                    <button type="button" class="nav-auth-btn" id="welcomeSignoutBtn" style="padding: 7px 12px; font-size: 12px;">Log Out</button>
                `;

                const signoutBtn = document.getElementById("welcomeSignoutBtn");
                if (signoutBtn) {
                    signoutBtn.addEventListener("click", () => {
                        setCurrentUser(null);
                        showToast("Signed out successfully 👋", "ℹ️");
                    });
                }

                const userPill = document.getElementById("welcomeUserPill");
                if (userPill) {
                    userPill.addEventListener("click", () => {
                        window.location.href = "index.html";
                    });
                }
            } else {
                welcomeNavAuth.innerHTML = `
                    <button type="button" class="nav-auth-btn" id="openAuthBtn">
                        <span>👤</span>
                        <span>Sign In</span>
                    </button>
                `;
                const openAuthBtn = document.getElementById("openAuthBtn");
                if (openAuthBtn) {
                    openAuthBtn.addEventListener("click", () => openAuthModal("login"));
                }
            }
        }

        // Hero action button on welcome page
        const heroAuthBtn = document.getElementById("heroAuthBtn");
        if (heroAuthBtn) {
            if (user) {
                heroAuthBtn.innerHTML = `Signed in as ${user.name} (Switch)`;
                heroAuthBtn.onclick = () => openAuthModal("login");
            } else {
                heroAuthBtn.innerHTML = `Sign In / Sign Up`;
                heroAuthBtn.onclick = () => openAuthModal("login");
            }
        }

        // 2. MAIN PLAYER (INDEX.HTML) TOPBAR PROFILE
        const profileBtn = document.getElementById("profileBtn");
        const profileAvatar = document.getElementById("profileAvatar");
        const userGreeting = document.getElementById("userGreeting");
        const profileDropdown = document.getElementById("profileDropdown");

        if (profileAvatar) {
            if (user) {
                profileAvatar.textContent = user.avatar || user.name.charAt(0);
                if (profileBtn) profileBtn.title = `Signed in as ${user.name} (${user.provider})`;
            } else {
                profileAvatar.textContent = "👤";
                if (profileBtn) profileBtn.title = "Click to Sign In or Create Account";
            }
        }

        if (userGreeting) {
            if (user) {
                userGreeting.innerHTML = `Welcome, ${user.name.split(" ")[0]} <span>✦</span>`;
            } else {
                userGreeting.innerHTML = `Good evening <span>✦</span>`;
            }
        }

        if (profileDropdown) {
            if (user) {
                profileDropdown.innerHTML = `
                    <div class="profile-dropdown-header">
                        <div class="profile-dropdown-avatar">${user.avatar || user.name.charAt(0)}</div>
                        <div class="profile-dropdown-info">
                            <div class="profile-dropdown-name">${user.name}</div>
                            <div class="profile-dropdown-email">${user.email}</div>
                            <span class="profile-dropdown-badge">${user.provider} Account</span>
                        </div>
                    </div>
                    <div class="profile-dropdown-actions">
                        <button type="button" class="profile-action-btn" id="btnSwitchAccount">
                            <span>🔄</span> Switch Account / Sign In
                        </button>
                        <button type="button" class="profile-action-btn logout-btn" id="btnLogoutUser">
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                `;

                const btnLogoutUser = document.getElementById("btnLogoutUser");
                if (btnLogoutUser) {
                    btnLogoutUser.addEventListener("click", () => {
                        profileDropdown.classList.remove("show");
                        setCurrentUser(null);
                        showToast("Signed out 👋", "ℹ️");
                    });
                }

                const btnSwitchAccount = document.getElementById("btnSwitchAccount");
                if (btnSwitchAccount) {
                    btnSwitchAccount.addEventListener("click", () => {
                        profileDropdown.classList.remove("show");
                        openAuthModal("login");
                    });
                }
            } else {
                profileDropdown.innerHTML = `
                    <div class="profile-dropdown-header">
                        <div class="profile-dropdown-avatar">👤</div>
                        <div class="profile-dropdown-info">
                            <div class="profile-dropdown-name">Not Signed In</div>
                            <div class="profile-dropdown-email">Sign in to save favorites & playlists</div>
                        </div>
                    </div>
                    <div class="profile-dropdown-actions">
                        <button type="button" class="profile-action-btn" id="btnDropdownLogin">
                            <span>🔑</span> Log In / Sign Up
                        </button>
                        <button type="button" class="profile-action-btn" id="btnDropdownGuest">
                            <span>🎧</span> Continue as Guest
                        </button>
                    </div>
                `;

                const btnDropdownLogin = document.getElementById("btnDropdownLogin");
                if (btnDropdownLogin) {
                    btnDropdownLogin.addEventListener("click", () => {
                        profileDropdown.classList.remove("show");
                        openAuthModal("login");
                    });
                }

                const btnDropdownGuest = document.getElementById("btnDropdownGuest");
                if (btnDropdownGuest) {
                    btnDropdownGuest.addEventListener("click", () => {
                        profileDropdown.classList.remove("show");
                        setCurrentUser({
                            name: "Guest Listener",
                            email: "guest@vibely.app",
                            provider: "Guest",
                            avatar: "🎧"
                        });
                        showToast("Listening as Guest 🎧", "✨");
                    });
                }
            }
        }
    }

    // Toggle profile dropdown on index.html
    function setupProfileDropdown() {
        const profileBtn = document.getElementById("profileBtn");
        const profileDropdown = document.getElementById("profileDropdown");

        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle("show");
            });

            document.addEventListener("click", (e) => {
                if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
                    profileDropdown.classList.remove("show");
                }
            });
        }
    }

    // Initialize on DOM load
    document.addEventListener("DOMContentLoaded", () => {
        injectAuthModal();
        updatePageAuthUI();
        setupProfileDropdown();
    });

    // In case DOM is already loaded
    if (document.readyState === "interactive" || document.readyState === "complete") {
        injectAuthModal();
        updatePageAuthUI();
        setupProfileDropdown();
    }

    // Expose global controller
    window.vibelyAuth = {
        openModal: openAuthModal,
        closeModal: closeAuthModal,
        getUser: getCurrentUser,
        setUser: setCurrentUser,
        logout: () => setCurrentUser(null)
    };
})();

