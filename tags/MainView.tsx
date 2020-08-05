// import { state } from "../scripts/store";
// import { h } from "maquette";
// import { tabbar } from "./tabbar";
import * as React from "react";
import { TabBar } from "./TabBar";
import { TuneList } from "./TuneList";
import { Scores } from "./Score";
import { useCurrentAlbumId } from "../scripts/state";
import { useEffect, useState } from "react";
import { run } from "../scripts/util/lazy";
import { DAO } from "../scripts/dao/dao";
import { Album } from "../scripts/album";

function useSavedAlbumName() {
  const currentAlbumId = useCurrentAlbumId();
  const [name, setName] = useState<string>("");
  useEffect(() => {
    run(async () => {
      const nameGot = await DAO.getEntityName(currentAlbumId);
      setName(nameGot);
      if (await DAO.albumExists({ id: currentAlbumId })) {
        await DAO.addAlbum(new Album(nameGot, currentAlbumId));
      }
    });
  }, [currentAlbumId]);
  return name;
}

export const MainView: React.FC = () => {
  const name = useSavedAlbumName();
  return <div id="mainview">
    <TabBar albumName={name} />
    <div id="main_contents">
      <TuneList />
      <Scores />
    </div>
  </div>;
};
