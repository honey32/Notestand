import { h } from "maquette/dist/h";
import { flatmap } from "./utils";
import { scoreManager } from "../scripts/store";
import { cross } from "./icon/icons";
import { Tune } from "../scripts/tune";
import { openTune, closeTune } from "../scripts/router";
import { isTabListOpen } from "./main_view";
import { activateRipple } from "./commons/ripple";

export function mob_tabList() {
    return h('div.mob_tab_list', { onclick, hidden: !isTabListOpen.value },  [
        ...flatmap(scoreManager.scores.value, tune => [
            h('div.tab', { key: tune, 'bound-tab': tune }, [
                h('div.tab_name', [ tune.name ]),
                h('div.tab_close_button', [ cross() ])
            ])
        ])
    ])
}

document.addEventListener('click', (e) => {
    if (!(<HTMLElement>e.target).closest('.mob_tab_list')) {
        isTabListOpen.value = false
    }
}, false)

function onclick(e: Event) {
    const target = <HTMLElement>e.target
    e.stopPropagation()
    const elemCloseButton = target.closest('.tab_close_button')
    if(elemCloseButton) {
        activateRipple(elemCloseButton, () => {
            closeTune(target.closest('.tab')['bound-tab'] as Tune)
            isTabListOpen.value = scoreManager.scores.value.length > 0
        })
        return true
    }
    const elemTab = target.closest('.tab')
    if(elemTab) {
        activateRipple(elemTab, () => {
            openTune((elemTab['bound-tab'] as Tune).id)
            isTabListOpen.value = false
        })
    }
}
