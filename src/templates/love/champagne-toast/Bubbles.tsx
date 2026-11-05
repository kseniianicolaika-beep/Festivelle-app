"use client";
import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";

// WebGL champagne bubbles: a few hundred soft gold points rising and wobbling. GPU-light (one draw call),
// pauses off-screen, DPR capped at 1.5, and silently renders nothing if WebGL is unavailable.
const vert = /* glsl */ `
attribute vec4 seed;
uniform float uTime;
uniform float uAspect;
varying float vA;
void main(){
  float speed = .035 + seed.y * .07;
  float y = fract(seed.x + uTime * speed) * 2.4 - 1.2;
  float x = (seed.z * 2. - 1.) * 1.05 + sin(uTime * (1. + seed.w * 2.) + seed.x * 30.) * .012;
  vA = smoothstep(-1.2, -.6, y) * (1. - smoothstep(.6, 1.2, y)) * (.25 + seed.w * .5);
  gl_Position = vec4(x, y, 0., 1.);
  gl_PointSize = (1.5 + seed.w * seed.w * seed.w * 7.) * uAspect;
}`;
const frag = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - .5;
  float d = length(c);
  float ring = smoothstep(.5, .38, d) * (.35 + smoothstep(.2, .45, d));
  float hi = smoothstep(.16, .0, length(c - vec2(-.14, -.14)));
  float a = (ring + hi) * vA;
  if (a < .01) discard;
  gl_FragColor = vec4(uColor + hi * .4, a);
}`;

const GOLD = [0.98, 0.86, 0.6];
export function Bubbles({ className = "", count = 260, color = GOLD }: { className?: string; count?: number; color?: [number, number, number] | number[] }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true, premultipliedAlpha: false });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    el.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    const seed = new Float32Array(count * 4).map(() => Math.random());
    const geometry = new Geometry(gl, { position: { size: 3, data: new Float32Array(count * 3) }, seed: { size: 4, data: seed } });
    const program = new Program(gl, { vertex: vert, fragment: frag, transparent: true, depthTest: false, uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uColor: { value: color } } });
    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    const resize = () => { renderer.setSize(el.clientWidth, el.clientHeight); program.uniforms.uAspect.value = Math.min(1.6, Math.max(0.7, el.clientWidth / 900)) * renderer.dpr; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      program.uniforms.uTime.value = (t - t0) / 1000;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); gl.getExtension("WEBGL_lose_context")?.loseContext(); gl.canvas.remove(); };
  }, [count, color]);
  return <div ref={host} aria-hidden className={`pointer-events-none ${className}`} />;
}
