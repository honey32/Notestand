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
            key={tune.id}
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
