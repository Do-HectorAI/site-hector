/* ==========================================================================
   HECTOR AI — Vidéos des cas d'usage ("Comment ça marche")
   --------------------------------------------------------------------------
   👉 POUR BRANCHER UNE VRAIE VIDÉO : renseignez son URL .mp4 ci-dessous, à la
      ligne correspondant au cas d'usage. C'est le SEUL endroit à modifier.
      - Laissez "" tant que la vidéo n'est pas prête → un placeholder
        "Vidéo à venir" s'affiche automatiquement.
      - Vous pouvez aussi indiquer une image d'aperçu (poster) en option, via
        l'attribut data-poster directement dans le HTML de la page.

   Exemple :
      "analyse-1": "assets/video/usecase-analyse-1.mp4",
   ========================================================================== */

const VIDEO_SOURCES = {
  /* --- Axe 1 : Rédaction d'acte --- */
  "redaction-1": "", // Rédigez dans votre style, dans Word (modèles + style)
  "redaction-2": "", // Plan détaillé de l'argumentation
  "redaction-3": "", // Enrichissez vos actes (jurisprudence + arguments)

  /* --- Axe 2 : Analyse de dossier --- */
  "analyse-1": "", // Maîtrisez vos dossiers les plus volumineux
  "analyse-2": "", // Faits, parties et tableau des pièces (fusion)
  "analyse-3": "", // Trouvez la jurisprudence

  /* --- Axe 3 : Gestion du contentieux --- */
  "gestion-1": "", // Numérotez et tamponnez vos pièces
  "gestion-2": "", // Centralisez et sécurisez vos dossiers
};

/* --------------------------------------------------------------------------
   Au chargement : pour chaque cadre vidéo (élément [data-video-id]), si une
   URL est renseignée ci-dessus, on remplace le placeholder par une vraie
   vidéo en lecture automatique, en boucle et sans son. Sinon, on ne touche à
   rien : le placeholder "Vidéo à venir" reste affiché.
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const frames = document.querySelectorAll("[data-video-id]");

  frames.forEach(function (frame) {
    const id = frame.getAttribute("data-video-id");
    const src = VIDEO_SOURCES[id];

    // Pas d'URL pour ce cas → on garde le placeholder.
    if (!src) return;

    const poster = frame.getAttribute("data-poster") || "";
    const label = frame.getAttribute("aria-label") || "";

    // Construit la balise <video> (lecture auto, muette, en boucle).
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true; // évite le plein écran forcé sur iOS
    if (poster) video.poster = poster;
    if (label) video.setAttribute("aria-label", label);

    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.appendChild(source);

    // Remplace le contenu du cadre (placeholder) par la vidéo.
    frame.innerHTML = "";
    frame.appendChild(video);
  });
});
