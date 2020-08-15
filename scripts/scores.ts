import { atom, useRecoilState, useRecoilValue } from "recoil";
import { useCurrentScoreId, useCurrentAlbumId, useQueryParam } from "./state";
import { useEffect } from "react";
import { findById, pushToArray } from "./util/immut";
import { useHistory } from "react-router-dom";
import { Tune } from "./tune";
import { albumTuneListR } from "./album_tunes";

const scoresOpenR = atom<Tune[]>({
  key: "scores/open",
  default: [],
});

export function useOpenScores() {
  const [scoresOpen, setScoresOpen] = useRecoilState(scoresOpenR);
  const s = useCurrentScoreId();
  const a = useCurrentAlbumId();
  const tuneList = useRecoilValue(albumTuneListR);

  useEffect(() => {
    setScoresOpen([]);
  }, [a]);

  useEffect(() => {
    const newScore = findById(Array.from(tuneList.getTunesSorted()), s);
    if (!newScore) return;
    if (findById(scoresOpen, s)) return;
    setScoresOpen(pushToArray(newScore));
  }, [s, tuneList]);
  return scoresOpen;
}

export function useCloseScore() {
  const [scoresOpen, setScoresOpen] = useRecoilState(scoresOpenR);
  const [q] = useQueryParam();
  const h = useHistory();
  return (id: string) => {
    const tuneIdx = scoresOpen.findIndex((t) => t.id === id);
    const arr = [...scoresOpen];
    arr.splice(tuneIdx, 1);
    const nextTune = arr.length === 0 ? null : arr[(tuneIdx - 1) % arr.length];
    const backUrl = q.has("album") ? `/view?album=${q.get("album")}` : "/";
    const url = !nextTune
      ? backUrl
      : `/view?score=${nextTune.id}` +
        (q.has("album") ? `&album=${q.get("album")}` : "");
    h.push(url);
    setScoresOpen(arr);
  };
}
