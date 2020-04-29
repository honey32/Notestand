import { basename, join } from "path";
import { getAppDataPath } from "appdata-path"
import { readFile, appendFile, statSync, writeFile, mkdir } from "fs";
import { promisify } from "util";
import { digDir, fileExists } from "./file_util";
import { wait } from "../scripts/util/lazy";

const readFileP = promisify(readFile)
const appendFileP = promisify(appendFile)
const writeFileP = promisify(writeFile)
const mkdirP = promisify(mkdir)

function uniqueId() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    for(let i = 0; i < 12; i++) {
        const idx = Math.random() * (chars.length - 1)
        id += chars.charAt(idx)
    }
    return id
}

export class AlbumIdStore {
    path: string
    private flagAccess: boolean = false
    cache = new Map<string, string>()
    constructor() {
        const dir = getAppDataPath('notestand')
        this.path = join(dir, 'itemid.csv')
        if(!fileExists(this.path)) {
            this.flagAccess = true
            digDir(dir).then(async () => {
                await writeFileP(this.path, '')
                this.flagAccess = false
            })
        }
    }

    async waitInit(ms: number = 50) {
        if(this.flagAccess) {
            if(ms < 1000 * 10) { throw "AlbumIdStore Init Timeout" }
            await wait(ms)
            await this.waitInit(ms * 2)
        }
    }

    async addAlbum(rootdir: string): Promise<{id: string}> {
        const id = uniqueId()
        await this.waitInit()
        await appendFileP(this.path, `\n${id} , ${rootdir}`, 'utf8')
        return { id }
    }
    async getAlbumRootdir(id: string): Promise<string> {
        const content = await readFileP(this.path, 'utf-8')
        const lines = content.split(/\r\n|\n/)
        for(const line of lines) {
            const split = line.split(',')
            if(split.length >= 2) {
                const key = split[0].trim()
                if(id === key) {
                    return split[1].trim()
                }
            }
        }
        throw `Not Found id: ${id}`
    }
}

export class TempolaryIdStore {
    map = new Map<string, string>()
    
    add(path: string): {id: string} {
        const id = uniqueId()
        this.map.set(id, path)
        return {id}
    }

    getPath(id: string): string {
        return this.map.get(id)
    }
}