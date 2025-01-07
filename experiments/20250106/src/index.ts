import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDefaultFileBrowser } from '@jupyterlab/filebrowser';
import { IDocumentManager } from '@jupyterlab/docmanager';

import { requestAPI } from './handler';
import { CrossComputePanel } from './panel';

/**
 * Initialization data for the myextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'myextension:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  requires: [ILabShell, IDefaultFileBrowser, IDocumentManager],
  activate: (
    app: JupyterFrontEnd,
    labShell: ILabShell,
    fileBrowser: IDefaultFileBrowser,
    documentManager: IDocumentManager
  ) => {
    const { shell } = app;
    const openPath = (path: string) => documentManager.openOrReveal(path);
    const panel: CrossComputePanel = new CrossComputePanel(openPath);
    shell.add(panel, 'right', { rank: 700 });
    labShell.currentPathChanged.connect((sender, args) => {
      console.log(args.newValue);
      panel.model.labShellPath = args.newValue;
    });
    fileBrowser.model.pathChanged.connect((sender, args) => {
      panel.model.fileBrowserFolder = args.newValue;
    });

    console.log('JupyterLab extension myextension is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The myextension server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
