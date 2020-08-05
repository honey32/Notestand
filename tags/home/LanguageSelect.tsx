import { useLocale, useSetLocale } from "../../scripts/i18n";
import * as React from "react";

export const LanguageSelect: React.FC = () => {
  return (
    <div id="language_wrapper">
      <div id="language">
        <Selection code="ja">日本語</Selection>
        <Selection code="en">English</Selection>
        <Selection code="zh-CN">简体中文</Selection>
      </div>
    </div>
  );
};

const Selection: React.FC<{ code: string }> = ({ code, children }) => {
  const [, current] = useLocale();
  const { setCurrentLocale } = useSetLocale();
  const active = current === code;

  return (
    <div
      className="selection"
      key={code}
      onClick={() => setCurrentLocale(code)}
      data-active={active}
    >
      {children}
    </div>
  );
};
