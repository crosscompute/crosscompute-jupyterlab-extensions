import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import RunAutomationButton from './RunAutomationButton';
import { LogDialogWidget } from './DialogWidget';

function activate(
  tracker: INotebookTracker,
  palette: ICommandPalette
): void {
  app.commands.addCommand(RUN_AUTOMATION_COMMAND, {
    label: 'Run Automation',
    execute: async () => {
      const { context } = tracker.currentWidget;

      // Save notebook
      if (context.model.dirty && !context.model.readOnly) {
        await context.save();
      }

      const formData = new FormData();
      formData.append('path', context.path);
      const d = await requestAPI<any>('prints', {
        method: 'POST',
        body: formData,
      });
      LogDialogWidget(d.id);
    },
  });
  // Add widgets
  const runAutomationButton = new RunAutomationButton(app);
  app.docRegistry.addWidgetExtension('Notebook', runAutomationButton);
}
