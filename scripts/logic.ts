import { scoreManager, toastShown } from "./store";
import { Tune } from "./tune";
import { DAO } from "./dao/dao";
import { run } from "./util/lazy";

export async function _openTuneDirectly(albumId: string, tuneId: string) {
  // await albumManager.open(albumId);
  // await albumManager.getCurrentAlbumRenderer().tunes;
  // try {
  //   scoreManager.open(albumManager.current.forId(tuneId));
  // } catch (e) {
  //   alert(e);
  // }
}

export async function _openIndependentTune(tuneId: string) {
  const tune = new Tune(await DAO.getEntityName(tuneId), tuneId);
  scoreManager.open(tune);
}

export function showToast(message: string) {
  toastShown.value = message;
  setTimeout(() => {
    if (toastShown.value === message) toastShown.value = null;
  }, 5000);
}
