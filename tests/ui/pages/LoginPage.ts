// tests/ui/pages/LoginPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly EmailAddressInput: Locator;
  readonly SignInText: Locator;
  readonly EnterPasswordText: Locator;
  readonly PasswordInput: Locator;
  readonly ContinueBttn: Locator;
  readonly Title: Locator;
  readonly WelcomeBackText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.EmailAddressInput = page.getByLabel('Email address');
    this.SignInText = page.getByText('If you have already signed up');
    this.ContinueBttn = page.getByRole('button', {
      name: 'Continue',
      exact: true,
    });
    this.EnterPasswordText = page.getByRole('heading', {
      name: 'Enter Your Password',
    });
    this.PasswordInput = page.getByRole('textbox', { name: 'Password' });
    this.Title = page.getByRole('link', { name: 'Jupiter Intelligence' });
    this.WelcomeBackText = page.getByRole('heading', { name: 'Welcome back' });
  }

  async navigateByURL() {
    await this.page.goto('/');
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async loginToApplication(username: string, password: string) {
    await expect(this.SignInText).toBeVisible();
    await this.EmailAddressInput.fill(username);
    await this.ContinueBttn.click();
    await expect(this.EnterPasswordText).toBeVisible();
    await this.PasswordInput.fill(password);
    await this.ContinueBttn.click();
  }

  async validateControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await expect(this.SignInText).toBeVisible();
    await expect(this.EmailAddressInput).toBeVisible();
    await expect(this.ContinueBttn).toBeVisible();
  }
}
