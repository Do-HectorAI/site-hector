/* ==========================================================================
   HECTOR AI — Médias des cas d'usage ("Comment ça marche")
   --------------------------------------------------------------------------
   Chaque cas d'usage peut afficher SOIT une vidéo, SOIT une photo (même
   format 16:9). Tant que rien n'est renseigné, un placeholder "Vidéo à venir"
   s'affiche. C'est le SEUL fichier à modifier pour brancher vos médias.

   👉 POUR METTRE UNE VIDÉO sur un point :
      renseignez son URL .mp4 dans VIDEO_SOURCES, à la ligne du cas d'usage.
      Déposez le fichier dans : assets/video/
      Exemple :  "analyse-1": "assets/video/usecase-analyse-1.mp4",

   👉 POUR METTRE UNE PHOTO sur un point :
      renseignez son URL d'image dans IMAGE_SOURCES, à la ligne du cas d'usage.
      Déposez le fichier dans : assets/img/usecases/
      Exemple :  "analyse-1": "assets/img/usecases/analyse-1.jpg",

   ⚠️ Si une PHOTO et une VIDÉO sont renseignées pour le même point, c'est la
      PHOTO qui est affichée (elle est prioritaire).
   ========================================================================== */

/* --- VIDÉOS (.mp4 dans assets/video/) --- */
const VIDEO_SOURCES = {
  /* Axe 1 : Rédaction d'acte */
  "redaction-1": "", // Rédigez dans votre style (vidéo à recompresser : > 100 Mo)
  "redaction-2": "", // Plan détaillé de l'argumentation
  "redaction-3": "assets/video/usecases/redaction-3.mp4", // Enrichissez vos actes

  /* Axe 2 : Analyse de dossier */
  "analyse-1": "assets/video/usecases/analyse-1.mp4", // Maîtrisez vos dossiers volumineux
  "analyse-2": "", // Faits, parties et tableau des pièces (fusion)
  "analyse-3": "assets/video/usecases/analyse-3.mp4", // Trouvez la jurisprudence

  /* Axe 3 : Gestion du contentieux */
  "gestion-1": "", // Structurez votre dossier (renommage auto + scission)
  "gestion-2": "", // Numérotez et tamponnez vos pièces
  "gestion-3": "", // Centralisez et sécurisez vos dossiers
};

/* --- PHOTOS (images dans assets/img/usecases/) --- */
const IMAGE_SOURCES = {
  /* Axe 1 : Rédaction d'acte */
  "redaction-1": "", // ex : "assets/img/usecases/redaction-1.jpg"
  "redaction-2": "assets/img/usecases/redaction-2.png",
  "redaction-3": "",

  /* Axe 2 : Analyse de dossier */
  "analyse-1": "",
  "analyse-2": "assets/img/usecases/analyse-2.png",
  "analyse-3": "",

  /* Axe 3 : Gestion du contentieux */
  "gestion-1": "assets/img/usecases/gestion-1.png",
  "gestion-2": "",
  "gestion-3": "assets/img/usecases/gestion-3.png",
};

/* --------------------------------------------------------------------------
   Au chargement : pour chaque cadre média (élément [data-video-id]) :
     1. si une PHOTO est renseignée → on affiche l'image ;
     2. sinon, si une VIDÉO est renseignée → on affiche la vidéo (auto, muette,
        en boucle) ;
     3. sinon → on garde le placeholder "Vidéo à venir".
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const frames = document.querySelectorAll("[data-video-id]");

  // Lightbox réutilisable (créée une seule fois) pour agrandir les photos.
  const lightbox = createLightbox();

  frames.forEach(function (frame) {
    const id = frame.getAttribute("data-video-id");
    const imageSrc = IMAGE_SOURCES[id];
    const videoSrc = VIDEO_SOURCES[id];
    const label = frame.getAttribute("aria-label") || "";

    // 1) PHOTO prioritaire
    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = label; // texte alternatif pour l'accessibilité
      img.loading = "lazy"; // chargement différé (performance)
      // L'image porte déjà sa description : on retire le rôle du cadre.
      frame.removeAttribute("role");
      frame.removeAttribute("aria-label");
      frame.innerHTML = "";
      frame.appendChild(img);
      // Rendre la photo cliquable pour l'afficher en grand.
      makeImageZoomable(img, label, lightbox);
      return;
    }

    // 2) VIDÉO
    if (videoSrc) {
      const poster = frame.getAttribute("data-poster") || "";
      const video = document.createElement("video");
      // Pas d'autoplay : on ne charge/joue la vidéo que lorsqu'elle est visible
      // (voir lazyPlay), pour ne pas tout télécharger d'un coup au chargement.
      video.muted = true;
      video.loop = true;
      video.playsInline = true; // évite le plein écran forcé sur iOS
      video.preload = "none"; // rien n'est téléchargé tant qu'on ne lit pas
      if (poster) video.poster = poster;
      if (label) video.setAttribute("aria-label", label);

      const source = document.createElement("source");
      source.src = videoSrc;
      source.type = "video/mp4";
      video.appendChild(source);

      frame.innerHTML = "";
      frame.appendChild(video);
      // Rendre la vidéo cliquable pour l'ouvrir en grand, avec le son.
      makeVideoZoomable(video, videoSrc, label, lightbox);
      // Charger et lire la vidéo seulement quand elle entre à l'écran.
      lazyPlay(video);
      return;
    }

    // 3) Rien de renseigné → on laisse le placeholder en place.
  });
});

/* --------------------------------------------------------------------------
   Lightbox : crée une fois pour toutes une fenêtre superposée qui affiche un
   média en grand. Gère deux cas :
     - showImage(src, alt) : affiche une photo ;
     - showVideo(src, alt) : affiche une vidéo AVEC LE SON et des contrôles
       (lecture/pause, volume), en lecture automatique et en boucle.
   Fermeture : bouton ×, clic sur le fond, ou touche Échap. À la fermeture, la
   vidéo est arrêtée (le son se coupe).
   -------------------------------------------------------------------------- */
