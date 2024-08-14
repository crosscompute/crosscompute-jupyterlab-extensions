import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IDefaultFileBrowser } from '@jupyterlab/filebrowser';

import { S_FILEBROWSER, S_LABSHELL } from './constant';
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
    shell.add(panel, 'right', { rank: 7000 });
    if (restorer) {
      restorer.add(panel, panel.id);
    }
    labShell.activeChanged.connect((sender, args) => {
      const shellPath = labShell.currentPath;
      if (args.newValue && shellPath) {
        panel.model.update(S_LABSHELL, shellPath);
      } else {
        panel.model.update(S_FILEBROWSER, fileBrowser.model.path);
      }
    });
    if (fileBrowser) {
      fileBrowser.model.pathChanged.connect((sender, args) => {
        panel.model.update(S_FILEBROWSER, args.newValue);
      });
    }
  }
};

export default plugin;
