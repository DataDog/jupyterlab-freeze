/* 
  Unless explicitly stated otherwise all files in this repository are licensed under the BSD 3-Clause License.
  This product includes software developed at Datadog (https://www.datadoghq.com/) Copyright 2023 Datadog, Inc.
*/

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { NotebookPanel } from '@jupyterlab/notebook';
import { FreezeWidget } from './freeze';

/**
 * Initialization data for the jupyterlab-freeze extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-freeze:plugin',
  description: 'Jupyterlab version of freeze extension',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension jupyterlab-freeze is activated!');

    notebookTracker.widgetAdded.connect((_: any, notebookPanel: NotebookPanel) => {
      // Retrieve notebook toolbar
      const notebookToolbar = notebookPanel.toolbar;
      // Create the widget
      const freezeWidget = new FreezeWidget(notebookPanel);
      // Add the widget to the toolbar
      notebookToolbar.addItem('freeze', freezeWidget);

      notebookPanel.disposed.connect(() => {
        freezeWidget.dispose();
      });
    });
  }
};

export default plugin;
