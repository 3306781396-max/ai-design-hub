"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { logError } from "@/lib/logger";
import { getFavorites, getUserReviews, deleteReview } from "@/lib/supabase";
import type { Review } from "@/lib/supabase";
import type { Tool } from "@/types";
import { ToolCard } from "@/components/tools/ToolCard";
import { Loader2, Heart, Settings, User as UserIcon, Star, MessageSquare, Trash2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [toolNames, setToolNames] = useState<Map<string, { name: string; slug: string }>>(new Map());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    website: "",
  });
  const { t } = useTranslation();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Initialize form data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        website: profile.website || "",
      });
    }
  }, [profile]);

  // Fetch favorites
  useEffect(() => {
    if (!user) return;

    // Capture userId BEFORE any async work (TypeScript knows this is non-null)
    const userId = user.id;

    async function fetchFavorites() {
      setLoading(true);
      try {
        const { tools } = await import("@/data/mock");
        const favIds = await getFavorites(userId);
        const favTools = tools.filter((t: Tool) => favIds.includes(t.id));
        setFavoriteTools(favTools);
      } catch (err: any) {
        logError("Failed to fetch favorites", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  // Fetch my reviews
  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const reviews = await getUserReviews(userId);
        setMyReviews(reviews);
      } catch (err: any) {
        logError("Failed to fetch reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [user]);

  // Load tool names for reviews
  useEffect(() => {
    async function loadToolMap() {
      const { tools } = await import("@/data/mock");
      const map = new Map<string, { name: string; slug: string }>();
      tools.forEach((t: Tool) => map.set(t.id, { name: t.name, slug: t.slug }));
      setToolNames(map);
    }
    loadToolMap();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { updateProfile } = await import("@/lib/supabase");
      const { error } = await updateProfile(user.id, formData);
      if (error) throw error;
      await refreshProfile();
      setEditing(false);
      toast({ title: t("profile.update_success") || "Profile updated", description: t("profile.update_success_desc") || "Your profile has been saved." });
    } catch (err: any) {
      toast({ title: t("profile.update_error") || "Update failed", description: err.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dark-700 bg-dark-800 p-8 md:flex-row md:items-start">
        {/* Avatar */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center overflow-hidden shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {(profile?.full_name || user.email || "?")[0].toUpperCase()}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">
            {profile?.full_name || "User"}
          </h1>
          <p className="text-dark-400 text-sm">{user.email}</p>
          {profile?.bio && (
            <p className="mt-2 text-dark-300 text-sm">{profile.bio}</p>
          )}
          {profile?.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-indigo-400 hover:text-indigo-300"
            >
              {profile.website}
            </a>
          )}
        </div>

        {/* Edit Button */}
        <Button
          onClick={() => setEditing(!editing)}
          variant="outline"
          size="sm"
          className="border-dark-600 text-dark-300 hover:text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          {t("profile.edit") || "Edit"}
        </Button>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="mt-6 rounded-2xl border border-dark-700 bg-dark-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {t("profile.edit_profile") || "Edit Profile"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-dark-300 text-sm">
                {t("auth.full_name") || "Full Name"}
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-dark-900 border-dark-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-dark-300 text-sm">
                {t("profile.username") || "Username"}
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-dark-900 border-dark-700 text-white"
                placeholder="mysusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-dark-300 text-sm">
                {t("profile.bio") || "Bio"}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-dark-900 border-dark-700 text-white"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-dark-300 text-sm">
                {t("profile.website") || "Website"}
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-dark-900 border-dark-700 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-indigo-500 hover:bg-indigo-600">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.saving") || "Saving..."}
                  </>
                ) : (
                  t("common.save") || "Save"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(false)}
                className="text-dark-400"
              >
                {t("common.cancel") || "Cancel"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Favorites Section */}
      <div className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
          <Heart className="h-5 w-5 text-red-400" />
          {t("nav.favorites") || "My Favorites"}
          <span className="text-dark-400 text-base font-normal">
            ({favoriteTools.length})
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : favoriteTools.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dark-700 bg-dark-800 p-12 text-center">
            <p className="text-dark-400">
              {t("profile.no_favorites") || "No favorites yet. Start exploring tools!"}
            </p>
            <Link href="/tools">
              <Button
                variant="outline"
                className="mt-4 border-dark-600 text-dark-300 hover:text-white"
              >
                {t("profile.browse_tools") || "Browse Tools"}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* My Reviews Section */}
      <div className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
          <MessageSquare className="h-5 w-5 text-amber-400" />
          {t("profile.my_reviews") || "My Reviews"}
          <span className="text-dark-400 text-base font-normal">
            ({myReviews.length})
          </span>
        </h2>

        {loadingReviews ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : myReviews.length > 0 ? (
          <div className="space-y-4">
            {myReviews.map((review) => {
              const toolInfo = toolNames.get(review.tool_id);

              const handleDelete = async () => {
                if (deletingReviewId) return; // prevent double click
                // Show inline confirmation via toast
                toast({
                  title: t("profile.confirm_delete_review") || "Delete this review?",
                  description: t("profile.delete_review_desc") || "This action cannot be undone.",
                  variant: "destructive",
                  action: (
                    <button
                      className="rounded bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        setDeletingReviewId(review.id);
                        try {
                          const { error } = await deleteReview(review.id, user!.id);
                          if (error) throw error;
                          setMyReviews((prev) => prev.filter((r) => r.id !== review.id));
                          toast({ title: t("profile.review_deleted") || "Review deleted" });
                        } catch (err: any) {
                          logError("Failed to delete review", err);
                          toast({ title: t("profile.delete_error") || "Delete failed", variant: "destructive" });
                        } finally {
                          setDeletingReviewId(null);
                        }
                      }}
                    >
                      {t("common.confirm") || "Confirm"}
                    </button>
                  ),
                });
              };

              return (
                <div
                  key={review.id}
                  className="rounded-xl border border-dark-700 bg-dark-800 p-5 transition-colors hover:border-dark-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Tool name */}
                      <div className="flex items-center gap-2 mb-2">
                        {toolInfo ? (
                          <Link
                            href={`/tool/${toolInfo.slug}/`}
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                          >
                            {toolInfo.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-dark-400">
                            {review.tool_id}
                          </span>
                        )}
                      </div>

                      {/* Star rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-dark-600"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-dark-300 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}

                      {/* Date */}
                      <p className="mt-2 text-xs text-dark-500">
                        {new Date(review.created_at).toLocaleDateString(
                          t("common.locale") === "zh" ? "zh-CN" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={handleDelete}
                      className="shrink-0 rounded-lg p-2 text-dark-500 hover:bg-dark-700 hover:text-red-400 transition-colors"
                      title={t("reviews.delete") || "Delete"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dark-700 bg-dark-800 p-12 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-dark-600 mb-3" />
            <p className="text-dark-400">
              {t("profile.no_reviews") || "No reviews yet. Share your thoughts on tools you've used!"}
            </p>
            <Link href="/tools">
              <Button
                variant="outline"
                className="mt-4 border-dark-600 text-dark-300 hover:text-white"
              >
                {t("profile.explore_tools") || "Explore Tools"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
