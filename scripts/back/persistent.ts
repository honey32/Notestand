import { Album } from "../album";
const Dexie: new (s: string) => { version(i: number): any } = require('dexie').default.Dexie;

interface IAlbum {
    id: string,
    name: string
}

class MyDB extends Dexie {
    albums: any // Dexie.Table<IAlbum, string>
    constructor() {
        super('Notestand')
        this.version(1).stores({
            albums: 'id, name'
        })
    }
}

const db = new MyDB()

export namespace persistant {

    export async function albumExists(album: Album): Promise<boolean> {
        try {
            const data = await db.albums.get(album.id)
            return !!data
        } catch (e) {
            return false
        }
    }

    export async function addAlbum(album: Album): Promise<void> {
        const { id, name } = album
        db.albums.put({ id, name })
    }

    export async function renameAlbum(id: string, name: string): Promise<void>{
        db.albums.update(id, { name })
    }

    export function loadAlbumList(): Promise<Album[]> {
        return db.albums.toArray(vales => vales.map(Album.deserialize))
    }

    export async function deleteAlbum(a: Album): Promise<void> {
        db.albums.delete(a.id)
    }

}