# TSL Courses — Gobelins

Template d'entrainement au **TSL** (Three.js Shading Language) avec Three.js et le
renderer WebGPU. Chaque lecon est un petit module autonome : une geometrie, un
NodeMaterial, et un graphe TSL a bidouiller.

## Installation

```bash
npm install
npm run dev
```

Le navigateur s'ouvre sur la premiere lecon. Le panneau **lil-gui** en haut a
droite permet de changer de shape (`Shape`) et expose les reglages de la lecon
en cours. L'URL suit la selection (`#01-plane`), donc un rechargement ou un lien
partage retombe sur la bonne lecon.

> Il faut un navigateur avec WebGPU (Chrome / Edge recents, Safari 18+).
> Sinon Three.js bascule automatiquement sur WebGL2.

## Structure

```
public/targets/          # images de reference, une par variante
scripts/
└── targets-plugin.js    # ecrit les PNG rendus par /targets.html (dev only)
src/
├── main.js              # point d'entree : routeur de lecons
├── targets.js           # outil prof : rend les solutions en PNG
├── style.css
├── core/
│   ├── Sketch.js        # scene, camera, renderer, controls, boucle de rendu
│   └── gui.js           # panneau lil-gui + selecteur de shape
└── lessons/
    ├── index.js         # registre : l'ordre ici est l'ordre du menu
    ├── 01-plane/
    │   ├── index.js     # la lecon : deux planes + selecteurs
    │   └── tsl/
    │       ├── index.js     # registre : ramasse questions/ et solutions/
    │       ├── questions/   # les exercices a remplir
    │       └── solutions/   # les corriges (gitignore)
    └── 02-sphere/
        └── index.js
```

## Exercices

La scene affiche **deux planes** cote a cote :

```
[ TARGET ]        [ YOUR CODE ]
  l'image           le rendu de
  a reproduire      questions/
```

Chaque fichier de `01-plane/tsl/questions/` est un exercice, et chaque fonction
qu'il exporte une variante a completer. Le panneau lil-gui expose deux listes :

- **Exercise** — un fichier de `questions/` (`03 — Circle`).
- **Effect** — les variantes de cet exercice (`smoothCircle`).

Le registre est automatique et **`questions/` fait foi** : ajouter un
`export const maVariante = Fn(...)` dans un fichier de `questions/` suffit a le
faire apparaitre dans le menu, le supprimer suffit a l'en retirer — meme si la
solution existe toujours. Pas besoin de toucher a `tsl/index.js`. Meme chose
pour un fichier d'exercice entier : le prefixe numerique de son nom donne
l'ordre du menu.

Reste a nettoyer a la main le PNG correspondant dans `public/targets/` : la page
de rendu ecrit les images, elle n'en supprime jamais.

Les variantes sont listees dans l'ordre alphabetique. Pour imposer un autre
ordre, ajouter un `order` dans le fichier d'exercice :

```js
export const order = ['horizontalGradient', 'verticalGradient', 'diagonalGradient']
```

Les noms listes passent en premier, dans cet ordre ; les autres suivent en
alphabetique. Pas besoin de tout lister, ni de tenir la liste a jour.

La selection est gardee en `localStorage`, donc le rechargement declenche par
Vite a chaque sauvegarde ne fait pas revenir au premier effet.

Un plane de gauche hachure signifie qu'aucune image de reference n'existe pour
cette variante.

## Les cibles (cote prof)

Le dossier `solutions/` est gitignore : les etudiants ne recoivent que les
images. Le plane de gauche affiche donc :

- la **solution rendue en direct** si `solutions/` est present (votre machine) ;
- l'**image** `public/targets/<exercice>/<variante>.png` sinon.

Pour (re)generer les images apres avoir modifie une solution :

```bash
npm run targets
```

Ca ouvre `/targets.html`, qui rend chaque solution en 512×512 et renvoie les PNG
au serveur de dev, qui les ecrit dans `public/targets/`. Il faut donc commiter
`public/targets/` mais jamais `solutions/`.

> `npm run build` embarque les solutions dans le bundle si le dossier est
> present. Ne deployez pas depuis une machine qui a les corriges.

## Anatomie d'une lecon

```js
export default {
  id: '01-plane',          // also the URL hash
  title: '01 — Plane',
  description: 'Shown under the panel.',

  setup({ group, gui, scene, camera, controls, renderer }) {
    // Everything added to `group` is cleaned up when the lesson changes.
    group.add(mesh)

    // `gui` is a lil-gui folder owned by the lesson, destroyed with it.
    // Leave it empty and it won't show up.
    gui.add(params, 'speed', 0, 2)

    return {
      update({ delta, elapsed }) {},  // called every frame (optional)
      dispose() {},                   // manual cleanup (optional)
    }
  },
}
```

## Ajouter une lecon

1. `src/lessons/03-cube/index.js` sur le modele ci-dessus.
2. L'importer et l'ajouter au tableau dans `src/lessons/index.js`.

## Les deux imports a retenir

```js
import { Mesh, MeshBasicNodeMaterial } from 'three/webgpu' // all of Three.js + WebGPU
import { vec3, uv, time } from 'three/tsl'                 // the TSL nodes
```

On importe **tout** depuis `three/webgpu` (jamais depuis `three`) pour eviter
d'embarquer deux copies de la lib dans le bundle.
