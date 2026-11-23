const SHOW_DELAY_MS = 150;
const RECOVERY_TIMEOUT_MS = 15000;

/** Only navigation to a different page/query on this origin needs progress. */
export function isInternalPageNavigation(href: string, currentHref: string): boolean {
  if (!href.trim()) return false;

  try {
    const current = new URL(currentHref);
    const destination = new URL(href, current);

    return (
      destination.origin === current.origin &&
      (destination.protocol === "https:" || destination.protocol === "http:") &&
      (destination.pathname !== current.pathname || destination.search !== current.search)
    );
  } catch {
    return false;
  }
}

/** Delay fast-navigation flashes and recover even if the router never commits. */
export function createNavigationProgress(onChange: (loading: boolean) => void) {
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let recoveryTimer: ReturnType<typeof setTimeout> | undefined;

  const dispose = () => {
    clearTimeout(showTimer);
    clearTimeout(recoveryTimer);
  };

  const stop = () => {
    dispose();
    onChange(false);
  };

  const start = () => {
    dispose();
    showTimer = setTimeout(() => onChange(true), SHOW_DELAY_MS);
    recoveryTimer = setTimeout(stop, RECOVERY_TIMEOUT_MS);
  };

  return { start, stop, dispose };
}
