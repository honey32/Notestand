// import { state, albumManager } from "../scripts/store";
import {
  _if,
  getScrollOriginElement,
} from "./utils";
import { Tune } from "../scripts/tune";
import { activateRipple } from "./commons/ripple";
import { SignInButton } from "./home/AccountInfo";
import { Ctxmenu } from "./menubar";
import { TabBar } from "./TabBar";
import { loadingSpinner } from "./commons/load_spinner";
// import { projector } from "./tags";
import { BaseProperty, each2 } from "hojoki";
import { useState, ReactElement } from "react";
import * as React from "react";

type TuneId = string;
const ctxmenuOpenFor = new BaseProperty<TuneId>(null);

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
  const [tunes] = useState<[string, Tune[]][]>([["A", []]]);
  // const isLoading = albumManager.current.tunes.value.state === "pending";
  return <div id="album_tune_list">
    <AlbumIndicies indices={tunes.map(([k]) => k)} />
    <SignInButton />
    ..._if(isLoading, loadingSpinner()),
    <div id="album_container_tunes">
      <RenderListItems tunesIndexed={tunes} />
    </div>
  </div>;
};

const AlbumIndicies: React.FC<{ indices: string[] }> = ({ indices }) => {
  return <div id="album_indices">
    {indices.map((idx) => {
      <div
        className="album_index_jump"
        key={idx}
        onClick={jumpToIndex(idx)}
      >
        {idx}
      </div>;
    })}
  </div>;
};

const jumpToIndex = (key: string) =>
  (e: React.MouseEvent) => {
    const elem = e.target as HTMLElement;
    activateRipple(elem, () => {});
    const tunesContainer = elem.closest("#album_tune_list").querySelector(
      "#album_container_tunes",
    );
    const label = tunesContainer.querySelector(
      `.section_label[data-anchor=${key}]`,
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

const RenderListItems: React.FC<{ tunesIndexed: [string, Tune[]][] }> = (
  { tunesIndexed },
) => {
  const elems: ReactElement[] = [];
  for (const [index, tunes] of tunesIndexed) {
    elems.push(
      <div className="section_label" key={`index_${index}`} data-anchor={index}>
        {index}
      </div>,
    );
    for (const tune of tunes) {
      const ctxmenuOpen = ctxmenuOpenFor.value === tune.id;
      elems.push(
        <div className="tune" key={tune.id}>
          <div className="tune_name">{tune.name}</div>
          ctxmenu(tune, ctxmenuOpen, onCloseCtxMenu)
        </div>,
      );
    }
  }
  return <>{elems}</>;
};

function isEventOnLabel(e: Event) {
  const target = e.target as Element;
  return target.classList.contains("section_label");
}

function getBoundTune(e: Event): [Tune, Element] {
  const target = e.target as Element;
  const tuneDom = target.closest(".tune_name");
  return [tuneDom["tune-bound"] as Tune, tuneDom];
}

function onClickTune(e: Event) {
  if (isEventOnLabel(e)) return;
  const [tune, tuneDom] = getBoundTune(e);
  activateRipple(tuneDom, () => {
    // openTune(tune.id);
  });
}

function onContextMenuTune(e: Event) {
  if (isEventOnLabel(e)) return;
  const [tune] = getBoundTune(e);

  if (ctxmenuOpenFor.value !== tune.id) {
    ctxmenuOpenFor.value = tune.id;
    e.preventDefault();
  }
}

document.addEventListener("click", (e) => {
  if (!(e.target as HTMLElement).closest("#album_tune_list")) {
    ctxmenuOpenFor.value = null;
  }
});

function onCloseCtxMenu(e: Event) {
  ctxmenuOpenFor.value = null;
  e.stopPropagation();
}
