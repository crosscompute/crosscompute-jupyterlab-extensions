import { LabIcon } from '@jupyterlab/ui-components';

import logoSvgstr from '../style/icons/Logo-SmallFormat-20230118.svg';

export const logoIcon = new LabIcon({
  name: 'crosscompute:logo',
  svgstr: logoSvgstr
});
export const NAMESPACE = 'jupyterlab-crosscompute';
export const S_FILEBROWSER = 'File Browser';
export const S_LABSHELL = 'Lab Shell';
