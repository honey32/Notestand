export function pushAtIndex<V>(key: string, value?: V) {
  return function (r: Record<string, V[]>) {
    if (r[key] === undefined && value === undefined) {
      return { ...r, [key]: [] };
    }
    if (value === undefined) {
      return r;
    }
    const arr = r[key] ?? [];
    return { ...r, [key]: [...arr, value] };
  };
}

export function removeFromArray<V>(value: V) {
  return function (arr: V[]) {
    const set = new Set(arr);
    set.delete(value);
    return Array.from(set);
  };
}

export function pushSafelyToArray<V>(value: V, idKey?: keyof V) {
  const idPred = !idKey
    ? (v: V) => v === value
    : (v: V) => v[idKey] === value[idKey];
  return (arr: V[]) => (arr.find(idPred)) ? arr : [...arr, value];
}

export function findById<V extends { id: string }>(arr: V[], id: string) {
  return arr.find((v) => v.id === id);
}

export function findByKey<T, K extends keyof T>(
  arr: Iterable<T>,
  key: K,
  value: T[K],
) {
  const _arr = Array.isArray(arr) ? arr : Array.from(arr);
  return _arr.find((v) => v[key] === value);
}
