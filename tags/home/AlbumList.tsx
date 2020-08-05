import { activateRipple } from "../commons/ripple";
import { Album } from "../../scripts/album";
import { useState, useEffect } from "react";
import { DAO } from "../../scripts/dao/dao";
import { run } from "../../scripts/util/lazy";
import * as React from "react";

export const AlbumList: React.FC = () => {
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  useEffect(() => {
    run(async () => setRecentAlbums(await DAO.loadAlbumList()));
  }, []);
  return (
    <div id="container_albums">
      {recentAlbums.map((album) => [
        <div
          className="album"
          key={album.id}
          onClick={onclick}
          onContextMenu={oncontextmenu}
        >
          <div className="tab_album_name">{album.name}</div>
        </div>,
      ])}
    </div>
  );
};

function onclick(e: React.MouseEvent) {
  activateRipple(e.target as HTMLElement, () => {
    // router.openAlbum(this.id);
  });
}

function oncontextmenu() {}
