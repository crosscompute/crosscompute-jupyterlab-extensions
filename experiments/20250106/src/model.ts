import { Signal } from '@lumino/signaling';

export class CrossComputeModel {
  private _update(): void {
    console.log('update');
    this.changed.emit();
  }
  get labShellPath() {
    return this._labShellPath;
  }
  set labShellPath(path: string) {
    this._labShellPath = path;
    console.log('labShellPath', path);
    this._update();
  }
  get fileBrowserFolder() {
    return this._fileBrowserFolder;
  }
  set fileBrowserFolder(folder: string) {
    this._fileBrowserFolder = folder || '.';
    this._update();
  }
  changed = new Signal<this, void>(this);
  private _labShellPath: string = '';
  private _fileBrowserFolder: string = '.';
}
