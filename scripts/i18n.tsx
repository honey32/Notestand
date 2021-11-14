import { useContext, useState, useEffect } from "react";
import * as React from "react";

const en = {
  home: {
    albumList: "Recent Albums",
    about: "About Notestand",
  },
  newAlbumFromURL: {
    description:
      "Put URL or a part of URL of Google Drive(tm) folder to create a new album.",
    placeholder: "example: drive.google.com/open?id=<Id Goes Here>",
    buttonLabel: "Create New Album",
  },
  menu: {
    openOriginal: "Open Original",
    closeScore: "Close This Score",
    toggleTheme: "Toggle Theme",
    copyCurrentUrl: "Copy Current URL",
    toastCopiedCurrentUrl: "Current URL was Copied to Clipboard",
  },
  account: {
    signIn: "Sign In with Google",
    signOut: "Sign Out",
  },
};

export type MessageAsset = typeof en;

const ja: MessageAsset = {
  home: {
    albumList: "アルバム一覧",
    about: "Notestandについて",
  },
  newAlbumFromURL: {
    description: "Google DriveのURLまたはその一部からアルバムを作成できます。",
    placeholder: "例: drive.google.com/open?id=<ここにIdが入ります>",
    buttonLabel: "アルバムを作成",
  },
  menu: {
    openOriginal: "元ファイルを開く",
    closeScore: "楽譜を閉じる",
    toggleTheme: "テーマを切り替える",
    copyCurrentUrl: "現在のURLをコピー",
    toastCopiedCurrentUrl: "URLがクリップボードにコピーされました",
  },
  account: {
    signIn: "Googleでログイン",
    signOut: "ログアウト",
  },
};

// eslint-disable-next-line camelcase
const zh_s: MessageAsset = {
  home: {
    albumList: "谱册一览表",
    about: "关于Notestand",
  },
  newAlbumFromURL: {
    description: "从Google Drive的URL或URL一部分, 能制作谱册",
    placeholder: "例: drive.google.com/open?id=<这儿Id>",
    buttonLabel: "制作谱册",
  },
  menu: {
    openOriginal: "打开原版",
    closeScore: "关这个乐谱",
    toggleTheme: "开关主题",
    copyCurrentUrl: "复写现在的URL",
    toastCopiedCurrentUrl: "URL到剪贴板复制了",
  },
  account: {
    signIn: "用谷歌注册",
    signOut: "注销",
  },
};

const LocaleContext = React.createContext<{
  locale: string;
  setLocale: (s: string) => void;
}>(undefined);

export function useLocale() {
  const { locale } = useContext(LocaleContext);
  const asset: MessageAsset = {
    ja: ja,
    "ch-CN": zh_s,
  }[locale] ?? en;
  return [asset, locale] as const;
}

export const LocaleContextProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    const l = localStorage.getItem("locale");

    if (!l) {
      try {
        localStorage.setItem("locale", l);
      } catch (e) {}
      console.log(locale);
    }
    setLocale(l);
  }, []);
  useEffect(() => {
    document.body.setAttribute("lang", locale);
  }, [locale]);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export function useSetLocale() {
  const a = useContext(LocaleContext);
  return { setCurrentLocale: (s: string) => a.setLocale(s) };
}
