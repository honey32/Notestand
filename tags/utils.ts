import { useEffect } from "react";

export function flatmap<V, R>(
  array: V[],
  fn: (value: V, index: number, itself: V[]) => R[]
): R[] {
  const result: R[] = [];

  for (let i = 0; i < array.length; i++) {
    result.push(...fn(array[i], i, array));
  }

  return result;
}

export function safeArray<V>(array: V[] | null | undefined): V[] {
  return array || [];
}

export function _if<V>(cond: boolean | any, v: V): V[] {
  return cond ? [v] : [];
}

export function getScrollOriginElement() {
  if (navigator.userAgent.toLowerCase().match(/webkit|msie 5/)) {
    // Webkit系（Safari, Chrome, iOS）判定
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      // Chromeはhtml要素
      return document.documentElement;
    } else {
      // Chrome以外はbody要素
      return document.body;
    }
  } else {
    // IE（6以上）、Firefox、Operaはhtml要素
    return document.documentElement;
  }
}

type Handler = (e: Event) => void;

export function keyedHandlerMemo<K, H = Handler>(provider: (key: K) => H) {
  const map = new Map<K, H>();

  return (key: K): H => {
    const got = map.get(key);
    if (got) {
      return got;
    }

    const h = provider(key);
    map.set(key, h);
    return h;
  };
}

interface Global<Args extends any[]> {
  addEventListener(...args: Args): any;
  removeEventListener(...args: Args): any;
}

type G<D> = D extends Global<infer Args> ? Args : never;

export function useGlobalEventListener<D extends Global<any[]>>(
  doc: D,
  ...args: G<D>
) {
  useEffect(() => {
    doc.addEventListener(...args);
    return () => {
      doc.removeEventListener(...args);
    };
  }, []);
}
