import { RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three/webgpu'
import { normalMap, texture, uv, vec2 } from 'three/tsl'

const loader = new TextureLoader()

function load(file, colorSpace) {
    const map = loader.load(`/textures/bricks/${file}`)

    map.wrapS = RepeatWrapping
    map.wrapT = RepeatWrapping
    map.anisotropy = 8
    if (colorSpace) map.colorSpace = colorSpace

    return map
}

// seule la diffuse porte des couleurs : les autres maps sont des donnees, pas des images
const diffuse = load('stacked_brick_wall_diff_1k.jpg', SRGBColorSpace)
const normal = load('stacked_brick_wall_nor_gl_1k.jpg')
const arm = load('stacked_brick_wall_arm_1k.jpg')

// la sphere fait deux fois plus large que haute en uv : 2 pour 1 garde des briques carrees
const TILING = vec2(6, 3)

export const brickWall = () => {
    const coords = uv().mul(TILING)

    // ARM : occlusion dans le rouge, rugosite dans le vert, metal dans le bleu
    const armSample = texture(arm, coords)

    return {
        colorNode: texture(diffuse, coords),
        normalNode: normalMap(texture(normal, coords)),
        aoNode: armSample.r,
        roughnessNode: armSample.g,
        metalnessNode: armSample.b,
    }
}
