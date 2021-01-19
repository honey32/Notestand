import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { Album } from "../scripts/album";
import { DAO } from "../scripts/dao/dao";
import { useLocale } from "../scripts/i18n";
import { useQueryParam } from "../scripts/state";
import { Theme } from "../scripts/store";
import { Tune } from "../scripts/tune";
import { activateRipple } from "./commons/ripple";
import { Cross } from "./icon/icons";
import { ctxMenuR } from "./TuneList";
import { useGlobalEventListener } from "./utils";

export const menuOpenR = atom({
  key: "menu-open",
  default: false,
});

function useMenuOpenState(): [boolean, (b: boolean) => void, () => boolean] {
  const [isMenuOpen, setMenuOpen] = useRecoilState(menuOpenR);
  const isMenuOpenDyn = useRef<boolean>();
  useEffect(() => {
    isMenuOpenDyn.current = isMenuOpen;
  }, [isMenuOpen]);
  return [isMenuOpen, setMenuOpen, () => isMenuOpenDyn.current];
}

export const Menubar: React.FC = () => {
  const [i18n] = useLocale();
  const [isMenuOpen, setMenuOpen, getIsMenuOpen] = useMenuOpenState();
  const [q] = useQueryParam();
  const state = q.has("score") ? "Score" : "Album";
  const itemId = q.get("score") ?? q.get("album");

  useGlobalEventListener(
    () => document,
    "click",
    (e) => {
      if (!(e.target as HTMLElement).closest("#menubar") && getIsMenuOpen()) {
        setMenuOpen(false);
        e.preventDefault();
      }
    },
    false
  );

  const onOpenScoreFile = useCallback(
    (e: React.MouseEvent) => {
      DAO.openOriginal({ id: itemId });
      activateRipple(e.target as HTMLElement, () => {
        setMenuOpen(false);
      });
    },
    [itemId]
  );

  function onCloseTab(e: React.MouseEvent) {
    activateRipple(e.target as HTMLElement, () => {
      // closeTune(scoreManager.viewed.value);
    });
  }

  function onCloseMenu(e: React.MouseEvent) {
    activateRipple(e.target as HTMLElement, () => {
      setMenuOpen(false);
    });
  }

  function onToggleTheme(e: React.MouseEvent) {
    activateRipple(e.target as HTMLElement, () => {
      let value: Theme;

      // switch (theme.value) {
      //       case "blight":
      //         value = "dark";
      //         break;
      //       default:
      //         value = "blight";
      //     }

      //     theme.value = value;
    });
  }

  function onCopyCurrentUrl(e: React.MouseEvent) {
    activateRipple(e.target as HTMLElement, () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(document.URL);
        // showToast(i18n.menu.toastCopiedCurrentUrl);
      }
    });
  }

  return (
    <div id="menubar" hidden={!isMenuOpen}>
      <div id="menu-close-button" onClick={onCloseMenu}>
        <Cross />
      </div>
      ,
      <div className="menu_item" onClick={onOpenScoreFile}>
        {i18n.menu.openOriginal}
      </div>
      <div
        className="menu_item"
        hidden={state !== "Score"}
        onClick={onCloseTab}
      >
        {i18n.menu.closeScore}
      </div>
      <div className="menu_item" onClick={onToggleTheme}>
        {i18n.menu.toggleTheme}
      </div>
      <div className="menu_item" onClick={onCopyCurrentUrl}>
        {i18n.menu.copyCurrentUrl}
      </div>
    </div>
  );
};

export const Ctxmenu: React.FC<{
  item: Album | Tune;
  shown: boolean;
}> = ({ item, shown }) => {
  const setContextMenu = useSetRecoilState(ctxMenuR);
  const [i18n] = useLocale();
  const onOpenScoreFile = (e: React.MouseEvent) => {
    DAO.openOriginal(item);
    activateRipple(e.target as HTMLElement, () => {
      // setMenuOpen(false);
    });
  };
  const onCloseCtxMenu = (e) => {
    setContextMenu("");
  };
  return (
    <div className="ctxmenu_wrap">
      {shown ? (
        <>
          <div className="ctxmenu" onClick={onCloseCtxMenu}></div>
          <div className="menu_item" onClick={onOpenScoreFile}>
            {i18n.menu.openOriginal}
          </div>
          <div className="menu_item menu_item_close" onClick={onCloseCtxMenu}>
            <Cross />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
