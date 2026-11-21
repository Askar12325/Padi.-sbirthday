import { useMemo } from "react";

export function useIsLowPower(): boolean {
  return useMemo(() => {
    // Mobile UA or low device pixel ratio or reduced concurrency
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const lowCores = navigator.hardwareConcurrency <= 4;
    return isMobile || lowCores;
  }, []);
}
