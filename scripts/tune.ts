export class Tune {
    constructor(public name: string, public id: string) {}

    static createFromFile(file: {name: string, id: string}) {
        const result = /(.*)\.[^.]*$/.exec(file.name)
        return new Tune(result[1] || file.name, file.id)
    }
}