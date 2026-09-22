import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

// Seuls '<exercice>/<variante>.png' sont acceptes : pas de remontee de chemin.
const SAFE_PATH = /^[\w-]+\/[\w-]+\.png$/

/**
 * Recoit les PNG rendus par /targets.html et les ecrit dans public/targets/.
 * Dev uniquement : rien de tout ca n'existe dans le build.
 */
export function targetsPlugin({ outDir = 'public/targets' } = {}) {
  return {
    name: 'tsl-targets',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use('/__targets', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          return response.end()
        }

        const chunks = []
        for await (const chunk of request) chunks.push(chunk)

        const { file, data } = JSON.parse(Buffer.concat(chunks).toString())

        if (!SAFE_PATH.test(file)) {
          response.statusCode = 400
          return response.end('invalid target path')
        }

        const destination = resolve(server.config.root, outDir, file)

        await mkdir(dirname(destination), { recursive: true })
        await writeFile(destination, Buffer.from(data, 'base64'))

        response.end('ok')
      })
    },
  }
}
