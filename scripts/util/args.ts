export function parseArgs(): {[key: string]: string} {
    const arg = {}

    const pair=location.search.substring(1).split('&')
    
    for(let i = 0; pair[i]; i++) {
        const [k, v] = pair[i].split('=')
        arg[k] = v
    }

    return arg
}
