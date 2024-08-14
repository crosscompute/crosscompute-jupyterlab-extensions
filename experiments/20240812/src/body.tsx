import { ISignal, Signal } from '@lumino/signaling';
import { requestAPI } from './handler';

export class CrossComputePanel extends ReactWidget {
  private _config: { name: string; version: string };
  private _onClickLaunch = () => {
    this._isRunning = true;
    // TODO: send launch request to launch endpoint

    // Wait until backend ready

    // Update log accordingly
    this._log = 'click launch button';
    this._stateChanged.emit();
  };

  private _onClickStop = () => {
    this._isRunning = false;

    // TODO: send stop request to launch endpoint

    // Wait until backend ready

    // Update log accordingly
    this._log = 'click stop button';
    this._stateChanged.emit();
  };

  constructor(openPath: any, openFolder: any) {
    this.addClass('jp-react-widget');

    this._curFile = '';
    this._curDir = '';
    this._config = {
      name: '',
      version: ''
    };
    this._cache = {};
    this._stateChanged = new Signal<this, void>(this);
    this._isRunning = false;
    this._log = '';

    this._openPath = openPath;
    this._openFolder = openFolder;
  }

  render(): JSX.Element {
    return (
      <UseSignal signal={this._stateChanged}>
        {(): JSX.Element => (
          <div>
            <div>Current File: {this._curFile}</div>
            <div>Current Dir: {this._curDir}</div>
            <div>Config:</div>
            <div>Name: {this._config.name}</div>
            <div>Version: {this._config.version}</div>
            {this._isRunning ? (
              <button onClick={this._onClickStop}>Stop</button>
            ) : (
              <button onClick={this._onClickLaunch}>Launch</button>
            )}

            <div>Running Log: </div>
            <div>{this._log}</div>
            <a className="crosscompute-Link" onClick={() => this._openPath('jupyterlab-crosscompute/versions/0.3/src/index.ts')}>
          Test OpenPath
        </a>

            <a className="crosscompute-Link" onClick={() => this._openFolder('jupyterlab-crosscompute/versions/0.3/src/')}>
          Test OpenFolder
        </a>

          </div>
        )}
      </UseSignal>
    );
  }

  // updatePath(curFile: string, curDir: string) {
  updatePath(currentPath: string) {
    this._config = this._cache[currentPath] || {};
    this._stateChanged.emit();

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
        requestAPI<any>('get-example?path=' + currentPath)
    .then(data => {
        // TODO: Update cache using results from backend
        // TODO: Only update front end if backend results matches front end focus
        const { path } = data;
        this._cache[path] = data;
        if (path === currentPath) {
          this._config = data;
          this._stateChanged.emit();
        }
    })
    .catch(reason => {
        console.error(
          `The jupyterlab_crosscompute server extension appears to be missing.\n${reason}`
        );
      });
      }, 3000);

  }

  updateLog(log: string) {
      this._log = log;
      this._stateChanged.emit();
  }

  public get stateChanged(): ISignal<this, void> {
    return this._stateChanged;
  }
