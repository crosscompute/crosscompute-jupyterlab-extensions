import React from 'react';
import { Message } from '@lumino/messaging';
import { ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

import { logoIcon, NAMESPACE } from './constant';
import { CrossComputeModel } from './model';

export class CrossComputePanel extends ReactWidget {
  constructor(
    openFolder: (folder: string) => void,
    openPath: (path: string) => void,
  ) {
    super();
    this.id = 'crosscompute-panel';
    this.model = new CrossComputeModel();
    this._eventSource = undefined;

    const { title } = this;
    title.icon = logoIcon;
  }
  protected onBeforeShow(msg: Message): void {
    const settings = ServerConnection.makeSettings();
    const eventSource = new EventSource(URLExt.join(
      settings.baseUrl, NAMESPACE, 'updates.json'));
    this._eventSource = eventSource;
    eventSource.onmessage = function(message) {
      console.log(message);
    };
  }
  protected onAfterHide(msg: Message): void {
    this._eventSource?.close();
  }
  render(): JSX.Element {
    return (
      <CrossComputePaper />
    );
  }

  model: CrossComputeModel;
  private _eventSource: EventSource | undefined;
}

const CrossComputePaper = ({
}: {
}): JSX.Element => {
  return (
    <div>
      whee!
    </div>
  );
};
