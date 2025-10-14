'use client'

import { useEffect, useRef, useState } from 'react'
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl'
import Image from 'next/image'

interface OrbProps {
  hue?: number
  hoverIntensity?: number
  rotateOnHover?: boolean
  forceHoverState?: boolean
  profileImage?: boolean
}

export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  profileImage = true,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const container = ctnDom.current
    if (!container) return

    try {
      const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      container.appendChild(gl.canvas)

      const geometry = new Triangle(gl)
      const program = new Program(gl, {
        vertex: `precision highp float;attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}`,
        fragment: `precision highp float;uniform float iTime;uniform vec3 iResolution;uniform float hue;uniform float hover;uniform float rot;uniform float hoverIntensity;varying vec2 vUv;vec3 hash33(vec3 p3){p3=fract(p3*vec3(.1031,.11369,.13787));p3+=dot(p3,p3.yxz+19.19);return-1.0+2.0*fract(vec3(p3.x+p3.y,p3.x+p3.z,p3.y+p3.z)*p3.zyx);}float snoise3(vec3 p){const float K1=0.333333333;const float K2=0.166666667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.0),d0-d0.yzx);vec3 i1=e*(1.0-e.zxy);vec3 i2=1.0-e.zxy*(1.0-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-0.5;vec4 h=max(0.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.0);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.0)));return dot(vec4(31.316),n);}vec4 draw(vec2 uv){float ang=atan(uv.y,uv.x);float len=length(uv);float n0=snoise3(vec3(uv*0.65,iTime*0.5))*0.5+0.5;float r0=mix(mix(0.6,1.0,0.4),mix(0.6,1.0,0.6),n0);float d0=distance(uv,(r0/len)*uv);float v0=1.0/(1.0+d0*10.0);v0*=smoothstep(r0*1.05,r0,len);float a=iTime*-1.0;vec2 pos=vec2(cos(a),sin(a))*r0;float d=distance(uv,pos);float v1=1.5/(1.0+d*d*5.0);v1*=1.0/(1.0+d0*50.0);float v2=smoothstep(1.0,mix(0.6,1.0,n0*0.5),len);float v3=smoothstep(0.6,mix(0.6,1.0,0.5),len);vec3 col=mix(vec3(0.61,0.26,1.0),vec3(0.3,0.76,0.91),cos(ang+iTime*2.0)*0.5+0.5);col=mix(vec3(0.06,0.08,0.6),col,v0);col=(col+v1)*v2*v3;col=clamp(col,0.0,1.0);float alpha=max(max(col.r,col.g),col.b);return vec4(col.rgb/(alpha+1e-5),alpha);}void main(){vec2 center=iResolution.xy*0.5;float size=min(iResolution.x,iResolution.y);vec2 uv=(vUv*iResolution.xy-center)/size*2.0;float s=sin(rot);float c=cos(rot);uv=vec2(c*uv.x-s*uv.y,s*uv.x+c*uv.y);uv.x+=hover*hoverIntensity*0.1*sin(uv.y*10.0+iTime);uv.y+=hover*hoverIntensity*0.1*sin(uv.x*10.0+iTime);vec4 col=draw(uv);gl_FragColor=vec4(col.rgb*col.a,col.a);}`,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, 1) },
          hue: { value: hue },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: hoverIntensity },
        },
      })

      const mesh = new Mesh(gl, { geometry, program })

      const resize = () => {
        if (!container) return
        const dpr =
          window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio
        const width = container.clientWidth
        const height = container.clientHeight
        renderer.setSize(width * dpr, height * dpr)
        gl.canvas.style.width = width + 'px'
        gl.canvas.style.height = height + 'px'
        program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 1)
      }

      window.addEventListener('resize', resize)
      resize()

      let targetHover = 0
      let rafId: number

      const handleMouseEnter = () => {
        targetHover = 1
      }

      const handleMouseLeave = () => {
        targetHover = 0
      }

      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)

      const update = (t: number) => {
        rafId = requestAnimationFrame(update)
        program.uniforms.iTime.value = t * 0.001
        program.uniforms.hover.value +=
          ((forceHoverState ? 1 : targetHover) - program.uniforms.hover.value) * 0.1
        if (rotateOnHover && targetHover > 0) {
          program.uniforms.rot.value += 0.01
        }
        renderer.render({ scene: mesh })
      }

      rafId = requestAnimationFrame(update)

      return () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
        container.removeChild(gl.canvas)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    } catch {
      setWebglSupported(false)
    }
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState])

  if (!webglSupported) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full cursor-pointer">
      <div ref={ctnDom} className="w-full h-full" />
      {profileImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-44 h-44 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/30 backdrop-blur-sm">
            <Image
              src="/assets/images/profile.jpg"
              alt="Sushant Sonbarse - DevOps Engineer Profile Picture"
              width={192}
              height={192}
              className="w-full h-full object-cover"
              priority
              quality={90}
              sizes="(max-width: 768px) 176px, 192px"
            />
          </div>
        </div>
      )}
    </div>
  )
}
