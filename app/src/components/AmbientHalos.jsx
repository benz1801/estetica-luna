import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   Ambient halos — a full-page, autonomous drift of soft organic
   blobs. No input listeners. Each blob traces a Lissajous path
   (parametric loop with irrational frequency ratio, so it never
   closes), and gently "breathes" by wobbling its radius. Painted
   additively on a 2D canvas, fixed behind the page at z-index 0.

   Falls back to a CSS gradient for users with reduced motion.
   ───────────────────────────────────────────────────────────── */

const PALETTE = [
  { r: 70,  g: 89,  b: 58,  a: 0.45 }, // sage-700
  { r: 184, g: 146, b: 116, a: 0.38 }, // bronze-400
  { r: 225, g: 169, b: 155, a: 0.34 }, // rose-300
  { r: 107, g: 132, b: 86,  a: 0.40 }, // sage-500
  { r: 157, g: 178, b: 138, a: 0.36 }, // sage-300 — soft ambient
  { r: 225, g: 169, b: 155, a: 0.32 }, // rose-300 repeat (density)
  { r: 184, g: 146, b: 116, a: 0.34 }, // bronze-400 repeat (density)
];

function makeBlobs(width, height, count) {
  const blobs = [];
  const base = Math.min(width, height);
  for (let i = 0; i < count; i += 1) {
    const palette = PALETTE[i % PALETTE.length];
    blobs.push({
      x: width * 0.5,
      y: height * 0.5, // overwritten by step() on the first tick
      cx: (0.15 + Math.random() * 0.7) * width,
      cy: (0.15 + Math.random() * 0.7) * height,
      ax: (0.20 + Math.random() * 0.25) * base,
      ay: (0.20 + Math.random() * 0.25) * base,
      fx: 0.05 + Math.random() * 0.13, // rad/s, x frequency
      fy: 0.05 + Math.random() * 0.13, // rad/s, y frequency (irrational ratio to fx)
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      r: base * (0.32 + Math.random() * 0.23),
      phase: Math.random() * Math.PI * 2,
      speed: 0.0018 + Math.random() * 0.0015,
      palette,
    });
  }
  return blobs;
}

function step(blobs, t) {
  for (const b of blobs) {
    b.x = b.cx + Math.sin(b.fx * t + b.px) * b.ax;
    b.y = b.cy + Math.sin(b.fy * t + b.py) * b.ay;
    b.phase += b.speed;
  }
}

function render(ctx, blobs) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  for (const b of blobs) {
    const r = b.r * (1 + Math.sin(b.phase) * 0.06);
    const { r: rr, g: gg, b: bb, a: aa } = b.palette;
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0,   `rgba(${rr}, ${gg}, ${bb}, ${aa})`);
    grad.addColorStop(0.6, `rgba(${rr}, ${gg}, ${bb}, ${aa * 0.35})`);
    grad.addColorStop(1,   `rgba(${rr}, ${gg}, ${bb}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export default function AmbientHalos({ blobCount = 6 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.setAttribute('data-reduced', 'true');
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      wrap.setAttribute('data-reduced', 'true');
      return undefined;
    }

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const dprCap = isMobile ? 1.5 : 2;

    let width = 0;
    let height = 0;
    let blobs = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blobs = makeBlobs(width, height, blobCount);
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      step(blobs, (now - start) / 1000);
      render(ctx, blobs);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [blobCount]);

  return (
    <div
      ref={wrapRef}
      className="ambient-halos"
      data-reduced="false"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="ambient-halos__canvas" />
      <div className="ambient-halos__fallback" />
    </div>
  );
}
