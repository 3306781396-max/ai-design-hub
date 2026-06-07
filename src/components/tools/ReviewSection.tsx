"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Star, ThumbsUp, Trash2, Edit3, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { logError } from "@/lib/logger";
import {
  getReviews,
  upsertReview,
  deleteReview,
  type Review,
} from "@/lib/supabase";

// ============================================================
// Types
// ============================================================

interface ReviewSectionProps {
  toolId: string;
  toolName: string;
}

type SortMode = "newest" | "highest" | "lowest";

// ============================================================
// Star Rating Input
// ============================================================

function StarInput({
  rating,
  onChange,
  size = "md",
}: {
  rating: number;
  onChange?: (r: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-colors",
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-dark-600 hover:text-amber-400/50"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Review Card
// ============================================================

function ReviewCard({
  review,
  onDelete,
  onEdit,
  currentUserId,
}: {
  review: Review;
  onDelete: (id: string) => void;
  onEdit: (review: Review) => void;
  currentUserId?: string;
}) {
  const { t } = useTranslation();
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  const isOwner = currentUserId === review.user_id;
  const displayName =
    review.profiles?.full_name || review.profiles?.username || "Anonymous";
  const initial = displayName[0]?.toUpperCase() || "?";

  return (
    <div className="border border-dark-700 rounded-xl bg-dark-800/50 p-5 space-y-3">
      {/* Header: avatar, name, date, rating */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-sm font-bold text-primary-400 shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {displayName}
              </span>
              <StarInput rating={review.rating} size="sm" />
            </div>
            <span className="text-xs text-dark-500">
              {new Date(review.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(review)}
              className="p-1.5 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-dark-700 transition-colors"
              title={t("reviews.edit_review")}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-dark-700 transition-colors"
              title={t("reviews.delete")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-dark-300 leading-relaxed">{review.comment}</p>
      )}

      {/* Helpful button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            if (!clicked) {
              setHelpfulCount((c) => c + 1);
              setClicked(true);
            }
          }}
          disabled={clicked}
          className={cn(
            "flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors",
            clicked
              ? "text-primary-400 bg-primary-500/10"
              : "text-dark-500 hover:text-dark-300 hover:bg-dark-700"
          )}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          {t("reviews.helpful")}
          {helpfulCount > 0 && (
            <span className="text-dark-400">({helpfulCount})</span>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Review Form
// ============================================================

function ReviewForm({
  toolId,
  toolName,
  initialRating,
  initialComment,
  reviewId,
  onSaved,
  onCancel,
}: {
  toolId: string;
  toolName: string;
  initialRating?: number;
  initialComment?: string;
  reviewId?: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rating, setRating] = useState(initialRating || 0);
  const [comment, setComment] = useState(initialComment || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COMMENT_MAX_LENGTH = 1000;
  const COMMENT_MIN_LENGTH = 3;
  const isEditing = !!reviewId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || submitting) return;

    // Validate comment length
    const trimmed = comment.trim();
    if (trimmed && trimmed.length < COMMENT_MIN_LENGTH) {
      setError("Review must be at least 3 characters.");
      return;
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      setError(`Review must be under ${COMMENT_MAX_LENGTH} characters.`);
      return;
    }

    // Strip HTML / script injection
    const sanitized = trimmed
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "");

    setSubmitting(true);
    setError(null);

    try {
      const { error: upsertError } = await upsertReview(
        user.id,
        toolId,
        rating,
        sanitized || undefined
      );
      if (upsertError) throw upsertError;
      onSaved();
    } catch (err: any) {
      setError(err.message || t("auth.error_generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="border border-dashed border-dark-600 rounded-xl p-6 text-center">
        <MessageSquare className="w-8 h-8 text-dark-500 mx-auto mb-2" />
        <p className="text-dark-400 text-sm">{t("reviews.login_to_review")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-dark-700 rounded-xl bg-dark-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">
          {isEditing ? t("reviews.edit_review") : t("reviews.write_review")}
        </h4>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-dark-400 hover:text-white transition-colors"
          >
            {t("common.cancel")}
          </button>
        )}
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-dark-400">{t("reviews.your_rating")}:</span>
        <StarInput rating={rating} onChange={setRating} size="md" />
        {rating > 0 && (
          <span className="text-xs text-amber-400 font-medium">
            {rating}/5
          </span>
        )}
      </div>

      {/* Comment */}
      <div>
        <Textarea
          value={comment}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= COMMENT_MAX_LENGTH) setComment(val);
          }}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder={t("reviews.review_placeholder")}
          rows={3}
          className="bg-dark-900 border-dark-700 text-white placeholder:text-dark-500 resize-none"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-dark-500">
            {t("common.min_chars") || `Min ${COMMENT_MIN_LENGTH} chars`}
          </span>
          <span className={cn(
            "text-xs",
            comment.length >= COMMENT_MAX_LENGTH ? "text-red-400" : "text-dark-500"
          )}>
            {comment.length}/{COMMENT_MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting || rating === 0}
        className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-sm"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("reviews.updating")}
          </>
        ) : (
          t("reviews.submit_review")
        )}
      </Button>
    </form>
  );
}

