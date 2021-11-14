import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useCurrentScoreId, useCurrentAlbumId, useQueryParam } from "./state";
import { useEffect } from "react";
import { findByKey, pushSafelyToArray } from "./util/immut";
import { useHistory } from "react-router-dom";
import { Tune } from "./tune";
import { albumTuneListR } from "./album_tunes";
import { DAO } from "./dao/dao";
import { run } from "./util/lazy";

const scoresOpenR = atom<Tune[]>({
  key: "scores/open",
  default: [],
});

const msgR = atom<string>({
  key: "message",
  default: "",
});

async function getTuneDirectly(albumId: string) {
  const name = await DAO.getEntityName(albumId);
  return new Tune(name, albumId);
}

export function useOpenScores() {
  const [scoresOpen, setScoresOpen] = useRecoilState(scoresOpenR);
  const s = useCurrentScoreId();
  const a = useCurrentAlbumId();
  const tuneList = useRecoilValue(albumTuneListR);

  useEffect(() => {
    setScoresOpen([]);
  }, [a]);

  useEffect(() => {
    run(async () => {
      const newScore =
        s && tuneList.isEmpty
          ? await getTuneDirectly(s)
          : findByKey(tuneList.getTunesSorted(), "id", s);
      if (!newScore) return;
      if (findByKey(scoresOpen, "id", s)) return;
      setScoresOpen(pushSafelyToArray(newScore, "id"));
    });
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

export function useNextScore() {
  const scoresOpen = useRecoilValue(scoresOpenR);
  const setMsg = useSetRecoilState(msgR);
  const [q] = useQueryParam();
  const h = useHistory();
  return (id: string, ward: "forward" | "backward") => {
    const numScores = scoresOpen.length;
    if (numScores === 1) {
      return;
    }
    const tuneIdx = scoresOpen.findIndex((t) => t.id === id);
    let targetIdx = tuneIdx + (ward === "forward" ? 1 : -1);
    if (targetIdx < 0) {
      targetIdx = numScores - 1;
    }
    if (targetIdx > numScores - 1) {
      targetIdx = 0;
    }
    const targetId = scoresOpen[targetIdx].id;
    const urlSuffix = q.has("album") ? `&album=${q.get("album")}` : "";
    const url = `/view?score=${targetId}` + urlSuffix;
    h.push(url);
    setMsg(scoresOpen[targetIdx].name);
    setTimeout(() => {
      setMsg("");
    }, 500);
  };
}

export function usePopupMessage() {
  return useRecoilValue(msgR);
}
