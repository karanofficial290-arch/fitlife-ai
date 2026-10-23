import { useCallback, useEffect, useRef, useState } from 'react';

/** Current time, refreshed every `intervalMs` while mounted. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/**
 * Countdown based on an end timestamp, so it stays correct even if the
 * JS thread is paused (e.g. app in background) and resumes later.
 */
export function useCountdown(onFinish?: () => void) {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (endsAt === null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setEndsAt(null);
        finishRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const start = useCallback((seconds: number) => {
    setRemaining(seconds);
    setEndsAt(Date.now() + seconds * 1000);
  }, []);

  const stop = useCallback(() => {
    setEndsAt(null);
    setRemaining(0);
  }, []);

  return { remaining, running: endsAt !== null, start, stop };
}
