// Progressive enhancement tier for the city scene. Evaluated once on the
// client (scene mounts via ssr:false). Low-power devices get dpr 1, lighter
// geometry, and fewer particles — same composition, cheaper frame.
export function isLowPowerDevice() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 4)
  );
}
