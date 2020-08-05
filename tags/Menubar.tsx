import { h } from "maquette";
import { theme, Theme } from "../scripts/store";
import { _if } from "./utils";
import { activateRipple } from "./commons/ripple";
import { useLocale, MessageAsset } from "../scripts/i18n";
import { cross } from "./icon/icons";
// import { closeTune } from '../scripts/router';
import { Album } from "../scripts/album";
import { Tune } from "../scripts/tune";
import { DAO } from "../scripts/dao/dao";
import { showToast } from "../scripts/logic";
import { useEffect, useState, useCallback } from "react";
import { useQueryParam } from "../scripts/state";
import * as React from "react";

export const Menubar: React.FC = () => {
  const [i18n] = useLocale();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [q] = useQueryParam();
  const state = q.has("score") ? "Score" : "Album";
  const itemId = q.get("score") ?? q.get("album");
  useEffect(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (!(e.target as HTMLElement).closest("#menubar")) {
          setMenuOpen(false);
        }
      },
      false,
    );
  }, []);

  const onOpenScoreFile = useCallback(
    (e: React.MouseEvent) => {
      DAO.openOriginal({ id: itemId });
      activateRipple(e.target as HTMLElement, () => {
        setMenuOpen(false);
      });
    },
    [itemId],
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

      switch (theme.value) {
        case "blight":
          value = "dark";
          break;
        default:
          value = "blight";
      }

      theme.value = value;
    });
  }

  function onCopyCurrentUrl(e: React.MouseEvent) {
    activateRipple(e.target as HTMLElement, () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(document.URL);
        showToast(i18n.menu.toastCopiedCurrentUrl);
      }
    });
  }

  return (
    <div id="menubar" hidden={!isMenuOpen}>
      <div id="menu-close-button" onClick={onCloseMenu}>
        [cross()]
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
  onCloseCtxMenu: (e: React.MouseEvent) => void;
  i18n: MessageAsset;
}> = ({ item, shown, onCloseCtxMenu, i18n }) => {
  const onOpenScoreFile = (e: React.MouseEvent) => {
    DAO.openOriginal(item);
    activateRipple(e.target as HTMLElement, () => {
      // setMenuOpen(false);
    });
  };
  return (
    <div className="ctxmenu_wrap">
      {shown
        ? (
          <>
            <div className="ctxmenu" onClick={onCloseCtxMenu}></div>
            <div className="menu_item" onClick={onOpenScoreFile}>
              {i18n.menu.openOriginal}
            </div>
            <div className="menu_item menu_item_close" onClick={onCloseCtxMenu}>
              [cross()]
            </div>
          </>
        )
        : (
          <></>
        )}
    </div>
  );
};