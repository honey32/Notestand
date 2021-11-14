import { run } from "../../scripts/util/lazy";
import { useLocale } from "../../scripts/i18n";
import { useState } from "react";
import * as React from "react";

interface DetailedHTMLProps<E> {
  onKeydown: (e: React.KeyboardEvent) => void;
}

export const NewAlbumDesktop: React.FC = () => {
  const [i18n] = useLocale();
  const [disabled, setDisabled] = useState(true);
  function onkeydown(e: React.KeyboardEvent) {
    let throttle: number;
    setDisabled(true);
    const { value } = e.target as HTMLInputElement;
    if (throttle) {
      window.clearTimeout(throttle);
    }
    throttle = window.setTimeout(() => {
      confirmedId(value).then(
        (_) => setDisabled(false),
        (_) => setDisabled(true),
      );
    }, 1000);
  }

  return <div id="home_new_album">
    <details>
      <summary>{i18n.newAlbumFromURL.buttonLabel}</summary>
      <form onSubmit={onsubmit}>
        <div className="labeltext">{i18n.newAlbumFromURL.description}</div>
        <input
          type="text"
          id="home_new_album_input"
          name="dir_path"
          // onKeydown={onkeydown}
          placeholder={i18n.newAlbumFromURL.placeholder}
        />
        <button
          id="home_new_album_button"
          type="submit"
          disabled={disabled}
        >
          {i18n.newAlbumFromURL.buttonLabel}
        </button>
      </form>
    </details>
  </div>;
};

function onsubmit(e: React.FormEvent) {
  e.preventDefault();
  const input = (e.target as HTMLFormElement).dir_path as HTMLInputElement;
  const rootdir = input.value;
  input.value = "";
  run(async () => {
    const res = await fetch("/api/albums/", {
      method: "post",
      body: JSON.stringify({ rootdir }),
    });
    const { id } = await res.json();
    // openAlbum(id);
  });
}

async function confirmedId(partURL: string) {
  if (!partURL) throw null;
  return partURL;
  const result = /.*(?:[=\/])(.+)$/.exec(partURL);
  const id = result ? result[1] : partURL;
  return id;
}
