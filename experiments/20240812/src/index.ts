const plugin: JupyterFrontEndPlugin<void> = {
    // Change focus when users open different files
    labShell.currentPathChanged.connect((sender, args) => {
      panel.updatePath(args['newValue']);
    });

    // Change path when users go up/down in left filebrowser
    if (defaultFileBrowser) {
      defaultFileBrowser.model.pathChanged.connect((sender, args) => {
        panel.updatePath(defaultFileBrowser.model.path);
      });
    }
    source.onmessage = function(message) {
      panel.updateLog(message.data);
    };
  }
};
