document.addEventListener("DOMContentLoaded", () => {
  // 1. Typing Effect Logic
  const words = ["AI & Machine Learning Engineer", "Deep Learning Developer", "Python & Data Specialist"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById("typing-text");

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  if (typingElement) typeEffect();

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // 3. Scroll Active Link & Scroll Reveal
  const sections = document.querySelectorAll(".section");
  const navItems = document.querySelectorAll(".nav-link");
  const revealElements = document.querySelectorAll(".reveal");

  function handleScroll() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentSection}`) {
        item.classList.add("active");
      }
    });

    // Reveal elements on scroll
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // 4. Project Card Inner Sliders & Lightbox Integration
  const sliders = document.querySelectorAll(".project-slider");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentSliderSlides = [];
  let currentLightboxIndex = 0;

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev-btn");
    const nextBtn = slider.querySelector(".next-btn");
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }

    // Open Lightbox on Image Click
    slides.forEach((slide, slideIndex) => {
      const img = slide.querySelector("img");
      const caption = slide.querySelector(".slide-caption");

      if (img) {
        img.addEventListener("click", () => {
          currentSliderSlides = Array.from(slides);
          currentLightboxIndex = slideIndex;
          openLightbox();
        });
      }
    });
  });

  function openLightbox() {
    const currentSlide = currentSliderSlides[currentLightboxIndex];
    const img = currentSlide.querySelector("img");
    const caption = currentSlide.querySelector(".slide-caption");

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentSliderSlides.length;
    openLightbox();
  }

  function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentSliderSlides.length) % currentSliderSlides.length;
    openLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", nextLightboxImage);
  if (lightboxPrev) lightboxPrev.addEventListener("click", prevLightboxImage);

  // Close when clicking outside image
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard Navigation Support
  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    }
  });

  // 5. Quick Direct Message via WhatsApp
  const whatsappForm = document.getElementById("whatsapp-form");

  if (whatsappForm) {
    whatsappForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      const formattedMessage = `Hello Ahmed,%0A%0AMy Name: ${encodeURIComponent(name)}%0AMy Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
      const whatsappUrl = `https://wa.me/201126169033?text=${formattedMessage}`;

      window.open(whatsappUrl, "_blank");
    });
  }
});