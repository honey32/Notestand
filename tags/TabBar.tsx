import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import {
  useCurrentAlbumId,
  useCurrentScoreId,
  useQueryParam,
} from "../scripts/state";
import { Tune } from "../scripts/tune";
import { activateRipple } from "./commons/ripple";
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
  const currentScoreId = useCurrentScoreId();

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
        [tabs()],
      </div>
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
      <Link to={backUrl}>[arrow()]</Link>
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
  return <div className="menu-open-button">[hanburber()]</div>;
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
      <div className="tab_close">[cross()]</div>
    </div>
  );
};
