import { Page, Locator,expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  readonly createNewClientBtn: Locator;
  readonly deleteClientBtns: Locator;
  readonly deleteConfirmBtn: Locator;
  readonly downloadReportsBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNewClientBtn = page.getByTestId('create-api-client-btn');
    this.deleteClientBtns = page.getByTestId('delete-client-btn');
    this.deleteConfirmBtn = page.getByTestId('confirm-modal-button-confirm');
    this.downloadReportsBtn = page.getByTestId(
      'usage-tracking-download-report',
    );
  }

  async navigateByURL() {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async createNewClient() {
    await expect(this.createNewClientBtn).toBeVisible();

    // There's no direct indication for the clients showing up, so just wait for two seconds for them
    // and proceed if it doesn't appear
    try {
      await this.deleteClientBtns.first().waitFor({ timeout: 2000 });
    } catch {}
    const preNumClients = await this.deleteClientBtns.count();
    await this.createNewClientBtn.click();

    await expect(this.deleteClientBtns).toHaveCount(preNumClients + 1);
  }

  async deleteFirstClient() {
    const initialCount = await this.deleteClientBtns.count();
    if (initialCount === 0) {
      return;
    }

    await this.deleteClientBtns.first().click();
    await this.deleteConfirmBtn.click();
    await expect(this.deleteClientBtns).toHaveCount(initialCount - 1);
  }

  async verifyUsageTracking() {
    await expect(
      this.page.getByTestId('usage-tracking-you-portfolios'),
    ).toBeVisible();
    await expect(
      this.page.getByTestId('usage-tracking-you-locations'),
    ).toBeVisible();
    await expect(
      this.page.getByTestId('usage-tracking-org-portfolios'),
    ).toBeVisible();
    await expect(
      this.page.getByTestId('usage-tracking-org-locations'),
    ).toBeVisible();

    await this.downloadReportsBtn.click();
    const download = await this.page.waitForEvent('download');


    expect(await download.path()).toBeTruthy();
  }
}
