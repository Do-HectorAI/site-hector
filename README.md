# Site vitrine — Hector AI

Site vitrine de **Hector AI**, legaltech française dont la plateforme d'IA est
spécialisée en contentieux pour les avocats.

C'est un site **statique** : il est écrit en **HTML, CSS et JavaScript pur**,
sans aucun framework ni étape de compilation. Il fonctionne directement dans un
navigateur et est 100 % compatible avec **GitHub Pages**.

---

## 1. Prévisualiser le site en local (sur votre ordinateur)

Vous avez deux options.

### Option A — La plus simple
Double-cliquez sur le fichier **`index.html`**. Il s'ouvre dans votre
navigateur. C'est suffisant pour voir le site.

> ⚠️ Petite limite : avec cette méthode, certaines fonctions (comme la lecture
> automatique des vidéos) peuvent être bloquées par le navigateur. Pour un rendu
> 100 % fidèle, préférez l'option B.

### Option B — Avec un petit serveur local (recommandé)
Si vous avez **Python** installé (c'est le cas sur la plupart des Mac), ouvrez
le **Terminal**, placez-vous dans le dossier du site et lancez :

```bash
cd chemin/vers/site-hector
python3 -m http.server 8000
```

Puis ouvrez votre navigateur à l'adresse : **http://localhost:8000**

Pour arrêter le serveur, appuyez sur `Ctrl + C` dans le Terminal.

---

## 2. Mettre le site en ligne avec GitHub Pages

1. Créez un dépôt (repository) sur GitHub et **envoyez-y tous les fichiers** de
   ce dossier.
2. Sur GitHub, allez dans **Settings → Pages**.
3. Dans **Source**, choisissez la branche `main` et le dossier `/ (root)`.
4. Validez : après quelques minutes, votre site est en ligne à l'adresse
   indiquée par GitHub.

> Le fichier **`.nojekyll`** (déjà présent à la racine) est important : il dit à
> GitHub Pages de publier le site tel quel. Ne le supprimez pas.

---

## 3. Où déposer vos fichiers (logo, photo, vidéos)

| Fichier à fournir | Où le déposer | Utilisé pour |
|---|---|---|
| **Logo** | `assets/img/logo.svg` | Header, footer et hero. *(Tant qu'il est absent, le mot « Hector » s'affiche automatiquement.)* |
| **Photo du hero** | `assets/img/hero.jpg` | Image de fond plein écran de l'accueil |
| **Vidéo « Analyse »** | `assets/video/demo-analyse.mp4` | Démo sur « Comment ça marche » |
| **Vidéo « Rédaction »** | `assets/video/demo-redaction.mp4` | Démo sur « Comment ça marche » |
| **Vidéo du hero** *(option)* | `assets/video/hero.mp4` | Pour remplacer la photo du hero (voir commentaire dans `index.html`) |
| **Photos équipe** *(option)* | `assets/img/equipe/` | Cartes de l'équipe (voir commentaire dans `equipe.html`) |

Il suffit de **déposer le fichier au bon endroit avec le bon nom** : le site
l'affichera automatiquement, sans rien changer dans le code.

---

## 4. Modifier les textes et les chiffres

Tous les textes sont directement dans les fichiers `.html`. Ouvrez-les avec un
éditeur de texte (ex. **Visual Studio Code**, gratuit) et modifiez le texte
entre les balises.

Repères pour vous guider :

- **Les chiffres clés** (page d'accueil) : cherchez `[XX]` dans `index.html`
  et remplacez-les par vos vrais nombres.
- **Les questions de la FAQ** : dans `faq.html`, chaque question est un bloc
  `faq-item`. Un commentaire `Remplace par ta vraie réponse` vous guide.
- **Les membres de l'équipe** : dans `equipe.html`, chaque membre est un bloc
  `team-card`. Remplacez `[Prénom Nom]`, `[Rôle]` et la bio.
- **Les textes juridiques** : dans chaque page légale, cherchez le grand
  commentaire `COLLE ICI TON TEXTE DE ...` et collez votre texte à cet endroit.
- **Le lien « Réserver une démo »** : cherchez `https://calendly.com/PLACEHOLDER`
  (présent sur toutes les pages) et remplacez-le par votre vrai lien Calendly.
- **L'adresse e-mail** : remplacez `contact@hector.legal` par votre vraie adresse.

> 💡 Astuce : dans votre éditeur, utilisez **Rechercher/Remplacer dans tous les
> fichiers** pour changer d'un coup le lien Calendly ou l'e-mail partout.

---

## 5. Changer les couleurs et les polices

Tout le style est dans **un seul fichier** : `css/styles.css`.

Tout en haut de ce fichier se trouve un bloc `:root` qui contient les
**variables** (couleurs, polices, espacements). Modifiez une valeur ici et elle
se met à jour **partout** sur le site. Exemple :

```css
:root {
  --color-text: #0a0a0a;   /* couleur du texte principal */
  --color-bg: #ffffff;     /* couleur de fond */
  /* ... */
}
```

---

## 6. Structure des fichiers

```
site-hector/
├── index.html                      ← Page d'accueil
├── comment-ca-marche.html          ← Fonctionnement (avec vidéos)
├── faq.html                        ← Questions fréquentes (accordéon)
├── equipe.html                     ← Équipe / à propos
├── contact.html                    ← Contact
├── mentions-legales.html           ┐
├── cgu.html                        │
├── cgv.html                        ├─ Pages légales (mêmes gabarits)
├── politique-confidentialite.html  │
├── dpa.html                        ┘
│
├── css/
│   └── styles.css                  ← TOUT le style (variables en haut)
├── js/
│   └── main.js                     ← TOUTES les interactions (menu, onglets…)
│
├── assets/
│   ├── img/                        ← Vos images (logo, hero, photos équipe)
│   └── video/                      ← Vos vidéos de démo
│
├── .nojekyll                       ← Requis pour GitHub Pages (ne pas supprimer)
└── README.md                       ← Ce fichier
```

---

## 7. Ce qu'il vous reste à fournir / compléter

- [ ] **Logo** → `assets/img/logo.svg`
- [ ] **Photo du hero** → `assets/img/hero.jpg`
- [ ] **Vidéos de démo** → `assets/video/demo-analyse.mp4` et `demo-redaction.mp4`
- [ ] **Lien Calendly** → remplacer `https://calendly.com/PLACEHOLDER` partout
- [ ] **Chiffres clés** → remplacer les `[XX]` dans `index.html`
- [ ] **Questions/réponses de la FAQ** → dans `faq.html`
- [ ] **Mission, vision et membres de l'équipe** → dans `equipe.html`
- [ ] **Coordonnées de contact** → dans `contact.html`
- [ ] **Textes juridiques** → mentions légales, CGU, CGV, politique de
      confidentialité et DPA
- [ ] **E-mail de contact** → remplacer `contact@hector.legal` si besoin

Bon lancement ! 🚀
