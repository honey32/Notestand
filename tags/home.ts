import { h } from 'maquette'
import { locale } from '../scripts/i18n';
import { accountInfo } from './home/account_info';

export function homeHeading() {
    const i18n = locale.value.home
    return h('div#home_heading', [ 
        h('div#home_heading_text', [ i18n.albumList ]),
        accountInfo()
    ])
}

export function linkToAbout() {
    const i18n = locale.value.home
    return h('div#link_to_about_wrapper', [
        h('a#link_to_about', { href: '/' }, [ i18n.about ])
    ])
}