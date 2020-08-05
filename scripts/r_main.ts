import "babel-polyfill";
// import '../tags/tags';
import "../tags/App";
// import { albumManager } from "./store";
import { run } from "./util/lazy";
// import { openAlbum } from "./router";

if ("serviceWorker" in navigator && process.env.NODE_ENV !== "desktop") {
  navigator.serviceWorker.register("/service-worker.js");
}

run(async () => {
  // const { albumIdFromArg = null } = await albumManager.init();
  // if (albumIdFromArg) {
  //   openAlbum(albumIdFromArg);
  // }
});
