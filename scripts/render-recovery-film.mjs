import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { chromium } from 'playwright'

const directory = new URL('../public/assets/phase-three/', import.meta.url)
const still = await readFile(new URL('recovery-channel.webp', directory))
const encode = promisify(execFile)
const ffmpeg = process.env.PORTFOLIO_FFMPEG ?? 'ffmpeg'
await encode(ffmpeg, ['-version'])
const fps = 30
const count = 225
const framesDir = await mkdtemp(join(tmpdir(), 'recovery-film-'))
const browser = await chromium.launch({
  ...(process.env.PORTFOLIO_CHROMIUM ? { executablePath: process.env.PORTFOLIO_CHROMIUM } : {}),
  args: ['--disable-gpu'],
})

try {
  const page = await browser.newPage()
  const versions = [
    { suffix: '', width: 960, height: 540 },
    { suffix: '-mobile', width: 576, height: 432 },
  ]

  for (const { suffix, ...dimensions } of versions) {
    await page.evaluate(
      async ({ width, height, frame }) => {
        const photo = new Image()
        photo.src = `data:image/webp;base64,${frame}`
        await photo.decode()

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d', { alpha: false })
        const mobile = width / height < 1.5
        const tau = Math.PI * 2
        const junction = [0.466, 0.66]
        const normal = [[-0.025, 0.883], junction, [0.848, 0.519], [0.909, 0.49]]
        const failover = [[-0.025, 0.883], junction, [0.261, 0.534], [0.382, 0.51]]

        function draw(phase) {
          const drift = (1 - Math.cos(phase * tau)) / 2
          const switchOver = Math.min(1, Math.max(0, (drift - 0.52) / 0.33))
          const alternate = switchOver ** 2 * (3 - 2 * switchOver)
          const zoom = 1.005 + drift * 0.045
          const drawnHeight = height * zoom
          const drawnWidth = drawnHeight * (photo.width / photo.height)
          const x = (width - drawnWidth) * (mobile ? 0.76 : 0.51) - drift * width * 0.011
          const y = (height - drawnHeight) * 0.63
          ctx.drawImage(photo, x, y, drawnWidth, drawnHeight)

          function illuminate(path, color, intensity) {
            const points = path.map(([px, py]) => [x + px * drawnWidth, y + py * drawnHeight])
            const sizes = points
              .slice(1)
              .map(([px, py], i) => Math.hypot(px - points[i][0], py - points[i][1]))
            const distance = sizes.reduce((sum, length) => sum + length, 0)
            const scale = drawnWidth / 960
            ctx.save()
            ctx.globalCompositeOperation = 'screen'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.beginPath()
            points.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
            ctx.strokeStyle = `rgba(${color},${(intensity * 0.29).toFixed(3)})`
            ctx.lineWidth = 2 * scale
            ctx.stroke()
            ctx.lineWidth = 6 * scale
            ctx.strokeStyle = `rgba(${color},${(intensity * 0.09).toFixed(3)})`
            ctx.stroke()
            ctx.setLineDash([18 * scale, distance * 0.5 - 18 * scale])
            ctx.lineDashOffset = -2 * distance * phase
            ctx.strokeStyle = `rgba(${color},${(intensity * 0.82).toFixed(3)})`
            ctx.lineWidth = 3 * scale
            ctx.stroke()
            ctx.restore()
          }

          if (alternate > 0) {
            const dark = ctx.createLinearGradient(width * 0.3, 0, width, 0)
            dark.addColorStop(0, 'rgba(7,9,7,0)')
            dark.addColorStop(1, `rgba(7,9,7,${alternate * 0.48})`)
            ctx.fillStyle = dark
            ctx.fillRect(0, 0, width, height)
          }
          illuminate(normal, '217,255,135', 1 - alternate * 0.92)
          illuminate(failover, '255,161,82', alternate)
        }

        window.renderRecoveryFrame = (phase) => {
          draw(phase)
          return canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
        }
      },
      { ...dimensions, frame: still.toString('base64') }
    )

    // Render a fixed time for every frame so the clip never drops motion on a slow host.
    for (let start = 0; start < count; start += 12) {
      const frames = await page.evaluate(
        ({ start, count }) =>
          Array.from({ length: Math.min(12, count - start) }, (_, i) =>
            window.renderRecoveryFrame((start + i) / count)
          ),
        { start, count }
      )
      await Promise.all(
        frames.map((frame, i) =>
          writeFile(
            join(framesDir, `frame-${String(start + i).padStart(3, '0')}.jpg`),
            Buffer.from(frame, 'base64')
          )
        )
      )
    }

    const path = (format) =>
      fileURLToPath(new URL(`recovery-channel${suffix}.${format}`, directory))
    const source = [
      '-y',
      '-v',
      'error',
      '-framerate',
      String(fps),
      '-i',
      join(framesDir, 'frame-%03d.jpg'),
    ]
    await encode(ffmpeg, [
      ...source,
      '-threads',
      '2',
      '-c:v',
      'libvpx-vp9',
      '-crf',
      '35',
      '-b:v',
      '0',
      '-deadline',
      'good',
      '-cpu-used',
      '4',
      '-pix_fmt',
      'yuv420p',
      path('webm'),
    ])
    await encode(ffmpeg, [
      ...source,
      '-threads',
      '2',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '24',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      path('mp4'),
    ])
    for (const format of ['webm', 'mp4']) console.log(path(format), (await stat(path(format))).size)
  }
} finally {
  await browser.close()
  await rm(framesDir, { recursive: true, force: true })
}
