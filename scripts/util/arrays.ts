export function deleteFromArray<A> (arr: A[], s: A) {
  arr.splice(arr.indexOf(s), 1);
}

export function deleteFromArrayById<A extends {id: string}> (arr: A[], id: string) {
  arr.splice(arr.findIndex(t => t.id === id), 1);
}
