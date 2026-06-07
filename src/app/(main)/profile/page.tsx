"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Tool } from "@/types";
import { ToolCard } from "@/components/tools/ToolCard";
import { Loader2, Heart, Settings, User as UserIcon, MessageSquare } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.name || "",
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
    if (user) {
      const stored = localStorage.getItem("aid-hub_profile");
      const saved = stored ? JSON.parse(stored) : {};
      setFormData({
        full_name: saved.full_name || user.name || "",
        bio: saved.bio || "",
        website: saved.website || "",
      });
    }
  }, [user]);

  // Fetch favorites from localStorage
  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      try {
        const { tools } = await import("@/data/mock");
        const raw = localStorage.getItem("aid-hub_favorites") || "[]";
        const favIds: string[] = JSON.parse(raw);
        const favTools = tools.filter((t: Tool) => favIds.includes(t.id));
        setFavoriteTools(favTools);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("aid-hub_profile", JSON.stringify(formData));
      setEditing(false);
      toast({
        title: t("profile.update_success") || "Profile updated",
        description: t("profile.update_success_desc") || "Your profile has been saved.",
      });
    } catch {
      toast({
        title: t("profile.update_error") || "Update failed",
        description: "Failed to save profile",
        variant: "destructive",
      });
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
          {user.image ? (
            <img
              src={user.image}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {(formData.full_name || user.email || "?")[0].toUpperCase()}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">
            {formData.full_name || user.name || "User"}
          </h1>
          <p className="text-dark-400 text-sm">{user.email}</p>
          {user.provider && (
            <p className="text-xs text-dark-500 mt-1">
              Logged in via {user.provider}
            </p>
          )}
          {formData.bio && (
            <p className="mt-2 text-dark-300 text-sm">{formData.bio}</p>
          )}
          {formData.website && (
            <a
              href={formData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-indigo-400 hover:text-indigo-300"
            >
              {formData.website}
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

      {/* Reviews placeholder */}
      <div className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
          <MessageSquare className="h-5 w-5 text-amber-400" />
          {t("profile.my_reviews") || "My Reviews"}
        </h2>
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
      </div>
    </div>
  );
}
