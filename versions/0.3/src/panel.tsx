import React from 'react';
import { Message } from '@lumino/messaging';
import { ReactWidget } from '@jupyterlab/apputils';
import { UseSignal } from '@jupyterlab/ui-components';

import { logoIcon } from './constant';
import { CrossComputeModel } from './model';

export class CrossComputePanel extends ReactWidget {
  constructor(
    openFolder: (folder: string) => void,
    openPath: (path: string) => void
  ) {
    super();
    this.id = 'crosscompute-panel';
    this.model = new CrossComputeModel();
    this.addClass('jp-CrossComputePanel');

    const { title } = this;
    title.icon = logoIcon;
  }
  protected onBeforeShow(msg: Message): void {
    this.model.connect();
  }
  protected onAfterHide(msg: Message): void {
    this.model.disconnect();
  }
  render(): JSX.Element {
    return (
      <UseSignal signal={this.model.changed}>
        {(): JSX.Element => (
          <>
            <LabShellInformation model={this.model} />
            <FileBrowserInformation model={this.model} />
            <FileBrowserHistory model={this.model} />
          </>
        )}
      </UseSignal>
    );
  }

  model: CrossComputeModel;
}

const LabShellInformation = ({
  model
}: {
  model: CrossComputeModel;
}): JSX.Element => {
  return <div>{model.labShellPath}</div>;
};

const FileBrowserInformation = ({
  model
}: {
  model: CrossComputeModel;
}): JSX.Element => {
  return <div>{model.fileBrowserFolder}</div>;
};

const FileBrowserHistory = ({
  model
}: {
  model: CrossComputeModel;
}): JSX.Element => {
  return <div>file browser history</div>;
};
