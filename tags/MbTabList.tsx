import * as React from "react";
import { useEffect, useState } from "react";
import { Tune } from "../scripts/tune";
import { Cross } from "./icon/icons";
import { useGlobalEventListener } from "./utils";
import { atom } from "recoil";
import { useRecoilState } from "recoil";

export const tabListOpenR = atom<boolean>({
  key: "mobile_tablist_open",
  default: false,
});

export const MbTabList: React.FC<{ scores: Tune[] }> = ({ scores }) => {
  const [isTabListOpen, setTabListOpen] = useRecoilState(tabListOpenR);
  useGlobalEventListener(
    document,
    "click",
    (e) => {
      const elem = e.target as HTMLElement;
      if (!elem.closest(".mob_tab_list, .mob_tablist_open_button")) {
        console.log("close");
        setTabListOpen(false);
      }
    },
    false
  );

  return (
    <div className="mob_tab_list" hidden={!isTabListOpen}>
      {scores.map((tune) => (
        <div className="tab" key={tune.id}>
          <div className="tab_name">{tune.name}</div>
          <div className="tab_close_button">
            <Cross />
          </div>
        </div>
      ))}
    </div>
  );
};

function onclick(e: Event) {
  const target = e.target as HTMLElement;
  // e.stopPropagation();
  // const elemCloseButton = target.closest(".tab_close_button");
  // if (elemCloseButton) {
  //   activateRipple(elemCloseButton, () => {
  //     closeTune(target.closest(".tab")["bound-tab"] as Tune);
  //     isTabListOpen.value = scoreManager.scores.value.length > 0;
  //   });
  //   return true;
  // }
  // const elemTab = target.closest(".tab");
  // if (elemTab) {
  //   activateRipple(elemTab, () => {
  //     openTune((elemTab["bound-tab"] as Tune).id);
  //     isTabListOpen.value = false;
  //   });
  // }
}
