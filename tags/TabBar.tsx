import { activateRipple } from "./commons/ripple";
import { arrow, hanburber, tabs, cross } from "./icon/icons";
import { PromiseState } from "hojoki";
import { Tune } from "../scripts/tune";
import { useState } from "react";
import { Album } from "../scripts/album";
import * as React from "react";

export const TabBar: React.FC<{ albumName: string }> = ({ albumName }) => {
  const [isTabListOpen, setTabListOpen] = useState(false);
  const [scores, setScores] = useState<Tune[]>([]);

  function onTabListOpen(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      setTabListOpen(true);
    });
  }

  return <div className="tabbar">
    <BackButton />
    <AlbumNameTab albumName={albumName} />
    <div className="tab_tune_container">
      {scores.map((tune) => <TuneTab tune={tune} key={tune.id} />)}
    </div>
    <div
      className="mob_tablist_open_button"
      onClick={onTabListOpen}
      hidden={!scores.length}
    >
      [tabs()],
    </div>
    <MenuOpenButton />
  </div>;
};

const BackButton: React.FC = () => {
  function clickBack(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // if (state.value === "Score" && albumManager.current.album.value) {
      //   backToAlbum();
      // } else {
      //   backHome();
      // }
    });
  }
  return <div className="back_home tab" onClick={clickBack}>[arrow()]</div>;
};

const AlbumNameTab: React.FC<{ albumName: string }> = ({ albumName }) => {
  function onClickAlbumTab(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // backToAlbum();
    });
  }

  return <div
    className="tab_album_name tab"
    onClick={onClickAlbumTab}
    data-active={!!albumName}
  >
    {albumName}
  </div>;
};

const MenuOpenButton: React.FC = () => {
  function onMenuOpen(e: React.MouseEvent<HTMLDivElement>) {
    activateRipple(e.currentTarget, () => {
      // isMenuOpen.value = true;
    });
  }
  return <div className="menu-open-button" onClick={onMenuOpen}>
    [hanburber()]
  </div>;
};

const TuneTab: React.FC<{ tune: Tune }> = ({ tune }) => {
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
  return <div
    className="tab tab-tune"
    data-active={isViewed}
    onClick={onClickTuneTab}
  >
    <div className="tab_name">{tune.name}</div>
    <div className="tab_close">[cross()]</div>
  </div>;
};
