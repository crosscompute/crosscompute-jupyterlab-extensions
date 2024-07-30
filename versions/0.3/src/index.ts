import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDefaultFileBrowser } from '@jupyterlab/filebrowser';
import { CrossComputePanel } from './body';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-crosscompute:plugin',
  description: 'CrossCompute Extensions for JupyterLab',
  autoStart: true,
  requires: [ILabShell, IDefaultFileBrowser],
  activate: (
    app: JupyterFrontEnd,
    labShell: ILabShell,
    defaultFileBrowser: IDefaultFileBrowser
  ) => {
    console.log('app', app);
    const { shell } = app;

    // Change focus when user opens different files
    labShell.currentPathChanged.connect((sender, args) => {
      console.log('labShell.currentPathChanged', sender, args);
    });

    // Change path when user go up/down in left filebrowser
    if (defaultFileBrowser) {
      // Promise.all([app.restored, defaultFileBrowser.model.restored]).then(() => {
      defaultFileBrowser.model.pathChanged.connect((sender, args) => {
        console.log(
          'defaultFileBrowser pathChanged',
          defaultFileBrowser.model.path
        );
      });
      // });
    }
    // labShell.activeChanged.connect(f);
    // labShell.currentChanged.connect(f);
    // labShell.layoutModified.connect(f);
    const panel: CrossComputePanel = new CrossComputePanel();
    shell.add(panel, 'right', { rank: 700 });
  }
};

export default plugin;
