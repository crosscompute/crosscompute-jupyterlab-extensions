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

    const { title } = this;
    title.icon = logoIcon;

    this._openFolder = openFolder;
    this._openPath = openPath;
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
            <CurrentPathInformation
              model={this.model}
              openFolder={this._openFolder}
            />
            <CurrentFolderInformation model={this.model} />
            <ConfigurationFolderHistory model={this.model} />
          </>
        )}
      </UseSignal>
    );
  }

  model: CrossComputeModel;
  _openFolder: (folder: string) => void;
  _openPath: (path: string) => void;
}

const CurrentPathInformation = ({
  model,
  openFolder
}: {
  model: CrossComputeModel;
  openFolder: (folder: string) => void;
}) => {
  const { currentPath } = model;
  if (!currentPath) {
    return null;
  }
  return (
    <div>
      <div>Current Path</div>
      <div>{currentPath}</div>
    </div>
  );
};

const CurrentFolderInformation = ({ model }: { model: CrossComputeModel }) => {
  const { currentFolder, currentFolderInformation } = model;
  const { informationByPath } = currentFolderInformation;
  return (
    <div className="jp-crosscompute-CurrentFolderInformation">
      <div>
        <div>Current Folder</div>
        <div>{currentFolder}</div>
      </div>
      <CurrentFolderDetail informationByPath={informationByPath} />
    </div>
  );
};

const CurrentFolderDetail = ({
  informationByPath
}: {
  informationByPath: any;
}) => {
  if (informationByPath === undefined) {
    return null;
  }
  const configurationPaths = Object.keys(informationByPath);
  return (
    <>
      <div>
        <div>Configuration Path</div>
        <div>
          {configurationPaths.length === 1 ? (
            configurationPaths[0]
          ) : (
            <select>
              {configurationPaths.map(path => (
                <option>{path}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </>
  );
};

/*
const FolderError = ({
}: {
}) => {
};
*/

const ConfigurationFolderHistory = ({
  model
}: {
  model: CrossComputeModel;
}) => {
  return <div>tool folder history</div>;
};
