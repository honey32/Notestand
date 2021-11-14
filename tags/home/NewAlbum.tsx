import { useLocale } from "../../scripts/i18n";
import { GDrive, useAccount } from "../../scripts/back/gdrive";
import { NewAlbumDesktop } from "./NewAlbumDT";
import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router";

export const NewAlbum: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  if (process.env.NODE_ENV === "desktop") {
    return <NewAlbumDesktop />;
  }

  const [i18n] = useLocale();
  const account = useAccount();
  const h = useHistory();

  function openAlbum(id: string) {
    h.push(`/view?album=${id}`);
  }

  let throttle: number;

  function oninput(e: React.FormEvent<HTMLInputElement>) {
    setDisabled(true);
    const { value } = e.currentTarget;
    if (throttle) {
      window.clearTimeout(throttle);
    }
    throttle = window.setTimeout(() => {
      confirmedId(value).then(
        (_) => {
          setDisabled(false);
        },
        (_) => {
          setDisabled(true);
        }
      );
    }, 300);
  }

  function onsubmit(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement & {
      gdrive_id: { value: string };
    };
    const value = decodeURIComponent(target.gdrive_id.value);
    e.preventDefault();
    confirmedId(value).then(
      (id) => {
        setDisabled(false);
        openAlbum(id);
        target.gdrive_id.value = "";
      },
      (_) => {
        setDisabled(true);
      }
    );
  }

  return (
    <div id="home_new_album" hidden={!account}>
      <details>
        <summary>{i18n.newAlbumFromURL.buttonLabel}</summary>
        <form onSubmit={onsubmit}>
          <div className="labeltext">{i18n.newAlbumFromURL.description}</div>
          <input
            type="text"
            id="home_new_album_input"
            name="gdrive_id"
            onInput={oninput}
            placeholder={i18n.newAlbumFromURL.placeholder}
          />
          <button id="home_new_album_button" type="submit" disabled={disabled}>
            {i18n.newAlbumFromURL.buttonLabel}
          </button>
        </form>
      </details>
    </div>
  );
};

async function confirmedId(partURL: string) {
  if (!partURL) throw new Error("error");
  const result = /.*(?:[=/])(.+)$/.exec(partURL);
  const id = result ? result[1] : partURL;
  await GDrive.getFileItself(id);
  return id;
}
