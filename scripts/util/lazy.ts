export function wait(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function waitLowPriority(ms_fallback: number = 4000): Promise<void> {
  // @ts-ignore
  return window.requestIdleCallback
    ? new Promise((resolve, reject) => {
        // @ts-ignore
        window.requestIdleCallback(() => resolve());
      })
    : wait(ms_fallback);
}

export function run<A>(fn: () => A): A {
  return fn();
}

export function throttled<Args extends any[], R>(
  fn: (...args: any[]) => R,
  spanMs: number
) {
  const now = () => new Date().getTime();
  const time = now();
  return (...args: any[]): R => {
    if (now() - time > spanMs) {
      return fn(...args);
    }
  };
}
