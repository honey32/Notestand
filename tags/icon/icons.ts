import { h } from "maquette";

export function arrow() {
    return h('svg.icon.arrow', { viewBox: '0 0 100 100' }, [
        h('path', { d: 'M50 20 L20 50 L50 80' }),
        h('path', { d: 'M20 50 L80 50' })
    ])
}

export function hanburber() {
    return h('svg.icon.hamburger', { viewBox: '0 0 100 100'}, [
        h('path', { d: 'M18 22 L82 22' }),
        h('path', { d: 'M18 50 L82 50' }),
        h('path', { d: 'M18 78 L82 78' }),
    ])
}

export function cross() {
    return h('svg.icon.cross', { viewBox: '0 0 100 100'}, [
        h('path', { d: 'M20 20 80 80' }),
        h('path', { d: 'M20 80 80 20' }),
    ])
}

export function tabs() {
    return h('svg.icon.tabs', { viewBox: '0 0 100 100', innerHTML: '<path d="M25 81.25L25 90.63L87.5 90.63L87.5 21.88L25 21.88L25 81.25L12.5 81.25L12.5 9.38L76.09 9.38L76.09 21.78" id="e2uOPDlCAc"></path>'})
}