import * as pdfjs from "pdfjs-dist";

window["PDFJS"].workerSrc = "/app/pdf.worker.min.js";

export type Document = {
  numPages: number;
  getPage(num: number): PdfPage;
};

export type PdfPage = {
  getOperatorList(): Promise<OpList>;
  getViewport(scale: number, rotation: number): Viewport;
  commonObjs: PdfObjects;
  objs: PdfObjects;
};

type OpList = {};

type Viewport = {};

type PdfObjects = {};

type SVGGraphicsCtor = {
  new (commonObjs: PdfObjects, objects: PdfObjects): SVGGraphics;
};

type SVGGraphics = {
  getSVG(opList: OpList, viewPort: Viewport): SVGElement;
};

export const SVGGraphics: SVGGraphicsCtor = pdfjs.SVGGraphics;

export function getDocument(arr: Uint8Array): Document {
  return pdfjs.getDocument(arr);
}

type ViewportOptions = {
  scale: number;
  rotation: number;
};

export async function renderPdfPageAsSVG(
  page: PdfPage,
  option: ViewportOptions = { scale: 1, rotation: 0 }
): Promise<SVGElement> {
  const opList = page.getOperatorList();
  const viewport = page.getViewport(option.scale, option.rotation);
  const svggfx = new SVGGraphics(page.commonObjs, page.objs);
  return svggfx.getSVG(await opList, viewport);
}

export async function forEachPages<R>(
  document: Document,
  fn: (page: PdfPage, idx?: number) => Promise<R>
) {
  const result = Array<Promise<R>>(document.numPages);
  for (let i = 0; i < document.numPages; i++) {
    result[i] = fn(await document.getPage(i + 1), i + 1);
  }
  return result;
}
