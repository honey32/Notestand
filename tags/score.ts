import { Tune } from "../scripts/tune";
import { h } from "maquette";
import { scoreManager } from "../scripts/store";
import { flatmap, _if } from "./utils";
import { openNextTune } from "../scripts/router";
import { loadingSpinner } from "./commons/load_spinner";
import { run, throttled } from "../scripts/util/lazy";
import { BaseProperty } from "hojoki";
import { diff, getClientPos } from "../scripts/util/vec2";

const loadingManager = run(() => {
    const map = new BaseProperty(new Map<string, boolean>())
    return {
        isLoading(tune: Tune): boolean {
            return map.value.get(tune.id) || false        
        },
        setLoading(tune: Tune, on_off: 'on' | 'off') {
            map.mutate(m => m.set(tune.id, on_off === 'on'))
        }
    }
})

export function scores() {
    return h("div#scores_container",[ 
            ...flatmap(scoreManager.scores.value, tune => [ score(tune) ]),
            popupMessage()
    ])
}

function popupMessage() {
    return h("div.popup_message", { classes: { hidden : !scoreManager.showsPopup.value } }, [
        scoreManager.popupMsg.value
    ])
}

function score(tune: Tune) {
    return h("div.score", {
        key: tune, bind: tune, afterCreate: setRenderingHook, ontouchstart: touchStart, ontouchmove: handleOverSwipe,
        classes: { hidden: !scoreManager.isViewed(tune) } }, [
            ..._if(loadingManager.isLoading(tune), 
                h("div.score_loading_spinner_wrapper", [ 
                    loadingSpinner()
                ])
            ),
        ])
}

async function setRenderingHook(this: Tune, elem: Element) {
    elem.addEventListener('touchstart', touchStart)
    elem.addEventListener('touchmove', throttled(handleOverSwipe, 100))
    elem.addEventListener('touchend', releaseLock)
    elem.addEventListener('touchcancel', releaseLock)
    loadingManager.setLoading(this, 'on')
    const renderingProcess = scoreManager.getRenderingProcess(this)
    for(const page of await renderingProcess.graphics) {
        elem.appendChild(await page)
    }
    loadingManager.setLoading(this, 'off')
}

let start: [number, number] = [0, 0]
let lock = false

function touchStart(e: TouchEvent) {
    start = getClientPos(e.touches[0])
}

function handleOverSwipe(e: TouchEvent) {
    if(lock) { return }
    if(!(e.target instanceof Element)) { return }

    const [dx, dy] = diff(getClientPos(e.touches[0]), start)
    const action = (ward: 'forward' | 'backward') => {
        lock = true
        e.stopPropagation()
        openNextTune(ward)
    }
    const nearVertical = Math.abs(dx / (dy + 0.01)) < 1.0
        
    if (dy > 40 && nearVertical) {
        action('backward')
    }
    if (dy < -40 && nearVertical) { 
        action('forward')
    }
}

function releaseLock(e: Event) {
    e.preventDefault()
    lock = false
}