#!/usr/bin/env python3
"""Append 2026-new AI tools to src/data/mock.ts and bump category tool_count."""
import re, json, sys

PATH = "src/data/mock.ts"

def tool(**kw) -> str:
    """Render one Tool object as TS source (compact but complete)."""
    lines = ["  {"]
    for k, v in kw.items():
        lines.append(f"    {k}: {json.dumps(v, ensure_ascii=False, indent=None)},")
    lines.append("  },")
    return "\n".join(lines)

def arr(items):
    return json.dumps(items, ensure_ascii=False)

def plans(*tuples):
    return json.dumps([{"name": n, "price": p, "currency": "USD", "interval": "month", "features": f} for n, p, f in tuples], ensure_ascii=False)

now = "2026-11-04T09:00:00.000Z"

tools = [
 tool(
  id="tool-101", slug="sora-2", name="Sora 2",
  description="OpenAI's flagship text-to-video model with synchronized audio. Generates cinematic, physically consistent scenes with native sound design and dialogue.",
  description_long="Sora 2 is OpenAI's second-generation video model, released inside the Sora app and ChatGPT. Compared with the original Sora, it dramatically improves physical fidelity — objects follow realistic dynamics, failed actions are corrected instead of morphed, and scenes stay consistent across shots. Its signature capability is synchronized audio: dialogue, ambience and sound effects are generated together with the video, so clips come out with a finished feel rather than silent drafts. Cameos let creators insert a consented likeness of themselves into any scene, and the social feed around the app turned Sora 2 into the most talked-about video model of 2026.",
  website_url="https://openai.com/sora", category_slug="ai-video-tools", category_name="AI Video Tools",
  logo="https://logo.clearbit.com/openai.com?size=128", screenshot="/images/tool-placeholder.png",
  tags=["text-to-video","audio-sync","cinematic","OpenAI","storyboard"],
  pricing="Paid",
  pricing_details={"starting_price":"$20/month","paid_plans":json.loads(plans(("ChatGPT Plus",20,["Limited Sora 2 generations","720p exports","Watermark-free personal use"]),("ChatGPT Pro",200,["Highest priority generation","1080p and longer clips","Commercial usage terms"])))},
  rating=4.7, review_count=8600, clicks=51200, featured=True, trending=True, sponsored=False,
  pros=["Native synchronized audio and dialogue generation","Best-in-class physical consistency and realism","Cameo feature for consented personal likeness","Story tools for multi-shot narrative control","Strong prompt adherence for complex scenes"],
  cons=["Region and plan gated — not available everywhere","Generation queue can be slow at peak times","Strict likeness and content moderation","Clip lengths still limited versus traditional footage","Heavy usage requires the Pro plan"],
  features=["Text-to-video with synchronized audio","Image-to-video animating stills","Cameos with verified personal likeness","Storyboard timeline for multi-shot sequences","Remix of community creations","HD export up to 1080p"],
  use_cases=["Cinematic concept films and mood reels","Social video with finished sound design","Ad pre-visualization before live production","Animatics for film and game pitches","Short-form storytelling with dialogue"],
  alternatives=["Veo 3","Kling AI","Runway","Hailuo AI"],
  faq=[{"question":"What makes Sora 2 different from other video models?","answer":"Sora 2 generates synchronized audio — dialogue, effects and ambience — together with the footage, and its physics simulation is noticeably more consistent than first-generation models."},{"question":"How much does Sora 2 cost?","answer":"Sora 2 is included with ChatGPT Plus ($20/month) with limited generations, and the Pro plan ($200/month) unlocks priority, higher resolution and commercial terms."},{"question":"Can I use Sora 2 videos commercially?","answer":"Commercial usage is tied to the ChatGPT Pro plan terms; Plus-tier output is intended for personal use. Always check OpenAI's current usage policies."}],
  seo_title="Sora 2 Review 2026 - OpenAI's Video Model with Synchronized Audio",
  seo_description="Complete Sora 2 review: synchronized audio, physics consistency, cameo likeness, pricing on ChatGPT Plus and Pro, and how it compares to Veo 3 and Kling AI.",
  keywords=["Sora 2","OpenAI video","text to video","AI video generator","Sora app"],
  status="published", created_at=now, updated_at=now,
 ),
 tool(
  id="tool-102", slug="veo-3", name="Veo 3",
  description="Google DeepMind's cinematic video model with native audio generation. Photorealistic 4K-ready clips with dialogue, effects and camera control in Flow.",
  description_long="Veo 3 is Google DeepMind's flagship video generation model, available through the Gemini app and the filmmaker-oriented Flow tool. Its headline features are native audio — every clip ships with matching dialogue, sound effects and music — and a strong grasp of cinematography: camera moves, depth of field and lighting follow director-style prompts. Veo 3 raised the bar on realism for people and physics, and its Flow integration adds scene extension and camera controls that make it practical for actual pre-production work rather than one-off clips. It is one of the two leading choices (alongside OpenAI's Sora 2) for professional-grade AI video in 2026.",
  website_url="https://deepmind.google/models/veo/", category_slug="ai-video-tools", category_name="AI Video Tools",
  logo="https://logo.clearbit.com/deepmind.google?size=128", screenshot="/images/tool-placeholder.png",
  tags=["text-to-video","audio-sync","cinematic","Google","filmmaking"],
  pricing="Paid",
  pricing_details={"starting_price":"$19.99/month","paid_plans":json.loads(plans(("Google AI Pro",19.99,["Veo 3 Fast access in Gemini and Flow","Limited monthly generations","1080p export"]),("Google AI Ultra",249.99,["Highest Veo 3 quality and limits","Early access to new models","Project Flow with longer clips"])))},
  rating=4.8, review_count=9800, clicks=58700, featured=True, trending=True, sponsored=False,
  pros=["Native audio with accurate lip-sync and effects","Excellent cinematography and camera-language control","Flow tooling for scene building and extension","Very high visual realism for people and nature","Available in 70+ countries via Gemini plans"],
  cons=["Higher tiers are expensive for individual creators","Generation limits on lower plans","Watermarks on some export tiers","Complex prompts occasionally drift from intent","Commercial rights depend on plan"],
  features=["Text-to-video with native synchronized audio","Image-to-video generation","Camera and movement controls in Flow","Scene extension for longer narratives","Photorealistic human performance","SynthID watermarking for provenance"],
  use_cases=["Film pre-visualization and look development","Advertising and brand films","Dialogue-driven short scenes","Nature and documentary-style B-roll","Music visuals with generated sound"],
  alternatives=["Sora 2","Kling AI","Runway","Hailuo AI"],
  faq=[{"question":"Does Veo 3 generate audio?","answer":"Yes — Veo 3 is Google's first video model with fully native audio, generating dialogue, sound effects and ambience matched to the visuals."},{"question":"How do I access Veo 3?","answer":"Veo 3 is available through Google AI Pro and Ultra plans in the Gemini app, and through the Flow filmmaking tool with higher limits on Ultra."},{"question":"Veo 3 vs Sora 2 — which is better?","answer":"Veo 3 leads on audio realism and camera control; Sora 2 leads on social distribution and cameos. Both generate dialogue-synced cinematic clips."}],
  seo_title="Veo 3 Review 2026 - Google's Cinematic AI Video Model with Audio",
  seo_description="Veo 3 deep dive: native audio, Flow camera controls, Gemini plan pricing, SynthID watermarking, and how Google's video model compares to Sora 2 and Kling.",
  keywords=["Veo 3","Google Veo","AI video generator","text to video","Google Flow"],
  status="published", created_at=now, updated_at=now,
 ),
 tool(
  id="tool-103", slug="kling-ai", name="Kling AI",
  description="Kuaishou's high-fidelity video model known for lifelike motion and strong image-to-video. Long 1080p clips with fluid physics at accessible prices.",
  description_long="Kling AI from Kuaishou has become the go-to video model for creators who prioritize realistic human motion and value. Its image-to-video pipeline is among the best available — a still photo becomes a moving shot with convincing weight, hair and cloth dynamics — and text-to-video keeps up with detailed prompts. Kling supports clips up to two minutes at 1080p with its extension feature, well beyond most competitors, and its motion brush lets you direct which parts of a frame move and how. With aggressive pricing and rapid version updates throughout 2025 and 2026, it is the value leader for professional-looking AI footage.",
  website_url="https://klingai.com", category_slug="ai-video-tools", category_name="AI Video Tools",
  logo="https://logo.clearbit.com/klingai.com?size=128", screenshot="/images/tool-placeholder.png",
  tags=["text-to-video","image-to-video","long-clip","motion-brush","value"],
  pricing="Free Trial",
  pricing_details={"starting_price":"$10/month","paid_plans":json.loads(plans(("Standard",10,["Daily free credits","Fast-track generation queue","Watermark removal"]),("Pro",37,["More monthly credits","Priority access to new models","Professional mode features"])))},
  rating=4.6, review_count=15200, clicks=44800, featured=False, trending=True, sponsored=False,
  pros=["Best-in-class image-to-video motion realism","Clips up to 2 minutes with extension","Motion brush for per-element direction","Generous free daily credits","Significantly cheaper than Western rivals"],
  cons=["Generation queue can be long on free tier","Chinese-first UI, English translations imperfect","Content moderation stricter for realistic faces","Audio generation weaker than Sora 2 or Veo 3","Occasional morphing on complex interactions"],
  features=["Text-to-video and image-to-video","Motion brush element direction","Clip extension up to ~2 minutes","Camera movement presets","Lip-sync with uploaded audio","1080p exports"],
  use_cases=["Animating product and portrait photos","Short drama and story content","Social ads from still assets","Music and dance performance clips","Previz for action sequences"],
  alternatives=["Hailuo AI","Sora 2","Veo 3","Runway"],
  faq=[{"question":"Is Kling AI free to use?","answer":"Kling offers daily free credits on signup. Paid plans from $10/month remove watermarks, speed up queues and add professional features."},{"question":"How long can Kling AI videos be?","answer":"Individual generations are typically 5–10 seconds, but Kling's extension feature can build clips up to around two minutes."},{"question":"What is Kling's motion brush?","answer":"Motion brush lets you paint areas of a frame and assign them individual motion trajectories, giving director-level control over what moves."}],
  seo_title="Kling AI Review 2026 - Realistic AI Video at the Best Price",
  seo_description="Kling AI review: image-to-video realism, motion brush, 2-minute clip extension, pricing from $10/month, and comparisons against Sora 2, Veo 3 and Hailuo.",
  keywords=["Kling AI","Kuaishou Kling","AI video generator","image to video","motion brush"],
  status="published", created_at=now, updated_at=now,
 ),
 tool(
  id="tool-104", slug="hailuo-ai", name="Hailuo AI",
  description="MiniMax's video model praised for character consistency and expressive human performance. Fast, affordable generation with director-grade camera control.",
  description_long="Hailuo AI, built by MiniMax (also known by its I2V models), has carved out a niche with character consistency and expressive acting — faces stay stable across shots and emotional performance reads convincingly, which most rivals still fumble. Its camera-control vocabulary (quick dolly, orbit, crash zoom) gives creators director-level moves without complex prompts, and generation speed is among the fastest in the category. For social teams producing volume content around consistent characters, Hailuo is often the pragmatic pick in 2026.",
  website_url="https://hailuoai.video", category_slug="ai-video-tools", category_name="AI Video Tools",
  logo="https://logo.clearbit.com/minimaxi.com?size=128", screenshot="/images/tool-placeholder.png",
  tags=["text-to-video","character-consistency","camera-control","fast","MiniMax"],
  pricing="Free Trial",
  pricing_details={"starting_price":"$9.99/month","paid_plans":json.loads(plans(("Standard",9.99,["Monthly credit pack","Faster generation queue","Commercial usage for outputs"]),("Master",94.99,["Large credit pool","Priority new-model access","Team-friendly concurrency"])))},
  rating=4.5, review_count=7400, clicks=32600, featured=False, trending=True, sponsored=False,
  pros=["Strong character and face consistency across shots","Expressive human emotion and performance","Simple director-style camera controls","Very fast generation turnaround","Low entry price with free trial credits"],
  cons=["Max resolution trails Kling and Veo on base tiers","Shorter default clip lengths","Audio features less mature than Veo 3","Prompt understanding occasionally literal","English documentation is thinner"],
  features=["Text-to-video and image-to-video","Subject reference for character consistency","Camera movement command presets","Fast generation mode","Lip-sync tooling","HD export"],
  use_cases=["Character-led social series","UGC-style ads with consistent presenters","Animatics for commercials","Dance and performance captures","Rapid ideation and B-roll"],
  alternatives=["Kling AI","Sora 2","Veo 3","Pika"],
  faq=[{"question":"What is Hailuo AI best at?","answer":"Character consistency and expressive human performance — faces and emotions hold up across shots better than most competitors."},{"question":"How fast is Hailuo AI?","answer":"Hailuo is one of the fastest video generators; standard clips typically render in well under two minutes."},{"question":"Does Hailuo AI support camera control?","answer":"Yes — you can request moves like orbit, dolly-in or crash zoom directly in the prompt, and the model executes them reliably."}],
  seo_title="Hailuo AI Review 2026 - MiniMax Video Model for Consistent Characters",
  seo_description="Hailuo AI (MiniMax) review: character consistency, camera-control presets, speed, pricing from $9.99/month, and how it compares to Kling, Sora 2 and Veo 3.",
  keywords=["Hailuo AI","MiniMax video","AI video generator","character consistency","camera control"],
  status="published", created_at=now, updated_at=now,
 ),
 tool(
  id="tool-105", slug="nano-banana", name="Nano Banana",
  description="Google's Gemini image model (2.5 Flash Image) that took 2026 by storm. Conversational editing, character consistency, and world-class prompt understanding.",
  description_long="Nano Banana — the community nickname for Google's Gemini 2.5 Flash Image — became the fastest-adopted image model of 2026 after topping every image-editing benchmark. Its superpower is conversational editing: upload a photo and change anything with plain sentences while the rest of the image stays pixel-consistent. Character consistency across multiple generations makes it a storyboarding and brand-asset machine, and it fuses multiple reference images (person + product + scene) naturally. It ships inside the Gemini app, AI Studio and the API at Flash pricing, which effectively made high-end image editing free to try for everyone.",
  website_url="https://gemini.google.com", category_slug="ai-image-tools", category_name="AI Image Tools",
  logo="https://logo.clearbit.com/gemini.google.com?size=128", screenshot="/images/tool-placeholder.png",
  tags=["image-editing","character-consistency","Gemini","conversational","Google"],
  pricing="Free",
  pricing_details={"free_tier":"Free generations in the Gemini app and AI Studio with limits","starting_price":"Free","paid_plans":json.loads(plans(("Google AI Pro",19.99,["Higher generation limits","Early access to new image models","Commercial terms for most outputs"])))},
  rating=4.8, review_count=21400, clicks=67400, featured=True, trending=True, sponsored=False,
  pros=["State-of-the-art conversational photo editing","Excellent character consistency across images","Natural multi-image fusion (person + product + place)","Cheap or free access via Gemini","SynthID watermarking built in"],
  cons=["Max resolution lower than dedicated pro tools","Text rendering strong but not flawless","Moderation can refuse legitimate edits of people","Fewer pro controls (masks, layers) than Photoshop-class tools","Style range narrower than Midjourney"],
  features=["Natural-language image editing","Multi-reference fusion","Character consistency across generations","Template and style transfer","SynthID provenance watermarking","API access at Flash pricing"],
  use_cases=["Product and marketing photo edits","Storyboarding with consistent characters","Virtual try-on and outfit swaps","Old photo restoration and retouching","Rapid concept iterations in chat"],
  alternatives=["Midjourney","FLUX 2","Recraft V4","Adobe Firefly"],
  faq=[{"question":"What is Nano Banana?","answer":"Nano Banana is the popular codename for Google's Gemini 2.5 Flash Image model, famous for conversational image editing and character consistency."},{"question":"Is Nano Banana free?","answer":"Yes, it is available for free with limits in the Gemini app and Google AI Studio; paid Google AI plans raise the limits."},{"question":"How is it different from Midjourney?","answer":"Midjourney excels at generating new artistic images; Nano Banana excels at editing and combining existing ones while keeping people and products consistent."}],
  seo_title="Nano Banana Review 2026 - Google's Gemini Image Editing Model",
  seo_description="Nano Banana (Gemini 2.5 Flash Image) review: conversational editing, character consistency, multi-image fusion, free access via Gemini, and use cases.",
  keywords=["Nano Banana","Gemini image","AI photo editing","character consistency","Google image AI"],
  status="published", created_at=now, updated_at=now,
 ),
 tool(
  id="tool-106", slug="tripo-ai", name="Tripo AI",
  description="Production-grade text-to-3D and image-to-3D generation. Clean topology, PBR textures and export-ready meshes for games and 3D pipelines.",
  description_long="Tripo AI has become the default answer for fast, usable 3D assets. Where earlier text-to-3D produced lumpy museum pieces, Tripo outputs meshes with clean topology, sensible UVs and PBR materials that drop into Blender, Unity or Unreal without heroic cleanup. Image-to-3D from a single product photo or character sheet works reliably, and its API powers 3D features inside partner apps. For indie game teams, e-commerce teams needing 3D product views, and worldbuilding hobbyists, Tripo compresses days of modeling into minutes.",
  website_url="https://www.tripo3d.ai", category_slug="ai-3d-tools", category_name="AI 3D Tools",
  logo="https://logo.clearbit.com/tripo3d.ai?size=128", screenshot="/images/tool-placeholder.png",
  tags=["text-to-3d","image-to-3d","PBR-textures","game-assets","API"],
  pricing="Free Trial",
  pricing_details={"starting_price":"$20/month","paid_plans":json.loads(plans(("Professional",20,["Monthly generation credits","Faster queue priority","Commercial license for outputs"]),("Studio",120,["Team seats and shared assets","API access","Highest resolution exports"])))},
  rating=4.6, review_count=6100, clicks=28900, featured=False, trending=True, sponsored=False,
  pros=["Clean topology that survives retopology-light workflows","PBR textures and sensible UV unwraps","Strong single-image-to-3D conversion","Fast generation at seconds per draft","Full API for pipeline integration"],
  cons=["Complex organic characters still need manual cleanup","Credit costs add up for heavy iteration","Rigging not fully automatic","Free tier is watermarked for commercial use","Fewer artistic style knobs than Meshy"],
  features=["Text-to-3D draft and refine modes","Single-image and multi-image to 3D","PBR texture generation","Auto UV and mesh simplification","Rig-ready humanoid outputs","API and plugin integrations"],
  use_cases=["Game asset prototyping","3D product viewers for e-commerce","Prop and set dressing for scenes","VR/AR content pipelines","Concept-to-3D worldbuilding"],
  alternatives=["Meshy","Luma AI","Spline AI","CSM AI"],
  faq=[{"question":"What can I export from Tripo AI?","answer":"GLB, OBJ, FBX and USDZ with PBR textures — ready for Blender, Unity, Unreal and web 3D viewers."},{"question":"Is Tripo AI good for game development?","answer":"Yes — clean topology and PBR materials make Tripo outputs usable as real game assets, especially for props and environment pieces."},{"question":"How much does Tripo AI cost?","answer":"A free trial covers evaluation; Professional is $20/month and Studio at $120/month adds team seats and API access."}],
  seo_title="Tripo AI Review 2026 - Production-Ready Text-to-3D and Image-to-3D",
  seo_description="Tripo AI review: clean topology, PBR textures, image-to-3D accuracy, API access, pricing from $20/month, and comparisons with Meshy and Luma AI.",
  keywords=["Tripo AI","text to 3D","image to 3D","AI 3D model generator","game assets"],
  status="published", created_at=now, updated_at=now,
 ),
]

src = open(PATH, encoding="utf-8").read()

# 1) Insert before the Blog Posts banner (end of tools array)
marker = "// ============================================================\n// Blog Posts"
idx = src.index(marker)
block = "\n".join(tools) + "\n"
src = src[:idx] + block + "\n" + src[idx:]

# 2) Bump category tool_count (main six categories only, by slug anchor)
bumps = {"ai-video-tools": 3, "ai-image-tools": 1, "ai-3d-tools": 1}
for slug, delta in bumps.items():
    pat = re.compile(r'(slug: "%s",(?:(?!tool_count).)*?tool_count: )(\d+)' % slug, re.S)
    m = pat.search(src)
    if not m:
        print(f"WARN: category {slug} not found"); continue
    src = pat.sub(lambda mm: mm.group(1) + str(int(mm.group(2)) + delta), src, count=1)

open(PATH, "w", encoding="utf-8").write(src)
print("Inserted", len(tools), "tools; counts bumped.")
