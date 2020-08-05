import { BaseProperty, Computed, bundle, map } from "hojoki";
import { ScoreManager } from "./score_manager";

export type State = "Home" | "Album" | "Score" | "Whiteout";
export const state = new BaseProperty<State>("Home");
export const isMenuOpen = new BaseProperty<boolean>(false);
export const toastShown = new BaseProperty<string>(null);
// export const albumManager = new AlbumListManager(state);
export const scoreManager = new ScoreManager();
export const searchResult = new BaseProperty<string[]>([]);
export const account = new BaseProperty<string>(null);

export type Theme = "blight" | "dark";
export const theme = new BaseProperty<Theme>(
  (localStorage.getItem("ui-theme") as Theme) || "blight"
);

theme.addEventListener((newValue) => {
  document.body.dataset.uitheme = newValue;
  localStorage.setItem("ui-theme", newValue);
});

// const title = Computed.create(
//   state,
//   albumManager.current.name,
//   scoreManager.viewed
// )(bundle()).c(
//   map((b) => {
//     const [state, albumName, tune] = b;
//     switch (state) {
//       case "Home":
//       case "Whiteout":
//         return "Notestand";
//       case "Album":
//         return (albumName.value || "") + " - Notestand";
//       case "Score":
//         return tune.name + " - Notestand";
//     }
//   })
// );

// title.addEventListener((newValue) => {
//   document.title = newValue;
// });

state.addEventListener((newValue) => {
  if (newValue === "Home") {
    document.getElementById("home").classList.remove("hidden");
  } else {
    document.getElementById("home").classList.add("hidden");
  }
});
