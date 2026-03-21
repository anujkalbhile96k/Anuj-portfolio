/* ============================================================
   ANUJ KRUSHNA KALBHILE — PORTFOLIO JAVASCRIPT
   script.js
   ============================================================
   TABLE OF CONTENTS:
   1.  Theme Toggle (Dark / Light Mode)
   2.  Navbar Scroll Behaviour & Active Link Highlighting
   3.  Hamburger Mobile Menu
   4.  Typewriter / Typed-Text Animation
   5.  Module Filter Tabs
   6.  Scroll-reveal Animation (IntersectionObserver)
   7.  Contact Form Handler (client-side feedback)
   8.  Footer Year Auto-update
   9.  Smooth Scroll for anchor links
   ============================================================ */

/* ----------------------------------------------------------
   Wait for the full DOM to load before running any JS logic
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. THEME TOGGLE — Dark / Light Mode
     The current theme is stored in localStorage so the
     user's preference is remembered across page refreshes.
  -------------------------------------------------------- */
  const html         = document.documentElement; // <html> element
  const themeToggle  = document.getElementById('themeToggle');

  /* Load saved theme preference from localStorage, default to 'dark' */
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  /* Toggle theme on button click */
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme     = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);   // persist preference
  });


  /* --------------------------------------------------------
     2. NAVBAR SCROLL BEHAVIOUR
     Adds .scrolled class to navbar when user scrolls down,
     which triggers the frosted-glass background in CSS.
     Also highlights the nav link for the visible section.
  -------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]'); // all sections with an id

  /* Add / remove .scrolled class based on scroll position */
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* --- Active section highlighting ---
       Loops through sections and marks the nav link active
       when its corresponding section is in the viewport. */
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;  // 100px offset for navbar height
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // run once on load


  /* --------------------------------------------------------
     3. HAMBURGER MOBILE MENU
     Toggles the mobile nav-links list open/closed.
  -------------------------------------------------------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileNavLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    mobileNavLinks.classList.toggle('open');
  });

  /* Close mobile menu when a nav link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavLinks.classList.remove('open');
    });
  });


  /* --------------------------------------------------------
     4. TYPEWRITER ANIMATION
     Cycles through an array of role strings, typing and
     then deleting each one character by character.
  -------------------------------------------------------- */
  const typedEl = document.getElementById('typedText');

  /* Array of roles / descriptions to cycle through */
  const roles = [
    'CSE Student @ SSGMCE Shegaon',
    'FabLab Learner',
    'Web Developer',
    'IoT & AI/ML Explorer',
  ];

  let roleIndex   = 0;   // current role being typed
  let charIndex   = 0;   // current character position
  let isDeleting  = false;

  const TYPE_SPEED   = 80;   // ms per character while typing
  const DELETE_SPEED = 40;   // ms per character while deleting
  const PAUSE_END    = 1800; // ms pause after full word is typed
  const PAUSE_START  = 400;  // ms pause before typing next word

  function typeWriter() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      /* Typing forward */
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        /* Word fully typed — pause before deleting */
        isDeleting = true;
        setTimeout(typeWriter, PAUSE_END);
        return;
      }
      setTimeout(typeWriter, TYPE_SPEED);

    } else {
      /* Deleting backward */
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        /* Word fully deleted — move to next role */
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        setTimeout(typeWriter, PAUSE_START);
        return;
      }
      setTimeout(typeWriter, DELETE_SPEED);
    }
  }

  /* Start the typewriter effect after a short initial delay */
  setTimeout(typeWriter, 800);


  /* --------------------------------------------------------
     5. MODULE FILTER TABS
     Filters the module cards by data-category attribute.
     'all' shows every card; other values filter by match.
  -------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const moduleCards = document.querySelectorAll('.module-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active button style */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter'); // e.g. 'all', 'hardware'

      moduleCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* --------------------------------------------------------
     6. SCROLL-REVEAL ANIMATION
     Uses IntersectionObserver to add .visible class to
     elements with .reveal class when they enter the viewport.
     Elements start invisible (opacity 0) via CSS and
     transition to visible when .visible is added.
  -------------------------------------------------------- */

  /* Add .reveal class to all major section children */
  const revealTargets = document.querySelectorAll(
    '.about-card, .module-card, .project-card, .contact-card, .contact-form-wrap'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  /* Create observer with 10% threshold (visible when 10% is in view) */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.1 });

  /* Observe every reveal target */
  revealTargets.forEach(el => revealObserver.observe(el));


  /* --------------------------------------------------------
     7. CONTACT FORM HANDLER
     Provides client-side validation feedback.
     You can extend this to actually send data via
     Formspree / EmailJS / a backend endpoint.
  -------------------------------------------------------- */
  const contactForm   = document.getElementById('contactForm');
  const formFeedback  = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent default browser submit

    /* Read form field values */
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    /* Basic validation */
    if (!name || !email || !message) {
      showFeedback('⚠️ Please fill in all fields.', true);
      return;
    }

    /* Simple email format check using regex */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('⚠️ Please enter a valid email address.', true);
      return;
    }

    /* ----- SUCCESS -----
       In a real project, replace this block with an API call,
       e.g. fetch('https://formspree.io/f/YOUR_ID', { method:'POST', ... })
    */
    showFeedback(`✅ Thanks ${name}! Your message has been received.`, false);
    contactForm.reset(); // clear the form fields
  });

  /* Helper: display feedback message below the form */
  function showFeedback(msg, isError) {
    formFeedback.textContent = msg;
    formFeedback.className   = 'form-feedback' + (isError ? ' error' : '');

    /* Auto-clear after 5 seconds */
    setTimeout(() => {
      formFeedback.textContent = '';
      formFeedback.className   = 'form-feedback';
    }, 5000);
  }


  /* --------------------------------------------------------
     8. FOOTER YEAR AUTO-UPDATE
     Automatically keeps the copyright year current.
  -------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------------
     9. SMOOTH SCROLL FOR ANCHOR LINKS
     Overrides default anchor jumping with smooth scroll.
     (CSS scroll-behavior: smooth handles most cases, but
     this JS version gives a custom offset for the fixed navbar.)
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = anchor.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (target) {
        const navbarHeight = navbar.offsetHeight;          // dynamic navbar height
        const targetTop    = target.getBoundingClientRect().top
                             + window.scrollY
                             - navbarHeight
                             - 16;                         // 16px extra breathing room

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    });
  });


}); // end DOMContentLoaded
