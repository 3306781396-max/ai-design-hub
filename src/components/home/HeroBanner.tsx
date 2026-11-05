"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatMsg {
  role: "user" | "ai";
  text: string;
  tools?: { name: string; slug: string; logo: string }[];
}

const TOOL = (name: string, slug: string) => ({
  name,
  slug,
  logo: `/logos/${slug}.png`,
});

type Conv = { user: string; ai: string; tools: { name: string; slug: string; logo: string }[] };

const SCRIPTS: Record<string, Conv[][]> = {
  zh: [
    [
      {
        user: "帮我找适合做产品海报的 AI 工具",
        ai: "这 3 个最擅长图像生成：",
        tools: [TOOL("Midjourney", "midjourney"), TOOL("Nano Banana", "nano-banana"), TOOL("Recraft", "recraft-v4")],
      },
    ],
    [
      {
        user: "我想把设计稿直接转成前端代码",
        ai: "设计转代码用这几个：",
        tools: [TOOL("v0", "v0-by-vercel"), TOOL("Galileo AI", "galileo-ai"), TOOL("Uizard", "uizard")],
      },
    ],
    [
      {
        user: "要一个文字生成视频的工具做宣传短片",
        ai: "视频生成推荐：",
        tools: [TOOL("Sora 2", "sora-2"), TOOL("Kling AI", "kling-ai"), TOOL("Runway", "runway")],
      },
    ],
  ],
  en: [
    [
      {
        user: "Find me an AI tool for product posters",
        ai: "These 3 are best for image generation:",
        tools: [TOOL("Midjourney", "midjourney"), TOOL("Nano Banana", "nano-banana"), TOOL("Recraft", "recraft-v4")],
      },
    ],
    [
      {
        user: "I want to turn my design file into front-end code",
        ai: "Design-to-code picks:",
        tools: [TOOL("v0", "v0-by-vercel"), TOOL("Galileo AI", "galileo-ai"), TOOL("Uizard", "uizard")],
      },
    ],
    [
      {
        user: "Need a text-to-video tool for a promo clip",
        ai: "Video generation picks:",
        tools: [TOOL("Sora 2", "sora-2"), TOOL("Kling AI", "kling-ai"), TOOL("Runway", "runway")],
      },
    ],
  ],
  ja: [
    [
      {
        user: "商品ポスターに合うAIツールを探して",
        ai: "画像生成ならこの3つがおすすめ：",
        tools: [TOOL("Midjourney", "midjourney"), TOOL("Nano Banana", "nano-banana"), TOOL("Recraft", "recraft-v4")],
      },
    ],
    [
      {
        user: "デザインをそのままコードにしたい",
        ai: "デザインからコードなら：",
        tools: [TOOL("v0", "v0-by-vercel"), TOOL("Galileo AI", "galileo-ai"), TOOL("Uizard", "uizard")],
      },
    ],
    [
      {
        user: "テキストから動画を作りたい",
        ai: "動画生成のおすすめ：",
        tools: [TOOL("Sora 2", "sora-2"), TOOL("Kling AI", "kling-ai"), TOOL("Runway", "runway")],
      },
    ],
  ],
  ko: [
    [
      {
        user: "제품 포스터에 맞는 AI 도구 찾아줘",
        ai: "이미지 생성엔 이 3개가 최고예요:",
        tools: [TOOL("Midjourney", "midjourney"), TOOL("Nano Banana", "nano-banana"), TOOL("Recraft", "recraft-v4")],
      },
    ],
    [
      {
        user: "디자인을 코드로 바꾸고 싶어요",
        ai: "디자인→코드 추천:",
        tools: [TOOL("v0", "v0-by-vercel"), TOOL("Galileo AI", "galileo-ai"), TOOL("Uizard", "uizard")],
      },
    ],
    [
      {
        user: "텍스트로 영상을 만들고 싶어요",
        ai: "영상 생성 추천:",
        tools: [TOOL("Sora 2", "sora-2"), TOOL("Kling AI", "kling-ai"), TOOL("Runway", "runway")],
      },
    ],
  ],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function useHeroChat(locale: string) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [chipsShown, setChipsShown] = useState(0);
  const ref = useRef<{ cancelled: boolean }>({ cancelled: false });

  useEffect(() => {
    const state = { cancelled: false };
    ref.current = state;

    (async () => {
      const scripts = (SCRIPTS[locale] || SCRIPTS.zh).flat();
      let round = 0;
      await sleep(600);
      while (!state.cancelled) {
        const conv = scripts[round % scripts.length];
        round += 1;
        setMsgs([]);
        setChipsShown(0);
        setAiTyping(false);
        await sleep(450);

        // user message — typewriter
        setMsgs([{ role: "user", text: "" }]);
        setUserTyping(true);
        for (let i = 1; i <= conv.user.length; i++) {
          if (state.cancelled) return;
          setMsgs([{ role: "user", text: conv.user.slice(0, i) }]);
          await sleep(36);
        }
        setUserTyping(false);
        await sleep(420);

        // AI thinking
        setAiTyping(true);
        await sleep(1000);
        if (state.cancelled) return;
        setAiTyping(false);

        // AI reply
        setMsgs([
          { role: "user", text: conv.user },
          { role: "ai", text: conv.ai, tools: conv.tools },
        ]);
        for (let i = 1; i <= conv.tools.length; i++) {
          await sleep(320);
          if (state.cancelled) return;
          setChipsShown(i);
        }

        await sleep(3600);
      }
    })();

    return () => {
      state.cancelled = true;
    };
  }, [locale]);

  return { msgs, aiTyping, userTyping, chipsShown };
}

