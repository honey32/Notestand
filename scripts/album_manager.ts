import { getAlbumKanjiHint, KanjiHint, IndexedTunes } from "./search";
import { Tune } from "./tune";
import { State } from "./store";
import { AlbumManager, Album } from "./album";
import { run } from "./util/lazy";
import { parseArgs } from "./util/args";
import { DAO } from "./dao/dao";
import { BaseProperty, Observable } from "hojoki";

class AlbumLoadingProcess {
    name: Promise<string>
    kanjiHint: Promise<KanjiHint>
    tunes: Promise<IndexedTunes>

    constructor(albumId: string) {
        this.name =    DAO.getEntityName(albumId),
        this.kanjiHint = getAlbumKanjiHint(albumId),
        this.tunes = (async () => {
            const kanjiHint = await this.kanjiHint
            const tunes = await DAO.lookupTunesInAlbum(albumId)
            return kanjiHint.indexTunes(tunes)
        })()
    }
}

export class AlbumListManager {
    prefetcher = new Prefetcher()
    current: AlbumManager
    recentAlbums = new BaseProperty<Album[]>([])

    constructor(state: Observable<State>) {
        this.current = new AlbumManager(this)

        state.addEventListener((newValue) => {
            if (newValue == "Home" && this.current.id.value) { 
                this.prefetcher.refetch(this.current.id.value)
            }
        })
    }

    async init(): Promise<{ albumIdFromArg?: string }> {
        const loadAlbums = run(async () => {
            await this.syncRecentAlbums()
            this.recentAlbums.value.forEach(album => {
                this.prefetcher.fetch(album.id, true)
            })
        })
        
        const args = parseArgs()
        if (args.gdrive_id) {
            await loadAlbums
            const [,, id] = /(\?id=)?([^=]+)$/.exec(args.gdrive_id)
            return { albumIdFromArg: id }
        }
        return {}
    }

    async addAlbum(id: string): Promise<Album> {
        const album = new Album('', id)
        DAO.addAlbum(album)
        run(async() => {
            const name = await this.prefetcher.fetch(album.id, false).name
            DAO.renameAlbum(id, name)
            this.syncRecentAlbums()
        })
        return album
    }
    
    async syncRecentAlbums() {
        this.recentAlbums.value = await DAO.loadAlbumList()
    }
    
    removeAlbumFromRecent(a: Album) {
        DAO.deleteAlbum(a)
        this.syncRecentAlbums()
    }
    
    async open(albumId: string) {
        const identical = this.recentAlbums.value.find(it => it.id == albumId)
        if (identical)  {
            this.current.album.value = identical
        } else {
            this.current.album.value = await this.addAlbum(albumId)
        }   
    }

    checkIfOpened(albumId: string) {
        return this.current.album.value && this.current.id.value === albumId
    }

    getCurrentAlbumRenderer() {
        return this.prefetcher.fetch(this.current.id.value, false)
    }
}

class Prefetcher {
    prefetched = new Map<string, AlbumLoadingProcess>()

    fetch(albumId: string, isPrefetch: boolean): AlbumLoadingProcess {
        const ret = this.prefetched.get(albumId)
        
        if (ret) {
            if (!isPrefetch) {
                this.unprefetch(albumId)
            }
            return ret
        }

        const process = new AlbumLoadingProcess(albumId)

        if (isPrefetch && this.prefetched.size < 16) {
            this.prefetched.set(albumId, process)
        }

        return process
    }

    unprefetch(albumId: string) {
        this.prefetched.delete(albumId)
    }

    refetch(albumId: string) {
        this.unprefetch(albumId)
        this.fetch(albumId, false)
    }

    clearCache() {
        this.prefetched.clear()
    }
}

