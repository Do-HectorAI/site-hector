/* ==========================================================================
   HECTOR AI — Script principal (JavaScript pur / vanilla)
   --------------------------------------------------------------------------
   Ce fichier gère toutes les interactions du site :
     1. Menu hamburger (mobile)
     2. Header qui se densifie au scroll
     3. Onglets de la section "Fonctionnalités"
     4. Accordéon de la FAQ
     5. Animations d'apparition au scroll (IntersectionObserver)
     6. Défilement fluide des ancres internes

   Tout est encapsulé et déclenché une fois la page chargée. Chaque bloc
   vérifie que les éléments existent : le même fichier peut donc être inclus
   sur toutes les pages sans erreur, même si un composant est absent.
   ========================================================================== */

// On attend que le DOM soit prêt avant de manipuler les éléments.
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initHeaderScroll();
  initTabs();
  initFaqAccordion();
  initScrollReveal();
  initSmoothAnchors();
});


/* --------------------------------------------------------------------------
   1. MENU HAMBURGER (mobile)
   Ouvre / ferme la navigation au clic sur le bouton hamburger.
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return; // sécurité si le header est absent

  // Bascule l'ouverture du menu
  function toggleMenu() {
    const isOpen = nav.classList.toggle("is-open");
    // On met à jour l'attribut ARIA pour l'accessibilité (lecteurs d'écran)
    toggle.setAttribute("aria-expanded", String(isOpen));
    // Empêche le défilement de l'arrière-plan quand le menu est ouvert
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  toggle.addEventListener("click", toggleMenu);

  // Ferme le menu quand on clique sur un lien de navigation
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) toggleMenu();
    });
  });

  // Ferme le menu avec la touche Échap (accessibilité clavier)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) toggleMenu();
  });
}


/* --------------------------------------------------------------------------
   2. HEADER QUI SE DENSIFIE AU SCROLL
   Ajoute la classe .is-scrolled au header quand on défile, ce qui renforce le
   fond et ajoute une bordure/ombre légère (voir le CSS).

   Cas particulier de l'accueil : le header y est transparent par-dessus la
   vidéo du hero (classe .site-header--transparent). On veut alors qu'il reste
   transparent TANT QU'ON EST SUR LE HERO, et qu'il devienne blanc seulement
   une fois le hero dépassé. Le seuil de déclenchement est donc la hauteur du
   hero ; sur les autres pages, on garde un petit seuil de 10 px.
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const hero = document.querySelector(".hero");
  const isTransparent = header.classList.contains("site-header--transparent");

  // Calcule le seuil à partir duquel le header devient blanc.
  function getThreshold() {
    if (isTransparent && hero) {
      // Juste avant que le bas du hero n'atteigne le bas du header.
      return hero.offsetHeight - header.offsetHeight;
    }
    return 10;
  }

  function onScroll() {
    if (window.scrollY > getThreshold()) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  onScroll(); // état initial au chargement
  // { passive: true } améliore les performances de défilement
  window.addEventListener("scroll", onScroll, { passive: true });
}


/* --------------------------------------------------------------------------
   3. ONGLETS DE LA SECTION "FONCTIONNALITÉS"
   Au clic sur un onglet, on affiche le panneau correspondant avec une
   transition douce et on masque les autres.
   Structure HTML attendue :
     <button class="tab-btn" data-tab="analyse"> … </button>
     <div class="tab-panel" id="analyse"> … </div>
   -------------------------------------------------------------------------- */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  if (tabButtons.length === 0) return;

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-tab");

      // 1) Réinitialise tous les boutons (état non sélectionné)
      tabButtons.forEach(function (b) {
        b.setAttribute("aria-selected", "false");
      });
      // 2) Active le bouton cliqué
      btn.setAttribute("aria-selected", "true");

      // 3) Masque tous les panneaux, puis affiche le bon avec un fondu
      document.querySelectorAll(".tab-panel").forEach(function (panel) {
        panel.classList.remove("is-active", "is-visible");
      });

      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add("is-active");
        // Petit délai pour que la transition CSS (opacité/translation) se déclenche
        requestAnimationFrame(function () {
          target.classList.add("is-visible");
        });
      }
    });
  });
}


/* --------------------------------------------------------------------------
   4. ACCORDÉON FAQ
   Ouvre / ferme une réponse au clic sur sa question. On anime la hauteur
   via max-height (défini sur scrollHeight pour s'adapter au contenu).
   Structure HTML attendue :
     <div class="faq-item">
       <button class="faq-question" aria-expanded="false"> … </button>
       <div class="faq-answer"><div class="faq-answer-inner"> … </div></div>
     </div>
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  if (questions.length === 0) return;

  questions.forEach(function (question) {
    question.addEventListener("click", function () {
      const answer = question.nextElementSibling; // la div .faq-answer
      const isOpen = question.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        // Fermeture : on remet la hauteur à 0
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        // Ouverture : on règle max-height sur la hauteur réelle du contenu
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}


/* --------------------------------------------------------------------------
   5. ANIMATIONS D'APPARITION AU SCROLL (IntersectionObserver)
   Tous les éléments portant l'attribut [data-reveal] apparaissent en fondu
   + légère translation quand ils entrent dans la fenêtre (voir le CSS).
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length === 0) return;

  // Repli : si IntersectionObserver n'est pas supporté, on affiche tout.
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          // On arrête d'observer l'élément une fois révélé (animation unique)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,          // déclenche quand ~12% de l'élément est visible
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}


/* --------------------------------------------------------------------------
   6. DÉFILEMENT FLUIDE DES ANCRES INTERNES
   Le scroll fluide est déjà géré en CSS (scroll-behavior: smooth), mais on
   ajoute ici une gestion explicite pour les liens #ancre afin de bien tenir
   compte de la hauteur du header fixe.
   -------------------------------------------------------------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      // On ignore les liens vides "#" (sans cible réelle)
      if (href === "#" || href.length <= 1) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
