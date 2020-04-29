import { h } from "maquette";
import { locale } from "../../scripts/i18n";
import { run } from "../../scripts/util/lazy";
import { openAlbum } from "../../scripts/router";
import { BaseProperty } from "hojoki";

const disabled = new BaseProperty(true)

export function newAlbum_desktop() {
    const i18n = locale.value.newAlbumFromURL
    return h('div#home_new_album', {}, [
        h('details', [
            h('summary', [ i18n.buttonLabel ]),
            h('form', { onsubmit }, [
                h('div.labeltext', [ i18n.description ]),
                h('input#home_new_album_input', { type: 'text', name: 'dir_path', onkeydown, placeholder: i18n.placeholder }),
                h('button#home_new_album_button', { type: 'submit', disabled: disabled.value }, [ i18n.buttonLabel ])
            ])
        ])
    ])
}

function onsubmit(e: Event) {
    e.preventDefault()
    const input = (e.target as HTMLFormElement)['dir_path'] as HTMLInputElement
    const rootdir = input.value
    input.value = ''
    run(async () => {
        const res = await fetch(`/api/albums/`, { 
            method: 'post', 
            body: JSON.stringify({ rootdir })
        })
        const { id } = await res.json()
        openAlbum(id)
    })
}

let throttle: number

function onkeydown(e: Event) {
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
    }, 1000)
}

async function confirmedId(partURL: string) {
    if (!partURL) { throw null }
    return partURL;
    const result = /.*(?:[=\/])(.+)$/.exec(partURL)
    const id = result ? result[1] : partURL
    return id;
}