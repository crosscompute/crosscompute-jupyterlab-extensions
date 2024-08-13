import { Signal } from '@lumino/signaling';

export class CrossComputeModel {
  // updatePath
  // set path(newValue: boolean) {
  changed = new Signal<this, void>(this);
}
