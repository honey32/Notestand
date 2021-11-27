import { Tune } from '../tune';
import { Album } from '../album';
import { DAO_WEB } from './dao_web';

export interface DAO_Main {
    getKanjiHintNotation(albumId: string): Promise<string>
    lookupTunesInAlbum(albumId: string): Promise<Tune[]>
    getEntityName(albumId: string): Promise<string>
    getTuneContent(tuneId: string): Promise<Uint8Array>
    openOriginal(item: {id: string}): Promise<void>
}

export interface DAO_Albums {
    albumExists(album: Album | {id: string}): Promise<boolean>
    addAlbum(album: Album): Promise<void>
    renameAlbum(id: string, name: string): Promise<void>
    loadAlbumList(): Promise<Album[]>
    deleteAlbum(a: Album): Promise<void>
}

export type DAO = DAO_Main & DAO_Albums

export const DAO: DAO = DAO_WEB();
