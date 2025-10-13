"use client";

import { useEffect, useState } from "react";

export function useResponsiveInfoWindow() {
  const [maxWidth, setMaxWidth] = useState(320); // Aligned with PropertyInfoCard
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateMaxWidth = () => {
      if (window.innerWidth < 640) {
        // Mobile: allow more space but cap at screen width minus margins
        setMaxWidth(Math.min(320, window.innerWidth - 32));
      } else {
        // Desktop/Tablet: consistent 320px to match PropertyInfoCard
        setMaxWidth(320);
      }
    };

    // Set initial value
    updateMaxWidth();

    // Add event listener
    window.addEventListener("resize", updateMaxWidth);

    // Cleanup
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  // Return default value during SSR and initial client render
  if (!isClient) {
    return 320;
  }

  return maxWidth;
}
