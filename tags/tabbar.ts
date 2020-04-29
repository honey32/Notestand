import { h } from "maquette";
import { state, albumManager, scoreManager, isMenuOpen } from "../scripts/store";
import { activateRipple } from "./commons/ripple";
import { backHome, openTune, openAlbum, closeTune, backToAlbum } from "../scripts/router";
import { flatmap, _if } from "./utils";
import { arrow, hanburber, tabs, cross } from "./icon/icons";
import { isTabListOpen } from "./main_view";
import { PromiseState } from "hojoki";
import { Tune } from "../scripts/tune";

export function tabbar()  {
    return h("div.tabbar", [
        backButton(),
        ..._if(albumManager.current.album.value, albumNameTab()),
        h("div.tab_tune_container", { onclick: onClickTuneTab }, [
            ...flatmap(scoreManager.scores.value, (tune) => [ tuneTab(tune) ])
        ]),
        h('div.mob_tablist_open_button', 
            { onclick: onTabListOpen, hidden: !scoreManager.scores.value.length }, 
            [ tabs() ]),
        menuOpenButton(),
    ])
}

function backButton() { return h("div.back_home.tab", { onclick: clickBack }, [ arrow() ]) }

function albumNameTab() {
    const name = albumManager.current.name.value
    return h("div.tab_album_name.tab", 
        { onclick: onClickAlbumTab, classes: { active: state.value === 'Album' }},
        [ PromiseState.orElse(name, '') ])
}

function menuOpenButton() { return h("div.menu-open-button", { onclick: onMenuOpen }, [ hanburber() ]) }

function tuneTab(tune: Tune) {
    const active = scoreManager.isViewed(tune) && state.value === 'Score'
    return h("div.tab.tab-tune", 
        { key: tune, classes : { active }, ['tune-bound']: tune }, 
        [ 
            h("div.tab_name", {}, [ tune.name ]),
            h("div.tab_close", {} , [ cross() ])
        ])
}


function clickBack(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        if(state.value === "Score" && albumManager.current.album.value) {
            backToAlbum()
        } else {
            backHome()
        }
    })
}

function onClickAlbumTab(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        backToAlbum()
    })
}

function onTabListOpen(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        isTabListOpen.value = true
    })
}

function onMenuOpen(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        isMenuOpen.value = true
    })
}

function onClickTuneTab(e: Event) {
    const target = <HTMLElement>e.target

    const close_btn = target.closest('.tab_close')
    const tab = target.closest('.tab')

    if (close_btn) {
        activateRipple(close_btn, () => {
            closeTune(tab['tune-bound'])
        })
    } else if (tab) {
        activateRipple(tab, () => {
            openTune(tab['tune-bound'].id)
        })
    }
}
