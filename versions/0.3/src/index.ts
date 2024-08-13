import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IDefaultFileBrowser } from '@jupyterlab/filebrowser';

import { CrossComputePanel } from './panel';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-crosscompute:plugin',
  description: 'CrossCompute Extensions for JupyterLab',
  autoStart: true,
  requires: [IDefaultFileBrowser, ILabShell, IDocumentManager],
  optional: [ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    fileBrowser: IDefaultFileBrowser,
    labShell: ILabShell,
    documentManager: IDocumentManager,
    restorer?: ILayoutRestorer
  ) => {
    const { shell } = app;

    const openFolder = (folder: string) => {
      fileBrowser.model.cd(folder);
      labShell.activateById(fileBrowser.id);
    };
    const openPath = (path: string) => documentManager.openOrReveal(path);

    const panel: CrossComputePanel = new CrossComputePanel(
      openFolder,
      openPath
    );
    labShell.currentPathChanged.connect((sender, args) => {
      console.log('labShell', args);
      // panel.model.updatePath(args['newValue']);
    });
    if (fileBrowser) {
      fileBrowser.model.pathChanged.connect((sender, args) => {
        console.log('fileBrowser', args);
        // panel.model.updatePath(args['newValue']);
      });
    }

    shell.add(panel, 'right', { rank: 7000 });
    if (restorer) {
      restorer.add(panel, panel.id);
    }
  }
};

export default plugin;
