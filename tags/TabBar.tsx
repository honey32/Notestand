import { activateRipple } from "./commons/ripple";
import { arrow, hanburber, tabs, cross } from "./icon/icons";
import { PromiseState } from "hojoki";
import { Tune } from "../scripts/tune";
import { useState, useEffect } from "react";
import { Album } from "../scripts/album";
import * as React from "react";
import {
  useQueryParam,
  useCurrentScoreId,
  useCurrentAlbumId,
} from "../scripts/state";
import { Link, useHistory } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { albumTuneListR } from "./MainView";

const scoresOpenR = atom<Tune[]>({
  key: "scores/open",
  default: [],
});

function useOpenScores() {
  const [scoresOpen, setScoresOpen] = useRecoilState(scoresOpenR);
  const s = useCurrentScoreId();
  const a = useCurrentAlbumId();
  const [tuneList] = useRecoilState(albumTuneListR);

  useEffect(() => {
    setScoresOpen([]);
  }, [a]);

  useEffect(() => {
    const newScore = Array.from(tuneList.getTunesSorted()).find(
      ({ id }) => id === s
    );
    if (!newScore) return;
    if (scoresOpen.find(({ id }) => id === s)) return;
    setScoresOpen((r) => [newScore, ...r]);
  }, [s, tuneList]);
  return scoresOpen;
}

export const TabBar: React.FC<{ albumName: string }> = ({ albumName }) => {
  const [isTabListOpen, setTabListOpen] = useState(false);
  const scoresOpen = useOpenScores();
  const currentAlbumId = useCurrentAlbumId();

  function onTabListOpen(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      setTabListOpen(true);
    });
  }

  return (
    <div className="tabbar">
      <BackButton />
      <AlbumNameTab albumName={albumName} />
      <div className="tab_tune_container">
        {scoresOpen.map((tune) => (
          <TuneTab tune={tune} key={tune.id} album={currentAlbumId} />
        ))}
      </div>
      <div
        className="mob_tablist_open_button"
        onClick={onTabListOpen}
        hidden={!scoresOpen.length}
      >
        [tabs()],
      </div>
      <MenuOpenButton />
    </div>
  );
};

const BackButton: React.FC = () => {
  const [q, err] = useQueryParam();
  const h = useHistory();
  const shouldBackToHome = err ? true : !q.has("score") || !q.has("album");

  function clickBack(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // if (state.value === "Score" && albumManager.current.album.value) {
      //   backToAlbum();
      // } else {
      //   backHome();
      // }
    });
  }

  const backUrl = shouldBackToHome ? "/" : `/view?album=${q.get("album")}`;

  return (
    <div className="back_home tab">
      <Link to={backUrl}>[arrow()]</Link>
    </div>
  );
};

const AlbumNameTab: React.FC<{ albumName: string }> = ({ albumName }) => {
  const albumId = useCurrentAlbumId();
  function onClickAlbumTab(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // backToAlbum();
    });
  }

  return (
    <div
      className="tab_album_name tab"
      onClick={onClickAlbumTab}
      data-active={!!albumName}
    >
      <Link to={`/view?album=${albumId}`}>{albumName}</Link>
    </div>
  );
};

const MenuOpenButton: React.FC = () => {
  function onMenuOpen(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // isMenuOpen.value = true;
    });
  }
  return (
    <div className="menu-open-button" onClick={onMenuOpen}>
      [hanburber()]
    </div>
  );
};

const TuneTab: React.FC<{ tune: Tune; album: string }> = ({ tune, album }) => {
  const isViewed = false; //TODO:
  function onClickTuneTab(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    // const close_btn = target.closest(".tab_close");
    // const tab = target.closest(".tab");

    // if (close_btn) {
    // activateRipple(close_btn, () => {
    // closeTune(tab["tune-bound"]);
    //   });
    // } else if (tab) {
    //   activateRipple(tab, () => {
    // openTune(tab["tune-bound"].id);
    //   });
    // }
  }
  return (
    <div
      className="tab tab-tune"
      data-active={isViewed}
      onClick={onClickTuneTab}
    >
      <div className="tab_name">
        <Link to={`/view?score=${tune.id}&album=${album}`}>{tune.name}</Link>
      </div>
      <div className="tab_close">[cross()]</div>
    </div>
  );
};
