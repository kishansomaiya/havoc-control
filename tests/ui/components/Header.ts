// tests/ui/components/Header.ts

import { Page, Locator,expect } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly Header: Locator;
  readonly Title: Locator;
  readonly TitleText: string;
  readonly Logo: Locator;
  readonly LogoImg: Locator;
  readonly WelcomeBack: Locator;
  readonly WelcomeBackText: string;
  readonly UserIcon: Locator;
  readonly CompanyName: Locator;
  readonly CompanyNameText: string;
  readonly KnowledgeBaseBttn: Locator;
  readonly KnowledgeBaseBttnName: string;
  readonly KnowledgeBaseUrl: string;
  readonly KnowledgeBaseIdentityUrl: string;
  readonly DropDownBttn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Header = page.getByTestId('top-header-block');
    this.Logo = page.getByTestId('top-header-logo');
    this.LogoImg = page.getByTestId('top-header-logo-img');
    this.WelcomeBack = page.getByTestId('top-header-welcome-user-text');
    this.WelcomeBackText =
      'Welcome back, csg-cypress@testing.jupiterintel.com'; // hardcoded
    this.UserIcon = page.getByTestId('top-header-user-icon');
    this.CompanyName = page.getByTestId('top-header-user-company');
    this.CompanyNameText = 'Jupiter Testing'; // hardcoded
    this.Title = page.getByTestId('top-header-title');
    this.TitleText = 'ClimateScore Global';
    this.KnowledgeBaseBttn = page.getByTestId(
      'top-header-knowledge-base-button',
    );
    this.KnowledgeBaseBttnName = 'Knowledge Base';
    this.KnowledgeBaseUrl = 'https://jupiterintel.document360.io/';
    this.KnowledgeBaseIdentityUrl = 'https://identity.document360.io/';
    this.DropDownBttn = page
      .getByTestId('top-header-menu-drop-down-arrow')
      .getByRole('img');
  }

  async validateHeaderControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await expect(this.Logo).toBeVisible({ timeout: 20000 });
    await expect(this.Title).toBeVisible({ timeout: 20000 });
    await expect(this.KnowledgeBaseBttn).toBeVisible({ timeout: 20000 });
    await expect(this.UserIcon).toBeVisible({ timeout: 20000 });
    await expect(this.WelcomeBack).toBeVisible({ timeout: 20000 });
    await expect(this.CompanyName).toBeVisible({ timeout: 20000 });
    await expect(this.DropDownBttn).toBeVisible({ timeout: 20000 });
    await expect(this.WelcomeBack).toBeVisible({ timeout: 10000 });
  }

  async clickOnTheLogo() {
    await this.Logo.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async clickOnKnowledgeBase() {
    await this.KnowledgeBaseBttn.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }
  async clickOnDropDown() {
    await this.DropDownBttn.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }
}
