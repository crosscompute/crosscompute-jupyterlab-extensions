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
            <LabShellPathInformation
              model={this.model}
              openFolder={this._openFolder}
            />
            <FileBrowserFolderInformation model={this.model} />
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

const LabShellPathInformation = ({
  model,
  openFolder
}: {
  model: CrossComputeModel;
  openFolder: (folder: string) => void;
}) => {
  const { labShellPath } = model;
  if (!labShellPath) {
    return null;
  }
  return (
    <div>
      <div>Lab Shell Path</div>
      <div>{labShellPath}</div>
    </div>
  );
};

const FileBrowserFolderInformation = ({
  model
}: {
  model: CrossComputeModel;
}) => {
  const { fileBrowserFolder } = model;
  return (
    <div className="jp-crosscompute-FileBrowserFolderInformation">
      <div>
        <div>File Browser Folder</div>
        <div>{fileBrowserFolder}</div>
      </div>
      <FileBrowserFolderDetail model={model} />
    </div>
  );
};

const FileBrowserFolderDetail = ({
  model
}: {
  model: CrossComputeModel;
}) => {
  const { fileBrowserFolderInformation } = model;
  const { informationByPath } = fileBrowserFolderInformation;
  if (
    informationByPath === undefined ||
    !Object.keys(informationByPath).length
  ) {
    return null;
  }
  const folder = model.fileBrowserFolder;
  // restore selected using current folder in model
  const configurationPaths = Object.keys(informationByPath);
  const configurationPath = model.configurationPathByFolder[folder] || configurationPaths[0];
  // const [selected, setSelected] = useState(configurationPaths[0]);
  /*
  setSelected
   */
  return (
    <>
      <div>
        <div>Configuration Path</div>
        <div>
          {configurationPaths.length === 1 ? (
            configurationPaths[0]
          ) : (
            <select value={configurationPath} onChange={(e) => {
              model.updateConfigurationPath(folder, e.target.value);
              // setSelected(e.target.value)
              // TODO: store selected based on current folder
            }}>
              {configurationPaths.map(path => (
                <option>{path}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div>
        <div>Configuration Name</div>
        <div>
          {configurationPaths.length === 1 ? (
            informationByPath[configurationPaths[0]].name
          ) : (
            informationByPath[configurationPath].name
          )}
        </div>
      </div>
      <div>
        <div>Configuration Version</div>
        <div>
          {configurationPaths.length === 1 ? (
            informationByPath[configurationPaths[0]].version
          ) : (
            informationByPath[configurationPath].version
          )}
        </div>
      </div>
      <button>Launch</button>
      <button>Stop</button>
    </>
  );
};

/*
const FileBrowserFolderError = ({
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
