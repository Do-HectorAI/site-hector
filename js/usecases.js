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
  "redaction-1": "", // Rédigez dans votre style, dans Word (modèles + style)
  "redaction-2": "", // Plan détaillé de l'argumentation
  "redaction-3": "", // Enrichissez vos actes (jurisprudence + arguments)

  /* Axe 2 : Analyse de dossier */
  "analyse-1": "", // Maîtrisez vos dossiers les plus volumineux
  "analyse-2": "", // Faits, parties et tableau des pièces (fusion)
  "analyse-3": "", // Trouvez la jurisprudence

  /* Axe 3 : Gestion du contentieux */
  "gestion-1": "", // Structurez votre dossier (renommage auto + scission)
  "gestion-2": "", // Numérotez et tamponnez vos pièces
  "gestion-3": "", // Centralisez et sécurisez vos dossiers
};

/* --- PHOTOS (images dans assets/img/usecases/) --- */
const IMAGE_SOURCES = {
  /* Axe 1 : Rédaction d'acte */
  "redaction-1": "", // ex : "assets/img/usecases/redaction-1.jpg"
  "redaction-2": "",
  "redaction-3": "",

  /* Axe 2 : Analyse de dossier */
  "analyse-1": "",
  "analyse-2": "",
  "analyse-3": "",

  /* Axe 3 : Gestion du contentieux */
  "gestion-1": "",
  "gestion-2": "",
  "gestion-3": "",
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
      return;
    }

    // 2) VIDÉO
    if (videoSrc) {
      const poster = frame.getAttribute("data-poster") || "";
      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true; // évite le plein écran forcé sur iOS
      if (poster) video.poster = poster;
      if (label) video.setAttribute("aria-label", label);

      const source = document.createElement("source");
      source.src = videoSrc;
      source.type = "video/mp4";
      video.appendChild(source);

      frame.innerHTML = "";
      frame.appendChild(video);
      return;
    }

    // 3) Rien de renseigné → on laisse le placeholder en place.
  });
});
