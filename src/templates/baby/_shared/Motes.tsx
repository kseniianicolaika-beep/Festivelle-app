"use client";
import { useEffect, useRef } from "react";
import { reducedMotion } from "./motion";

// Light WebGL layer (ogl): soft drifting motes / twinkling stars. ~150 points, one draw call, paused off-screen.
// Fails silently (no WebGL, reduced motion, compact) — the art underneath already stands on its own.
export function Motes({ color = [1, 0.95, 0.85], count = 140, size = 9, twinkle = 1, rise = 0.02, className = "" }: { color?: [number, number, number]; count?: number; size?: number; twinkle?: number; rise?: number; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || reducedMotion()) return;
    let raf = 0, alive = true, visible = true;
    let cleanup = () => {};
    import("ogl").then(({ Renderer, Geometry, Program, Mesh }) => {
      if (!alive) return;
      let renderer: InstanceType<typeof Renderer>;
      try { renderer = new Renderer({ dpr: Math.min(2, window.devicePixelRatio), alpha: true, premultipliedAlpha: false }); } catch { return; }
      const gl = renderer.gl;
      gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      el.appendChild(gl.canvas);
      const pos = new Float32Array(count * 3), rnd = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        pos.set([Math.random() * 2 - 1, Math.random() * 2 - 1, 0], i * 3);
        rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      }
      const geometry = new Geometry(gl, { position: { size: 3, data: pos }, random: { size: 4, data: rnd } });
      const program = new Program(gl, {
        transparent: true, depthTest: false,
        vertex: `attribute vec3 position; attribute vec4 random; uniform float uTime; uniform float uSize; uniform float uRise; uniform float uDpr; varying float vA; varying vec4 vR;
          void main(){ vec3 p = position; float t = uTime;
            p.x += sin(t*0.2 + random.x*6.28)*0.04; p.y = mod(p.y + 1.0 + t*uRise*(0.4+random.y), 2.0) - 1.0;
            vA = 0.35 + 0.65*abs(sin(t*(0.5+random.z) + random.w*6.28)); vR = random;
            gl_Position = vec4(p, 1.0); gl_PointSize = uSize * uDpr * (0.35 + random.w); }`,
        fragment: `precision mediump float; uniform vec3 uColor; uniform float uTw; varying float vA; varying vec4 vR;
          void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); float core = smoothstep(0.5, 0.0, d);
            float star = max(0.0, 1.0 - abs(c.x)*14.0) * smoothstep(0.5,0.0,abs(c.y)) + max(0.0, 1.0 - abs(c.y)*14.0) * smoothstep(0.5,0.0,abs(c.x));
            float a = (core*core + star*0.5*step(0.7, vR.x)*uTw) * mix(1.0, vA, uTw);
            gl_FragColor = vec4(uColor, a*0.85); }`,
        uniforms: { uTime: { value: 0 }, uSize: { value: size }, uColor: { value: color }, uTw: { value: twinkle }, uRise: { value: rise }, uDpr: { value: renderer.dpr } },
      });
      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
      const resize = () => renderer.setSize(el.clientWidth, el.clientHeight);
      resize();
      const ro = new ResizeObserver(resize); ro.observe(el);
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(el);
      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(loop);
      cleanup = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.getExtension("WEBGL_lose_context")?.loseContext(); gl.canvas.remove(); };
    }).catch(() => {});
    return () => { alive = false; cancelAnimationFrame(raf); cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color.join(), count, size, twinkle, rise]);
  return <div ref={host} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} />;
}