export function HeroBanner() {
  const { t, locale } = useTranslation();
  const { msgs, aiTyping, userTyping, chipsShown } = useHeroChat(locale);

  return (
    <section className="relative overflow-hidden">
      {/* Starfield + glow background */}
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      <div className="starfield" />
      <div className="absolute left-[20%] top-1/3 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b7cfa]/[0.07] blur-[140px]" />
      <div className="absolute right-[8%] top-[30%] h-[380px] w-[420px] rounded-full bg-[#5b7cfa]/[0.08] blur-[120px] panel-pulse" />

      <div className="relative container mx-auto max-w-6xl px-4 pb-24 pt-32 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ===== Left: copy ===== */}
          <div>
            <div className="kicker mb-8 animate-fade-in">
              <span>{t("home.hero.badge")}</span>
            </div>

            <h1 className="font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl animate-slide-up">
              {t("home.hero.heading")}
              <br />
              <span className="text-white/40">{t("home.hero.version")}</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/55 md:text-lg animate-slide-up [animation-delay:200ms]">
              {t("home.hero.description")}
            </p>

            {/* Search */}
            <div className="mt-10 max-w-lg animate-slide-up [animation-delay:400ms]">
              <form action="/tools" method="GET" className="relative">
                <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <Input
                  name="q"
                  type="search"
                  placeholder={t("home.hero.search_placeholder")}
                  className="h-14 w-full rounded-full border-white/10 bg-white/[0.04] pl-12 pr-32 text-base text-white placeholder:text-white/35 backdrop-blur focus:border-white/30 focus:ring-0"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/85"
                >
                  {t("home.hero.search_button")}
                </button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-4 animate-slide-up [animation-delay:600ms]">
              <Link
                href="/tools"
                className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/85"
              >
                {t("home.hero.cta_browse")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/submit"
                className="inline-flex h-12 items-center rounded-full border border-white/15 bg-transparent px-8 text-sm font-medium text-white/80 transition-colors hover:border-white/35 hover:text-white"
              >
                {t("home.hero.cta_submit")}
              </Link>
            </div>
          </div>

          {/* ===== Right: AI chat panel ===== */}
          <div className="relative animate-slide-up [animation-delay:300ms]">
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[#5b7cfa]/[0.06] blur-3xl" />
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5b7cfa]/20">
                    <Sparkles className="h-3.5 w-3.5 text-[#8ba2ff]" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                    AI Copilot
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-400/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Online
                </span>
              </div>

              {/* Messages */}
              <div className="flex h-[340px] flex-col justify-end gap-3 overflow-hidden px-4 py-4 sm:h-[380px]">
                {msgs.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="msg-in flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#5b7cfa] px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_8px_24px_rgba(91,124,250,0.35)]">
                        {m.text}
                        {userTyping && (
                          <span className="caret-blink ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-white/80" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="msg-in flex flex-col gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#5b7cfa]/20">
                          <Sparkles className="h-3 w-3 text-[#8ba2ff]" />
                        </span>
                        <div className="rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm leading-relaxed text-white/85">
                          {m.text}
                        </div>
                      </div>
                      {m.tools && (
                        <div className="flex flex-wrap gap-2 pl-8">
                          {m.tools.slice(0, chipsShown).map((tool) => (
                            <Link
                              key={tool.slug}
                              href={`/tool/${tool.slug}`}
                              className="chip-in group/chip flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-[#5b7cfa]/60 hover:bg-[#5b7cfa]/10"
                            >
                              <img
                                src={tool.logo}
                                alt={tool.name}
                                className="h-6 w-6 rounded-full bg-white/[0.06] object-cover"
                              />
                              <span className="text-xs font-medium text-white/80 transition-colors group-hover/chip:text-white">
                                {tool.name}
                              </span>
                              <ArrowRight className="h-3 w-3 text-white/30 transition-colors group-hover/chip:text-[#8ba2ff]" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* AI typing indicator */}
                {aiTyping && (
                  <div className="msg-in flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#5b7cfa]/20">
                      <Sparkles className="h-3 w-3 text-[#8ba2ff]" />
                    </span>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.05] px-4 py-3">
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                    </div>
                  </div>
                )}
              </div>

              {/* Panel footer (fake input) */}
              <div className="border-t border-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                  <span className="text-xs text-white/30">
                    {locale === "zh" ? "描述你的需求…" : locale === "ja" ? "ニーズを入力…" : locale === "ko" ? "필요한 내용을 입력…" : "Describe what you need…"}
                  </span>
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#5b7cfa]/25">
                    <ArrowRight className="h-3 w-3 text-[#8ba2ff]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