// ============================================================
// ReviewSection (Main)
// ============================================================

export function ReviewSection({ toolId, toolName }: ReviewSectionProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortMode>("newest");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReviews(toolId);
      setReviews(data);
    } catch (err) {
      logError("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check if current user already has a review
  const userReview = user ? reviews.find((r) => r.user_id === user.id) : null;
  const otherReviews = user
    ? reviews.filter((r) => r.user_id !== user.id)
    : reviews;

  // Sort
  const sortedReviews = [...otherReviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  // Handlers
  const handleDelete = (reviewId: string) => {
    if (!user) return;
    setDeleteConfirmId(reviewId);
  };

  const confirmDelete = async () => {
    if (!user || !deleteConfirmId) return;
    try {
      const { error } = await deleteReview(deleteConfirmId, user.id);
      if (error) throw error;
      setDeleteConfirmId(null);
      await fetchReviews();
    } catch (err) {
      setDeleteConfirmId(null);
      logError("Failed to delete review", err);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleSaved = async () => {
    setShowForm(false);
    setEditingReview(null);
    await fetchReviews();
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            {t("reviews.title")}
          </h3>
          <p className="text-sm text-dark-400 mt-1">
            {reviews.length > 0
              ? `${reviews.length} ${t("common.reviews")} \u00b7 ${avgRating.toFixed(1)} ${t("common.out_of_5")}`
              : t("reviews.no_reviews")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingReview(userReview || null);
            setShowForm(!showForm);
          }}
          variant="outline"
          size="sm"
          className="border-dark-600 text-dark-300 hover:text-white text-sm"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {userReview ? t("reviews.edit_review") : t("reviews.write_review")}
        </Button>
      </div>

      {/* Rating Summary (if reviews exist) */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 border border-dark-700 rounded-xl bg-dark-800 p-5">
          {/* Average */}
          <div className="flex flex-col items-center justify-center shrink-0 sm:min-w-[100px]">
            <span className="text-4xl font-bold text-white">
              {avgRating.toFixed(1)}
            </span>
            <StarInput rating={Math.round(avgRating)} size="sm" />
            <span className="text-xs text-dark-400 mt-1">
              {reviews.length} {t("common.reviews")}
            </span>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-dark-400 w-4 text-right">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-dark-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form (when toggled) */}
      {showForm && (
        <ReviewForm
          toolId={toolId}
          toolName={toolName}
          initialRating={editingReview?.rating}
          initialComment={editingReview?.comment || undefined}
          reviewId={editingReview?.id}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {/* Sort controls */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-500">{t("common.sort_by")}:</span>
          {(["newest", "highest", "lowest"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortBy(mode)}
              className={cn(
                "text-xs px-3 py-1 rounded-lg transition-colors",
                sortBy === mode
                  ? "bg-primary-500/20 text-primary-400"
                  : "text-dark-400 hover:text-dark-300 hover:bg-dark-700"
              )}
            >
              {t(`reviews.sort_${mode}`)}
            </button>
          ))}
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      ) : sortedReviews.length > 0 || userReview ? (
        <div className="space-y-4">
          {/* User's own review (pinned) */}
          {userReview && (
            <div className="relative">
              <div className="absolute -top-2 left-4 px-2 py-0.5 rounded text-[10px] font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                {t("reviews.your_review")}
              </div>
              <ReviewCard
                review={userReview}
                onDelete={handleDelete}
                onEdit={handleEdit}
                currentUserId={user?.id}
              />
            </div>
          )}

          {/* Other reviews */}
          {sortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUserId={user?.id}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-dark-600 rounded-xl p-10 text-center">
          <MessageSquare className="w-10 h-10 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400 text-sm">{t("reviews.no_reviews")}</p>
          {!user && (
            <p className="text-dark-500 text-xs mt-2">{t("reviews.login_to_review")}</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}
        title="Delete Review"
        description={t("reviews.delete_confirm")}
        confirmLabel={t("common.delete") || "Delete"}
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
