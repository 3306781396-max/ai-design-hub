"user client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Linkedin,
  Link2,
  Check,
  Share2,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function ShareButton({
  title,
  description,
  url,
  image,
}: ShareButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url;
  const shareText = `${title} - ${description}`;

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedinUrl, "_blank", "width=550,height=420");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to showing menu
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={shareNative}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        {t("common.share")}
      </Button>

      {/* Share Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-dark-900 border border-dark-700 rounded-lg shadow-xl py-2 min-w-[160px]">
            <button
              onClick={shareToTwitter}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
              Twitter / X
            </button>
            <button
              onClick={shareToLinkedIn}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              LinkedIn
            </button>
            <button
              onClick={copyLink}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">{t("common.copied")}</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  {t("common.copy_link")}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
