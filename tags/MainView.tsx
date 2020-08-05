// import { state } from "../scripts/store";
// import { h } from "maquette";
// import { tabbar } from "./tabbar";
import * as React from "react";
import { TabBar } from "./TabBar";
import { TuneList } from "./TuneList";
import { Scores } from "./Score";

export const MainView: React.FC = () => {
  return <div id="mainview">
    <TabBar />
    <div id="main_contents">
      <TuneList />
      <Scores />
    </div>
  </div>;
};
