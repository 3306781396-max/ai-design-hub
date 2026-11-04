"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  The Approach — centered statement with planet glow (VESPER style)  */
/* ------------------------------------------------------------------ */
export function Approach() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-44">
      {/* Planet + orbit */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[560px] w-[560px] rounded-full opacity-90"
          style={{
            background:
              "radial-gradient(circle at 38% 30%, #171c2b 0%, #0e0f14 52%, #0a0a0b 78%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 rounded-[50%] border border-white/[0.06]"
          style={{
            width: "820px",
            height: "320px",
            transform: "translate(-50%, -50%) rotate(-16deg)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-8 flex justify-center">
          <p className="kicker">The Approach</p>
        </div>
        <h2 className="font-display text-4xl font-medium leading-[1.12] tracking-tight text-white sm:text-6xl">
          A thousand tools exist.
          <br />
          <span className="text-white/50">One short list matters.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/45">
          Every directory on the web dumps links on you. We do the opposite —
          test, score, and cut, until only the tools worth your time remain.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Process — numbered steps with ghost number (VESPER "How we work")  */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    n: "01",
    name: "Scout",
    desc: "New AI tools tracked daily across launch feeds, communities, and designer word-of-mouth. Nothing notable slips past.",
  },
  {
    n: "02",
    name: "Test",
    desc: "Hands-on with real design briefs — not marketing demos. We push each tool until its edges show.",
  },
  {
    n: "03",
    name: "Score",
    desc: "Output quality, speed, pricing, and workflow fit, weighted for working designers instead of hype cycles.",
  },
  {
    n: "04",
    name: "Re-rank",
    desc: "Lists refresh weekly. Tools that stall fall out; tools that improve climb. The directory never goes stale.",
  },
];

export function Process() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[active];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[#0c0c0e] py-28 lg:py-36">
      <div className="container mx-auto px-4">
        <div className="mb-20 flex justify-center lg:justify-start">
          <p className="kicker">How we work</p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[280px_1fr_320px]">
          {/* Left menu */}
          <div className="relative flex gap-6">
            {/* active indicator */}
            <div
              className="absolute left-0 w-[2px] rounded bg-[#5b7cfa] transition-all duration-500"
              style={{ top: `${active * 44}px`, height: "28px" }}
            />
            <ul className="space-y-4 pl-4">
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <button
                    onClick={() => setActive(i)}
                    className="flex items-baseline gap-3 text-left"
                  >
                    <span
                      className={`font-display text-xs transition-colors ${
                        i === active ? "text-[#5b7cfa]" : "text-white/30"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`font-display text-lg font-medium transition-colors ${
                        i === active ? "text-white" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {s.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: active step */}
          <div key={step.n} className="process-fade">
            <h3 className="font-display text-5xl font-medium tracking-tight text-white lg:text-6xl">
              {step.name}
            </h3>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/50">
              {step.desc}
            </p>
          </div>

          {/* Right ghost number */}
          <div
            className="hidden select-none font-display text-[220px] font-bold leading-none text-white/[0.04] lg:block"
            aria-hidden
          >
            {step.n}
          </div>
        </div>
      </div>

      <style jsx>{`
        .process-fade {
          animation: processFade 0.6s ease both;
        }
        @keyframes processFade {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
