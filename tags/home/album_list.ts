import { flatmap } from "../utils";
import { h } from "maquette/dist/h";
import { activateRipple } from "../commons/ripple";
import * as router from '../../scripts/router';
import { Album } from "../../scripts/album";
import { albumManager } from "../../scripts/store";

export function albumList() {
    return h('div#container_albums', [
        ...flatmap(albumManager.recentAlbums.value, album => [
            h('div.album', { key: album, bind: album, onclick, oncontextmenu }, [ h('div.album_name', [album.name]) ]),
        ])
    ])
}

function onclick(this: Album, e: Event) {
    activateRipple(<HTMLElement>e.target, () => {
        router.openAlbum(this.id)
    })
}

function oncontextmenu() {
}
