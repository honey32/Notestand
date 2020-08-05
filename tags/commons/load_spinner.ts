import { h } from 'maquette';

export function loadingSpinner () {
  return h('div.loading_spinner', {}, [
    ...[0, 1, 2, 3].map(i =>
      h('div.loading_spinner_dot', [' '])
    )
  ]);
}
