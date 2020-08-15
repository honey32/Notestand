import { Tune } from "../scripts/tune";
import { scoreManager, state } from "../scripts/store";
// import { openNextTune } from "../scripts/router";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { run, throttled } from "../scripts/util/lazy";
import { BaseProperty } from "hojoki";
import { diff, getClientPos } from "../scripts/util/vec2";
import { useState, useEffect } from "react";
import * as React from "react";
import { useQueryParam, useCurrentScoreId } from "../scripts/state";
import { RenderingProcess, getPages } from "../scripts/pdf/pdfhelper";

function pushAtIndex<V>(r: Record<string, V[]>, key: string, value?: V) {
  if (r[key] === undefined && value === undefined) {
    return { ...r, [key]: [] };
  }
  if (value === undefined) {
    return r;
  }
  const arr = r[key] ?? [];
  return { ...r, [key]: [...arr, value] };
}

function removeFromArray<V>(arr: V[], value: V) {
  const set = new Set(arr);
  set.delete(value);
  return Array.from(set);
}

function useLoadingManager() {
  const [value, setValue] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<string[]>([]);
  const score = useCurrentScoreId();
  useEffect(() => {
    if (!score || Object.keys(value).includes(score)) return;
    const process = getPages(score);
    setLoading((v) => [...v, score]);
    setValue((v) => pushAtIndex(v, score));
    run(async () => {
      for (const p of await process) {
        const html = (await p).outerHTML;
        setValue((v) => pushAtIndex(v, score, html));
      }
      setLoading((v) => removeFromArray(v, score));
    });
  }, [score]);
  return {
    scores: value,
    isLoading(id: string) {
      return loading.includes(id);
    },
  };
}

export const Scores: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [q] = useQueryParam();
  const { scores, isLoading } = useLoadingManager();
  const [n, updator] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      updator((v) => v + 1);
    }, 1000);
  }, [n]);

  return (
    <div id="scores_container" hidden={!q.has("score")}>
      {Object.entries(scores).map(([tune, rp]) => (
        <Score
          key={tune}
          tuneId={tune}
          shown={q.get("score") === tune}
          rp={rp}
          loading={isLoading(tune)}
        />
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

type ScoreProps = {
  tuneId: string;
  shown: boolean;
  rp: string[];
  loading: boolean;
};
const Score: React.FC<ScoreProps> = ({ tuneId, shown, rp, loading }) => {
  return (
    <div
      className="score"
      key={tuneId}
      // afterCreate: setRenderingHook
      // onTouchstart={touchStart}
      // onTouchmove={handleOverSwipe}
      hidden={!shown}
    >
      <div className="score_loading_spinner_wrapper" hidden={!loading}>
        <LoadingSpinner />
      </div>
      {rp.map((page, idx) => (
        <div
          key={idx}
          className="svg_wrapper"
          dangerouslySetInnerHTML={{
            __html: page,
          }}
        ></div>
      ))}
    </div>
  );
};

// async function setRenderingHook(this: Tune, elem: Element) {
//   elem.addEventListener("touchstart", touchStart);
//   elem.addEventListener("touchmove", throttled(handleOverSwipe, 100));
//   elem.addEventListener("touchend", releaseLock);
//   elem.addEventListener("touchcancel", releaseLock);
//   loadingManager.setLoading(this, "on");
//   const renderingProcess = scoreManager.getRenderingProcess(this);
//   for (const page of await renderingProcess.graphics) {
//     elem.appendChild(await page);
//   }
//   loadingManager.setLoading(this, "off");
// }

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
