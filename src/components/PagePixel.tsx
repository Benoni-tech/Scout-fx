"use client";

import { useEffect } from "react";
import { META_PIXEL_ID, initPixel, trackPixel } from "@/lib/metaPixel";

/**
 * Loads the Meta Pixel on a page that ads point to and records the visit.
 * Re-runs every time the page mounts, so client-side navigation back counts
 * as a new PageView.
 */
export default function PagePixel({
  contentName,
  contentType,
  contentIds,
}: {
  contentName: string;
  contentType: string;
  contentIds?: string[];
}) {
  useEffect(() => {
    if (!initPixel()) return;
    trackPixel("PageView");
    trackPixel("ViewContent", {
      content_name: contentName,
      content_type: contentType,
      ...(contentIds ? { content_ids: contentIds } : {}),
    });
  }, [contentName, contentType, contentIds]);

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
