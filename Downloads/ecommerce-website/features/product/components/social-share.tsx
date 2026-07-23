"use client";

import { useState } from "react";
import { Facebook, Link2, Check, Share2 } from "lucide-react";

/**
 * Share intents need no API keys — they're just prefilled compose URLs
 * (or the native share sheet where available). Genuinely functional
 * today, unlike a "live" social feed would be.
 */
export function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(`${title} — Kopal Seth Studio`);
  const shareUrl = encodeURIComponent(url);

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: `${title} — Kopal Seth Studio`, url });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the link is still visible/selectable in the address bar.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-widest text-ink/40">
        Share
      </span>

      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          aria-label="Share this piece"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-sand-100 hover:text-ink"
        >
          <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-sand-100 hover:text-ink"
      >
        <Facebook className="h-3.5 w-3.5" strokeWidth={1.5} />
      </a>

      <a
        href={`https://www.pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pin on Pinterest"
        className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-ink/50 transition-colors hover:bg-sand-100 hover:text-ink"
      >
        P
      </a>

      <button
        onClick={handleCopyLink}
        aria-label="Copy link"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-sand-100 hover:text-ink"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
        ) : (
          <Link2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
