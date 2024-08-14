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
      socket.send(this._path);
    };
    socket.onmessage = message => {
      const d = JSON.parse(message.data);
      if (d.path === this._path) {
        this._configuration = d;
        this.changed.emit();
      }
      this._cache[d.path] = d;
    };
    this._socket = socket;
  }
  update(sourceName: string, newPath: string): void {
    this._sourceName = sourceName;
    this._configuration = this._cache[newPath] || {};
    this.changed.emit();

    const socket = this._socket;
    clearTimeout(this._timeout);
    this._timeout = window.setTimeout(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(newPath);
      }
    }, 10);

    this._path = newPath;
  }
  disconnect(): void {
    this._socket?.close();
  }
  get path() {
    return this._path;
  }
  get sourceName() {
    return this._sourceName;
  }
  get configuration() {
    return this._configuration;
  }
  changed = new Signal<this, void>(this);
  private _path: string = '';
  private _sourceName: string = '';
  private _cache: any = {};
  private _configuration: any = {};
  private _timeout: number = 0;
  private _socket: WebSocket | undefined = undefined;
}
