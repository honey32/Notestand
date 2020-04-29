import { Tune } from "./tune";
import { DAO } from "./dao/dao";

function pipe(s: string, fns: ((s: string) => string)[]) {
    let current = s
    for (const fn of fns) {
        current = fn(current)
    }
    return current
}

export class IndexedTunes implements Iterable<[string, Tune[]]> {
    indices: string[]

    constructor(
        private tunesIndexed: { [index: string]: Tune[] } = {}
    ) {
        this.indices = Object.keys(this.tunesIndexed)
    }
    
    *[Symbol.iterator]() { 
        for(const i of this.indices) {
            yield [i, this.tunesIndexed[i]] as [string, Tune[]]
        }
    }

    *getTunesSorted() {
        for(const i of this.indices) {
            yield* this.tunesIndexed[i]
        }
    }
}

export class KanjiHint {
    private cache: { [key: string]: string } = Object.create(null)
    
    constructor(private transformTable: ((s: string) => string)[]) {}

    private transform(s: string) {
        const cached = this.cache[s]
        
        if (cached) {
            return this.cache[s]
        }

        const result = pipe(s, this.transformTable)
        this.cache[s] = result
        return result
    }

    private getIndexName(tune: Tune): string {
        return pipe(tune.name, [
            name => 
                name.replace(/[ァ-ン]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60)),
            name => this.transform(name)
        ])
    }

    private getSectionIndex(tune: Tune): string {
        const name = this.getIndexName(tune)

        if (/^[ぁ-お]/.test(name)) { return "あ" }
        if (/^[か-ご]/.test(name)) { return "か" }
        if (/^[さ-ぞ]/.test(name)) { return "さ" }
        if (/^[た-ど]/.test(name)) { return "た" }
        if (/^[な-の]/.test(name)) { return "な" }
        if (/^[は-ぽ]/.test(name)) { return "は" }
        if (/^[ま-も]/.test(name)) { return "ま" }
        if (/^[ゃ-よ]/.test(name)) { return "や" }
        if (/^[ら-ろ]/.test(name)) { return "ら" }
        if (/^[ゎ-ん]/.test(name)) { return "わ" }
        if (name === "ゔ") { return "ゔ" }

        return name.charAt(0)
    }

    indexTunes(tunes: Tune[]): IndexedTunes {
        const mapping: {[k: string]: string} = {}
        tunes.forEach(t => mapping[t.id] = this.getSectionIndex(t))
        tunes.sort((a, b) => this.transform(a.name).localeCompare(this.transform(b.name)))
        const grouped: {[idx: string]: Tune[] } = {}
        for(const t of tunes) {
            const i = mapping[t.id]
            if(grouped[i] === undefined) { grouped[i] = [] }
            grouped[i].push(t)
        }
        return new IndexedTunes(grouped)
    }
}

function* parseKanjiHintText(lines: string) {
    for (const line of lines.split(/\r\n|\n|\r/)) {
        try {
            const [_, key, value] = /^([^:]+):\s*(.+)$/.exec(line)
            const regexp = RegExp(key)
            yield (s: string) => regexp.test(s) ? s.replace(regexp, value) : s
        } catch (e) {}
    }
}

export async function getAlbumKanjiHint(albumId: string): Promise<KanjiHint> {
    const content = await DAO.getKanjiHintNotation(albumId).catch(() => null)
    return new KanjiHint(content ? Array.from(parseKanjiHintText(content)): [])
}