import { useCurrentAlbumId } from "./state";
import { useRecoilState, atom } from "recoil";
import { useState, useEffect } from "react";
import { IndexedTunes, getAlbumKanjiHint } from "./search";
import { run } from "./util/lazy";
import { DAO } from "./dao/dao";

export const albumTuneListR = atom<IndexedTunes>({
  key: "albumTuneList",
  default: IndexedTunes.Nullish(),
});

export function useTuneList() {
  const currentAlbumId = useCurrentAlbumId();
  const [tunes, setTunes] = useRecoilState<IndexedTunes>(albumTuneListR);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!currentAlbumId) {
      setTunes(IndexedTunes.Nullish());
      return;
    }
    run(async () => {
      setLoading(true);
      const kanjiHint = getAlbumKanjiHint(currentAlbumId);
      const tunes = DAO.lookupTunesInAlbum(currentAlbumId);
      const indexed = (await kanjiHint).indexTunes(await tunes);
      setLoading(false);
      setTunes(indexed);
    });
  }, [currentAlbumId]);
  return { loading, tunes, indices: tunes.indices };
}
