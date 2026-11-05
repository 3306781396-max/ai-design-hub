import { tools } from "@/data/mock";
import type { Tool } from "@/types";

/**
 * 纯前端需求匹配引擎：
 * 用户输入一段自然语言需求 → 按意图词典打分 → 返回最合适的 3 个工具。
 * 无需后端 / API Key，静态站点可直接运行。
 */

export interface RecIntent {
  id: string;
  /** 触发该意图的关键词（中/英/日/韩），小写匹配 */
  tokens: string[];
  /** 意图对应的分类 slug（强信号） */
  categories: string[];
  /** 意图偏好的工具 slug（人工校准的强信号） */
  picks?: string[];
  /** 各语言的推荐语 */
  label: Record<string, string>;
}

const INTENTS: RecIntent[] = [
  {
    id: "image-gen",
    tokens: [
      "图像", "图片", "画", "绘图", "插画", "海报", "壁纸", "封面", "绘图", "生成图", "画图", "作画",
      "image", "picture", "art", "illustration", "poster", "wallpaper", "draw", "painting", "graphic",
      "画像生成", "イラスト", "画像", "그림", "이미지", "포스터",
    ],
    categories: ["ai-image-tools"],
    picks: ["midjourney", "nano-banana", "flux-2", "gpt-image-2", "recraft-v4", "ideogram-ai"],
    label: {
      zh: "图像生成",
      en: "image generation",
      ja: "画像生成",
      ko: "이미지 생성",
    },
  },
  {
    id: "video-gen",
    tokens: [
      "视频", "短片", "宣传片", "短视频", "影片", "文生视频", "视频生成", "电影感",
      "video", "clip", "film", "movie", "trailer", "footage", "reel",
      "動画", "映像", "영상", "동영상",
    ],
    categories: ["ai-video-tools"],
    picks: ["sora-2", "veo-3", "kling-ai", "hailuo-ai", "runway", "kling-4"],
    label: {
      zh: "视频生成",
      en: "video generation",
      ja: "動画生成",
      ko: "영상 생성",
    },
  },
  {
    id: "avatar",
    tokens: [
      "数字人", "虚拟人", "口播", "播报", "虚拟主播", "数字人视频", "口型",
      "avatar", "talking head", "spokesperson", "presenter", "digital human",
      "アバター", "아바타",
    ],
    categories: ["ai-video-tools"],
    picks: ["heygen", "synthesia"],
    label: {
      zh: "AI 数字人 / 口播视频",
      en: "AI avatar & talking-head video",
      ja: "AIアバター動画",
      ko: "AI 아바타 영상",
    },
  },
  {
    id: "video-edit",
    tokens: [
      "剪辑", "剪视频", "视频编辑", "剪辑师", "后期",
      "video editing", "edit video", "cut video", "post production",
      "動画編集", "편집",
    ],
    categories: ["ai-video-tools"],
    picks: ["capcut-ai", "runway"],
    label: {
      zh: "视频剪辑",
      en: "video editing",
      ja: "動画編集",
      ko: "영상 편집",
    },
  },
  {
    id: "ui-design",
    tokens: [
      "界面", "ui", "ux", "网页设计", "落地页", "原型", "app设计", "产品界面", "设计稿", "线框",
      "interface", "landing page", "prototype", "wireframe", "web design", "app design",
      "ui设计", "インターフェース", "ui 디자인",
    ],
    categories: ["ai-ui-tools"],
    picks: ["framer-ai", "google-stitch", "visily", "uizard", "motiff", "figma-agent"],
    label: {
      zh: "UI / 界面设计",
      en: "UI / interface design",
      ja: "UIデザイン",
      ko: "UI 디자인",
    },
  },
  {
    id: "design-to-code",
    tokens: [
      "代码", "前端", "开发", "转代码", "写代码", "建站", "网站开发", "html", "css",
      "code", "frontend", "front-end", "developer", "coding", "website builder",
      "コード", "코딩", "코드",
    ],
    categories: ["ai-ui-tools"],
    picks: ["v0-by-vercel", "lovable", "locofy"],
    label: {
      zh: "设计转代码 / 快速建站",
      en: "design-to-code / rapid web building",
      ja: "デザインからコードへ",
      ko: "디자인→코드",
    },
  },
  {
    id: "3d",
    tokens: [
      "3d", "三维", "建模", "模型生成", "立体", "3d模型", "场景生成",
      "3d model", "modeling", "text-to-3d", "mesh",
      "3dモデル", "3d 모델",
    ],
    categories: ["ai-3d-tools"],
    picks: ["meshy", "tripo-ai", "luma-ai", "spline-ai", "hyper3d-rodin", "tripo3d"],
    label: {
      zh: "3D 建模",
      en: "3D modeling",
      ja: "3Dモデリング",
      ko: "3D 모델링",
    },
  },
  {
    id: "animation",
    tokens: [
      "动画", "动效", "绑定", "骨骼", "动画师", "动作捕捉",
      "animation", "motion capture", "mocap", "rigging", "animate",
      "アニメーション", "애니메이션",
    ],
    categories: ["ai-animation-tools"],
    picks: ["deepmotion", "cascadeur", "plask", "rokoko-vision", "ebsynth"],
    label: {
      zh: "AI 动画 / 动作捕捉",
      en: "AI animation / motion capture",
      ja: "アニメーション",
      ko: "애니메이션",
    },
  },
  {
    id: "portrait",
    tokens: [
      "头像", "写真", "人脸", "换脸", "虚拟形象", "角色设计", "个人形象照",
      "portrait", "headshot", "face swap", "character design", "avatar photo",
      "顔", "ポートレート", "프로필", "인물",
    ],
    categories: ["ai-image-portrait", "ai-image-tools"],
    picks: ["leonardo-ai", "stable-diffusion", "krea-ai"],
    label: {
      zh: "人像 / 角色设计",
      en: "portrait & character design",
      ja: "ポートレート",
      ko: "인물 / 캐릭터",
    },
  },
  {
    id: "logo-brand",
    tokens: [
      "logo", "标志", "logo设计", "品牌", "商标", "vi设计",
      "branding", "brand", "logotype",
      "ロゴ", "브랜드", "로고",
    ],
    categories: ["ai-image-tools"],
    picks: ["ideogram-ai", "recraft-v4", "looka"],
    label: {
      zh: "Logo / 品牌设计",
      en: "logo & brand design",
      ja: "ロゴデザイン",
      ko: "로고 / 브랜딩",
    },
  },
  {
    id: "presentation",
    tokens: [
      "ppt", "幻灯片", "演示", "汇报", "演示文稿", "slides",
      "presentation", "slide", "pitch deck",
      "プレゼン", "スライド", "프레젠테이션", "ppt",
    ],
    categories: ["ai-productivity-tools"],
    picks: ["gamma", "beautiful-ai", "tome"],
    label: {
      zh: "PPT / 演示文稿",
      en: "presentation & slides",
      ja: "プレゼンテーション",
      ko: "프레젠테이션",
    },
  },
  {
    id: "writing",
    tokens: [
      "写作", "文案", "笔记", "文档", "知识库", "效率", "办公",
      "writing", "notes", "document", "productivity", "knowledge",
      "文書", "メモ", " writing", "문서",
    ],
    categories: ["ai-productivity-tools"],
    picks: ["notion-ai", "gamma"],
    label: {
      zh: "写作 / 办公效率",
      en: "writing & productivity",
      ja: "ライティング / 生産性",
      ko: "글쓰기 / 생산성",
    },
  },
  {
    id: "upscale",
    tokens: [
      "放大", "超分", "修复", "增强", "高清化", "老照片", "画质",
      "upscale", "enhance", "restore", "restoration", "super resolution", "unblur",
      "拡大", "復元", "화질",
    ],
    categories: ["ai-image-tools"],
    picks: ["magnific-ai", "krea-ai"],
    label: {
      zh: "图像放大 / 修复增强",
      en: "image upscaling & enhancement",
      ja: "画像拡大 / 修復",
      ko: "이미지 업스케일",
    },
  },
  {
    id: "ecommerce",
    tokens: [
      "电商", "商品图", "产品图", "淘宝", "详情页", "带货", "营销图",
      "ecommerce", "product photo", "product image", "marketing",
      "ec", " 商品写真", "이커머스",
    ],
    categories: ["ai-image-tools", "use-case-ecommerce"],
    picks: ["canva-ai", "canva-design", "adobe-firefly", "recraft-v4"],
    label: {
      zh: "电商 / 产品图",
      en: "e-commerce / product visuals",
      ja: "EC / 商品画像",
      ko: "이커머스 / 상품 이미지",
    },
  },
  {
    id: "social",
    tokens: [
      "小红书", "自媒体", "社交", "抖音", "ins风", "instagram", "社交媒体",
      "social media", "content creation", "instagram post",
      "sns", "ソーシャル", "sns",
    ],
    categories: ["use-case-social-media", "ai-image-tools"],
    picks: ["canva-ai", "canva-design", "ideogram-ai", "nano-banana"],
    label: {
      zh: "社交媒体内容",
      en: "social media content",
      ja: "SNSコンテンツ",
      ko: "SNS 콘텐츠",
    },
  },
  {
    id: "game",
    tokens: [
      "游戏", "游戏素材", "游戏资产", "贴图", "texture", "game",
      "game asset", "game development",
      "ゲーム", "게임",
    ],
    categories: ["ai-3d-tools", "use-case-gaming"],
    picks: ["meshy", "hyper3d-worldgen", "hyper3d-rodin", "spline-ai"],
    label: {
      zh: "游戏素材 / 资产",
      en: "game assets",
      ja: "ゲームアセット",
      ko: "게임 에셋",
    },
  },
];

