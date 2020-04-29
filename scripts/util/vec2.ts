export type Vec2 = [number, number]

export function getClientPos(t: { clientX: number, clientY: number }): Vec2 {
    return [t.clientX, t.clientY]
}

export function diff(l: Vec2, r: Vec2) {
    return [l[0] - r[0], l[1] - r[1]]
}

export function abs(v: Vec2) {
    return Math.sqrt(v[0] ** 2 + v[1] ** 2)
}