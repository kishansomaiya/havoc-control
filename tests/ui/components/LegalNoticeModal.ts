// tests/ui/components/LegalNoticeModal.ts

import { Page, Locator, expect } from '@playwright/test';

export class LegalNoticeModal {
  readonly page: Page;
  readonly Heading: Locator;
  readonly TextLocator: Locator;
  readonly Text: string;
  readonly JupiterPrivacyPolicy: Locator;
  readonly JupiterPrivacyPolicyUrl: string;
  readonly LogOutBttn: Locator;
  readonly ConfirmBttn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Heading = page.getByTestId('confirm-modal-title');
    this.TextLocator = page.getByTestId('legal-notice-modal-message');
    this.Text =
      "I confirm that I am an authorized user of the ClimateScore Global application and that I will use the application solely in accordance with the terms of my company's agreement with Jupiter, or the Trial Agreement (if this is a trial and no agreement has been entered into between Jupiter and my company), including the requirement to treat the app and the Jupiter data accessed via the app as confidential information of Jupiter. I also acknowledge and agree to the Jupiter Privacy Policy which governs Jupiter's treatment of my personal information.";
    this.JupiterPrivacyPolicy = page.getByTestId(
      'legal-notice-modal-privacy-policy-link',
    );
    this.JupiterPrivacyPolicyUrl =
      'https://www.jupiterintel.com/legal/jupiters-acceptable-use-policy-for-jupiter-software-as-a-service';
    this.LogOutBttn = page.getByTestId('confirm-modal-button-cancel');
    this.ConfirmBttn = page.getByTestId('confirm-modal-button-confirm');
  }

  async confirmAgreementPolicy() {
    const LEGAL_ACKNOWLEDGE_KEY = 'legalAcknowledged';
    const LEGAL_ACKNOWLEDGE_VALUE = 'ACCEPTED';

    await expect(this.ConfirmBttn).toBeVisible({ timeout: 10000 });
    await this.ConfirmBttn.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await expect(this.Heading).not.toBeVisible();

    // Retrieve the value from local storage
    const value = await this.page.evaluate((key) => {
      return localStorage.getItem(key);
    }, LEGAL_ACKNOWLEDGE_KEY);

    // Check if the key exists and the value is as expected
    expect(value).not.toBeNull();
    expect(value).toBe(LEGAL_ACKNOWLEDGE_VALUE);
  }

  async declineAgreementPolicy() {
    const LEGAL_ACKNOWLEDGE_KEY = 'legalAcknowledged';

    await expect(this.LogOutBttn).toBeVisible({ timeout: 10000 });
    await this.LogOutBttn.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await expect(this.Heading).not.toBeVisible();

    // Retrieve the value from local storage
    const value = await this.page.evaluate((key) => {
      return localStorage.getItem(key);
    }, LEGAL_ACKNOWLEDGE_KEY);

    // Check if the key does not exist
    expect(value).toBeNull();
  }

  async validateControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    const href = await this.JupiterPrivacyPolicy.getAttribute('href');
    await expect(this.Heading).toBeVisible({ timeout: 10000 });
    await expect(this.TextLocator).toBeVisible({ timeout: 10000 });
    await expect(this.TextLocator).toContainText(this.Text, { timeout: 10000 });
    await expect(this.JupiterPrivacyPolicy).toBeVisible({ timeout: 10000 });
    await expect(href).toBe(this.JupiterPrivacyPolicyUrl);
    await expect(this.LogOutBttn).toBeVisible({ timeout: 20000 });
    await expect(this.ConfirmBttn).toBeVisible({ timeout: 10000 });
  }
}
