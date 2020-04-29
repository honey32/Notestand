export function activateRipple(target: Element, action: () => void) {
    target.classList.add("ripple-active")
    setTimeout(() => {
        action()
        target.classList.remove("ripple-active")
    }, 200)
}