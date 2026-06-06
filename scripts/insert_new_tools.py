#!/usr/bin/env python3
"""
Insert new 2026 AI tools into mock.ts before the closing of the tools array.
Reads mock.ts, finds the `];` before `export const blogPosts`, inserts new tool entries.
"""

import re
import sys

NEW_TOOLS = '''  {
    id: "tool-035",
    slug: "flux-2",
    name: "FLUX 2",
    description: "The most advanced open-weight text-to-image model from Black Forest Labs. 32B parameter model with best-in-class prompt adherence and open weights for local deployment.",
    description_long: "FLUX 2 represents a major leap forward in open-weight AI image generation. Developed by Black Forest Labs (the original Stable Diffusion team), FLUX 2 uses a 32-billion-parameter rectified flow transformer to generate, edit, and composite images with unprecedented quality. The Pro version supports up to 4MP resolution, while the dev version offers open weights for local deployment. FLUX 2's prompt adherence rivals or exceeds closed-source models, making it the top choice for developers and researchers who need local, private, or customizable image generation.",
    website_url: "https://blackforestlabs.ai/",
    category_slug: "ai-image-tools",
    category_name: "AI Image Tools",
    logo: "/images/tool-placeholder.png",
    screenshot: "/images/tool-placeholder.png",
    tags: ["text-to-image", "open-weights", "high-resolution", "image-editing", "local-deployment"],
    pricing: "Freemium",
    rating: 4.7,
    review_count: 8200,
    clicks: 28000,
    featured: false,
    trending: true,
    sponsored: false,
    pros: ["Open weights available for local deployment", "Exceptional prompt adherence", "Multiple versions for different use cases", "Pro version supports up to 4MP resolution", "Strong ComfyUI ecosystem support"],
    cons: ["dev version has commercial use restrictions", "Local deployment requires significant GPU VRAM", "API ecosystem less mature than OpenAI", "Learning curve for optimal prompt engineering"],
    features: ["Text-to-image generation with 32B parameter model", "Image editing and compositing capabilities", "FLUX 2 Pro API available", "FLUX 2 dev open weights for local use", "ComfyUI and webUI integration", "Inpainting and outpainting support"],
    use_cases: ["Local/private AI image generation", "High-quality marketing visuals", "Research and development", "ComfyUI-based creative workflows"],
    alternatives: ["Stable Diffusion 3.5", "Midjourney V8.1", "GPT Image 2", "Ideogram 3.0"],
    faq: [
      { question: "Is FLUX 2 free?", answer: "FLUX 2 dev is free for non-commercial research. Pro version is API-based with usage pricing." },
      { question: "Can I run FLUX 2 locally?", answer: "Yes, FLUX 2 dev weights are available on HuggingFace. You need a GPU with 16GB+ VRAM for best performance." },
      { question: "How does FLUX 2 compare to Midjourney?", answer: "FLUX 2 offers local deployment and open weights, while Midjourney is cloud-only. Prompt adherence is comparable or better." }
    ],
    seo_title: "FLUX 2 Review 2026 - Best Open Weights AI Image Generator",
    seo_description: "Complete FLUX 2 review: Features, pricing, open weights, and comparison with Midjourney and Stable Diffusion. Best open-source AI image generator in 2026.",
    keywords: ["FLUX2", "FLUX 2 review", "open weights AI image generator", "Black Forest Labs", "FLUX2 vs Midjourney"],
    status: "published",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-06-05T00:00:00.000Z",
  },
  {
    id: "tool-035",
    slug: "gpt-image-2",
    name: "GPT Image 2",
    description: "OpenAI's most advanced image generation model with ~99% text rendering accuracy, multi-language support, and conversational editing via the Responses API.",
    description_long: "GPT Image 2 (gpt-image-2) represents OpenAI's most significant advancement in AI image generation since DALL-E 3. The model achieves approximately 99% text rendering accuracy, making it the best choice for images requiring readable text. It supports multiple languages and complex compositional editing. GPT Image 2 is available through ChatGPT and the OpenAI API, superseding the deprecated DALL-E API.",
    website_url: "https://openai.com/index/gpt-image-2/",
    category_slug: "ai-image-tools",
    category_name: "AI Image Tools",
    logo: "/images/tool-placeholder.png",
    screenshot: "/images/tool-placeholder.png",
    tags: ["text-to-image", "text-rendering", "conversational-editing", "multi-language", "OpenAI"],
    pricing: "Paid",
    rating: 4.6,
    review_count: 9500,
    clicks: 35000,
    featured: false,
    trending: true,
    sponsored: false,
    pros: ["~99% text rendering accuracy", "Multi-language support", "Conversational multi-turn editing", "Complex compositional editing capabilities", "Integrated with ChatGPT and API"],
    cons: ["Token costs add up for high-resolution images", "Content safety filters may block prompts", "More expensive than FLUX 2 for high volume", "DALL-E API deprecated, migration required"],
    features: ["Text-to-image with ~99% text accuracy", "Multi-language prompt support", "Conversational image editing via API", "Complex compositing capabilities", "ChatGPT integration"],
    use_cases: ["Marketing materials with text overlays", "Poster and flyer design", "Product visualization with branding", "Educational materials with readable text"],
    alternatives: ["FLUX 2", "Midjourney V8.1", "Ideogram 3.0", "Google Imagen 4"],
    faq: [
      { question: "How much does GPT Image 2 cost?", answer: "Token-based pricing, approximately $0.04-0.12 per image depending on resolution. ChatGPT Free has limited usage; Plus ($20/month) includes more." },
      { question: "Is GPT Image 2 better than DALL-E 3?", answer: "Yes, GPT Image 2 supersedes DALL-E 3 with better text rendering, multi-language support, and conversational editing." },
      { question: "Can GPT Image 2 edit existing images?", answer: "Yes, it supports conversational multi-turn editing via the Responses API." }
    ],
    seo_title: "GPT Image 2 Review 2026 - OpenAI's Best Image Generator",
    seo_description: "Complete GPT Image 2 review: ~99% text accuracy, multi-language support, conversational editing. Compare with FLUX 2 and Midjourney V8.1.",
    keywords: ["GPT Image 2", "gpt-image-2", "OpenAI image generator", "DALL-E 4", "GPT Image 2 vs FLUX2"],
    status: "published",
    created_at: "2026-04-21T00:00:00.000Z",
    updated_at: "2026-06-05T00:00:00.000Z",
  },
  {
    id: "tool-036",
    slug: "recraft-v4",
    name: "Recraft V4",
    description: "Brand design AI with vector generation, cross-batch style consistency, and MCP support for Claude and Cursor. Best for brand asset systems and Logo-to-scene workflows.",
    description_long: "Recraft V4 is purpose-built for brand and marketing workflows, differentiating itself from general-purpose image generators. Its standout capability is brand asset generation - producing vector graphics, maintaining cross-batch style consistency, and compositing Logos into AI-generated scenes. Released in February 2026, V4 added MCP (Model Context Protocol) support, allowing integration with Claude and Cursor for AI-assisted design workflows. Recraft's vector generation capability makes it uniquely valuable for designers who need scalable assets for web and print.",
    website_url: "https://www.recraft.ai/",
    category_slug: "ai-image-tools",
    category_name: "AI Image Tools",
    logo: "/images/tool-placeholder.png",
    screenshot: "/images/tool-placeholder.png",
    tags: ["brand-design", "vector-generation", "style-consistency", "MCP-support", "Logo-design"],
    pricing: "Freemium",
    rating: 4.5,
    review_count: 4800,
    clicks: 16500,
    featured: false,
    trending: true,
    sponsored: false,
    pros: ["Vector generation for scalable brand assets", "Cross-batch style consistency", "MCP support for Claude and Cursor", "Strong brand asset workflow features", "Free plan available"],
    cons: ["Pure photorealism not its strongest suit", "Less versatile than general-purpose tools", "Pro plan ($20/month) required for commercial use", "Smaller community than Midjourney or FLUX"],
    features: ["AI vector graphics generation", "Cross-batch style consistency controls", "Logo-to-scene compositing", "MCP (Model Context Protocol) support", "Brand kit and asset management", "SVG export for web use"],
    use_cases: ["Brand identity and Logo design", "Marketing material generation with style consistency", "Website and app icon generation", "Mockup generation with brand assets", "Scalable vector asset creation"],
    alternatives: ["Adobe Firefly", "Canva AI", "Ideogram 3.0", "FLUX 2"],
    faq: [
      { question: "Is Recraft free?", answer: "Recraft offers a free plan with limited generations. The Pro plan at $20/month unlocks commercial use and more generations." },
      { question: "What is MCP support in Recraft V4?", answer: "MCP (Model Context Protocol) allows Recraft to integrate with AI coding assistants like Claude and Cursor, enabling AI-assisted design workflows." },
      { question: "Can Recraft generate vector graphics?", answer: "Yes, Recraft is one of the few AI tools that generates scalable vector graphics (SVG) suitable for web and print use." }
    ],
    seo_title: "Recraft V4 Review 2026 - Best AI for Brand Design & Vectors",
    seo_description: "Complete Recraft V4 review: Vector generation, brand consistency, MCP support. Best AI tool for brand designers and marketing teams in 2026.",
    keywords: ["Recraft V4", "Recraft AI", "brand design AI", "AI vector generator", "Recraft V4 vs Adobe Firefly"],
    status: "published",
    created_at: "2026-02-15T00:00:00.000Z",
    updated_at: "2026-06-05T00:00:00.000Z",
  },
'''

def main():
    filepath = "/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub/src/data/mock.ts"
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find the position of `];` that comes right before `export const blogPosts`
    # We look for:   },\n];\n\n// =====...\nexport const blogPosts
    pattern = r'(\s+)},\s*\];\s*\n\n// ='
    
    match = re.search(pattern, content)
    if not match:
        print("ERROR: Could not find the closing ]); of tools array before blogPosts")
        sys.exit(1)
    
    indent = match.group(1)  # the indentation before `},`
    
    # Insert new tools before the closing `];`
    # We replace `  },\n];` with `  },\n{New_TOOLS_2entries  },\n];`
    # Actually, we need to insert between the last `  },` and `];`
    
    # Simpler approach: find the exact text `];` before `export const blogPosts`
    idx = content.find('];\n\n// ============================================================\n// Blog Posts')
    if idx == -1:
        print("ERROR: Could not find tools array closing before blogPosts")
        sys.exit(1)
    
    # Insert new tools before `];`
    new_content = content[:idx] + NEW_TOOLS + content[idx:]
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"SUCCESS: Added 3 new tools (FLUX 2, GPT Image 2, Recraft V4)")
    print(f"Total mock.ts size: {len(new_content)} chars")

if __name__ == "__main__":
    main()
