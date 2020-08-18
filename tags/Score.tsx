import * as React from "react";
import { useEffect, useState } from "react";
import { getPages } from "../scripts/pdf/pdfhelper";
import { useCurrentScoreId, useQueryParam } from "../scripts/state";
import {
  pushAtIndex,
  removeFromArray,
  pushSafelyToArray,
} from "../scripts/util/immut";
import { run } from "../scripts/util/lazy";
import { diff, getClientPos } from "../scripts/util/vec2";
// import { openNextTune } from "../scripts/router";
import { LoadingSpinner } from "./commons/LoadingSpinner";

function useScorePages() {
  const [scoreFiles, setScoreFiles] = useState<Record<string, string[]>>({});
  return {
    scoreFiles,
    yieldPage(scoreId: string, value?: string) {
      setScoreFiles(pushAtIndex(scoreId, value));
    },
  };
}

function useLoadingStates() {
  const [value, setLoading] = useState<string[]>([]);
  return {
    value,
    startLoading(id: string) {
      setLoading(pushSafelyToArray(id));
    },
    finishLoading(id: string) {
      setLoading(removeFromArray(id));
    },
    isLoading(id: string) {
      return value.includes(id);
    },
  };
}
function useLoadingManager() {
  const { scoreFiles, yieldPage } = useScorePages();
  const { startLoading, finishLoading, isLoading } = useLoadingStates();
  const score = useCurrentScoreId();
  useEffect(() => {
    if (!score || Object.keys(scoreFiles).includes(score)) return;
    const process = getPages(score);
    startLoading(score);
    yieldPage(score, undefined);
    run(async () => {
      for (const p of await process) {
        const html = (await p).outerHTML;
        yieldPage(score, html);
      }
      finishLoading(score);
    });
  }, [score]);
  return {
    scores: Object.entries(scoreFiles).map(
      ([k, v]) => [k, v, isLoading(k)] as const,
    ),
  };
}

export const Scores: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [q] = useQueryParam();
  const { scores } = useLoadingManager();
  const [n, updator] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      updator((v) => v + 1);
    }, 1000);
  }, [n]);
  const isScoreShown = (id: string) => q.get("score") === id;

  return (
    <div id="scores_container" hidden={!q.has("score")}>
      {scores.map(([tune, rp, loading]) => (
        <Score
          key={tune}
          tuneId={tune}
          shown={isScoreShown(tune)}
          rp={rp}
          loading={loading}
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
        >
        </div>
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
