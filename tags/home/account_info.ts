import { h } from "maquette";
import { locale } from "../../scripts/i18n";
import { account } from "../../scripts/store";
import { GDrive } from "../../scripts/back/gdrive";

export function accountInfo() {
    if(process.env.NODE_ENV === 'desktop') {
        return h('div#account_info', { hidden: true })
    }

    const i18n = locale.value.account
    
    return h('div#account_info', { hidden: !account.value, classes: { in: !account.value } }, [
        h('div#account_name', [ account.value ]),
        h('button#account_inout_button', { onclick: clickSignOut }, [ i18n.signOut ])
    ])
}

export function signInButton() {
    if(process.env.NODE_ENV === 'desktop') {
        return h('div.signin_button_wrapper', { hidden: true })
    }
    
    const i18n = locale.value.account

    return h('div.signin_button_wrapper', { hidden: !!account.value },  [
        h('button.signin_button', { onclick: clickSignIn },  [ 
            h('img.signin_button_icon', { src: '/image/google_logo_signin.png', width: '96', height: '96' }),
            h('div.signin_button_text', [ i18n.signIn ])])
    ])
}

function clickSignIn() {
    GDrive.signIn()
}

function clickSignOut() {
    GDrive.signOut()
}
