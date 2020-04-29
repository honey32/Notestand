import { h } from "maquette";
import { localeName, changeLocale } from "../../scripts/i18n";
import { keyedHandlerMemo } from "../utils";

export function languageSelect() {
    return h('div#language_wrapper', [
        h('div#language', [
            selection('ja', '日本語'),
            selection('en', 'English'),
            selection('zh-CN', '简体中文'),
        ])
    ])
}

const onclick = keyedHandlerMemo<string>(key => e => {
    changeLocale(key)
})

function selection(code: string, displayName: string) {
    const active = localeName.value === code
    return h('div.selection', 
            { classes: { active }, key: code, onclick: onclick(code) }, 
            [ displayName ])
}