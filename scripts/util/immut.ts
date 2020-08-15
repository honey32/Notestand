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

export function pushToArray<V>(...value: V[]) {
  return function (arr: V[]) {
    return [...arr, ...value];
  };
}

export function findById<V extends { id: string }>(arr: V[], id: string) {
  return arr.find((v) => v.id === id);
}
