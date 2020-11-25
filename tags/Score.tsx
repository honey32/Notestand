import * as React from "react";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf/dist/umd/entry.parcel";
import { useQueryParam } from "../scripts/state";
import { run } from "../scripts/util/lazy";
import { diff, getClientPos } from "../scripts/util/vec2";
import { LoadingSpinner } from "./commons/LoadingSpinner";
import { DAO } from "../scripts/dao/dao";
import {
  useNextScore,
  useOpenScores,
  usePopupMessage,
} from "../scripts/scores";
import { useThrottle } from "../scripts/util/hooks";

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
  const { data, pages, completed, onLoadSuccess } = useScore(tuneId);
  const file = React.useMemo(() => ({ data }), [data]);
  const renderMode = "svg";

  return (
    <Swipeable className="score" hidden={!shown} tuneId={tuneId}>
      <LoadingSpinnerWrapper hidden={completed} />
      {data && (
        <MemoizedDocument
          {...{ tuneId, file, onLoadSuccess, renderMode, pages }}
        />
      )}
    </Swipeable>
  );
};

interface DocProps {
  tuneId: string;
  file: { data: Uint8Array };
  onLoadSuccess: (p: { numPages: number }) => void;
  renderMode: "svg";
  pages: number[];
}
const MemoizedDocument = React.memo<DocProps>(
  ({ file, onLoadSuccess, renderMode, pages }) => {
    return (
      <Document {...{ file, onLoadSuccess, renderMode }}>
        {pages.map((i) => (
          <PageStyled key={i} pageNumber={i} />
        ))}
      </Document>
    );
  },
  (p, n) =>
    p.tuneId === n.tuneId &&
    p.file.data === n.file.data &&
    p.pages.length === n.pages.length
);

function useScore(tuneId: string) {
  const [data, setData] = useState<Uint8Array>(null);
  const [numPages, setNumPages] = useState(0);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    run(async () => {
      setData(await DAO.getTuneContent(tuneId));
    });
  }, [tuneId]);
  const onLoadSuccess = React.useCallback(
    ({ numPages }: { numPages: number }) => {
      setCompleted(true);
      setNumPages(numPages);
    },
    []
  );
  function* range() {
    for (let i = 0; i < numPages; i++) {
      yield i + 1;
    }
  }
  const pages = Array.from(range());
  return { data, pages, completed, onLoadSuccess };
}

const PageStyled: React.FC<{ pageNumber: number }> = (props) => {
  const setPreserveAspRatio = () => {
    for (const e of document.querySelectorAll(
      'svg[preserveAspectRatio="none"]'
    )) {
      e.removeAttribute("preserveAspectRatio");
    }
  };
  return <Page {...props} onRenderSuccess={setPreserveAspRatio} />;
};

const Swipeable: React.FC<
  React.HTMLAttributes<HTMLElement> & { tuneId: string }
> = ({ children, tuneId, ...props }) => {
  const [start, setStart] = useState<[number, number]>([0, 0]);
  const [lock, setLock] = useState(false);
  const openNextScore = useNextScore();

  const touchStart = (e: React.TouchEvent) => {
    setStart(getClientPos(e.touches[0]));
  };

  const handleOverSwipe = useThrottle((e: React.TouchEvent) => {
    if (lock) return;
    if (!(e.target instanceof Element)) return;

    const [dx, dy] = diff(getClientPos(e.touches[0]), start);
    const action = (ward: "forward" | "backward") => {
      setLock(true);
      e.stopPropagation();
      openNextScore(tuneId, ward);
    };
    const nearVertical = Math.abs(dx / (dy + 0.01)) < 1.0;

    if (dy > 40 && nearVertical) {
      action("backward");
    }
    if (dy < -40 && nearVertical) {
      action("forward");
    }
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
