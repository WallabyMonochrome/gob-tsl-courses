# TSL Courses — Gobelins

Template d'entrainement au **TSL** (Three.js Shading Language) avec Three.js et le
renderer WebGPU. Chaque lecon est un petit module autonome : une geometrie, un
NodeMaterial, et un graphe TSL a bidouiller.

## Prerequis

- **Node 18, 20 ou 22+** — verifiez avec `node -v`. Si la commande n'existe pas,
  installez Node depuis [nodejs.org](https://nodejs.org) (version LTS).
- **Un navigateur WebGPU** — Chrome ou Edge 113+, Safari 18+. A defaut, Three.js
  bascule tout seul sur WebGL2 : tout marche pareil, juste un peu moins vite.

## Demarrer

```bash
npm install
npm run dev
```