import { useEffect, useState } from "react";

/**
 * Countdown to the first coaching sessions: Fri Nov 20, 2026, 5:00 PM ET (22:00 UTC).
 * Entries close Thu Nov 12, 2026, 5:00 PM ET (22:00 UTC).
 */
export const ENTRIES_CLOSE = Date.UTC(2026, 10, 12, 22, 0, 0);
export const SESSIONS_START = Date.UTC(2026, 10, 20, 22, 0, 0);

type Parts = { d: number; h: number; m: number; s: number };

const ZERO: Parts = { d: 0, h: 0, m: 0, s: 0 };

function partsUntil(target: number, now = Date.now()): Parts {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * Ticks once per second. Starts at zero on the server and on the first client
 * render (so server and client markup match), then updates right after mount.
 */
export function useCountdown(target: number = SESSIONS_START): Parts {
  const [parts, setParts] = useState<Parts>(ZERO);

  useEffect(() => {
    const update = () => setParts(partsUntil(target));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}

/** True once the entry window has closed. Client-only; false during SSR. */
export function useEntriesClosed(): boolean {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const check = () => setClosed(Date.now() >= ENTRIES_CLOSE);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  return closed;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Renders the same markup the page's CSS already styles:
 * <div class="cd"><small>…</small><b>16</b><i>d</i>…</div>
 *
 * Use <Countdown label="Sessions start in" /> in the hero, the form cards and
 * the closing section, and <Countdown /> (no label) in the sticky bar.
 */
export default function Countdown({ label }: { label?: string }) {
  const t = useCountdown();

  return (
    <div className="cd">
      {label && <small>{label}</small>}
      <b>{pad(t.d)}</b>
      <i>d</i>
      <b>{pad(t.h)}</b>
      <i>h</i>
      <b>{pad(t.m)}</b>
      <i>m</i>
      <b>{pad(t.s)}</b>
      <i>s</i>
    </div>
  );
}
