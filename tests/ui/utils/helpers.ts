// helpers.ts

import { Locator, Page } from '@playwright/test';

export async function waitForContentLoaded(
  page: Page,
  testId= 'loading-spinner',
  timeout: number = 60000,
): Promise<void> {
  const loadingCircle: Locator = page
    .getByTestId(testId)
  await loadingCircle.waitFor({
    state: 'hidden',
    timeout,
  });
}
