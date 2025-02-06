import { IJupyterLabPageFixture, expect, test } from '@jupyterlab/galata';
import { getMetadata, openAdvancedToolsWindow } from './utils';
/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false, video: 'on', actionTimeout: 10000 });

async function markCellReadOnly(page: IJupyterLabPageFixture) {
  await page.click('div[title="Make selected cells read-only"] button');
}

async function markCellFreeze(page: IJupyterLabPageFixture) {
  await page.click('div[title="Freeze selected cells"] button');
}

async function markCellWriteable(page: IJupyterLabPageFixture) {
  await page.click('div[title="Lift restrictions from selected cells"] button');
}

test('should create a read cell', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto();

  // Create new notebook
  await page.notebook.createNew();

  // Mark cell as readonly
  await markCellReadOnly(page);
  await openAdvancedToolsWindow(page);

  const metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata.editable).toBeFalsy();
  expect(metadata.frozen).toBeFalsy();
});

test('should create a freeze cell', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto();

  // Create new notebook
  await page.notebook.createNew();

  // Mark cell as frozen
  await markCellFreeze(page);
  await openAdvancedToolsWindow(page);

  const metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata.editable).toBeFalsy();
  expect(metadata.frozen).toBeTruthy();
});

test('should create a read cell and then convert to normal', async ({
  page
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto();

  // Create new notebook
  await page.notebook.createNew();

  // Mark cell as readonly
  await markCellReadOnly(page);
  await openAdvancedToolsWindow(page);

  let metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata.editable).toBeFalsy();
  expect(metadata.frozen).toBeFalsy();

  // Convert to normal
  await markCellWriteable(page);
  metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata).not.toHaveProperty('editable'); // Special case, looks like editable is removed when is True
  expect(metadata.frozen).toBeFalsy();
});

test('should create a frozen cell and then convert to normal', async ({
  page
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto();

  // Create new notebook
  await page.notebook.createNew();

  // Mark cell as frozen
  await markCellFreeze(page);
  await openAdvancedToolsWindow(page);

  let metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata.editable).toBeFalsy();
  expect(metadata.frozen).toBeTruthy();

  // Convert to normal
  await markCellWriteable(page);
  metadata = await getMetadata(page);
  expect(metadata).not.toBeNull();
  expect(metadata).not.toHaveProperty('editable'); // Special case, looks like editable is removed when is True
  expect(metadata.frozen).toBeFalsy();
});
