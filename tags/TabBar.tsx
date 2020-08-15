import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { createPortal } from "react-dom";
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

export const TabBar: React.FC<{ albumName: string }> = ({ albumName }) => {
  const setTabListOpen = useSetRecoilState(mbTabListOpenR);
  const scoresOpen = useOpenScores();
  const currentAlbumId = useCurrentAlbumId();
  const currentScoreId = useCurrentScoreId();

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
            key={tune.id}
            album={currentAlbumId}
            viewed={currentScoreId === tune.id}
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
    <div className="back_home tab">
      <Link to={backUrl}>
        <Arrow />
      </Link>
    </div>
  );
};

const AlbumNameTab: React.FC<{ albumName: string }> = ({ albumName }) => {
  const [q, err] = useQueryParam();
  const active = !err && q.has("album") && !q.has("score");
  const albumId = q.get("album");

  return (
    <div className="tab_album_name tab" data-active={active}>
      <Link to={`/view?album=${albumId}`}>{albumName}</Link>
    </div>
  );
};

const MenuOpenButton: React.FC = () => {
  return (
    <div className="menu-open-button">
      <Hanburger />
    </div>
  );
};

const TuneTab: React.FC<{ tune: Tune; album: string; viewed: boolean }> = ({
  tune,
  album,
  viewed,
}) => {
  return (
    <div className="tab tab-tune" data-active={viewed}>
      <div className="tab_name">
        <Link to={`/view?score=${tune.id}&album=${album}`}>{tune.name}</Link>
      </div>
      <div className="tab_close">
        <Cross />
      </div>
    </div>
  );
};
