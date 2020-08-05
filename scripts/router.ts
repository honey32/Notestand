import { default as page } from "page";
import { _openTuneDirectly, _openIndependentTune } from "./logic";
// import { state, scoreManager, albumManager } from "./store";
import { Tune } from "./tune";
import { run, wait } from "./util/lazy";

// page('/app/', () => {
//   state.value = 'Home';
// });

// export function backHome () {
//   page('/app/');
// }

// export function backToAlbum () {
//   openAlbum(albumManager.current.id.value, true);
// }

// let supressReload: boolean = false;

// page<'albumId'>('/app/albums/:albumId/tunes', ctx => {
//   if (supressReload) {
//     state.value = 'Album';
//     supressReload = false;
//   } else {
//     albumManager.open(ctx.params.albumId);
//     state.value = 'Album';
//   }
// });

// page<'albumId'>('/app/view/:albumId', ctx => page(`/app/albums/${ctx.params.albumId}/tunes`));

// export function openAlbum (id: string, noreload: boolean = false) {
//   supressReload = noreload;
//   page(`/app/albums/${id}/tunes`);
// }

// page<'albumId' | 'tuneId'>('/app/albums/:albumId/tunes/:tuneId', async ctx => {
//   const { albumId, tuneId } = ctx.params;
//   if (albumManager.checkIfOpened(albumId)) {
//     scoreManager.open(albumManager.current.forId(tuneId));
//   } else {
//     _openTuneDirectly(albumId, tuneId);
//   }
//   state.value = 'Score';
// });

// page<'albumId' | 'tuneId'>('/app/view/:albumId/:tuneId', ctx => page(`/app/albums/${ctx.params.albumId}/tunes/${ctx.params.tuneId}`));

// export function openTune (tuneId: string, albumId: string = albumManager.current.id.value): void {
//   page(`/app/albums/${albumId}/tunes/${tuneId}/`);
// }

// page<'tuneId'>('/app/tunes/:tuneId', ctx => {
//   const tuneId: string = ctx.params.tuneId;
//   _openIndependentTune(tuneId);
// });

// let openNextTuneLock: Symbol = null;

// export function openNextTune (order: 'forward' | 'backward') {
//   const key = Symbol();
//   openNextTuneLock = key;
//   const nextIdx = scoreManager.getScoreNextToViewed(order);
//   scoreManager.popupMsg.value = nextIdx.name;
//   scoreManager.showsPopup.value = true;
//   openTune(nextIdx.id);
//   run(async () => {
//     await wait(800);
//     scoreManager.showsPopup.value = false;
//     await wait(500);
//     if (openNextTuneLock === key) {
//       scoreManager.popupMsg.value = '';
//     }
//   });
// }

// export function closeTune (t: Tune) {
//   const { tuneToShow } = scoreManager.close(t);
//   if (tuneToShow) {
//     openTune(tuneToShow.id);
//   } else if (albumManager.current.album) {
//     backToAlbum();
//   } else {
//     backHome();
//   }
// }

// page.start();
