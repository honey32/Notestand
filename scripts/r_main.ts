import "babel-polyfill";
import "../tags/App";

if ("serviceWorker" in navigator && process.env.NODE_ENV !== "desktop") {
  navigator.serviceWorker.register(
    new URL("~/service-worker.js", import.meta.url),
    { type: "module" }
  );
}
