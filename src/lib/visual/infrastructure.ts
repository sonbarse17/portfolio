export function createInfrastructureRenderer(canvas: HTMLCanvasElement, allowSoftware = false) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: !allowSoftware,
    powerPreference: 'default',
  })
  if (!gl) return null

  const vertex = `#version 300 es
    void main() {
      vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
      gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
    }`

  const fragment = `#version 300 es
    precision highp float;
    out vec4 outputColor;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uTravel;
    uniform int uQuality;

    const float floorHeight = -2.57;
    const float slotHeight = 0.66;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float box(vec3 p, vec3 extent, float radius) {
      vec3 q = abs(p) - extent + radius;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - radius;
    }

    float level(vec3 p) {
      return clamp(floor((p.y + slotHeight * 0.5) / slotHeight), -3.0, 3.0);
    }

    vec2 enclosure(float row) {
      return vec2(2.06 + 0.17 * cos(row * 0.78), 1.22 + 0.10 * cos(row * 0.56));
    }

    vec3 rackPosition(vec3 p, float row) {
      return p - vec3(sin(row * 0.72) * 0.19, row * slotHeight, cos(row * 0.66) * 0.11);
    }

    vec2 scene(vec3 p) {
      float row = level(p);
      vec2 size = enclosure(row);
      float drawer = box(rackPosition(p, row), vec3(size.x, 0.21, size.y), 0.065);
      float spine = box(p, vec3(1.57, 2.11, 0.91), 0.09);
      float rail = box(
        vec3(abs(p.x) - 1.84, p.y, abs(p.z) - 1.09),
        vec3(0.046, 2.13, 0.043),
        0.018
      );
      float support = min(spine, rail);
      float deck = box(p - vec3(0, -2.35, 0), vec3(2.43, 0.11, 1.58), 0.065);
      float optic = box(
        p - vec3(0.95, 2.27, -0.19),
        vec3(0.71, 0.10, 0.53),
        0.092
      );
      float floorDistance = p.y - floorHeight;
      vec2 s = drawer < support ? vec2(drawer, 1) : vec2(support, 2);
      if (deck < s.x) s = vec2(deck, 3);
      if (optic < s.x) s = vec2(optic, 4);
      if (floorDistance < s.x) s = vec2(floorDistance, 0);
      return s;
    }

    vec3 normal(vec3 p) {
      const float e = 0.003;
      float d = scene(p).x;
      return normalize(vec3(
        scene(p + vec3(e, 0, 0)).x - d,
        scene(p + vec3(0, e, 0)).x - d,
        scene(p + vec3(0, 0, e)).x - d
      ));
    }

    vec3 sky(vec2 uv, vec3 ray) {
      float wash = exp(-1.4 * length((uv + vec2(0.18, -0.28)) * vec2(0.66, 1.4)));
      float vertical = pow(1.0 - abs(ray.y), 5.0);
      return vec3(0.038, 0.050, 0.045) + wash * vec3(0.065, 0.092, 0.071)
        + vec3(0.044, 0.032, 0.012) * vertical;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
      float orbit = 0.48 + uPointer.x * 0.17 + uTravel * 0.18 + sin(uTime * 0.27) * 0.045;
      vec3 camera = vec3(sin(orbit) * 8.8, 3.00 + uPointer.y * 0.65 + uTravel * 1.05, cos(orbit) * 8.8);
      vec3 forward = normalize(vec3(0, -0.10, 0) - camera);
      vec3 right = normalize(cross(forward, vec3(0, 1, 0)));
      vec3 up = cross(right, forward);
      vec3 ray = normalize(forward * 2.49 + uv.x * right + uv.y * up);

      vec2 hit = vec2(0);
      float distanceTravelled = 0.0;
      bool found = false;
      for (int i = 0; i < 87; ++i) {
        if (uQuality == 0 && i > 60) break;
        hit = scene(camera + ray * distanceTravelled);
        if (hit.x < 0.0024) { found = true; break; }
        distanceTravelled += hit.x * 0.83;
        if (distanceTravelled > 35.0) break;
      }

      vec3 color = sky(uv, ray);
      if (found) {
        vec3 p = camera + ray * distanceTravelled;
        vec3 n = normal(p);
        vec3 lamp = normalize(vec3(-0.65, 0.82, 0.47));
        vec3 edgeLamp = normalize(vec3(0.72, 0.32, -0.63));
        float diffuse = max(0.0, dot(n, lamp));
        float edge = max(0.0, dot(n, edgeLamp));
        float specular = pow(max(0.0, dot(n, normalize(lamp - ray))), 24.0);

        if (hit.y < 0.5) {
          vec2 grid = abs(fract(p.xz * 0.50 + 0.5) - 0.5);
          float lines = 1.0 - smoothstep(0.001, 0.013, min(grid.x, grid.y));
          float fall = exp(-0.056 * dot(p.xz, p.xz));
          float lightStrip = exp(-80.0 * abs(p.x + 1.32))
            * smoothstep(-1.1, 0.0, p.z) * (1.0 - smoothstep(5.0, 9.2, p.z));
          float sweep = pow(0.5 + 0.5 * cos(uTime * 1.1 - p.z * 2.2), 9.0);
          color = vec3(0.067, 0.082, 0.074) + vec3(0.027, 0.046, 0.035) * fall;
          color += lines * vec3(0.048, 0.071, 0.057) * fall;
          color += lightStrip * vec3(0.41, 0.61, 0.31) * (0.43 + sweep);
          color *= mix(0.58, 1.05, smoothstep(0.75, 3.2, length(p.xz)));
        } else {
          float row = level(p);
          vec3 q = rackPosition(p, row);
          vec2 extent = enclosure(row);
          float alternating = mod(row + 3.0, 3.0);
          float front = smoothstep(0.74, 0.98, abs(n.z));
          float horizontal = smoothstep(0.68, 0.99, abs(n.y));
          float grain = hash(floor(vec2(p.x + p.z * 0.33, p.y * 3.0) * 690.0));
          vec3 material = (hit.y < 1.5) ? mix(vec3(0.21, 0.254, 0.231), vec3(0.41, 0.43, 0.34), alternating * 0.33)
            : vec3(0.113, 0.162, 0.136);
          vec3 base = material * (0.39 + diffuse * 0.78 + edge * 0.38);
          base += vec3(0.72, 0.76, 0.62) * specular * 0.54;
          base += (grain - 0.5) * 0.034;
          if (hit.y > 0.5 && hit.y < 1.5) {
            float grooves = abs(fract(q.x * 13.0 + 0.5) - 0.5);
            float ventBand = smoothstep(0.23, 0.35, abs(q.x)) * (1.0 - smoothstep(1.5, 1.7, abs(q.x)));
            float vents = (1.0 - smoothstep(0.07, 0.22, grooves)) * ventBand
              * (1.0 - smoothstep(0.05, 0.082, abs(q.y + 0.021))) * front;
            base *= 1.0 - 0.64 * vents;
            float seam = 1.0 - smoothstep(0.008, 0.017, abs(q.y + 0.135));
            float band = smoothstep(0.42, 0.46, abs(q.x)) * (1.0 - smoothstep(extent.x - 0.4, extent.x - 0.28, abs(q.x)));
            float aligned = 0.53 + 0.47 * pow(0.5 + 0.5 * cos(q.x * 2.4 - uTime * 1.3 + row * 0.8), 4.0);
            vec3 signal = mix(vec3(0.62, 0.84, 0.32), vec3(0.96, 0.65, 0.24), smoothstep(0.4, 0.9, uTravel));
            base += signal * seam * band * front * aligned * 0.71;
            vec2 indicator = vec2(q.x + extent.x - 0.26, q.y - 0.038);
            float dotLight = 1.0 - smoothstep(0.023, 0.032, length(indicator));
            base += signal * dotLight * front * 0.81;
            float groove = 1.0 - smoothstep(0.01, 0.035, abs(abs(q.x) - extent.x * 0.80));
            base += groove * horizontal * vec3(0.066, 0.080, 0.044);
            if (row > 2.5) {
              float trace = 1.0 - smoothstep(0.009, 0.03, abs(q.z - 0.46));
              float endcaps = (1.0 - smoothstep(0.01, 0.033, abs(abs(q.x - 0.06) - 0.87)))
                * (1.0 - smoothstep(0.33, 0.48, abs(q.z - 0.31)));
              base += (trace + endcaps) * horizontal * band * vec3(0.14, 0.27, 0.11);
            }
          } else if (hit.y > 3.5) {
            float fresnel = pow(1.0 - max(0.0, dot(n, -ray)), 3.0);
            float line = 1.0 - smoothstep(0.012, 0.038, abs(p.z - 0.16));
            float slot = 1.0 - smoothstep(0.08, 0.16, abs(fract(p.x * 7.0) - 0.5));
            base = vec3(0.16, 0.27, 0.18) * (0.56 + 0.8 * diffuse)
              + fresnel * vec3(0.31, 0.57, 0.35)
              + front * slot * vec3(0.23, 0.46, 0.19)
              + line * horizontal * vec3(0.39, 0.66, 0.23);
          }
          color = base;
        }
        color = mix(color, sky(uv, ray), smoothstep(11.4, 32.0, distanceTravelled) * 0.86);
      }

      color *= 1.0 - 0.26 * smoothstep(0.48, 1.92, length(uv * vec2(0.7, 0.90)));
      color += (hash(gl_FragCoord.xy) - 0.5) * 0.009;
      outputColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }`

  const program = gl.createProgram()
  const vs = gl.createShader(gl.VERTEX_SHADER)
  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  if (!program || !vs || !fs) {
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.deleteProgram(program)
    return null
  }

  gl.shaderSource(vs, vertex)
  gl.shaderSource(fs, fragment)
  gl.compileShader(vs)
  gl.compileShader(fs)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const reason = allowSoftware && gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    if (reason) throw new Error(reason)
    return null
  }

  gl.useProgram(program)
  const resolution = gl.getUniformLocation(program, 'uResolution')
  const pointer = gl.getUniformLocation(program, 'uPointer')
  const time = gl.getUniformLocation(program, 'uTime')
  const travel = gl.getUniformLocation(program, 'uTravel')
  const quality = gl.getUniformLocation(program, 'uQuality')

  return {
    resize(width: number, height: number) {
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(resolution, width, height)
    },
    draw(seconds: number, x: number, y: number, scroll: number, tier: number) {
      gl.uniform2f(pointer, x, y)
      gl.uniform1f(time, seconds)
      gl.uniform1f(travel, scroll)
      gl.uniform1i(quality, tier)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    dispose() {
      gl.deleteProgram(program)
    },
  }
}
