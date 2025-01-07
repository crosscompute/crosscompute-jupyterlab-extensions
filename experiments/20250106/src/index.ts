import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { Panel } from '@lumino/widgets';
import { LabIcon } from '@jupyterlab/ui-components';
import logoSvgstr from '../style/icons/Logo-SmallFormat-20230118.svg';

import { requestAPI } from './handler';

const logoIcon = new LabIcon({
  name: 'crosscompute:logo',
  svgstr: logoSvgstr
});

/**
 * Initialization data for the myextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'myextension:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  requires: [ILabShell],
  activate: (app: JupyterFrontEnd, labShell: ILabShell) => {
    const { shell } = app;
    const panel = new Panel();
    panel.id = 'myextension-panel';
    panel.title.icon = logoIcon;
    shell.add(panel, 'right', { rank: 700 });
    labShell.currentPathChanged.connect((sender, args) => {
      console.log(args.newValue);
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
