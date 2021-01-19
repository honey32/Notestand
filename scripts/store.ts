// import { BaseProperty, Computed, bundle, map } from "hojoki";
// import { ScoreManager } from "./score_manager";

// export type State = "Home" | "Album" | "Score" | "Whiteout";

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
