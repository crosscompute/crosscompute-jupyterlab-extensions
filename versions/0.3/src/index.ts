import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-crosscompute:plugin',
  description: 'CrossCompute Extensions for JupyterLab',
  autoStart: true,
  requires: [ILabShell],
  activate: (app: JupyterFrontEnd, labShell: ILabShell) => {
    console.log('app', app);
    // const { shell } = app;

    labShell.currentPathChanged.connect((sender, args) => {
      console.log('labShell.currentPathChanged');
      console.log('sender', sender);
      console.log('args', args);
    });

    // labShell.activeChanged.connect(f);
    // labShell.currentChanged.connect(f);
    // labShell.layoutModified.connect(f);
  }
};

export default plugin;
