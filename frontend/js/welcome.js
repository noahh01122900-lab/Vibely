// ========================================================
// VIBELY WELCOME / LANDING PAGE CONTROLLER
// Interactive animations, theme sync, parallax tilt & auth
// ========================================================

(function () {
    'use strict';

    // ----------------------------------------------------
    // 1. THEME SYNCHRONIZATION
    // ----------------------------------------------------
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            if (themeIcon) themeIcon.textContent = "☀️";
        } else {
            document.body.classList.remove("dark-mode");
            if (themeIcon) themeIcon.textContent = "🌙";
        }
    }

    const savedTheme = localStorage.getItem("vibely_theme") || "light";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-mode");
            const newTheme = isDark ? "light" : "dark";
            localStorage.setItem("vibely_theme", newTheme);
            applyTheme(newTheme);
        });
    }

    // ----------------------------------------------------
    // 2. NAVBAR BLUR & SCROLL ACTIVE INDICATOR
    // ----------------------------------------------------
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar nav a");
    const sections = document.querySelectorAll("main#home, section#features, section#about");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    }, { passive: true });

    // Smooth scrolling for navigation links
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // Active link highlighting on scroll
    if ("IntersectionObserver" in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach((sec) => observer.observe(sec));
    }

    // ----------------------------------------------------
    // 3. 3D PARALLAX TILT EFFECT ON HERO ARTWORK
    // ----------------------------------------------------
    const artworkSection = document.querySelector(".hero-artwork");
    const mainCard = document.querySelector(".album-card-main");
    const backCard = document.querySelector(".album-card-back");

    if (artworkSection && mainCard) {
        artworkSection.addEventListener("mousemove", (e) => {
            const rect = artworkSection.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 16;
            const rotateY = (x / rect.width) * 16;

            mainCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            if (backCard) {
                backCard.style.transform = `perspective(1000px) rotateX(${rotateX * 0.6}deg) rotateY(${rotateY * 0.6}deg) rotate(-6deg) scale(0.95)`;
            }
        });

        artworkSection.addEventListener("mouseleave", () => {
            mainCard.style.transform = "";
            mainCard.style.transition = "transform 0.5s ease";
            if (backCard) {
                backCard.style.transform = "";
                backCard.style.transition = "transform 0.5s ease";
            }
            setTimeout(() => {
                if (mainCard) mainCard.style.transition = "";
                if (backCard) backCard.style.transition = "";
            }, 500);
        });
    }

    // ----------------------------------------------------
    // 4. FLOATING MUSICAL NOTES GENERATOR
    // ----------------------------------------------------
    const notesSymbols = ["♫", "♪", "♬", "♩", "✨"];
    function createAmbientNote() {
        if (!artworkSection) return;
        const note = document.createElement("div");
        note.className = "floating-note dynamic-note";
        note.textContent = notesSymbols[Math.floor(Math.random() * notesSymbols.length)];
        note.style.left = `${Math.random() * 80 + 10}%`;
        note.style.bottom = "10%";
        note.style.position = "absolute";
        note.style.pointerEvents = "none";
        note.style.fontSize = `${Math.random() * 14 + 16}px`;
        note.style.opacity = "0.7";
        note.style.transition = "all 3.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
        note.style.zIndex = "4";

        artworkSection.appendChild(note);

        requestAnimationFrame(() => {
            note.style.transform = `translateY(-${Math.random() * 120 + 80}px) translateX(${(Math.random() - 0.5) * 60}px) rotate(${(Math.random() - 0.5) * 40}deg)`;
            note.style.opacity = "0";
        });

        setTimeout(() => {
            note.remove();
        }, 3600);
    }

    // Spawn floating notes periodically if user is viewing hero
    const noteInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
            createAmbientNote();
        }
    }, 2800);

    // ----------------------------------------------------
    // 5. AUTH BUTTONS INTEGRATION
    // ----------------------------------------------------
    function wireAuthButtons() {
        const openAuthBtn = document.getElementById("openAuthBtn");
        const heroAuthBtn = document.getElementById("heroAuthBtn");

        const openHandler = () => {
            if (window.vibelyAuth && typeof window.vibelyAuth.openModal === "function") {
                window.vibelyAuth.openModal("login");
            }
        };

        if (openAuthBtn) openAuthBtn.addEventListener("click", openHandler);
        if (heroAuthBtn) heroAuthBtn.addEventListener("click", openHandler);
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireAuthButtons);
    } else {
        wireAuthButtons();
    }
})();
