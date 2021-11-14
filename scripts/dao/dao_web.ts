import { DAO_Main, DAO } from './dao';
import { Tune } from '../tune';
import { GDrive, GDriveFile } from '../back/gdrive';
import { persistant } from '../back/persistent';
import { safeExec } from '../util/regex';

class _DAO_WEB implements DAO_Main {
  async getKanjiHintNotation (albumId: string): Promise<string> {
    const notestand = await GDrive.findOneFile(`'${albumId}' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder' and name contains 'notestand'`);

    if (!notestand) { return ''; }

    const kanjihintFile = await GDrive.findOneFile(`'${notestand.id}' in parents and trashed = false and name contains 'kanjihint'`);

    if (!kanjihintFile) { return ''; }

    return await GDrive.getContent(kanjihintFile.id);
  }

  async lookupTunesInAlbum (albumId: string): Promise<Tune[]> {
    const files: GDriveFile[] = await GDrive.listFiles(
            `'${albumId}' in parents and trashed = false and mimeType = 'application/pdf'`
    ).catch((reason) => (console.log(`error: ${reason}`), []));
    return files.map(Tune.createFromFile);
  }

  async getEntityName (id: string): Promise<string> {
    const file = await GDrive.getFileItself(id);
    return safeExec(/(.*)\.[^.]*$/, file.name).getOrElse(1, file.name);
  }

  getTuneContent (tuneId: string): Promise<Uint8Array> {
    return GDrive.getContent(tuneId, 'typed-array');
  }

  async openOriginal (item: { id: string; }): Promise<void> {
    window.open(`https://drive.google.com/open?id=${item.id}`, '_blank');
  }
}

export function DAO_WEB (): DAO {
  return Object.assign(new _DAO_WEB(), persistant);
}
