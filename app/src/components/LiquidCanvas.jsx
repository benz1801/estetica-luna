import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   "Pelle liquida" — a soft WebGL canvas of 2-3 organic blobs
   that drift, merge, and react to the cursor. Sits behind the
   hero copy at low opacity. Falls back to a CSS gradient for
   users with reduced motion or no WebGL.

   The math is deliberately simple: each blob is a point with
   position + velocity, and at every frame we render it as a
   radial gradient drawn additively onto a 2D canvas. No shader
   code, no library — just canvas2D + requestAnimationFrame.
   ───────────────────────────────────────────────────────────── */

const PALETTE = [
  { r: 70, g: 89, b: 58, a: 0.32 },   // sage-700
  { r: 184, g: 146, b: 116, a: 0.26 }, // bronze-400
  { r: 225, g: 169, b: 155, a: 0.22 }, // rose-300
  { r: 107, g: 132, b: 86, a: 0.28 },  // sage-500
];

function makeBlobs(width, height, count) {
  const blobs = [];
  for (let i = 0; i < count; i += 1) {
    const palette = PALETTE[i % PALETTE.length];
    blobs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.min(width, height) * (0.22 + Math.random() * 0.18),
      palette,
      // a soft "phase" used to wobble the radius
      phase: Math.random() * Math.PI * 2,
      speed: 0.0035 + Math.random() * 0.003,
    });
  }
  return blobs;
}

function step(blobs, width, height, t, mouse) {
  for (const b of blobs) {
    b.x += b.vx;
    b.y += b.vy;

    // very gentle cursor attraction — within a falloff radius.
    if (mouse.active) {
      const dx = mouse.x - b.x;
      const dy = mouse.y - b.y;
      const d2 = dx * dx + dy * dy;
      const falloff = 220 * 220;
      if (d2 < falloff) {
        const f = (1 - d2 / falloff) * 0.015;
        b.vx += dx * f * 0.02;
        b.vy += dy * f * 0.02;
      }
    }

    // friction so the attraction doesn't run away
    b.vx *= 0.985;
    b.vy *= 0.985;

    // soft wrap so blobs stay mostly on-screen
    const m = b.r * 0.6;
    if (b.x < -m) b.x = width + m;
    else if (b.x > width + m) b.x = -m;
    if (b.y < -m) b.y = height + m;
    else if (b.y > height + m) b.y = -m;

    // radius wobble — the "breathing"
    b.phase += b.speed;
  }
}

function render(ctx, blobs, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  for (const b of blobs) {
    const r = b.r * (1 + Math.sin(b.phase) * 0.08);
    const { r: rr, g: gg, b: bb, a: aa } = b.palette;
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, `rgba(${rr}, ${gg}, ${bb}, ${aa})`);
    grad.addColorStop(0.6, `rgba(${rr}, ${gg}, ${bb}, ${aa * 0.35})`);
    grad.addColorStop(1, `rgba(${rr}, ${gg}, ${bb}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export default function LiquidCanvas({ className = '', blobCount = 4 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      wrap.setAttribute('data-reduced', 'true');
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      wrap.setAttribute('data-reduced', 'true');
      return undefined;
    }

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let blobs = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // re-seed blobs on resize so they fit the new area
      blobs = makeBlobs(width, height, blobCount);
    };
    resize();

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);

    // touch: tap to nudge
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = wrap.getBoundingClientRect();
      mouseRef.current.x = t.clientX - rect.left;
      mouseRef.current.y = t.clientY - rect.top;
      mouseRef.current.active = true;
      // auto-release after a moment so the blob doesn't keep chasing the (now-missing) finger
      setTimeout(() => {
        mouseRef.current.active = false;
      }, 1200);
    };
    wrap.addEventListener('touchstart', onTouch, { passive: true });
    wrap.addEventListener('touchmove', onTouch, { passive: true });

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      step(blobs, width, height, t, mouseRef.current);
      render(ctx, blobs, width, height);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('touchstart', onTouch);
      wrap.removeEventListener('touchmove', onTouch);
    };
  }, [blobCount]);

  return (
    <div
      ref={wrapRef}
      data-reduced="false"
      className={`liquid-canvas ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="liquid-canvas__canvas" />
      <div className="liquid-canvas__fallback" />
    </div>
  );
}
