import { mkdir, statSync, PathLike } from "fs";
import { promisify } from "util";
import { join } from "path";

const mkdirP = promisify(mkdir)

export async function digDir(parent: string, ...path: string[]): Promise<string> {
    let p = parent
    if(fileExists(p)) {
        await mkdirP(p)
    }
    for(let i = 0; i < path.length; i++) {
        p = join(p, path[i])
        if(fileExists(p)) {
            await mkdirP(p)
        }
    }
    return p
}

export function fileExists(path: PathLike): boolean {
    try {
        statSync(path)
        return true
    } catch(e) {
        if(e.code === 'ENOENT') {
            return false
        }
    }
}