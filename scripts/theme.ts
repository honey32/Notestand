import React from "react";
import { useEffect } from "react";
import { atom, useRecoilState, useSetRecoilState } from "recoil";

export type Theme = "blight" | "dark";

const themeR = atom<Theme>({
  key: "ui_theme",
  default: "blight",
});

export function useThemeInitialization() {
  const [theme, setTheme] = useRecoilState(themeR);
  useEffect(() => {
    setTheme((localStorage.getItem("ui-theme") as Theme) || "blight");
  }, []);
  useEffect(() => {
    document.body.dataset.uitheme = theme;
    localStorage.setItem("ui-theme", theme);
  }, [theme]);
}

export function useToggleTheme() {
  const setValue = useSetRecoilState(themeR);
  const next: Record<Theme, Theme> = {
    blight: "dark",
    dark: "blight",
  };
  return () => {
    setValue((cur) => next[cur]);
  };
}

// export const theme = new BaseProperty<Theme>(
// (localStorage.getItem("ui-theme") as Theme) || "blight"
// );

// theme.addEventListener((newValue) => {
//   document.body.dataset.uitheme = newValue;
//   localStorage.setItem("ui-theme", newValue);
// });
