// import { RenderingProcess } from './pdf/pdfhelper';
// import { Tune } from './tune';
// import { deleteFromArrayById } from './util/arrays';
// import { BaseProperty } from 'hojoki';

// export class ScoreManager {
//     private _processes: Map<string, RenderingProcess> = new Map()
//     scores = new BaseProperty<Tune[]>([])
//     viewed = new BaseProperty<Tune>(null)
//     popupMsg = new BaseProperty<string>(null)
//     showsPopup = new BaseProperty<boolean>(false)

//     getRenderingProcess (tune: Tune) {
//       return this._processes.get(tune.id);
//     }

//     open (tune: Tune) {
//       if (!this._processes.has(tune.id)) {
//         const p = new RenderingProcess(tune);
//         this._processes.set(tune.id, p);
//         this.scores.mutate(it => it.push(tune));
//       }
//       this.viewed.value = tune;
//     }

//     close (tune: Tune): { tuneToShow: Tune} {
//       this._processes.delete(tune.id);
//       this.scores.mutate(scores => deleteFromArrayById(scores, tune.id));
//       if (this.scores.value.length) {
//         return { tuneToShow: this.scores.value[0] };
//       }
//       return { tuneToShow: null };
//     }

//     clear () {
//       this._processes.clear();
//       this.scores.value = [];
//     }

//     isViewed (tune: Tune): boolean {
//       return tune && this.viewed.value && tune.id === this.viewed.value.id;
//     }

//     getScoreNextToViewed (order: 'forward' | 'backward'): Tune {
//       if (this.scores.value.length <= 1 || !this.viewed.value) { return; }

//       let idxCurrent = this.scores.value.findIndex(it => it.id === this.viewed.value.id);
//       if (order === 'forward') { idxCurrent++; } else { idxCurrent--; }
//       idxCurrent = rangeLimited(idxCurrent, 0, this.scores.value.length);
//       return this.scores.value[idxCurrent];
//     }
// }

// function rangeLimited (value: number, lower: number, upper: number) {
//   return (value < lower) ? lower : (value > upper) ? upper : value;
// }
