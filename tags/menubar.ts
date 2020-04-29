import { h } from "maquette";
import { isMenuOpen, state, albumManager, theme, Theme, scoreManager } from "../scripts/store";
import { _if } from "./utils";
import { activateRipple } from "./commons/ripple";
import { locale } from "../scripts/i18n";
import { cross } from "./icon/icons";
import { closeTune } from "../scripts/router";
import { Album } from "../scripts/album";
import { Tune } from "../scripts/tune";
import { DAO } from "../scripts/dao/dao";
import { showToast } from "../scripts/logic";


export function menubar() {
    const item: Tune | Album = state.value === 'Score' ? scoreManager.viewed.value : albumManager.current.album.value
    return h("div#menubar", { classes: { hidden: !isMenuOpen.value }}, [
        h("div#menu-close-button",
            { onclick: onCloseMenu },
            [ cross() ]),
        h("div.menu_item",
            { onclick: onOpenScoreFile, bind: item , key: "openwithexplorer" }, 
            [ locale.value.menu.openOriginal　]),    
        h("div.menu_item", 
            { hidden: state.value !== "Score", onclick: onCloseTab, key: "closetab" },
            [ locale.value.menu.closeScore ]),
        h("div.menu_item", 
            { onclick: onToggleTheme, key: "toggleTheme" },
            [ locale.value.menu.toggleTheme ]),
        h("div.menu_item",
            { onclick: onCopyCurrentUrl, key: "copyCurrentUrl"}, 
            [ locale.value.menu.copyCurrentUrl ])
    ])
}

export function ctxmenu(item: Album | Tune, shown: boolean, onCloseCtxMenu: (e: Event) => void) {
    return h("div.ctxmenu_wrap", [
            ..._if(shown, 
                h("div.ctxmenu", {
                    onclick: onCloseCtxMenu
                }, [
                    h("div.menu_item",
                        { onclick: onOpenScoreFile, bind: item, key: "openwithexplorer" }, 
                        [ locale.value.menu.openOriginal　]),    
                    h("div.menu_item.menu_item_close",
                        { onclick: onCloseCtxMenu },
                        [ cross() ]),
                ])
            )
    ])
}

document.addEventListener('click', (e) => {
    if (!(<HTMLElement>e.target).closest('#menubar')) {
        isMenuOpen.value = false
    }
}, false)

function onOpenScoreFile(this: {id: string}, e: Event) {
    DAO.openOriginal(this)
    activateRipple(<HTMLElement>e.target, () => {
        isMenuOpen.value = false
    })
}

function onCloseTab(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        closeTune(scoreManager.viewed.value)
    })
}

function onCloseMenu(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        isMenuOpen.value = false
    })   
}

function onToggleTheme(e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        let value: Theme

        switch(theme.value) {
            case 'blight':
                value = 'dark'
                break
            default:
                value = 'blight'
        }

        theme.value = value
    })
}

function onCopyCurrentUrl(e: Event) {
    activateRipple(e.target as HTMLElement, () => {
        if(navigator.clipboard){
            navigator.clipboard.writeText(document.URL)
            showToast(locale.value.menu.toastCopiedCurrentUrl)
        }
    })
}