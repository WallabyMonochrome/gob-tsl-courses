import { color, mix, uniform, uv, vec3, vec4 } from 'three/tsl'

// Un NodeMaterial n'est pas un shader monolithique : c'est une liste de
// branchements. Chaque slot est evalue a un endroit precis du pipeline, d'ou des
// resultats tres differents pour un meme graphe.

export const order = ['colorSlot', 'roughnessSlot', 'emissiveSlot', 'opacitySlot', 'outputSlot']

// l'etat des cases a cocher survit au rebuild, contrairement aux uniforms locaux
const pbr = { roughnessFromUv: false }
const output = { bypassLighting: true }

// colorNode : la couleur de base, celle que les lumieres viennent ensuite eclairer
export const colorSlot = ({ gui }) => {
  const settings = { top: '#ff5a00', bottom: '#4455ff' }

  const top = uniform(color(settings.top))
  const bottom = uniform(color(settings.bottom))

  // .value.set() refait la conversion sRGB → lineaire que color() applique
  gui.addColor(settings, 'top').onChange((value) => top.value.set(value))
  gui.addColor(settings, 'bottom').onChange((value) => bottom.value.set(value))

  return { colorNode: mix(bottom, top, uv().y) }
}

// roughness / metalness : des donnees, pas des couleurs. Elles ne se lisent que
// dans la facon dont la lumiere rebondit.
export const roughnessSlot = ({ gui, rebuild }) => {
  const roughness = uniform(0.25)
  const metalness = uniform(1)

  gui.add(pbr, 'roughnessFromUv').name('roughness = uv().y').onChange(rebuild)
  gui.add(roughness, 'value', 0, 1, 0.01).name('roughness').disable(pbr.roughnessFromUv)
  gui.add(metalness, 'value', 0, 1, 0.01).name('metalness')

  return {
    colorNode: color('#c9ccd4'),
    roughnessNode: pbr.roughnessFromUv ? uv().y : roughness,
    metalnessNode: metalness,
  }
}

// emissiveNode : ajoute apres l'eclairage, donc visible meme du cote sombre
export const emissiveSlot = ({ gui }) => {
  const settings = { emissive: '#00ffae' }

  const tint = uniform(color(settings.emissive))
  const intensity = uniform(1.5)

  gui.addColor(settings, 'emissive').onChange((value) => tint.value.set(value))
  gui.add(intensity, 'value', 0, 3, 0.01).name('intensity')

  return {
    colorNode: color('#101216'),
    // une bande plutot qu'un aplat : l'emission se lit mieux sur un degrade
    emissiveNode: tint.mul(intensity).mul(uv().y.sub(0.5).abs().oneMinus()),
  }
}

// opacityNode : la lecon passe le material en transparent des que le slot est branche
export const opacitySlot = ({ gui }) => {
  const opacity = uniform(0.5)
  const fade = uniform(0)

  gui.add(opacity, 'value', 0, 1, 0.01).name('opacity')
  gui.add(fade, 'value', 0, 1, 0.01).name('degrade par uv().y')

  return {
    colorNode: color('#ff5a00'),
    opacityNode: mix(opacity, opacity.mul(uv().y), fade),
  }
}

// outputNode : renvoie la couleur FINALE du material. Tout ce qui precede,
// colorNode et eclairage compris, est ignore.
export const outputSlot = ({ gui, rebuild }) => {
  gui.add(output, 'bypassLighting').name('outputNode branche').onChange(rebuild)

  const gradient = vec3(uv().x, uv().y, 0)

  if (output.bypassLighting) return { colorNode: gradient, outputNode: vec4(gradient, 1) }

  return { colorNode: gradient }
}
