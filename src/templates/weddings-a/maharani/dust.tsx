"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Geometry, Mesh } from "ogl";
import { reducedMotion } from "../_shared/motion";

// Rising gold motes in candle-light: one tiny additive point cloud. Pauses offscreen; silently absent
// without WebGL, in reduced motion, or when disabled (compact previews).
const vert = `
attribute vec3 seed;
uniform float uTime; uniform vec2 uRes;
varying float vA;
void main(){
  float sp = .018 + seed.z * .03;
  float y = fract(seed.y + uTime * sp);
  float x = seed.x + sin(uTime * (.3 + seed.z) + seed.y * 12.) * .03;
  vA = smoothstep(0., .15, y) * (1. - smoothstep(.7, 1., y)) * (.35 + seed.z * .65);
  gl_Position = vec4(x * 2. - 1., y * 2. - 1., 0., 1.);
  gl_PointSize = (1.6 + seed.z * 4.2) * uRes.y / 900. + 1.;
}`;
const frag = `
precision mediump float; varying float vA; uniform vec3 uColor;
void main(){ vec2 c = gl_PointCoord - .5; float d = length(c); float a = smoothstep(.5, 0., d); gl_FragColor = vec4(uColor, a * a * vA); }`;

export function GoldDust({ className = "", count = 140, enabled = true, color = [1, 0.8, 0.45] }: { className?: string; count?: number; enabled?: boolean; color?: [number, number, number] | number[] }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || !enabled || reducedMotion()) return;
    // Skip on software rasterisers (no real GPU): the motes are a luxury, never a cost.
    const probe = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!probe) return;
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    let renderer: Renderer;
    try { renderer = new Renderer({ alpha: true, dpr: Math.min(1.5, window.devicePixelRatio || 1), premultipliedAlpha: false }); } catch { return; }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    el.appendChild(canvas);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { seeds[i * 3] = Math.random(); seeds[i * 3 + 1] = Math.random(); seeds[i * 3 + 2] = Math.random(); }
    const geometry = new Geometry(gl, { position: { size: 3, data: new Float32Array(count * 3) }, seed: { size: 3, data: seeds } });
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] }, uColor: { value: color } }, transparent: true, depthTest: false });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    const size = () => { const r = el.getBoundingClientRect(); renderer.setSize(Math.max(1, r.width), Math.max(1, r.height)); program.uniforms.uRes.value = [r.width, r.height]; };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);
    let raf = 0, on = true;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(loop); });
    io.observe(el);
    const t0 = performance.now();
    function loop(t: number) {
      raf = 0;
      if (!on) return;
      program.uniforms.uTime.value = (t - t0) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, count]);
  return <div ref={host} aria-hidden className={`pointer-events-none ${className}`} />;
}
