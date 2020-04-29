import { h } from "maquette";
import { state, albumManager } from "../scripts/store";
import { flatmap, _if, getScrollOriginElement, keyedHandlerMemo } from "./utils";
import { Tune } from "../scripts/tune";
import { activateRipple } from "./commons/ripple";
import { openTune } from "../scripts/router";
import { signInButton } from "./home/account_info";
import { ctxmenu } from "./menubar";
import { tabbar } from "./tabbar";
import { loadingSpinner } from "./commons/load_spinner";
import { projector } from "./tags";
import { BaseProperty, each2 } from "hojoki";


type TuneId = string
const ctxmenuOpenFor = new BaseProperty<TuneId>(null)

const jumpToIndex = keyedHandlerMemo<string>(key => e => {
    const elem = <HTMLElement>e.target
    activateRipple(elem, () => {})
    const tunesContainer = elem.closest("#album_tune_list").querySelector("#album_container_tunes")
    const label = tunesContainer.querySelector(`.section_label[data-anchor=${key}]`)
    let target = label
    for(let i = 0; i < 2 && target.previousElementSibling; i++) {
        target = target.previousElementSibling
    }

    target.scrollIntoView({
        block: "start", behavior: "smooth"
    })
})

let scrollValue = 0
state.c(each2()).addEventListener(({newValue, oldValue}) => {
    const scrollOriginElement = getScrollOriginElement()
    if(newValue === 'Album') {
        requestAnimationFrame(() => {
            projector.renderNow()
            scrollOriginElement.scrollTop = scrollValue    
        })
    } else if(oldValue === 'Album') {
        scrollValue = scrollOriginElement.scrollTop
    }
})

export function tuneList() {
    const isLoading = albumManager.current.tunes.value.state === 'pending'
    return h("div#album_tune_list", { classes: { hidden: state.value !== "Album" } }, [
            tabbar(),
            albumIndicies(),
            signInButton(),
            ..._if(isLoading, loadingSpinner()),
            h("div#album_container_tunes", { onclick: onClickTune, oncontextmenu: onContextMenuTune }, [
                ...renderListItems()
            ])
    ])
}

function albumIndicies() {
    const tunes = albumManager.current.tunes.value
    const indices = tunes.state === 'done' ? tunes.value.indices : []
    return h("div#album_indices", [
        ...flatmap(indices, (idx) => [
            h("div.album_index_jump", { key: idx, onclick: jumpToIndex(idx) }, [idx])
        ])
    ])
}

function* renderListItems () {
    const tunesIndexed = albumManager.current.tunes.value
    if(tunesIndexed.state !== 'done') { return }
    for(const [index, tunes] of tunesIndexed.value) {    
        yield h("div.section_label", { key: index, ["data-anchor"]: index }, [ index ])
        for(const tune of tunes) {
            const ctxmenuOpen = ctxmenuOpenFor.value === tune.id
            yield h("div.tune", { key: tune }, [ 
                h("div.tune_name", { ['tune-bound']: tune },  [ tune.name ]),
                ctxmenu(tune, ctxmenuOpen, onCloseCtxMenu)
            ])
        }
    }
}

function isEventOnLabel(e: Event) {
    const target = e.target as Element
    return target.classList.contains('section_label')
}

function getBoundTune(e: Event): [Tune, Element] {
    const target = e.target as Element
    const tuneDom = target.closest('.tune_name')
    return [tuneDom['tune-bound'] as Tune, tuneDom]
}

function onClickTune(e: Event) {
    if(isEventOnLabel(e)) { return }
    const [tune, tuneDom] = getBoundTune(e)
    activateRipple(tuneDom, () => {
        openTune(tune.id)
    })
}

function onContextMenuTune(e: Event) {
    if (isEventOnLabel(e)) { return }
    const [tune] = getBoundTune(e)

    if (ctxmenuOpenFor.value !== tune.id) {
        ctxmenuOpenFor.value = tune.id
        e.preventDefault()
    }
}

document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('#album_tune_list')) {
        ctxmenuOpenFor.value = null
    }
})

function onCloseCtxMenu(e: Event) {
    ctxmenuOpenFor.value = null
    e.stopPropagation()
}
