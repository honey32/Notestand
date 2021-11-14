import { DAO_Main, DAO } from './dao';
import { Tune } from '../tune';
import { persistant } from '../back/persistent';
import { albumManager } from '../store';

class _DAO_Carlo implements DAO_Main {
  async getKanjiHintNotation (albumId: string): Promise<string> {
    const res = await fetch(`/api/albums/${albumId}/kanji-hint/`);
    return await res.text();
  }

  async lookupTunesInAlbum (albumId: string): Promise<Tune[]> {
    const res = await fetch(`/api/albums/${albumId}/tunes/`);
    const arr = await res.json() as any[];
    return arr.map(file => new Tune(file.name, file.id));
  }

  async getEntityName (albumId: string): Promise<string> {
    const res = await fetch(`/api/albums/${albumId}`);
    const json = await res.json();
    return json.name;
  }

  async getTuneContent (tuneId: string): Promise<Uint8Array> {
    const albumId = albumManager.current.id.value;
    const res = await fetch(`/api/albums/${albumId}/tunes/${tuneId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async openOriginal (item: { id: string; }): Promise<void> {
    // TODO
  }
}

export function DAO_Carlo (): DAO {
  return Object.assign(new _DAO_Carlo(), persistant);
}
