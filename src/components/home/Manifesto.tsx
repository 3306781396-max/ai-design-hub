export function Manifesto() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="kicker mb-10">Manifesto</p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight text-white">
          We cut through the noise on purpose —{" "}
          <span className="text-[#5b7cfa]">testing every tool,</span>{" "}
          ranking what matters, and reducing each category to one true{" "}
          <span className="text-[#5b7cfa]">signal:</span>{" "}
          <span className="text-white/50">
            does it make designers faster.
          </span>
        </h2>
      </div>
    </section>
  );
}

const BRANDS = [
  "Midjourney", "Figma", "Sora", "Runway", "Veo", "Kling",
  "ElevenLabs", "Tripo", "Nano Banana", "Hailuo", "Luma", "Canva",
];

export function BrandMarquee() {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden}>
      {BRANDS.map((b) => (
        <span
          key={b}
          className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-wide text-white/35 whitespace-nowrap"
        >
          {b}
        </span>
      ))}
    </div>
  );
  return (
    <section className="relative py-14 border-y border-white/[0.05] overflow-hidden">
      <div className="flex justify-center mb-10">
        <p className="kicker">Trusted by teams shaping what comes next</p>
      </div>
      <div className="marquee marquee-mask">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
