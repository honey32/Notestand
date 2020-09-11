import * as React from "react";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf/dist/umd/entry.parcel";
import { useQueryParam } from "../scripts/state";
import { run } from "../scripts/util/lazy";
import { diff, getClientPos } from "../scripts/util/vec2";
// import { openNextTune } from "../scripts/router";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { DAO } from "../scripts/dao/dao";
import { useOpenScores } from "../scripts/scores";
import { useGlobalEventListener } from "./utils";

export const Scores: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [q] = useQueryParam();
  const scores = useOpenScores();
  const isScoreShown = (id: string) => q.get("score") === id;

  return (
    <div id="scores_container" hidden={!q.has("score")}>
      {scores.map((tune) => (
        <Score key={tune.id} tuneId={tune.id} shown={isScoreShown(tune.id)} />
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
};
const Score: React.FC<ScoreProps> = ({ tuneId, shown }) => {
  return (
    <div
      className="score"
      // onTouchstart={touchStart}
      // onTouchmove={handleOverSwipe}
      hidden={!shown}
    >
      <ScoreContents tuneId={tuneId} />
    </div>
  );
};

function useScore(tuneId: string) {
  const [data, setData] = useState<Uint8Array>(null);
  const [numPages, setNumPages] = useState(0);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    run(async () => {
      setData(await DAO.getTuneContent(tuneId));
    });
  }, [tuneId]);
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setCompleted(true);
    setNumPages(numPages);
  };
  function* range() {
    for (let i = 0; i < numPages; i++) {
      yield i + 1;
    }
  }
  const pages = Array.from(range());
  return { data, pages, completed, onLoadSuccess };
}

const ScoreContents = React.memo<{ tuneId: string }>(({ tuneId }) => {
  const { data, pages, completed, onLoadSuccess } = useScore(tuneId);
  return (
    <>
      <div className="score_loading_spinner_wrapper" hidden={completed}>
        <LoadingSpinner />
      </div>
      {data ? (
        <Document
          file={{ data }}
          onLoadSuccess={onLoadSuccess}
          renderMode="svg"
        >
          {pages.map((i) => (
            <Page
              key={i}
              pageNumber={i}
              onRenderSuccess={setPreserveAspRatio}
            />
          ))}
        </Document>
      ) : (
        <></>
      )}
    </>
  );
});

function setPreserveAspRatio() {
  for (const e of document.querySelectorAll(
    'svg[preserveAspectRatio="none"]'
  )) {
    e.removeAttribute("preserveAspectRatio");
  }
}

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
