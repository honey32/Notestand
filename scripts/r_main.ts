import "babel-polyfill";
import "../tags/App";
import "./back/gdrive";
// window.checkAuth, window.checkGis を、html の onLoad 等から直に呼び出したいので必要な初期化をする

if ("serviceWorker" in navigator && process.env.NODE_ENV !== "desktop") {
  navigator.serviceWorker.register(
    new URL("~/service-worker.js", import.meta.url),
    { type: "module" },
  );
}
