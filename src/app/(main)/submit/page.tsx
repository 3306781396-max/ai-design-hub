"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Send, ArrowRight, AlertCircle } from "lucide-react";
import type { Tool } from "@/types";

const CATEGORY_KEYS = [
  { slug: "ai-image-tools", key: "category.image_tools" },
  { slug: "ai-video-tools", key: "category.video_tools" },
  { slug: "ai-ui-tools", key: "category.ui_ux_tools" },
  { slug: "ai-animation-tools", key: "category.animation_tools" },
  { slug: "ai-3d-tools", key: "category.3d_tools" },
  { slug: "ai-productivity-tools", key: "category.productivity_tools" },
];

const PRICING_KEYS = ["common.free", "common.freemium", "common.paid", "common.free_trial"];

export default function SubmitPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    website_url: "",
    category_slug: "",
    pricing: "",
    description: "",
    description_long: "",
    tags: "",
    pros: "",
    cons: "",
    features: "",
    submitter_name: "",
    submitter_email: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Basic validation
    if (!form.name || !form.website_url || !form.category_slug || !form.description) {
      setError(t("submit.error_required"));
      setSubmitting(false);
      return;
    }

    // Build the tool payload
    const payload = {
      name: form.name,
      website_url: form.website_url,
      category_slug: form.category_slug,
      pricing: form.pricing,
      description: form.description,
      description_long: form.description_long,
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      pros: form.pros.split("\n").map((s: string) => s.trim()).filter(Boolean),
      cons: form.cons.split("\n").map((s: string) => s.trim()).filter(Boolean),
      features: form.features.split("\n").map((s: string) => s.trim()).filter(Boolean),
      submitter_name: form.submitter_name,
      submitter_email: form.submitter_email,
    };

    try {
      // Try Formspree (free form backend)
      const res = await fetch("https://formspree.io/f/xblegokn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_name: payload.name,
          tool_url: payload.website_url,
          category: payload.category_slug,
          pricing: payload.pricing,
          description: payload.description,
          long_description: payload.description_long,
          tags: payload.tags.join(", "),
          pros: payload.pros.join("\n"),
          cons: payload.cons.join("\n"),
          features: payload.features.join("\n"),
          submitter_name: payload.submitter_name,
          submitter_email: payload.submitter_email,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback: save to localStorage for admin review
        const submissions = JSON.parse(
          localStorage.getItem("aid-hub_submissions") || "[]"
        );
        submissions.push({
          ...payload,
          id: `submission-${Date.now()}`,
          status: "pending",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("aid-hub_submissions", JSON.stringify(submissions));
        setSubmitted(true);
      }
    } catch {
      // Network failed — save locally
      const submissions = JSON.parse(
        localStorage.getItem("aid-hub_submissions") || "[]"
      );
      submissions.push({
        ...payload,
        id: `submission-${Date.now()}`,
        status: "pending",
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("aid-hub_submissions", JSON.stringify(submissions));
      setSubmitted(true);
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            {t("submit.success.title")}
          </h1>
          <p className="text-dark-400 mb-8">
            {t("submit.success.description", { name: form.name })}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/tools">
              <Button variant="outline" className="border-dark-700">
                {t("submit.success.browse")}
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary-500 hover:bg-primary-600">
                {t("submit.success.home")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/" className="text-dark-400 hover:text-white text-sm mb-4 inline-block">
            {t("common.back_to_home")}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("submit.page_title")}
          </h1>
          <p className="text-dark-400 mb-8">
            {t("submit.page_description")}
          </p>

          <Card className="bg-dark-900 border-dark-800">
            <CardContent className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields */}
                <div>
                  <h3 className="text-white font-semibold mb-4">{t("submit.required_info")}</h3>
                  <div className="space-y-4">
                    {/* Tool Name */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.tool_name")} <span className="text-red-400">{t("common.required")}</span>
                      </label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder={t("submit.tool_name_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white"
                      />
                    </div>

                    {/* Website URL */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.website_url")} <span className="text-red-400">{t("common.required")}</span>
                      </label>
                      <Input
                        required
                        type="url"
                        value={form.website_url}
                        onChange={(e) => handleChange("website_url", e.target.value)}
                        placeholder={t("submit.website_url_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white"
                      />
                    </div>

                    {/* Category + Pricing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">
                          Category <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={form.category_slug}
                          onChange={(e) => handleChange("category_slug", e.target.value)}
                          className="w-full h-10 rounded-lg border border-dark-700 bg-dark-800 text-white px-3 text-sm"
                        >
                          <option value="">Select...</option>
                          {CATEGORY_KEYS.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {t(cat.key)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">
                          Pricing <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={form.pricing}
                          onChange={(e) => handleChange("pricing", e.target.value)}
                          className="w-full h-10 rounded-lg border border-dark-700 bg-dark-800 text-white px-3 text-sm"
                        >
                          <option value="">Select...</option>
                          {PRICING_KEYS.map((key, idx) => {
                            const values = ["Free", "Freemium", "Paid", "Free Trial"];
                            return (
                              <option key={key} value={values[idx]}>
                                {t(key)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        Short Description <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        required
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder={t("submit.short_description_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white min-h-20"
                      />
                    </div>

                    {/* Long Description */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.detailed_description")}
                      </label>
                      <Textarea
                        value={form.description_long}
                        onChange={(e) => handleChange("description_long", e.target.value)}
                        placeholder={t("submit.detailed_description_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white min-h-28"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div>
                  <h3 className="text-white font-semibold mb-4">{t("submit.optional_details")}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.tags")}
                      </label>
                      <Input
                        value={form.tags}
                        onChange={(e) => handleChange("tags", e.target.value)}
                        placeholder={t("submit.tags_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">
                          {t("submit.pros")}
                        </label>
                        <Textarea
                          value={form.pros}
                          onChange={(e) => handleChange("pros", e.target.value)}
                          placeholder={t("submit.pros_placeholder")}
                          className="bg-dark-800 border-dark-700 text-white min-h-24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1.5">
                          {t("submit.cons")}
                        </label>
                        <Textarea
                          value={form.cons}
                          onChange={(e) => handleChange("cons", e.target.value)}
                          placeholder={t("submit.cons_placeholder")}
                          className="bg-dark-800 border-dark-700 text-white min-h-24"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.features")}
                      </label>
                      <Textarea
                        value={form.features}
                        onChange={(e) => handleChange("features", e.target.value)}
                        placeholder={t("submit.features_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white min-h-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Submitter Info */}
                <div>
                  <h3 className="text-white font-semibold mb-4">{t("submit.your_info")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.your_name")}
                      </label>
                      <Input
                        value={form.submitter_name}
                        onChange={(e) => handleChange("submitter_name", e.target.value)}
                        placeholder={t("submit.your_name_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {t("submit.your_email")}
                      </label>
                      <Input
                        type="email"
                        value={form.submitter_email}
                        onChange={(e) => handleChange("submitter_email", e.target.value)}
                        placeholder={t("submit.your_email_placeholder")}
                        className="bg-dark-800 border-dark-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-dark-800">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-base h-12"
                  >
                    {submitting ? (
                      t("submit.submitting")
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("submit.submit_button")}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-dark-500 text-center mt-3">
                    {t("submit.disclaimer")}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