/** 各语言的回复开头 */
const REPLY_TEMPLATES: Record<string, (label: string) => string> = {
  zh: (l) => `根据你说的需求，最匹配的是「${l}」类工具，这 3 个最合适：`,
  en: (l) => `Based on your needs, you want "${l}" tools. Here are my top 3 picks:`,
  ja: (l) => `ご要望から、「${l}」系のツールが最適です。おすすめ3つ：`,
  ko: (l) => `요청에 가장 잘 맞는 건 "${l}" 계열이에요. 추천 3가지:`,
};

const FALLBACK_TEMPLATES: Record<string, string> = {
  zh: "这个需求我没有 100% 的把握，先推荐几个综合能力最强的热门工具：",
  en: "I'm not 100% sure about that one — here are the most capable all-round tools first:",
  ja: "そのご要望には確信が持てないので、総合力の高い人気ツールから：",
  ko: "그 요청에는 확신이 없어서, 종합적으로 가장 강한 인기 도구부터 추천할게요:",
};

const GREETING_TEMPLATES: Record<string, string> = {
  zh: "你好！告诉我你想做什么（比如「给产品做宣传视频」「把设计稿转成代码」），我帮你从站内 60+ 个工具里挑最合适的。",
  en: "Hi! Tell me what you want to make (e.g. \"a promo video\", \"turn design into code\") and I'll pick the best tools from our 60+ catalog.",
  ja: "こんにちは！作りたいものを教えてください（例：「プロモ動画」「デザインをコードに」）。60以上のツールから最適なものをおすすめします。",
  ko: "안녕하세요! 만들고 싶은 걸 말씀해 주세요(예: 홍보 영상, 디자인→코드). 60개 이상의 도구 중 최적을 골라드릴게요.",
};

