import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTuneList } from "../scripts/album_tunes";
import { useLocale } from "../scripts/i18n";
import { IndexedTunes } from "../scripts/search";
import { useCurrentAlbumId, useQueryParam } from "../scripts/state";
import { Tune } from "../scripts/tune";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { activateRipple } from "./commons/ripple";
import { SignInButton } from "./home/AccountInfo";
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

export const TuneList: React.FC = () => {
  const [scrollValue, setScrollValue] = useState(0);
  const { loading, tunes, indices } = useTuneList();
  const [q] = useQueryParam();

  return (
    <div id="album_tune_list" hidden={q.has("score") || !q.has("album")}>
      <AlbumIndicies indices={indices} />
      <SignInButton />
      {loading ? <LoadingSpinner /> : <></>}
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
