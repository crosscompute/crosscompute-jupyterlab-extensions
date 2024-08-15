import { Signal } from '@lumino/signaling';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

import { NAMESPACE } from './constant';

export class CrossComputeModel {
  connect(): void {
    const settings = ServerConnection.makeSettings();
    const uri = URLExt.join(settings.wsUrl, NAMESPACE, 'updates.json');
    const socket = new WebSocket(uri);
    socket.onopen = () => {
      // socket.send(this._path);
    };
    socket.onmessage = message => {
      /*
      const d = JSON.parse(message.data);
      if (d.path === this._path) {
        this._configuration = d;
        this.changed.emit();
      }
      this._cache[d.path] = d;
      */
    };
    this._socket = socket;
  }
  private _update(): void {
    clearTimeout(this._timeout);
    this._timeout = window.setTimeout(() => {
      console.log('update');
      this.changed.emit();
    }, 10);
  }
  get fileBrowserFolder() {
    return this._fileBrowserFolder;
  }
  set fileBrowserFolder(folder: string) {
    console.log('fileBrowserFolder', folder);
    this._fileBrowserFolder = folder;
    this._update();
  }
  get labShellPath() {
    return this._labShellPath;
  }
  set labShellPath(path: string) {
    console.log('labShellPath', path);
    this._labShellPath = path;
    this._update();
  }
  /*
  update(sourceName: string, newPath: string): void {
    this._configuration = this._cache[newPath] || {};
    this.changed.emit();

    const socket = this._socket;
    this._timeout = window.setTimeout(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(newPath);
      }
    }, 10);

    this._path = newPath;
  }
  */
  disconnect(): void {
    this._socket?.close();
  }
  /*
  get configuration() {
    return this._configuration;
  }
  */
  changed = new Signal<this, void>(this);
  private _fileBrowserFolder: string = '';
  private _labShellPath: string = '';
  /*
  private _cache: any = {};
  private _configuration: any = {};
  */
  private _socket: WebSocket | undefined = undefined;
  private _timeout: number = 0;
}
