import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const output = new URL('../public/assets/phase-two/', import.meta.url)
const versions = [
  { name: 'failover', width: 960, height: 540, bitrate: 740_000 },
  { name: 'failover-mobile', width: 576, height: 324, bitrate: 420_000 },
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch({ args: ['--disable-background-timer-throttling'] })

try {
  const page = await browser.newPage()
  for (const version of versions) {
    const files = await page.evaluate(async ({ width, height, bitrate }) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      document.body.append(canvas)
      const ctx = canvas.getContext('2d', { alpha: false })
      const unit = width / 14
      const tau = Math.PI * 2
      const lime = [190, 247, 140]
      const amber = [255, 176, 91]
      const sites = [
        [-4.2, 0, 1.7],
        [-1.9, 0, 1.1],
        [0.4, 0, -1.15],
        [1.4, 0, 2.35],
        [4.25, 0, 0.45],
      ]
      const primary = [0, 1, 2, 4]
      const replica = [0, 1, 3, 4]

      function draw(phase) {
        const yaw = 0.54 + Math.sin(phase * tau) * 0.105
        const sine = Math.sin(yaw)
        const cosine = Math.cos(yaw)
        const outage = Math.max(0, Math.min(1, (1 - Math.cos((phase - 0.03) * tau)) * 0.8 - 0.23))
        const fallback = outage * outage
        const limit = width / 960

        function project([x, y, z]) {
          const depth = x * sine + z * cosine
          const scale = unit * (1 + depth * 0.025)
          return [
            width * 0.51 + (x * cosine - z * sine) * scale,
            height * 0.57 + (depth * 0.47 - y) * scale,
          ]
        }

        function line(points, color, thickness = 1) {
          ctx.beginPath()
          points
            .map(project)
            .forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
          ctx.strokeStyle = color
          ctx.lineWidth = thickness * limit
          ctx.stroke()
        }

        function surface(points, fill, outline) {
          ctx.beginPath()
          points
            .map(project)
            .forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
          ctx.closePath()
          ctx.fillStyle = fill
          ctx.fill()
          ctx.strokeStyle = outline
          ctx.lineWidth = limit
          ctx.stroke()
        }

        const rgba = (rgb, opacity) => `rgba(${rgb.join(',')},${opacity})`
        const background = ctx.createRadialGradient(
          width * 0.55,
          height * 0.58,
          0,
          width * 0.55,
          height * 0.58,
          width * 0.51
        )
        background.addColorStop(0, '#283c2e')
        background.addColorStop(0.55, '#131f19')
        background.addColorStop(1, '#0b110e')
        ctx.fillStyle = background
        ctx.fillRect(0, 0, width, height)

        for (let x = -11; x <= 11; x += 0.55) {
          line(
            [
              [x, -0.08, -10],
              [x, -0.08, 10],
            ],
            '#69847535',
            0.64
          )
          line(
            [
              [-11, -0.08, x],
              [11, -0.08, x],
            ],
            '#69847535',
            0.64
          )
        }

        line(
          [
            [-5.45, 0, -2.35],
            [5.35, 0, -2.35],
            [5.35, 0, 3.2],
            [-5.45, 0, 3.2],
            [-5.45, 0, -2.35],
          ],
          '#78918089'
        )
        for (const [path, color, intensity] of [
          [primary, lime, 1 - outage],
          [replica, amber, fallback],
        ]) {
          const points = path.map((index) => sites[index])
          line(points, '#52695d', 2.4)
          line(points, rgba(color, 0.1 + intensity * 0.18), 9)
          line(points, rgba(color, 0.12 + intensity * 0.84), 2)
          if (intensity < 0.03) continue
          for (let index = 0; index < 10; index++) {
            const position = ((phase * 3 + index / 10) % 1) * (points.length - 1)
            const edge = Math.floor(position)
            const travel = position - edge
            const point = points[edge].map((v, axis) => v + (points[edge + 1][axis] - v) * travel)
            const [x, y] = project(point)
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 9 * limit)
            glow.addColorStop(0, rgba(color, intensity * 0.86))
            glow.addColorStop(1, rgba(color, 0))
            ctx.fillStyle = glow
            ctx.fillRect(x - 9 * limit, y - 9 * limit, 18 * limit, 18 * limit)
          }
        }

        const rackOrder = sites
          .map(([x, y, z], index) => ({ x, z, index, depth: x * sine + z * cosine }))
          .sort((a, b) => a.depth - b.depth)
        for (const { x, z, index } of rackOrder) {
          const lamps = index === 2 ? 1 - outage : index === 3 ? 0.2 + fallback * 0.8 : 0.78
          const metal = index === 2 ? '#2c3933' : '#3e5046'
          const accent = index === 3 ? amber : lime
          const stackHeight = index === 1 ? 5 : index === 0 || index === 4 ? 3 : 7
          const side = 0.52
          const box = (base, top) => {
            surface(
              [
                [x - side, base, z + side],
                [x + side, base, z + side],
                [x + side, top, z + side],
                [x - side, top, z + side],
              ],
              '#283731',
              '#587264'
            )
            surface(
              [
                [x + side, base, z + side],
                [x + side, base, z - side],
                [x + side, top, z - side],
                [x + side, top, z + side],
              ],
              '#1e2b25',
              '#4a6355'
            )
            surface(
              [
                [x - side, top, z + side],
                [x + side, top, z + side],
                [x + side, top, z - side],
                [x - side, top, z - side],
              ],
              metal,
              '#6a8775'
            )
          }

          surface(
            [
              [x - 0.72, 0, z + 0.72],
              [x + 0.72, 0, z + 0.72],
              [x + 0.72, 0, z - 0.72],
              [x - 0.72, 0, z - 0.72],
            ],
            '#283a31',
            rgba(accent, lamps * 0.55)
          )
          for (let tier = 0; tier < stackHeight; tier++) {
            const height = tier * 0.235 + 0.1
            box(height, height + 0.175)
            for (let led = 0; led < 3; led++) {
              const x0 = x - 0.37 + 0.095 * led
              const intensity = 0.7 + Math.sin((phase * 3 + tier * 0.19 + led * 0.2) * tau) * 0.3
              line(
                [
                  [x0, height + 0.076, z + side + 0.003],
                  [x0 + 0.041, height + 0.076, z + side + 0.003],
                ],
                rgba(accent, lamps * intensity),
                2.6
              )
            }
            for (let vent = 0; vent < 5; vent++) {
              const x0 = x + 0.029 + 0.074 * vent
              line(
                [
                  [x0, height + 0.062, z + side + 0.003],
                  [x0, height + 0.129, z + side + 0.003],
                ],
                '#a3b0a05f',
                0.8
              )
            }
          }

          const pinHeight = 0.2 + stackHeight * 0.235
          line(
            [
              [x, pinHeight, z],
              [x, pinHeight + 0.46, z],
            ],
            rgba(accent, lamps * 0.62)
          )
          const [px, py] = project([x, pinHeight + 0.46, z])
          ctx.strokeStyle = rgba(accent, lamps * 0.88)
          ctx.beginPath()
          ctx.arc(px, py, 3.4 * limit, 0, tau)
          ctx.stroke()
        }

        const border = 18 * limit
        ctx.strokeStyle = '#a5bba54c'
        ctx.lineWidth = limit
        for (const x of [border, width - border]) {
          for (const y of [border, height - border]) {
            ctx.beginPath()
            ctx.moveTo(x + (x < width / 2 ? 17 : -17) * limit, y)
            ctx.lineTo(x, y)
            ctx.lineTo(x, y + (y < height / 2 ? 17 : -17) * limit)
            ctx.stroke()
          }
        }
      }

      const formats = [
        ['webm', 'video/webm;codecs=vp9'],
        ['mp4', 'video/mp4;codecs=avc1.42001f'],
      ]
      const stream = canvas.captureStream(30)
      const base64 = async (blob) => {
        const buffer = new Uint8Array(await blob.arrayBuffer())
        let text = ''
        for (let offset = 0; offset < buffer.length; offset += 8192) {
          text += String.fromCharCode(...buffer.subarray(offset, offset + 8192))
        }
        return btoa(text)
      }

      const recordings = formats.map(([extension, mimeType]) => {
        if (!MediaRecorder.isTypeSupported(mimeType)) throw new Error('Missing encoder ' + mimeType)
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate })
        const chunks = []
        recorder.ondataavailable = ({ data }) => {
          if (data.size) chunks.push(data)
        }
        const result = new Promise((resolve, reject) => {
          recorder.onstop = async () => resolve(await base64(new Blob(chunks, { type: mimeType })))
          recorder.onerror = reject
        })
        return { extension, recorder, result }
      })

      draw(0)
      for (const { recorder } of recordings) recorder.start()
      const duration = 6000
      await new Promise((resolve) => {
        let start
        const paint = (now) => {
          start ??= now
          const phase = Math.min(1, (now - start) / duration)
          draw(phase)
          if (phase < 1) requestAnimationFrame(paint)
          else resolve()
        }
        requestAnimationFrame(paint)
      })
      for (const { recorder } of recordings) recorder.stop()
      const result = Object.fromEntries(
        await Promise.all(
          recordings.map(async ({ extension, result }) => [extension, await result])
        )
      )
      stream.getTracks().forEach((track) => track.stop())
      draw(0.55)
      result.webp = canvas.toDataURL('image/webp', 0.91).split(',')[1]
      canvas.remove()
      return result
    }, version)

    for (const [extension, encoded] of Object.entries(files)) {
      const file = new URL(`${version.name}.${extension}`, output)
      const buffer = Buffer.from(encoded, 'base64')
      await writeFile(file, buffer)
      console.log(`${version.name}.${extension} ${Math.round(buffer.length / 1024)} KB`)
    }
  }
} finally {
  await browser.close()
}
