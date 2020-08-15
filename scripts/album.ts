export class Album {
  constructor(public name: string, public id: string) {}

  serialize() {
    return { name: this.name, path: this.id };
  }

  static deserialize(json: any) {
    return new Album(json.name, json.id);
  }
}

// export class AlbumManager {
// state = this.dispatcher.create<AlbumLoadingState>({ state: "no-album" })
// album = new BaseProperty<Album | null>(null)
// id: Observable<string>
// name: Observable<PromiseState<string>>
// kanjiHint: Observable<PromiseState<KanjiHint>>
// tunes: Observable<PromiseState<IndexedTunes>>

// constructor (man: AlbumListManager) {
//   const progress = this.album.c(map(album =>
//     album ? man.prefetcher.fetch(album.id, false) : null
//   ));

//   this.id = this.album
//     .c(map(album => album ? album.id : undefined))
//     .asProperty();

//   this.kanjiHint = progress
//     .c(mapAsync(async p => p ? p.kanjiHint : new KanjiHint([])))
//     .asProperty();
//   // .c(map(p => p.state === 'done' ? p.value : new KanjiHint([])))

//   this.name = progress
//     .c(mapAsync(async p => p ? p.name : ''))
//     .asProperty();
//   // .c(map(p => p.state === 'done' ? p.value : ''))

//   this.tunes = progress
//     .c(mapAsync(async p => p ? p.tunes : new IndexedTunes()))
//     .asProperty();

//   this.tunes.addEventListener(() => {
//     scoreManager.clear();
//   });
// }

// forId (id: string): Tune {
//   const tunes = this.tunes.value;
//   if (tunes.state !== 'done') {
//     throw 'Cannot find tune; album tunes loading not completed now';
//     return null;
//   }
//   for (const t of tunes.value.getTunesSorted()) {
//     if (t.id === id) return t;
//   }
//   throw `there is no tune for id: ${id} in the open album.`;
// }
// }
