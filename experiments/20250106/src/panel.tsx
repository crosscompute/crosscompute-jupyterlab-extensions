import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { UseSignal } from '@jupyterlab/ui-components';

import { logoIcon } from './constant';
import { CrossComputeModel } from './model';

export class CrossComputePanel extends ReactWidget {
  constructor() {
    super();
    this.id = 'crosscompute-panel';
    this.title.icon = logoIcon;
    this.model = new CrossComputeModel();
  }
  render(): JSX.Element {
    return (
      <UseSignal signal={this.model.changed}>
        {(): JSX.Element => <>{this.model.labShellPath}</>}
      </UseSignal>
    );
  }
  model: CrossComputeModel;
}
