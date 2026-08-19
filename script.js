document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  // 0. Theme toggle (initial state is set inline in <head> to avoid flash)
  const STORAGE_KEY = "portfolio-theme";
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme, persist = false) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* storage unavailable — ignore */
      }
    }
  }

  if (themeToggle) {
    applyTheme(root.getAttribute("data-theme") || "light");
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  // 1. Typing effect
  const words = ["AI & Machine Learning Engineer", "Deep Learning Developer", "Python & Data Specialist", "FastAPI & Computer Vision Builder"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById("typing-text");

  if (typingElement) {
    if (reduceMotion) {
      typingElement.textContent = words[0];
    } else {
      function typeEffect() {
        const currentWord = words[wordIndex];
        typingElement.textContent = currentWord.substring(0, charIndex + (isDeleting ? -1 : 1));
        charIndex += isDeleting ? -1 : 1;

        let speed = isDeleting ? 40 : 95;

        if (!isDeleting && charIndex === currentWord.length) {
          speed = 1900;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          speed = 380;
        }

        setTimeout(typeEffect, speed);
      }
      typeEffect();
    }
  }

  // 2. Mobile menu
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");

  function closeMenu() {
    if (!navToggle || !navList) return;
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("open");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (navList.classList.contains("open") && !navList.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // 3. Header elevation + scroll spy
  const header = document.getElementById("site-header");
  const sections = document.querySelectorAll(".section");
  const navItems = document.querySelectorAll(".nav-link");

  function handleScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);

    let currentSection = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${currentSection}`);
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Close menu after choosing a destination
  navItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  // 4. Reveal on scroll (IntersectionObserver)
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // 5. Project sliders + lightbox
  const sliders = document.querySelectorAll(".project-slider");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCount = document.getElementById("lightbox-count");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentSliderSlides = [];
  let currentLightboxIndex = 0;

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.closest(".project-media").querySelector(".prev-btn");
    const nextBtn = slider.closest(".project-media").querySelector(".next-btn");
    const countEl = slider.closest(".project-media").querySelector(".slide-count");
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
      if (countEl) countEl.textContent = `${index + 1} / ${slides.length}`;
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        showSlide((currentSlide = (currentSlide + 1) % slides.length));
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        showSlide((currentSlide = (currentSlide - 1 + slides.length) % slides.length));
      });
    }

    slides.forEach((slide, slideIndex) => {
      const img = slide.querySelector("img");
      img?.addEventListener("click", () => {
        currentSliderSlides = Array.from(slides);
        currentLightboxIndex = slideIndex;
        openLightbox();
      });
    });
  });

  function openLightbox() {
    const slide = currentSliderSlides[currentLightboxIndex];
    const img = slide.querySelector("img");
    const caption = slide.querySelector(".slide-caption");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    if (lightboxCount) {
      lightboxCount.textContent = `${currentLightboxIndex + 1} / ${currentSliderSlides.length}`;
    }
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function stepLightbox(direction) {
    currentLightboxIndex =
      (currentLightboxIndex + direction + currentSliderSlides.length) % currentSliderSlides.length;
    openLightbox();
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", () => stepLightbox(1));
  lightboxPrev?.addEventListener("click", () => stepLightbox(-1));

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  // 6. WhatsApp quick message
  const whatsappForm = document.getElementById("whatsapp-form");
  if (whatsappForm) {
    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      const text = `Hello Ahmed,%0A%0AMy Name: ${encodeURIComponent(name)}%0AMy Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
      window.open(`https://wa.me/201126169033?text=${text}`, "_blank", "noopener");
    });
  }

  // 7. Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});