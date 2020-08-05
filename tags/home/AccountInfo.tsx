// import { account } from "../../scripts/store";
import { GDrive, useAccount } from "../../scripts/back/gdrive";
import { useLocale } from "../../scripts/i18n";
import * as React from "react";
import { useState } from "react";

export function AccountInfo() {
  if (process.env.NODE_ENV === "desktop") {
    return <div id="account_info" hidden></div>;
  }

  const [i18n] = useLocale();
  // const account = useAccount();
  const { signOut, name } = useAccount();

  return (
    <div id="account_info" hidden={!name}>
      <div id="account_name">{name}</div>
      <button
        id="account_inout_button"
        onClick={() => {
          signOut();
        }}
      >
        {i18n.account.signIn}
      </button>
    </div>
  );
}

export const SignInButton: React.FC = () => {
  if (process.env.NODE_ENV === "desktop") {
    return <div className="signin_button_wrapper" hidden></div>;
  }

  const [i18n] = useLocale();
  // const account = useAccount();
  const { signIn, name } = useAccount();

  return (
    <div className="signin_button_wrapper" hidden={!!name}>
      <button
        className="signin_button"
        onClick={() => {
          signIn();
        }}
      >
        <img
          src="/image/google_logo_signin.png"
          alt=""
          className="signin_button_icon"
          width="96"
          height="96"
        />
        <div className="signin_button_text">{i18n.account.signIn}</div>
      </button>
    </div>
  );
};

function clickSignIn() {
  GDrive.signIn();
}

function clickSignOut() {
  GDrive.signOut();
}
