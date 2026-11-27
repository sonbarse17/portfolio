import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import ts from 'typescript'

const folder = new URL('../public/assets/phase-four/', import.meta.url)
const source = await readFile(
  new URL('../src/lib/visual/infrastructure.ts', import.meta.url),
  'utf8'
)
const javascript = ts.transpile(source, {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
})
const { createInfrastructureRenderer } = await import(
  'data:text/javascript;base64,' + Buffer.from(javascript).toString('base64')
)
const browser = await chromium.launch({
  ...(process.env.PORTFOLIO_CHROMIUM ? { executablePath: process.env.PORTFOLIO_CHROMIUM } : {}),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
try {
  await mkdir(folder, { recursive: true })
  const page = await browser.newPage()
  for (const [name, width, height, layer] of [
    ['fabric.webp', 1216, 920, 0],
    ['fabric-mobile.webp', 640, 480, 0],
    ['fabric-runtime.webp', 768, 582, 1],
    ['fabric-recovery.webp', 768, 582, 2],
  ]) {
    const data = await page.evaluate(
      ({ source, width, height, layer }) => {
        const canvas = document.createElement('canvas')
        const create = new Function('return (' + source + ')')()
        const scene = create(canvas, true)
        if (!scene) throw new Error('A WebGL 2 context is required to render the poster.')
        scene.resize(width, height)
        scene.draw(2.1, 0, 0, 0, 1, layer)
        const result = canvas.toDataURL('image/webp', 0.85).split(',')[1]
        scene.dispose()
        return result
      },
      { source: createInfrastructureRenderer.toString(), width, height, layer }
    )
    const bytes = Buffer.from(data, 'base64')
    await writeFile(new URL(name, folder), bytes)
    console.log(name, bytes.length)
  }
} finally {
  await browser.close()
}
