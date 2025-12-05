// tests/ui/utils/verifyNewPage.ts

import { BrowserContext,expect } from '@playwright/test';
import { getBaseUrl } from './urlHelpers';

interface VerifyNewPageOptions {
  compareBaseUrl?: boolean; // Flag to compare only base URLs
}

export async function verifyNewPage(
  context: BrowserContext,
  action: () => Promise<void>,
  expectedUrl: string,
  options: VerifyNewPageOptions = {},
): Promise<void> {
  // Listen for a new page to be opened
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    action(), // Perform the action that should open a new tab
  ]);

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Get the URL of the new page
  const newPageUrl = newPage.url();

  // Decide whether to compare base URLs or full URLs
  if (options.compareBaseUrl) {
    // Compare base URLs
    const baseNewPageUrl = getBaseUrl(newPageUrl);
    const baseExpectedUrl = getBaseUrl(expectedUrl);
    expect(baseNewPageUrl).toBe(baseExpectedUrl);
  } else {
    // Compare full URLs
    expect(newPageUrl).toBe(expectedUrl);
  }
}
