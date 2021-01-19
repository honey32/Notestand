import * as React from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useCloseScore, useOpenScores } from "../scripts/scores";
import {
  useCurrentAlbumId,
  useCurrentScoreId,
  useQueryParam,
} from "../scripts/state";
import { Tune } from "../scripts/tune";
import { Arrow, Cross, Hanburger, Tabs } from "./icon/Icons";
import { MbTabList, tabListOpenR as mbTabListOpenR } from "./MbTabList";
import { Menubar, menuOpenR } from "./menubar";

export const TabBar: React.FC<{ albumName: string }> = ({ albumName }) => {
  const setTabListOpen = useSetRecoilState(mbTabListOpenR);
  const scoresOpen = useOpenScores();
  const currentScoreId = useCurrentScoreId();
  const openMenu = useSetRecoilState(menuOpenR);

  function onTabListOpen(e: React.MouseEvent<HTMLDivElement>) {
    // activateRipple(e.currentTarget, () => {
    setTabListOpen((v) => !v);
    // });
  }

  const handleMenuOpenButton = () => {
    openMenu(true);
  };

  return (
    <div className="tabbar">
      <BackButton />
      <AlbumNameTab albumName={albumName} />
      <div className="tab_tune_container">
        {scoresOpen.map((tune) => {
          const viewed = tune.id === currentScoreId;
          return <TuneTab key={tune.id} tune={tune} viewed={viewed} />;
        })}
      </div>
      <div
        className="mob_tablist_open_button"
        onClick={onTabListOpen}
        hidden={!scoresOpen.length}
      >
        <Tabs />
      </div>
      <MbTabList scores={scoresOpen} />
      <MenuOpenButton onClick={handleMenuOpenButton} />
      <Menubar />
    </div>
  );
};

const BackButton: React.FC = () => {
  const [q, err] = useQueryParam();
  const shouldBackToHome = !!err || !q.has("score") || !q.has("album");
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
  const url = `/view?album=${albumId}`;

  return (
    <Link to={url} className="tab_album_name tab" data-active={active}>
      {albumName}
    </Link>
  );
};

const MenuOpenButton: React.FC<{ onClick: () => void }> = ({ ...props }) => {
  return (
    <div className="menu-open-button" {...props}>
      <Hanburger />
    </div>
  );
};

interface TuneTabProps {
  tune: Tune;
  viewed: boolean;
}

const TuneTab: React.FC<TuneTabProps> = ({ tune, viewed }) => {
  const album = useCurrentAlbumId();
  const _closeScore = useCloseScore();
  const closeScore = (e: React.MouseEvent) => {
    _closeScore(tune.id);
    e.stopPropagation();
    e.preventDefault();
  };
  const url = `/view?score=${tune.id}&album=${album}`;
  return (
    <Link to={url} className="tab tab-tune" data-active={viewed}>
      <div className="tab_name">{tune.name}</div>
      <div className="tab_close" onClick={closeScore}>
        <Cross />
      </div>
    </Link>
  );
};
