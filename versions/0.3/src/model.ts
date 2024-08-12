import { Signal } from '@lumino/signaling';

export class CrossComputeModel {
  changed = new Signal<this, void>(this);
}
