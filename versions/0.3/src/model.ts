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
      const folder = d.fileBrowserFolder,
        folderInformation = d.fileBrowserFolderInformation;
      if (folder === this._fileBrowserFolder) {
        this._fileBrowserFolderInformation = folderInformation;
        this.changed.emit();
      }
      this._fileBrowserFolderInformationCache[folder] = folderInformation;
    };
    this._socket = socket;
  }
  private _update(): void {
    this._fileBrowserFolderInformation =
      this._fileBrowserFolderInformationCache[this._fileBrowserFolder] || {};
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
            labShellPath: this._labShellPath,
            fileBrowserFolder: this._fileBrowserFolder
          })
        );
      }
    }, 10);
  }
  get labShellPath() {
    return this._labShellPath;
  }
  set labShellPath(path: string) {
    this._labShellPath = path;
    this._update();
  }
  get fileBrowserFolder() {
    return this._fileBrowserFolder;
  }
  set fileBrowserFolder(folder: string) {
    this._fileBrowserFolder = folder || '.';
    this._update();
  }
  get fileBrowserFolderInformation() {
    return this._fileBrowserFolderInformation;
  }
  disconnect(): void {
    clearTimeout(this._timeout);
    this._socket?.close();
  }
  changed = new Signal<this, void>(this);
  private _labShellPath: string = '';
  private _fileBrowserFolder: string = '.';
  private _fileBrowserFolderInformation: any = {};
  private _fileBrowserFolderInformationCache: any = {};
  private _socket: WebSocket | undefined = undefined;
  private _timeout: number = 0;
}
