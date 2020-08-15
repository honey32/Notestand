import {
  GlobalWorkerOptions,
  PDFPageProxy,
  ViewportParameters,
  PDFDocumentProxy,
} from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";

// window["PDFJS"].workerSrc = "/app/pdf.worker.min.js";
GlobalWorkerOptions.workerSrc = "/app/pdf.worker.min.js";

type OpList = {};

type Viewport = {};

type PdfObjects = {};

type SVGGraphicsCtor = {
  new (commonObjs: PdfObjects, objects: PdfObjects): SVGGraphics;
};

type SVGGraphics = {
  getSVG(opList: OpList, viewPort: Viewport): SVGElement;
};

// @ts-ignore
const SVGGraphics: SVGGraphicsCtor = pdfjs.SVGGraphics;

export async function getDocument(arr: Uint8Array) {
  return pdfjs.getDocument(arr).promise;
}

export async function renderPdfPageAsSVG(
  page: PDFPageProxy,
  option: ViewportParameters = { scale: 1, rotation: 0 }
): Promise<SVGElement> {
  // @ts-ignore
  const opList = page.getOperatorList();
  const viewport = page.getViewport(option);
  // @ts-ignore
  const svggfx = new SVGGraphics(page.commonObjs, page.objs);
  return svggfx.getSVG(await opList, viewport);
}

export async function forEachPages<R>(
  document: PDFDocumentProxy,
  fn: (page: PDFPageProxy, idx?: number) => Promise<R>
) {
  const result = Array<Promise<R>>(document.numPages);
  for (let i = 0; i < document.numPages; i++) {
    result[i] = fn(await document.getPage(i + 1), i + 1);
  }
  return result;
}
