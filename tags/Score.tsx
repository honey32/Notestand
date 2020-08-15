import { Tune } from "../scripts/tune";
import { scoreManager } from "../scripts/store";
// import { openNextTune } from "../scripts/router";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { run, throttled } from "../scripts/util/lazy";
import { BaseProperty } from "hojoki";
import { diff, getClientPos } from "../scripts/util/vec2";
import { useState } from "react";
import * as React from "react";
import { useQueryParam } from "../scripts/state";

const loadingManager = run(() => {
  const map = new BaseProperty(new Map<string, boolean>());
  return {
    isLoading(tune: Tune): boolean {
      return map.value.get(tune.id) || false;
    },
    setLoading(tune: Tune, on_off: "on" | "off") {
      map.mutate((m) => m.set(tune.id, on_off === "on"));
    },
  };
});

export const Scores: React.FC = () => {
  const [scores] = useState<Tune[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [q] = useQueryParam();
  return (
    <div id="scores_container" hidden={!q.has("score")}>
      {scores.map((tune) => (
        <Score tune={tune} shown={false} />
      ))}
      <PopupMessage msg={msg} />
    </div>
  );
};

const PopupMessage: React.FC<{ msg: string }> = ({ msg }) => {
  return (
    <div className="popup_message" hidden={!msg}>
      {msg}
    </div>
  );
};

const Score: React.FC<{ tune: Tune; shown: boolean }> = ({ tune, shown }) => {
  return (
    <div
      className="score"
      key={tune.id}
      // afterCreate: setRenderingHook
      // onTouchstart={touchStart}
      // onTouchmove={handleOverSwipe}
      hidden={!shown}
    >
      loadingManager.isLoading(tune) ?
      <div className="score_loading_spinner_wrapper">loadingSpinner(),</div>
    </div>
  );
};

async function setRenderingHook(this: Tune, elem: Element) {
  elem.addEventListener("touchstart", touchStart);
  elem.addEventListener("touchmove", throttled(handleOverSwipe, 100));
  elem.addEventListener("touchend", releaseLock);
  elem.addEventListener("touchcancel", releaseLock);
  loadingManager.setLoading(this, "on");
  const renderingProcess = scoreManager.getRenderingProcess(this);
  for (const page of await renderingProcess.graphics) {
    elem.appendChild(await page);
  }
  loadingManager.setLoading(this, "off");
}

let start: [number, number] = [0, 0];
let lock = false;

function touchStart(e: TouchEvent) {
  start = getClientPos(e.touches[0]);
}

function handleOverSwipe(e: TouchEvent) {
  if (lock) return;
  if (!(e.target instanceof Element)) return;

  const [dx, dy] = diff(getClientPos(e.touches[0]), start);
  const action = (ward: "forward" | "backward") => {
    lock = true;
    e.stopPropagation();
    // openNextTune(ward);
  };
  const nearVertical = Math.abs(dx / (dy + 0.01)) < 1.0;

  if (dy > 40 && nearVertical) {
    action("backward");
  }
  if (dy < -40 && nearVertical) {
    action("forward");
  }
}

function releaseLock(e: Event) {
  e.preventDefault();
  lock = false;
}
