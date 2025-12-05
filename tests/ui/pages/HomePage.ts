// tests/ui/pages/HomePage.ts
import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateByURL() {
    await this.page.goto('/');
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }
}
