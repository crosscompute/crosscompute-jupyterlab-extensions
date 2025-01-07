import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

import { logoIcon } from './constant';

export class CrossComputePanel extends ReactWidget {
  constructor() {
    super();
    this.id = 'crosscompute-panel';
    this.title.icon = logoIcon;
  }
  render(): JSX.Element {
    return <>whee</>;
  }
}
