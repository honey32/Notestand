import "babel-polyfill";
import "../tags/App";
import { run } from "./util/lazy";

if ("serviceWorker" in navigator && process.env.NODE_ENV !== "desktop") {
  navigator.serviceWorker.register(
    new URL("service-worker.js"),
    { type: "module" }
  );
}

run(async () => {
  // const { albumIdFromArg = null } = await albumManager.init();
  // if (albumIdFromArg) {
  //   openAlbum(albumIdFromArg);
  // }
});
