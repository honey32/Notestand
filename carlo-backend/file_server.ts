import { createError, send, json } from 'micro';
import { router, get, ServerRequest, post } from 'microrouter';
import { join, basename } from 'path';
import { readFile, readdir } from 'fs';
import { promisify } from 'util';
import { ServerAction, Persistence } from './main';

const readdir_p = promisify(readdir)
const readFile_p = promisify(readFile)

const removeExt = (fileName: string) => {
    const lastDot = fileName.lastIndexOf('.')
    return fileName.substring(0, lastDot)
}

export const fileServer = ({albums, tunes}: Persistence, frontend: ServerAction) => {
    const getTunesInAlbum: ServerAction<ServerRequest> = async (req) => {
        const {albumId} = req.params
        const arr = await readdir_p(await albums.getAlbumRootdir(albumId))
        const isPdf = (name: string) => name.match(/\.pdf$/i)
        const toTune = async (fileName: string) => 
            ({ name: removeExt(fileName), ...await tunes.add(fileName) } as { name: string, id: string })
        return Promise.all(arr.filter(isPdf).map(toTune))
    }

    const getKanjiHInt: ServerAction<ServerRequest> = async (req) => {
        const {albumId} = req.params
        const path = join(await albums.getAlbumRootdir(albumId), '.notestand', 'kanjihint.txt')
        return await readFile_p(path, 'utf8').catch(() => "")
    }
    
    const getAlbum: ServerAction<ServerRequest> = async (req, res) => {
        const {albumId} = req.params
        try {
            const root = await albums.getAlbumRootdir(albumId)
            return { name: basename(root) }
        } catch(e) {
            throw createError(404, `Album ${albumId} not found`)
        }
    }

    const addAlbum: ServerAction<ServerRequest> = async (req) => {
        const jsonBody = await json(req)
        const rootdir = jsonBody['rootdir']
        return await albums.addAlbum(rootdir)
    }

    const getTune: ServerAction<ServerRequest> = async (req, res) => {
        const {albumId, tuneId} = req.params
        try {
            const albumRoot = await albums.getAlbumRootdir(albumId)
            const tuneFileName = await tunes.getPath(tuneId)
            const path = join(albumRoot, tuneFileName)
            res.setHeader('Content-Type', 'application/pdf');
            send(res, 200, await readFile_p(path))
        } catch(e) {
            if(typeof e === 'string' && e.startsWith('Not Found')) {
                throw createError(404, e)
            } else {
                throw e
            }
        }
    }

    return router(
        get('/api/albums/:albumId/tunes/:tuneId', getTune),
        get('/api/albums/:albumId/tunes/', getTunesInAlbum),
        get('/api/albums/:albumId/kanji-hint/', getKanjiHInt),
        get('/api/albums/:albumId', getAlbum),
        post('/api/albums/', addAlbum),
        get('*', frontend)
    )
}
        