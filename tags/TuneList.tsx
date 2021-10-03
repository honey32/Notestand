import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { useTuneList } from "../scripts/album_tunes";
import { IndexedTunes } from "../scripts/search";
import { useCurrentAlbumId, useQueryParam } from "../scripts/state";
import { Tune } from "../scripts/tune";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { activateRipple } from "./commons/ripple";
import { SignInButton } from "./home/AccountInfo";
import { Ctxmenu } from "./menubar";
import { useRecoilValue } from "recoil";
import { getScrollOriginElement } from "./utils";

type TuneId = string;
export const ctxMenuR = atom<string>({
  default: null,
  key: "ctxmenuOpenTune",
});

type AppState = "score" | "album" | "else"

const useTwin = <T extends unknown>(initial: [T, T]) => {
  const [[last, current], setTwin] = useState(initial);
  const update = React.useCallback((next: T) => 
    setTwin(([,current]) => [current, next])
  ,[])
  React.useDebugValue([last, current])
  return [last, current, update] as const
}

const useScrollRestore = () => {
  const [q] = useQueryParam();
  const [last, current, update] = useTwin<AppState>(["else", "else"])
  
  React.useEffect(() => {
    if(q.has("score")) {
      update("score")
    } else if(q.has("album")) {
      update("album")
    } else {
      update("else")
    }
  }, [q.has("score"), q.has("album"), update])
  
  const scrollValue = useRef(0);
  const id = useRef(0)

  React.useLayoutEffect(() => {
    const scrollOriginElement = getScrollOriginElement()
    if(current === "album") {
      const anime = () => {
        scrollValue.current = scrollOriginElement?.scrollTop
        id.current = requestAnimationFrame(anime)
      }
      setTimeout(anime, 1000)
    }
    return () => cancelAnimationFrame(id.current)
  }, [current])

  const cancel = React.useCallback(() => {
    cancelAnimationFrame(id.current)
  },[])

  React.useLayoutEffect(() => {
    const scrollOriginElement = getScrollOriginElement()
    
    if(last === "score" && current === "album") {
      requestAnimationFrame(() => {
        scrollOriginElement.scrollTop = scrollValue.current
      })
    }
  }, [last, current]);

  return cancel
}

export const TuneList: React.FC = () => {
  const [q] = useQueryParam();
  const { loading, tunes, indices } = useTuneList();
  const cancel = useScrollRestore();
  

  return (
    <div id="album_tune_list" hidden={q.has("score") || !q.has("album")}>
      <AlbumIndicies indices={indices} />
      <SignInButton />
      {loading ? <LoadingSpinner /> : <></>}
      <RenderListItems tunesIndexed={tunes} saveScroll={cancel}/>
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
  const target = tunesContainer.querySelector(
    `.section_label[data-anchor=${key}]`
  );
  
  target?.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};

const RenderListItems: React.FC<{ tunesIndexed: IndexedTunes, saveScroll }> = ({
  tunesIndexed,
  saveScroll
}) => {
  return (
    <div id="album_container_tunes">
      {Array.from(tunesIndexed).map(([index, tunes]) => (
        <React.Fragment key={index}>
          <div className="section_label" data-anchor={index}>
            {index}
          </div>
          {tunes.map((tune) => (
            <ItemTune key={tune.id} tune={tune} saveScroll={saveScroll}/>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const ItemTune: React.FC<{ tune: Tune, saveScroll: () => {} }> = ({ tune, saveScroll }) => {
  const [contextOpenFor, openContextMenu] = useRecoilState(ctxMenuR);
  const albumId = useCurrentAlbumId();
  const ctxmenuOpen = contextOpenFor === tune.id;
  const history = useHistory()
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const listener = (ev: MouseEvent | TouchEvent) => {
      const target = ev.target
      if(target instanceof Node) {
        if(!ref.current?.contains(target)) {
          if(!(target instanceof Element && target.closest(".tune_wrap"))) {
            openContextMenu(null)
          }
        }
      }
    }
    if(ctxmenuOpen) {
      window.addEventListener("click", listener)
      window.addEventListener("contextmenu", listener)
      window.addEventListener("touchstart", listener)
    }
    return () => {
      if(ctxmenuOpen) {
        window.removeEventListener("click", listener)
        window.removeEventListener("contextmenu", listener)
        window.removeEventListener("touchstart", listener)
    }
    }
  }, [ctxmenuOpen])

  return (
    <div className="tune_wrap" ref={ref}>
      <div 
        className="tune" 
        onClick={() => {
          saveScroll()
          history.push(`/view?score=${tune.id}&album=${albumId}`)
        }}
        onContextMenu={(e) =>{ e.preventDefault(); openContextMenu(tune.id); }}>
        <div className="tune_name">
          {tune.name}
        </div>
      </div>
      <Ctxmenu item={tune} shown={ctxmenuOpen} />
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
