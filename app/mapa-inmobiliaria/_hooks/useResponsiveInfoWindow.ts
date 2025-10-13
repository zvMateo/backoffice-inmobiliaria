"use client";

import { useEffect, useState } from "react";

export function useResponsiveInfoWindow() {
  const [maxWidth, setMaxWidth] = useState(384); // Default desktop width
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateMaxWidth = () => {
      if (window.innerWidth < 640) {
        setMaxWidth(window.innerWidth - 32);
      } else {
        setMaxWidth(384);
      }
    };

    // Set initial value
    updateMaxWidth();

    // Add event listener
    window.addEventListener('resize', updateMaxWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  // Return default value during SSR and initial client render
  if (!isClient) {
    return 384;
  }

  return maxWidth;
}
