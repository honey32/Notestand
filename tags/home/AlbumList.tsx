import { activateRipple } from "../commons/ripple";
import { Album } from "../../scripts/album";
import { useState, useEffect } from "react";
import { DAO } from "../../scripts/dao/dao";
import { run } from "../../scripts/util/lazy";
import * as React from "react";
import { useCurrentAlbumId } from "../../scripts/state";
import { Link } from "react-router-dom";

export const AlbumList: React.FC = () => {
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const currentAlbumId = useCurrentAlbumId();

  useEffect(() => {
    run(async () => setRecentAlbums(await DAO.loadAlbumList()));
  }, [currentAlbumId]);

  return (
    <div id="container_albums">
      {recentAlbums.map((album) => [
        <Link
          to="/view?album=0BzegRJ-j8XE4VFZiNUpMS2NrMlU"
          className="album"
          key={album.id}
        >
          <div className="tab_album_name">{album.name}</div>
        </Link>,
      ])}
    </div>
  );
};
