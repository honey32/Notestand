import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import {
  useCurrentAlbumId,
  useCurrentScoreId,
  useQueryParam,
} from "../scripts/state";
import { Tune } from "../scripts/tune";
import { activateRipple } from "./commons/ripple";
import { Arrow, Cross, Hanburger, Tabs } from "./icon/Icons";
import { albumTuneListR } from "./MainView";
import { pushToArray, findById } from "../scripts/util/immut";
import { MbTabList, tabListOpenR as mbTabListOpenR } from "./MbTabList";
import { useSetRecoilState } from "recoil";

const scoresOpenR = atom<Tune[]>({
  key: "scores/open",
  default: [],
});

function useOpenScores() {
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

export const TabBar: React.FC<{ albumName: string }> = ({ albumName }) => {
  const setTabListOpen = useSetRecoilState(mbTabListOpenR);
  const scoresOpen = useOpenScores();
  const currentAlbumId = useCurrentAlbumId();
  const currentScoreId = useCurrentScoreId();
  const closeScore = useCloseScore();

  function onTabListOpen(e: React.MouseEvent<HTMLDivElement>) {
    // activateRipple(e.currentTarget, () => {
    setTabListOpen((v) => !v);
    // });
  }

  return (
    <div className="tabbar">
      <BackButton />
      <AlbumNameTab albumName={albumName} />
      <div className="tab_tune_container">
        {scoresOpen.map((tune) => (
          <TuneTab
            tune={tune}
            album={currentAlbumId}
            viewed={tune.id === currentScoreId}
            onCloseScore={closeScore}
          />
        ))}
      </div>
      <div
        className="mob_tablist_open_button"
        onClick={onTabListOpen}
        hidden={!scoresOpen.length}
      >
        <Tabs />
      </div>
      <MbTabList scores={scoresOpen} />
      <MenuOpenButton />
    </div>
  );
};

const BackButton: React.FC = () => {
  const [q, err] = useQueryParam();
  const shouldBackToHome = err ? true : !q.has("score") || !q.has("album");
  const backUrl = shouldBackToHome ? "/" : `/view?album=${q.get("album")}`;

  return (
    <Link to={backUrl} className="back_home tab">
      <Arrow />
    </Link>
  );
};

const AlbumNameTab: React.FC<{ albumName: string }> = ({ albumName }) => {
  const [q, err] = useQueryParam();
  const active = !err && q.has("album") && !q.has("score");
  const albumId = q.get("album");

  return (
    <Link
      to={`/view?album=${albumId}`}
      className="tab_album_name tab"
      data-active={active}
    >
      {albumName}
    </Link>
  );
};

const MenuOpenButton: React.FC = () => {
  return (
    <div className="menu-open-button">
      <Hanburger />
    </div>
  );
};

interface TuneTabProps {
  tune: Tune;
  album: string;
  viewed: boolean;
  onCloseScore: (id: string) => void;
}

const TuneTab: React.FC<TuneTabProps> = ({
  tune,
  album,
  viewed,
  onCloseScore,
}) => {
  return (
    <Link
      to={`/view?score=${tune.id}&album=${album}`}
      className="tab tab-tune"
      data-active={viewed}
    >
      <div className="tab_name">{tune.name}</div>
      <div
        className="tab_close"
        onClick={(e) => {
          onCloseScore(tune.id);
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Cross />
      </div>
    </Link>
  );
};
