/* =========================================================
   animation.js  -  COS106 Web Technologies Practical
   Handles:
     - Mobile navigation toggle
     - Active navigation link highlighting
     - Fade-in / scroll-reveal (IntersectionObserver)
     - Progress bar animation on scroll
     - Smooth scrolling for in-page anchors
     - Back-to-top button
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------
     1. MOBILE NAVIGATION TOGGLE
     Shows / hides the nav-links list on small screens.
  -------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks  = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    /* Close the menu whenever a link is clicked (mobile UX) */
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --------------------------------------------------
     2. ACTIVE NAVIGATION HIGHLIGHTING
     Compares the current filename to each nav href
     and adds the .active class to the matching link.
  -------------------------------------------------- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  /* --------------------------------------------------
     3. FADE-IN ON SCROLL  (IntersectionObserver)
     Elements with .fade-in get .visible when they
     enter the viewport.
  -------------------------------------------------- */
  const fadeElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target); /* animate once only */
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    /* Fallback for browsers without IntersectionObserver */
    fadeElements.forEach((el) => el.classList.add("visible"));
  }

  /* --------------------------------------------------
     4. PROGRESS BAR ANIMATION
     .bar-fill elements read their data-width attribute
     and animate to that percentage when scrolled into view.
  -------------------------------------------------- */
  const barFills = document.querySelectorAll(".bar-fill");

  if (barFills.length && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetWidth = entry.target.getAttribute("data-width");
            entry.target.style.width = targetWidth + "%";
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barFills.forEach((bar) => barObserver.observe(bar));
  }

  /* --------------------------------------------------
     5. SMOOTH SCROLLING FOR IN-PAGE ANCHORS
     Intercepts clicks on href="#..." links and
     scrolls smoothly to the target element.
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* --------------------------------------------------
     6. BACK-TO-TOP BUTTON
     Appears after scrolling 300px; clicking it
     scrolls the page back to the top smoothly.
  -------------------------------------------------- */
  const backTopBtn = document.querySelector(".back-top");

  if (backTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backTopBtn.classList.add("show");
      } else {
        backTopBtn.classList.remove("show");
      }
    });

    backTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

}); /* end DOMContentLoaded */
