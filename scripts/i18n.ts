import { BaseProperty, map } from "hojoki";



type MessageAsset = typeof en

const en = {
    home: {
        albumList: 'Recent Albums',
        about: 'About Notestand'
    },
    newAlbumFromURL: {
        description: 'Put URL or a part of URL of Google Drive(tm) folder to create a new album.',
        placeholder: 'example: drive.google.com/open?id=<Id Goes Here>',
        buttonLabel: 'Create New Album',
    },
    menu: {
        openOriginal: 'Open Original',
        closeScore: 'Close This Score',
        toggleTheme: 'Toggle Theme',
        copyCurrentUrl: 'Copy Current URL',
        toastCopiedCurrentUrl: 'Current URL was Copied to Clipboard'
    },
    account: {
        signIn: 'Sign In with Google',
        signOut: 'Sign Out'
    }
}

const ja: MessageAsset = {
    home: {
        albumList: 'アルバム一覧',
        about: 'Notestandについて'
    },
    newAlbumFromURL: {
        description: 'Google DriveのURLまたはその一部からアルバムを作成できます。',
        placeholder: '例: drive.google.com/open?id=<ここにIdが入ります>',
        buttonLabel: 'アルバムを作成',
    },
    menu: {
        openOriginal: '元ファイルを開く',
        closeScore: '楽譜を閉じる',
        toggleTheme: 'テーマを切り替える',
        copyCurrentUrl: '現在のURLをコピー',
        toastCopiedCurrentUrl: 'URLがクリップボードにコピーされました',
    },
    account: {
        signIn: 'Googleでログイン',
        signOut: 'ログアウト'
    }
}

const zh_s: MessageAsset = {
    home: {
        albumList: '谱册一览表',
        about: '关于Notestand',
    },
    newAlbumFromURL: {
        description: '从Google Drive的URL或URL一部分, 能制作谱册',
        placeholder: '例: drive.google.com/open?id=<这儿Id>',
        buttonLabel: '制作谱册',
    },
    menu: {
        openOriginal: '打开原版',
        closeScore: '关这个乐谱',
        toggleTheme: '开关主题',
        copyCurrentUrl: '复写现在的URL',
        toastCopiedCurrentUrl: 'URL到剪贴板复制了',
    },
    account: {
        signIn: '用谷歌注册',
        signOut: '注销'
    }
}

export const localeName = new BaseProperty('en')

localeName.c(map(name => {
    document.body.setAttribute('lang', name)
}))

export const locale = localeName
    .c(map(name => {
        switch(name) {
            case 'ja' : return ja
            case 'zh-CN': return zh_s
            default: return en
        }
    }))

export function changeLocale(code: string) {
    localeName.value = code
    try {
        localStorage.setItem('locale', code)
    } catch(e) {

    }
}

const l = localStorage.getItem('locale')
if (l) {
    localeName.value = l
} else {
    changeLocale(navigator.language)
    console.log(locale.value)
}