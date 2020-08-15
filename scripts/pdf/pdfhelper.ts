import { wait, run } from "../util/lazy";
import { DAO } from "../dao/dao";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

type TuneId = string;
type NestedPromiseArray<V> = Promise<Promise<V>[]>;

const wait_ms_fg = 100;

export class RenderingProcess {
  graphics: SVGElement[] = [];

  constructor(tuneId: TuneId) {
    run(async () => {
      for (const page of await getPages(tuneId)) {
        this.graphics.push(await page);
      }
    });
  }
}

export async function getPages(tuneId: TuneId): Promise<Promise<SVGElement>[]> {
  const document = await getDocument(tuneId);

  const lib = await import("./pdf-bridge");
  return lib.forEachPages(document, async (page, i) => {
    if (i >= 2) {
      await wait(wait_ms_fg);
    }
    return renderPage(page);
  });
}

async function getDocument(tuneId: TuneId): Promise<PDFDocumentProxy> {
  const bin = await DAO.getTuneContent(tuneId);
  const lib = await import("./pdf-bridge");
  return await lib.getDocument(bin);
}

async function renderPage(page: PDFPageProxy): Promise<SVGElement> {
  const lib = await import("./pdf-bridge");
  const svg = await lib.renderPdfPageAsSVG(page);
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.removeAttribute("preserveAspectRatio");
  return svg;
}
