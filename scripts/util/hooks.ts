import { useState } from "react";

const getNow = () => new Date().getTime();
export function useThrottle<Args extends any[], R>(
  fn: (...args: Args) => R,
  spanMs: number
) {
  const [last, setLast] = useState(getNow());
  return (...args: Args): R => {
    const now = getNow();
    if (now - last > spanMs) {
      setLast(now);
      return fn(...args);
    }
  };
}
