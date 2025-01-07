import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { UseSignal } from '@jupyterlab/ui-components';

import { logoIcon } from './constant';
import { requestAPI } from './handler';
import { CrossComputeModel } from './model';

export class CrossComputePanel extends ReactWidget {
  constructor(openPath: (path: string) => void) {
    super();
    this.id = 'crosscompute-panel';
    this.title.icon = logoIcon;
    this.model = new CrossComputeModel();
    this._openPath = openPath;
  }
  render(): JSX.Element {
    return (
      <UseSignal signal={this.model.changed}>
        {(): JSX.Element => (
          <>
            <div>labShellPath = {this.model.labShellPath}</div>
            <div>fileBrowserFolder = {this.model.fileBrowserFolder}</div>
            <div
              className="crosscompute-Link"
              onClick={() => {
                this._openPath(this.model.fileBrowserFolder + '/README.md');
              }}
            >
              README.md
            </div>
            <button
              onClick={() => {
                requestAPI<any>('get-example').then(data => {
                  this.model.log = data.abc;
                });
              }}
            >
              Click
            </button>
            <div>{this.model.log}</div>
          </>
        )}
      </UseSignal>
    );
  }
  model: CrossComputeModel;
  _openPath: (path: string) => void;
}
