import type { BlogPost } from "@/types";

/**
 * 侧栏列表只需要 id / slug / title / published_at。
 * 直接把 BlogPost[] 传给客户端组件会让全文 content 进入 RSC payload，
 * 每个页面因此多出上百 KB —— 用这个裁剪后的类型代替。
 */
export type BlogMini = Pick<BlogPost, "id" | "slug" | "title" | "published_at">;

export function toBlogMini(posts: BlogPost[], limit?: number): BlogMini[] {
  const slice = typeof limit === "number" ? posts.slice(0, limit) : posts;
  return slice.map(({ id, slug, title, published_at }) => ({
    id,
    slug,
    title,
    published_at,
  }));
}
