"use client";
import { useEffect, useRef } from "react";

// A light WebGL particle field (ogl): rising bubbles/embers, falling snow, floating dust.
// One draw call, additive soft sprites, paused off-screen, single static frame under reduced motion.
// If WebGL is unavailable it simply renders nothing — every template's art stands without it.
type Mode = "rise" | "fall" | "float";
export function Particles({ mode = "float", colors, count = 90, size = 14, speed = 1, className = "", style }: { mode?: Mode; colors: string[]; count?: number; size?: number; speed?: number; className?: string; style?: React.CSSProperties }) {
  const host = useRef<HTMLDivElement>(null);
  const key = colors.join(",");
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let dead = false;
    let cleanup = () => {};
    (async () => {
      const { Renderer, Geometry, Program, Mesh } = await import("ogl");
      if (dead) return;
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5), antialias: false });
      } catch {
        return;
      }
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      el.appendChild(canvas);
      const hex = (c: string) => {
        const h = c.replace("#", "");
        const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h.slice(0, 6), 16);
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
      };
      const cols = colors.map(hex);
      const pos = new Float32Array(count * 3);
      const rnd = new Float32Array(count * 4);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos.set([Math.random(), Math.random(), Math.random()], i * 3);
        rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
        col.set(cols[i % cols.length], i * 3);
      }
      const geometry = new Geometry(gl, { position: { size: 3, data: pos }, random: { size: 4, data: rnd }, color: { size: 3, data: col } });
      const dir = mode === "rise" ? 1 : mode === "fall" ? -1 : 0;
      const program = new Program(gl, {
        vertex: `attribute vec3 position;attribute vec4 random;attribute vec3 color;uniform float uTime;uniform float uSize;uniform vec2 uRes;uniform float uDir;uniform float uSpeed;varying vec3 vColor;varying float vAlpha;
        void main(){vColor=color;float t=uTime*uSpeed*(0.03+random.x*0.05);
          float y=uDir==0.0?position.y+sin(t*3.0+random.y*6.28)*0.04:fract(position.y+uDir*t);
          float x=position.x+sin(t*2.0+random.z*6.28)*0.03;
          vAlpha=(0.35+0.65*random.w)*smoothstep(0.0,0.12,y)*smoothstep(1.0,0.86,y)*(0.6+0.4*sin(uTime*(1.0+random.x*2.0)+random.y*9.0));
          gl_Position=vec4(x*2.0-1.0,y*2.0-1.0,0.0,1.0);
          gl_PointSize=uSize*(0.35+position.z*0.9)*(uRes.y/900.0+0.4);}`,
        fragment: `precision mediump float;varying vec3 vColor;varying float vAlpha;void main(){vec2 c=gl_PointCoord-0.5;float d=length(c);float a=smoothstep(0.5,0.0,d);a=a*a;gl_FragColor=vec4(vColor*a,a*vAlpha);}`,
        uniforms: { uTime: { value: 0 }, uSize: { value: size }, uRes: { value: [1, 1] }, uDir: { value: dir }, uSpeed: { value: speed } },
        transparent: true,
        depthTest: false,
      });
      program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
      const resize = () => {
        const r = el.getBoundingClientRect();
        renderer.setSize(Math.max(r.width, 1), Math.max(r.height, 1));
        program.uniforms.uRes.value = [r.width, r.height];
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !reduced && !raf) raf = requestAnimationFrame(loop);
      });
      io.observe(el);
      const t0 = performance.now() - 20000 * Math.random();
      function loop(now: number) {
        raf = 0;
        program.uniforms.uTime.value = (now - t0) / 1000;
        renderer.render({ scene: mesh });
        if (visible && !reduced) raf = requestAnimationFrame(loop);
      }
      if (reduced) loop(performance.now());
      else raf = requestAnimationFrame(loop);
      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();
    return () => {
      dead = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, size, speed, key]);
  return <div ref={host} aria-hidden className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }} />;
}
