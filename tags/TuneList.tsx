import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DAO } from "../scripts/dao/dao";
import { useLocale } from "../scripts/i18n";
import { getAlbumKanjiHint, IndexedTunes } from "../scripts/search";
import { useCurrentAlbumId } from "../scripts/state";
import { Tune } from "../scripts/tune";
import { run } from "../scripts/util/lazy";
import { activateRipple } from "./commons/ripple";
import { SignInButton } from "./home/AccountInfo";
import { albumTuneListR } from "./MainView";
import { Ctxmenu } from "./menubar";

type TuneId = string;

// let scrollValue = 0;
// state.c(each2()).addEventListener(({ newValue, oldValue }) => {
//   const scrollOriginElement = getScrollOriginElement();
//   if (newValue === "Album") {
//     requestAnimationFrame(() => {
//       projector.renderNow();
//       scrollOriginElement.scrollTop = scrollValue;
//     });
//   } else if (oldValue === "Album") {
//     scrollValue = scrollOriginElement.scrollTop;
//   }
// });

function useTuneList() {
  const currentAlbumId = useCurrentAlbumId();
  const [tunes, setTunes] = useRecoilState<IndexedTunes>(albumTuneListR);
  useEffect(() => {
    if (!currentAlbumId) return;
    run(async () => {
      console.log("start loading");
      const kanjiHint = getAlbumKanjiHint(currentAlbumId);
      const tunes = DAO.lookupTunesInAlbum(currentAlbumId);
      const indexed = (await kanjiHint).indexTunes(await tunes);
      setTunes(indexed);
    });
  }, [currentAlbumId]);
  return { tunes, indices: Array.from(tunes).map(([k]) => k) };
}

export const TuneList: React.FC = () => {
  const [scrollValue, setScrollValue] = useState(0);
  const { tunes, indices } = useTuneList();

  return (
    <div id="album_tune_list">
      <AlbumIndicies indices={indices} />
      <SignInButton />
      ..._if(isLoading, loadingSpinner()),
      <RenderListItems tunesIndexed={tunes} />
    </div>
  );
};

const AlbumIndicies: React.FC<{ indices: string[] }> = ({ indices }) => {
  return (
    <div id="album_indices">
      {indices.map((idx) => (
        <div className="album_index_jump" key={idx} onClick={jumpToIndex(idx)}>
          {idx}
        </div>
      ))}
    </div>
  );
};

const jumpToIndex = (key: string) => (e: React.MouseEvent) => {
  const elem = e.target as HTMLElement;
  activateRipple(elem, () => {});
  const tunesContainer = elem
    .closest("#album_tune_list")
    .querySelector("#album_container_tunes");
  const label = tunesContainer.querySelector(
    `.section_label[data-anchor=${key}]`
  );
  let target = label;
  for (let i = 0; i < 2 && target.previousElementSibling; i++) {
    target = target.previousElementSibling;
  }

  target.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};

const RenderListItems: React.FC<{ tunesIndexed: IndexedTunes }> = ({
  tunesIndexed,
}) => {
  const [i18n] = useLocale();
  const [contextOpenFor, setContextOpen] = useState<string>("");
  const albumId = useCurrentAlbumId();
  const ItemTune: React.FC<{ tune: Tune }> = ({ tune }) => {
    const ctxmenuOpen = contextOpenFor === tune.id;
    return (
      <div className="tune">
        <div className="tune_name">
          <Link to={`/view?score=${tune.id}&album=${albumId}`}>
            {tune.name}
          </Link>
        </div>
        <Ctxmenu
          item={tune}
          shown={ctxmenuOpen}
          onCloseCtxMenu={() => {
            setContextOpen("");
          }}
          i18n={i18n}
        />
      </div>
    );
  };
  return (
    <div id="album_container_tunes">
      {Array.from(tunesIndexed).map(([index, tunes]) => (
        <React.Fragment key={index}>
          <div className="section_label" data-anchor={index}>
            {index}
          </div>
          {tunes.map((tune) => (
            <ItemTune key={tune.id} tune={tune} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

// function isEventOnLabel(e: Event) {
//   const target = e.target as Element;
//   return target.classList.contains("section_label");
// }

// function getBoundTune(e: Event): [Tune, Element] {
//   const target = e.target as Element;
//   const tuneDom = target.closest(".tune_name");
//   return [tuneDom["tune-bound"] as Tune, tuneDom];
// }

// function onContextMenuTune(e: Event) {
//   if (isEventOnLabel(e)) return;
//   const [tune] = getBoundTune(e);

//   if (ctxmenuOpenFor.value !== tune.id) {
//     ctxmenuOpenFor.value = tune.id;
//     e.preventDefault();
//   }
// }

// document.addEventListener("click", (e) => {
//   if (!(e.target as HTMLElement).closest("#album_tune_list")) {
//     ctxmenuOpenFor.value = null;
//   }
// });

// function onCloseCtxMenu(e: Event) {
//   ctxmenuOpenFor.value = null;
//   e.stopPropagation();
// }
