import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_freeze extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_freeze:plugin',
  description: 'Jupyter freeze extension for jupyterlab!',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_freeze is activated!');
  }
};

export default plugin;
