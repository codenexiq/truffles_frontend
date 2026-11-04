'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import styles from './CupcakeCarousel.module.css';
import { CUPCAKES } from './data';

const N = CUPCAKES.length;
const AUTOPLAY_MS = 5600;

/** [left %, top %, tamanho px, atraso s] */
const SPARKS: ReadonlyArray<readonly [number, number, number, number]> = [
  [12, 70, 7, 0],
  [24, 28, 5, 2.2],
  [38, 82, 9, 4.1],
  [58, 16, 6, 1.3],
  [72, 66, 8, 5.6],
  [84, 34, 5, 3.2],
  [90, 78, 10, 6.8],
  [6, 44, 6, 7.7],
];

interface Metrics {
  /** Largura e altura do palco */
  W: number;
  H: number;
  /** Altura visível do cupcake da frente */
  H0: number;
  /** Raio horizontal e vertical do anel */
  Rx: number;
  Ry: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startPos: number;
  moved: boolean;
  itemIndex: number | null;
  samples: { x: number; t: number }[];
}

const mod = (a: number): number => ((a % N) + N) % N;

export default function CupcakeCarousel() {
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const stageRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Estado de animação fica em refs para não re-renderizar a cada frame.
  const target = useRef(0);
  const pos = useRef(0);
  const vel = useRef(0);
  const activeRef = useRef(0);
  const dragging = useRef(false);
  const userTouched = useRef(false);
  const drag = useRef<DragState | null>(null);
  /** x/y: valor suavizado usado na animação; tx/ty: posição atual do mouse (-1 a 1) */
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const metrics = useRef<Metrics>({ W: 800, H: 600, H0: 300, Rx: 240, Ry: 80 });

  const setTarget = useCallback((t: number) => {
    target.current = t;
    const next = mod(Math.round(t));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
      setDetailsOpen(false);
    }
  }, []);

  const step = useCallback(
    (delta: number) => setTarget(Math.round(target.current) + delta),
    [setTarget],
  );

  const goTo = useCallback(
    (index: number) => {
      let delta = index - mod(Math.round(target.current));
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      setTarget(Math.round(target.current) + delta);
    },
    [setTarget],
  );

  const interact = () => {
    userTouched.current = true;
  };

  // ---------- Medição e laço de animação ----------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pos.current = reduce ? target.current : target.current - 0.9;
    vel.current = 0;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      const W = r.width;
      const H = r.height;
      const H0 = Math.min(400, H * 0.52, W * 0.62);
      let maxW = 0;
      CUPCAKES.forEach((c, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const h = H0 / c.visibleHeight;
        const w = h * (c.width / c.height);
        maxW = Math.max(maxW, w);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.marginLeft = `${-w / 2}px`;
        el.style.marginTop = `${-h / 2}px`;
      });
      const sideHalf = (maxW * 0.79) / 2;
      metrics.current = {
        W,
        H,
        H0,
        Rx: Math.max(W * 0.22, Math.min(W * 0.36, W / 2 - sideHalf - 8)),
        Ry: H * 0.11,
      };
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    const t0 = performance.now();
    let last = t0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = (now - t0) / 1000;
      const { H, H0, Rx, Ry } = metrics.current;

      if (!dragging.current) {
        if (reduce) {
          pos.current = target.current;
          vel.current = 0;
        } else {
          const k = 70;
          const c = 2 * Math.sqrt(k) * 0.92;
          vel.current += (k * (target.current - pos.current) - c * vel.current) * dt;
          pos.current += vel.current * dt;
        }
      }

      const intro = reduce ? 1 : Math.min(1, time / 1.0);
      const introE = 1 - Math.pow(1 - intro, 3);
      const mx = pointer.current.x;
      const my = pointer.current.y;

      for (let i = 0; i < N; i++) {
        const item = itemRefs.current[i];
        const body = bodyRefs.current[i];
        const shadow = shadowRefs.current[i];
        if (!item || !body || !shadow) continue;

        let d = (((i - pos.current) % N) + N) % N;
        if (d > N / 2) d -= N;
        const phi = d * ((Math.PI * 2) / N);
        const zc = Math.cos(phi);
        const depth = (zc + 1) / 2; // 1 na frente, 0 atrás
        const front = Math.max(0, 1 - Math.abs(d)); // 1 só quando está no centro

        const x = Math.sin(phi) * Rx;
        const y = -H * 0.06 - (1 - zc) * Ry;
        const s = (0.58 + 0.42 * depth) * (0.9 + 0.1 * introE);

        const float = reduce ? 0 : Math.sin(time * 1.5 + i * 1.7) * (4 + 5 * front) * (H0 / 340);
        const rotY = Math.sin(phi) * 30 + mx * 11 * front;
        const rotX = -my * 6 * front;
        const rotZ = reduce ? 0 : Math.sin(time * 0.9 + i) * 1.4 * (0.4 + 0.6 * front);

        item.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)})`;
        item.style.zIndex = String(Math.round(zc * 100) + 100);
        item.style.opacity = ((0.42 + 0.58 * Math.pow(depth, 0.6)) * introE).toFixed(3);
        item.style.filter =
          depth > 0.985
            ? 'none'
            : `blur(${((1 - depth) * 2.4).toFixed(2)}px) brightness(${(0.62 + 0.38 * depth).toFixed(3)})`;

        body.style.transform = `translateY(${float.toFixed(2)}px) perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;

        const lift = -float;
        shadow.style.transform = `translateX(-50%) scaleX(${(1 - Math.max(-0.1, Math.min(0.2, lift * 0.01))).toFixed(3)})`;
        shadow.style.opacity = (0.95 - Math.max(-0.1, Math.min(0.3, lift * 0.02))).toFixed(3);
      }

      // Suaviza o parallax do mouse
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.07;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.07;

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // ---------- Avanço automático (para quando a pessoa interage) ----------
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (userTouched.current || document.hidden) return;
      step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [step]);

  // ---------- Ponteiro: arrastar, tocar e parallax ----------
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button > 0) return;
    const itemEl = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startPos: pos.current,
      moved: false,
      itemIndex: itemEl ? Number(itemEl.dataset.index) : null,
      samples: [{ x: e.clientX, t: performance.now() }],
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;

    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      dragging.current = true;
      interact();
      try {
        e.currentTarget.setPointerCapture(d.pointerId);
      } catch {
        /* o navegador pode recusar a captura; o arraste continua funcionando */
      }
    }
    if (d.moved) {
      pos.current = d.startPos - dx / metrics.current.Rx;
      d.samples.push({ x: e.clientX, t: performance.now() });
      if (d.samples.length > 6) d.samples.shift();
    }
  };

  const onPointerEnd = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;

    if (d.moved) {
      dragging.current = false;
      const a = d.samples[0];
      const b = d.samples[d.samples.length - 1];
      const dt = Math.max(16, b.t - a.t) / 1000;
      const v = Math.max(-6, Math.min(6, -((b.x - a.x) / dt) / metrics.current.Rx));
      vel.current = v * 0.3;
      setTarget(Math.round(pos.current + v * 0.16));
    } else if (d.itemIndex !== null && e.type === 'pointerup') {
      interact();
      goTo(d.itemIndex);
    }
  };

  const onPointerLeave = () => {
    pointer.current.tx = 0;
    pointer.current.ty = 0;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      interact();
      step(-1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      interact();
      step(1);
      e.preventDefault();
    }
  };

  const current = CUPCAKES[active];
  const pageStyle = { '--tone': current.tone } as CSSProperties;

  return (
    <div className={styles.page} style={pageStyle}>
      <main className={styles.main}>
        <section className={styles.copy} aria-label="Descrição do cupcake">
          {CUPCAKES.map((c, i) => {
            const on = i === active;
            return (
              <article
                key={c.id}
                className={`${styles.slide} ${on ? styles.slideActive : ''}`}
                aria-hidden={!on}
              >
                <h2 className={styles.title}>{c.name}</h2>
                <p className={styles.desc}>{c.description}</p>
                <button
                  className={styles.btn}
                  type="button"
                  tabIndex={on ? 0 : -1}
                  aria-expanded={on && detailsOpen}
                  aria-controls={`details-${c.id}`}
                  onClick={() => setDetailsOpen((v) => !v)}
                >
                  Detalhes nutricionais
                </button>
                <div className={styles.details} id={`details-${c.id}`} hidden={!(on && detailsOpen)}>
                  <strong>Porção: 1 unidade</strong>
                  As informações nutricionais deste sabor aparecem aqui.
                </div>
              </article>
            );
          })}
        </section>

        <section
          ref={stageRef}
          className={styles.stage}
          tabIndex={0}
          role="group"
          aria-roledescription="carrossel"
          aria-label="Cupcakes. Use as setas do teclado para girar."
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerLeave}
        >
          <div className={styles.glow} aria-hidden="true" />
          <div aria-hidden="true">
            {SPARKS.map(([left, top, size, delay]) => (
              <i
                key={`${left}-${top}`}
                className={styles.spark}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  animationDelay: `${delay}s`,
                  animationDuration: `${8 + size * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className={styles.ring}>
            {CUPCAKES.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={styles.item}
                data-index={i}
                style={{ '--foot': c.foot, '--sw': c.shadowWidth } as CSSProperties}
              >
                <div
                  ref={(el) => {
                    shadowRefs.current[i] = el;
                  }}
                  className={styles.shadow}
                />
                <div
                  ref={(el) => {
                    bodyRefs.current[i] = el;
                  }}
                  className={styles.body}
                >
                  {/* The card the cupcake sits on. It fills the item box, so the ring spacing is unchanged. */}
                  <div className={styles.card} aria-hidden="true" />
                  <div className={styles.cardInfo}>
                    <strong className={styles.cardName}>{c.name}</strong>
                    <span className={styles.cardNote}>{c.note}</span>
                    <span className={styles.cardChips}>
                      <i>{c.base}</i>
                      <i>{c.topping}</i>
                    </span>
                  </div>
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 880px) 70vw, 560px"
                    priority={i === 0}
                    draggable={false}
                    className={styles.img}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.controls}>
        <button
          className={styles.arrow}
          type="button"
          aria-label="Cupcake anterior"
          onClick={() => {
            interact();
            step(-1);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 4 7 12l8 8" />
          </svg>
        </button>

        <div className={styles.dots}>
          {CUPCAKES.map((c, i) => (
            <button
              key={c.id}
              className={styles.dot}
              type="button"
              aria-label={`Ver ${c.name.toLowerCase()}`}
              aria-current={i === active}
              onClick={() => {
                interact();
                goTo(i);
              }}
            />
          ))}
        </div>

        <button
          className={styles.arrow}
          type="button"
          aria-label="Próximo cupcake"
          onClick={() => {
            interact();
            step(1);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 4 8 8-8 8" />
          </svg>
        </button>
      </footer>

      <div className={styles.srOnly} aria-live="polite">
        {`${current.name}, ${active + 1} de ${N}`}
      </div>
    </div>
  );
}