function createLightbox() {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Média agrandi");

  const img = document.createElement("img");
  img.alt = "";
  img.style.display = "none";

  const video = document.createElement("video");
  video.setAttribute("controls", ""); // contrôles natifs (volume, pause…)
  video.setAttribute("playsinline", ""); // reste dans la fenêtre sur mobile
  video.loop = true;
  video.style.display = "none";

  const close = document.createElement("button");
  close.type = "button";
  close.className = "lightbox-close";
  close.setAttribute("aria-label", "Fermer");
  close.innerHTML = "&times;";

  overlay.appendChild(img);
  overlay.appendChild(video);
  overlay.appendChild(close);
  document.body.appendChild(overlay);

  function open() {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden"; // bloque le défilement de fond
    close.focus();
  }
  function hide() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = ""; // réautorise le défilement
    // Arrête la vidéo et libère la source (coupe le son).
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function showImage(src, alt) {
    video.pause();
    video.style.display = "none";
    img.style.display = "block";
    img.src = src;
    img.alt = alt || "";
    open();
  }
  function showVideo(src, alt) {
    img.style.display = "none";
    video.style.display = "block";
    video.src = src;
    video.muted = false; // le son est activé en grand
    video.currentTime = 0;
    video.setAttribute("aria-label", alt || "");
    open();
    // Le clic d'ouverture est un geste utilisateur : la lecture avec son est autorisée.
    const p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  close.addEventListener("click", hide);
  // Clic sur le fond sombre (en dehors du média) → fermeture.
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) hide();
  });
  // Touche Échap → fermeture.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) hide();
  });

  return { showImage: showImage, showVideo: showVideo };
}

/* Lecture "paresseuse" : la vidéo ne se charge et ne démarre que lorsqu'elle
   entre dans l'écran, et se met en pause quand elle en sort. Cela évite de
   télécharger toutes les vidéos de la page en même temps au chargement. */
function lazyPlay(video) {
  // Repli : sans IntersectionObserver, on lit directement.
  if (!("IntersectionObserver" in window)) {
    const p = video.play();
    if (p && p.catch) p.catch(function () {});
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const p = entry.target.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          entry.target.pause();
        }
      });
    },
    {
      // rootMargin avec une grande marge BASSE : la vidéo commence à se charger
      // ~700px AVANT d'entrer à l'écran, pour qu'elle soit prête (et déjà en
      // lecture) au moment où l'utilisateur arrive dessus.
      rootMargin: "200px 0px 700px 0px",
      threshold: 0.01,
    }
  );

  observer.observe(video);
}

/* Rend une image cliquable (et accessible au clavier) pour l'agrandir. */
function makeImageZoomable(img, label, lightbox) {
  img.setAttribute("role", "button");
  img.setAttribute("tabindex", "0");
  img.setAttribute("aria-label", "Agrandir l'image : " + (label || ""));

  img.addEventListener("click", function () {
    lightbox.showImage(img.src, label);
  });
  // Accessibilité clavier : Entrée ou Espace ouvrent aussi l'image.
  img.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lightbox.showImage(img.src, label);
    }
  });
}

/* Rend une vidéo cliquable (et accessible au clavier) pour l'ouvrir en grand
   AVEC LE SON. La vidéo dans la page reste muette et en boucle. */
function makeVideoZoomable(video, src, label, lightbox) {
  video.setAttribute("role", "button");
  video.setAttribute("tabindex", "0");
  video.setAttribute("aria-label", "Agrandir la vidéo (avec le son) : " + (label || ""));

  video.addEventListener("click", function () {
    lightbox.showVideo(src, label);
  });
  video.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lightbox.showVideo(src, label);
    }
  });
}
