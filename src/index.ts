/* 
  Unless explicitly stated otherwise all files in this repository are licensed under the BSD 3-Clause License.
  This product includes software developed at Datadog (https://www.datadoghq.com/) Copyright 2023 Datadog, Inc.
*/

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import { NotebookPanel } from '@jupyterlab/notebook';
import { FreezeWidget } from './freeze';

const PLUGIN_ID = 'jupyterlab_freeze:plugin';
const FREEZE_KEY = '--jp-freeze-frozen-bg';
const READONLY_KEY = '--jp-freeze-readonly-bg';

/**
 * Initialization data for the jupyterlab-freeze extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: 'Jupyterlab version of freeze extension',
  autoStart: true,
  requires: [INotebookTracker, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker,
    settingRegistry: ISettingRegistry
  ) => {
    console.log('JupyterLab extension jupyterlab_freeze is activated!');
    let frozen_bg = null;
    let readonly_bg = null;

    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      frozen_bg = setting.get(FREEZE_KEY).composite as string;
      readonly_bg = setting.get(READONLY_KEY).composite as string;
      document.documentElement.style.setProperty(FREEZE_KEY, frozen_bg);
      document.documentElement.style.setProperty(READONLY_KEY, readonly_bg);
    }

    Promise.all([app.restored, settingRegistry.load(PLUGIN_ID)])
      .then(([, setting]) => {
        loadSetting(setting);

        setting.changed.connect(loadSetting);
      })
      .catch(reason => {
        console.error(
          `jupyterlab_freeze: Something went wrong when reading the settings.\n${reason}`
        );
      });

    notebookTracker.widgetAdded.connect(
      (_: any, notebookPanel: NotebookPanel) => {
        // Retrieve notebook toolbar
        const notebookToolbar = notebookPanel.toolbar;
        // Create the widget
        const freezeWidget = new FreezeWidget(notebookPanel);
        // Add the widget to the toolbar
        notebookToolbar.addItem('freeze', freezeWidget);

        notebookPanel.disposed.connect(() => {
          freezeWidget.dispose();
        });
      }
    );
  }
};

export default plugin;
