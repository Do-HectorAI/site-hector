Photos des cas d'usage — page "Comment ça marche"
=================================================

Déposez ici les PHOTOS (format paysage 16:9 conseillé, ex. 1600x900) à afficher
à la place d'une vidéo pour certains points de la page "Comment ça marche".

Ensuite, indiquez le nom du fichier dans js/usecases.js, à la ligne IMAGE_SOURCES
correspondant au point. Exemple :

    "analyse-1": "assets/img/usecases/analyse-1.jpg",

Identifiants disponibles (un par point) :
  - Axe 1 (Rédaction) : redaction-1, redaction-2, redaction-3
  - Axe 2 (Analyse)   : analyse-1,   analyse-2,   analyse-3
  - Axe 3 (Gestion)   : gestion-1,   gestion-2,   gestion-3

Rappels :
  - Une photo l'emporte sur une vidéo si les deux sont renseignées pour un point.
  - Tant que ni photo ni vidéo n'est renseignée, le placeholder "Vidéo à venir"
    reste affiché.
  - Les vidéos (.mp4), elles, vont dans assets/video/ (voir VIDEO_SOURCES).

Ce fichier README.txt peut être supprimé : il ne sert qu'à conserver le dossier
dans Git/GitHub tant qu'il est vide.
