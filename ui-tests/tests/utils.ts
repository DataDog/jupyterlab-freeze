import { IJupyterLabPageFixture } from '@jupyterlab/galata';

export async function openAdvancedToolsWindow(page: IJupyterLabPageFixture) {
  await page.click('svg[data-icon="ui-components:build"]');
  await page.click('span:has-text("Advanced Tools")');
}

export async function getMetadata(page: IJupyterLabPageFixture) {
  const metadata = await page.evaluate(() => {
    const labels = document.querySelectorAll('label.lm-Widget');

    for (const label of labels) {
      if (label.textContent === 'Cell metadata' && label.nextElementSibling) {
        const allLines =
          label.nextElementSibling.querySelectorAll('div.cm-line');
        let content: string[] = [];
        for (const line of allLines) {
          content.push(line.textContent as string);
        }
        return JSON.parse(content.join(''));
      }
    }
    return null;
  });
  return metadata;
}
