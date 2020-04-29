import { h } from "maquette";
import { locale } from "../../scripts/i18n";
import { account } from "../../scripts/store";
import { GDrive } from "../../scripts/back/gdrive";
import { openAlbum } from "../../scripts/router";
import { newAlbum_desktop } from "./new_album_dt";
import { BaseProperty } from "hojoki";

const disabled = new BaseProperty(true)

export function newAlbum() {
    if(process.env.NODE_ENV === 'desktop') {
        return newAlbum_desktop()
    }
    
    const i18n = locale.value.newAlbumFromURL
    return h('div#home_new_album', { hidden: !account.value }, [
        h('details', [
            h('summary', [ i18n.buttonLabel ]),
            h('form', { onsubmit }, [
                h('div.labeltext', [ i18n.description ]),
                h('input#home_new_album_input', { type: 'text', name: 'gdrive_id', oninput, placeholder: i18n.placeholder }),
                h('button#home_new_album_button', { type: 'submit', disabled: disabled.value }, [ i18n.buttonLabel ])
            ])
        ])
    ])
}


let throttle: number

function oninput(e: Event) {
    disabled.value = true
    const { value } = <HTMLInputElement>e.target
    if (throttle) {
        window.clearTimeout(throttle)
    }
    throttle = window.setTimeout(() => {
        confirmedId(value).then(
            _ => disabled.value = false,
            _ => disabled.value = true
        )
    }, 300)
}

function onsubmit(e: Event) {
    const target = <HTMLButtonElement>e.target
    const value = decodeURIComponent(target['gdrive_id'].value)
    console.log(`value = ${value}`)
    e.preventDefault()
    confirmedId(value).then(
        id => {
            disabled.value = false
            openAlbum(id)
            target['gdrive_id'].value = ''
        },
        _ => {
            disabled.value = true
        }
    )
}

async function confirmedId(partURL: string) {
    if (!partURL) { throw null }
    const result = /.*(?:[=\/])(.+)$/.exec(partURL)
    const id = result ? result[1] : partURL
    await GDrive.getFileItself(id)
    return id;
}