/** 检测输入语言（用于回复语言） */
function detectLang(input: string, fallback: string): string {
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(input)) return "ja";
  if (/[\uac00-\ud7af]/.test(input)) return "ko";
  if (/[\u4e00-\u9fff]/.test(input)) return "zh";
  if (/[a-zA-Z]/.test(input)) return "en";
  return fallback;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export interface RecResult {
  /** 推荐的意图（null 表示走 fallback） */
  intent: RecIntent | null;
  /** 匹配到的工具，按分数排序 */
  items: {
    tool: Tool;
    /** 推荐理由短句（该工具命中的意图标签） */
    reason: string;
  }[];
  /** 回复文本 */
  reply: string;
  lang: string;
}

const BEST_COUNT = 3;

export function recommend(input: string, uiLocale: string): RecResult {
  const lang = detectLang(input, uiLocale);
  const q = norm(input);
  if (!q) {
    return { intent: null, items: [], reply: GREETING_TEMPLATES[lang] || GREETING_TEMPLATES.en, lang };
  }

  // 1) 命中的意图
  const hits = INTENTS.filter((it) => it.tokens.some((tk) => q.includes(norm(tk))));

  // 2) 工具打分
  const scored = tools.map((tool) => {
    let score = 0;
    const reasons = new Set<string>();
    const haystacks = [
      norm(tool.name),
      ...(tool.tags || []).map(norm),
      ...(tool.features || []).map(norm),
      ...(tool.use_cases || []).map(norm),
      ...(tool.keywords || []).map(norm),
      norm(tool.description || ""),
      norm(tool.seo_description || ""),
    ].join(" | ");

    for (const it of hits) {
      // 分类命中（强信号）
      if (it.categories.includes(tool.category_slug)) {
        score += 10;
        reasons.add(it.label[lang] || it.label.zh);
      }
      // 人工校准的推荐位（最强信号）
      if (it.picks?.includes(tool.slug)) {
        score += 14;
        reasons.add(it.label[lang] || it.label.zh);
      }
      // 名称直接命中
      if (q.includes(norm(tool.name)) && norm(tool.name).length > 1) {
        score += 20;
        reasons.add(it.label[lang] || it.label.zh);
      }
      // 标签/特性 token 命中
      for (const tk of it.tokens) {
        const t = norm(tk);
        if (t.length < 2) continue;
        const tagHit = haystacks.includes(t) || (tool.tags || []).some((tag) => norm(tag) === t);
        if (tagHit) {
          score += 3;
          reasons.add(it.label[lang] || it.label.zh);
        }
      }
    }

    // 通用质量分
    score += tool.rating;
    if (tool.featured) score += 1.5;
    if (tool.trending) score += 1;

    return { tool, score, reasons: [...reasons] };
  });

  scored.sort((a, b) => b.score - a.score);

  // 3) 判断是否有有效匹配：有意图命中且第一名分数明显领先于纯质量分
  const hasRealMatch = hits.length > 0 && scored[0].score >= 12;

  const items = scored.slice(0, BEST_COUNT).map((s) => ({
    tool: s.tool,
    reason: s.reasons[0] || "",
  }));

  const topTool = scored[0].tool;
  // 标签优先级：picks 命中 > 分类命中 > 第一个命中意图
  const labelOf = (h: (typeof INTENTS)[number]) => h.label[lang] || h.label.zh;
  const topLabels: string[] = [];
  const byPick = hits.find((h) => h.picks?.includes(topTool.slug));
  if (byPick) topLabels.push(labelOf(byPick));
  if (topLabels.length === 0) {
    const byCat = hits.find((h) => h.categories.includes(topTool.category_slug));
    if (byCat) topLabels.push(labelOf(byCat));
  }
  if (topLabels.length === 0 && hits.length > 0) topLabels.push(labelOf(hits[0]));

  const reply = hasRealMatch
    ? (REPLY_TEMPLATES[lang] || REPLY_TEMPLATES.en)(topLabels[0] || hits[0].label[lang] || hits[0].label.zh)
    : FALLBACK_TEMPLATES[lang] || FALLBACK_TEMPLATES.en;

  return { intent: hasRealMatch ? hits[0] : null, items, reply, lang };
}

export { GREETING_TEMPLATES };
