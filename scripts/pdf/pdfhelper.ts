import { wait } from '../util/lazy';
import { Tune } from '../tune';
import { Document, PdfPage } from './pdf-bridge';
import { DAO } from '../dao/dao';

type NestedPromiseArray<V> = Promise<Promise<V>[]>

const wait_ms_fg = 100;

export class RenderingProcess {
    graphics: NestedPromiseArray<SVGElement>

    constructor (tune: Tune) {
      this.graphics = this.getPages(tune);
    }

    async getPages (tune: Tune): NestedPromiseArray<SVGElement> {
      const document = await this.getDocument(tune);

      const lib = await import('./pdf-bridge');
      return lib.forEachPages(document, async (page, i) => {
        if (i >= 2) {
          await wait(wait_ms_fg);
        }
        return this.renderPage(page);
      });
    }

    async getDocument (tune: Tune): Promise<Document> {
      const bin = await DAO.getTuneContent(tune.id);
      const lib = await import('./pdf-bridge');
      return lib.getDocument(bin);
    }

    async renderPage (page: PdfPage): Promise<SVGElement> {
      const lib = await import('./pdf-bridge');
      const svg = await lib.renderPdfPageAsSVG(page);
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.removeAttribute('preserveAspectRatio');
      return svg;
    }
}
