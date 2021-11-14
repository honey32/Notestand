import * as React from "react";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf/dist/umd/entry.parcel";
import { DAO } from "../../scripts/dao/dao";
import { run } from "../../scripts/util/lazy";

interface DocProps {
  file: { data: Uint8Array };
  onLoadSuccess: (p: { numPages: number }) => void;
  pages: number[];
}
export const PdfDocument: React.FC<DocProps> = React.memo(
  ({ pages, file, onLoadSuccess }) => {
    console.log("rerender");
    return (
      <Document {...{ file, onLoadSuccess }} renderMode="svg">
        {pages.map((i) => (
          <PageStyled key={i} pageNumber={i} />
        ))}
      </Document>
    );
  }
);

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

export function useScoreLoader(tuneId: string) {
  const file = useTuneContent(tuneId);
  const { numPages, completed, onLoadSuccess } = useLoadingState(tuneId);
  const pages = usePageIndices(numPages);
  return { file, pages, completed, onLoadSuccess };
}

interface DocumentFile {
  data: Uint8Array;
}
function useTuneContent(tuneId: string) {
  const [file, setFile] = useState<DocumentFile>(null);
  useEffect(() => {
    run(async () => {
      const data = await DAO.getTuneContent(tuneId);
      setFile({ data });
    });
  }, [tuneId]);
  return file;
}

function useLoadingState(tuneId: string) {
  const [numPages, setNumPages] = useState(0);
  const [completed, setCompleted] = useState(false);

  const _onLoadSuccess: DocProps["onLoadSuccess"] = ({ numPages }) => {
    setCompleted(true);
    setNumPages(numPages);
  };
  const onLoadSuccess = React.useCallback(_onLoadSuccess, [tuneId]);
  return { numPages, completed, onLoadSuccess };
}

function usePageIndices(num: number) {
  return React.useMemo(() => {
    function* range() {
      for (let i = 0; i < num; i++) {
        yield i + 1;
      }
    }
    return Array.from(range());
  }, [num]);
}
