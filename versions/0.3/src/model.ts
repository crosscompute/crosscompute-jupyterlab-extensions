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
      this._relay();
    };
    socket.onerror = event => {
      console.error(event);
    };
    socket.onmessage = message => {
      const d = JSON.parse(message.data);
      const folder = d.folder,
        folderInformation = d.folderInformation;
      if (folder === this._currentFolder) {
        this._currentFolderInformation = folderInformation;
        this.changed.emit();
      }
      this._currentFolderInformationCache[folder] = folderInformation;
    };
    this._socket = socket;
  }
  private _update(): void {
    this._currentFolderInformation =
      this._currentFolderInformationCache[this._currentFolder] || {};
    this.changed.emit();
    this._relay();
  }
  private _relay(): void {
    clearTimeout(this._timeout);
    this._timeout = window.setTimeout(() => {
      const socket = this._socket;
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            currentPath: this._currentPath,
            currentFolder: this._currentFolder
          })
        );
      }
    }, 10);
  }
  get currentPath() {
    return this._currentPath;
  }
  set currentPath(path: string) {
    this._currentPath = path;
    this._update();
  }
  get currentFolder() {
    return this._currentFolder;
  }
  set currentFolder(folder: string) {
    this._currentFolder = folder || '.';
    this._update();
  }
  get currentFolderInformation() {
    return this._currentFolderInformation;
  }
  disconnect(): void {
    clearTimeout(this._timeout);
    this._socket?.close();
  }
  changed = new Signal<this, void>(this);
  private _currentPath: string = '';
  private _currentFolder: string = '.';
  private _currentFolderInformation: any = {};
  private _currentFolderInformationCache: any = {};
  private _socket: WebSocket | undefined = undefined;
  private _timeout: number = 0;
}
