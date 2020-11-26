import * as React from "react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  useNextScore,
  useOpenScores,
  usePopupMessage,
} from "../scripts/scores";
import { useQueryParam } from "../scripts/state";
import { useThrottle } from "../scripts/util/hooks";
import { diff, getClientPos } from "../scripts/util/vec2";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { tabListOpenR } from "./MbTabList";
import { PdfDocument, useScoreLoader } from "./pdf/Document";

export const Scores: React.FC = () => {
  const msg = usePopupMessage();
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

const PopupMessage: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="popup_message" hidden={!msg}>
    {msg}
  </div>
);

const LoadingSpinnerWrapper: React.FC<{ hidden: boolean }> = ({ hidden }) => (
  <div className="score_loading_spinner_wrapper" hidden={hidden}>
    <LoadingSpinner />
  </div>
);

type ScoreProps = {
  tuneId: string;
  shown: boolean;
};
const Score: React.FC<ScoreProps> = ({ tuneId, shown }) => {
  const socreLoader = useScoreLoader(tuneId);
  const { completed, file } = socreLoader;

  return (
    <Swipeable className="score" hidden={!shown} tuneId={tuneId}>
      <LoadingSpinnerWrapper hidden={completed} />
      {file && <PdfDocument {...socreLoader} />}
    </Swipeable>
  );
};

type SwipeableProps = React.HTMLAttributes<HTMLElement> & { tuneId: string };
const Swipeable: React.FC<SwipeableProps> = ({
  children,
  tuneId,
  ...props
}) => {
  const [start, setStart] = useState<[number, number]>([0, 0]);
  const [lock, setLock] = useState(false);
  const setOpen = useSetRecoilState(tabListOpenR);
  const openNextScore = useNextScore();

  const touchStart = (e: React.TouchEvent) => {
    setOpen(false);
    setStart(getClientPos(e.touches[0]));
  };

  const handleOverSwipe = useThrottle((e: React.TouchEvent) => {
    if (lock) return;
    if (!(e.target instanceof Element)) return;

    const [dx, dy] = diff(getClientPos(e.touches[0]), start);
    const nearVertical = Math.abs(dx / (dy + 0.01)) < 1.0;

    let ward: "backward" | "forward";
    if (dy > 40 && nearVertical) {
      ward = "backward";
    } else if (dy < -40 && nearVertical) {
      ward = "forward";
    } else {
      return;
    }

    setLock(true);
    e.stopPropagation();
    openNextScore(tuneId, ward);
  }, 100);

  const releaseLock = (e: React.TouchEvent) => {
    e.preventDefault();
    setLock(false);
  };

  return (
    <div
      onTouchStart={touchStart}
      onTouchMove={handleOverSwipe}
      onTouchEnd={releaseLock}
      onTouchCancel={releaseLock}
      {...props}
    >
      {children}
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
