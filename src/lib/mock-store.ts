"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Tool, BlogPost } from "@/types";

// ---- In-memory mutable copies (singleton per session) ----
let _tools: Tool[] | null = null;
let _posts: BlogPost[] | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function cloneTool(t: Tool): Tool {
  return JSON.parse(JSON.stringify(t));
}

function clonePost(p: BlogPost): BlogPost {
  return JSON.parse(JSON.stringify(p));
}

// ---- Public API ----
export function getToolsStore() {
  return _tools ? [..._tools] : [];
}

export function getPostsStore() {
  return _posts ? [..._posts] : [];
}

export function initStore(tools: Tool[], posts: BlogPost[]) {
  if (!_tools) _tools = tools.map(cloneTool);
  if (!_posts) _posts = posts.map(clonePost);
  notify();
}

export function addTool(tool: Tool) {
  if (!_tools) return;
  _tools.unshift(cloneTool(tool));
  notify();
}

export function updateTool(id: string, updates: Partial<Tool>) {
  if (!_tools) return;
  const idx = _tools.findIndex((t) => t.id === id);
  if (idx >= 0) {
    _tools[idx] = { ..._tools[idx], ...updates };
    notify();
  }
}

export function deleteTool(id: string) {
  if (!_tools) return;
  _tools = _tools.filter((t) => t.id !== id);
  notify();
}

export function addPost(post: BlogPost) {
  if (!_posts) return;
  _posts.unshift(clonePost(post));
  notify();
}

export function updatePost(id: string, updates: Partial<BlogPost>) {
  if (!_posts) return;
  const idx = _posts.findIndex((p) => p.id === id);
  if (idx >= 0) {
    _posts[idx] = { ..._posts[idx], ...updates };
    notify();
  }
}

export function deletePost(id: string) {
  if (!_posts) return;
  _posts = _posts.filter((p) => p.id !== id);
  notify();
}

export function getNextToolId(): string {
  if (!_tools) return "tool-999";
  const nums = _tools
    .map((t) => parseInt(t.id.replace("tool-", ""), 10))
    .filter((n) => !isNaN(n));
  return `tool-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
}

export function getNextPostId(): string {
  if (!_posts) return "blog-999";
  const nums = _posts
    .map((p) => parseInt(p.id.replace("blog-", ""), 10))
    .filter((n) => !isNaN(n));
  return `blog-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
}

// ---- React Hook ----
export function useMockStore() {
  const [, forceUpdate] = useState(0);
  const initRef = useRef(false);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    tools: _tools ? [..._tools] : [],
    posts: _posts ? [..._posts] : [],
    isReady: !!_tools && !!_posts,
    addTool: useCallback((tool: Tool) => addTool(tool), []),
    updateTool: useCallback((id: string, updates: Partial<Tool>) => updateTool(id, updates), []),
    deleteTool: useCallback((id: string) => deleteTool(id), []),
    addPost: useCallback((post: BlogPost) => addPost(post), []),
    updatePost: useCallback((id: string, updates: Partial<BlogPost>) => updatePost(id, updates), []),
    deletePost: useCallback((id: string) => deletePost(id), []),
    getNextToolId: useCallback(() => getNextToolId(), []),
    getNextPostId: useCallback(() => getNextPostId(), []),
  };
}
