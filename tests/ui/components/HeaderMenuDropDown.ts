// tests/ui/components/HeaderMenuDropDown.ts

import { Page, Locator,expect } from '@playwright/test';

export class MenuDropDown {
  readonly page: Page;
  readonly DropDownList: Locator;
  readonly ThemeSwitcher: Locator;
  readonly ThemeSwitcherBlock: Locator;
  readonly Settings: Locator;
  readonly SettingsName: string;
  readonly LogoutBttn: Locator;
  readonly LogoutBttnName: string;

  constructor(page: Page) {
    this.page = page;
    this.DropDownList = page.getByTestId('menu-drop-down-list');
    // this.ThemeSwitcher = page.getByTestId('top-header-menu-drop-down-theme-stack')
    // this.ThemeSwitcherBlock = page.getByTestId('top-header-menu-drop-down-theme-switcher-block');
    this.Settings = page.getByTestId('top-header-menu-drop-down-settings');
    this.SettingsName = 'Settings';
    this.LogoutBttn = page.getByTestId('top-header-menu-drop-down-logout');
    this.LogoutBttnName = 'Logout';
  }

  async validateDropDownControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await expect(this.DropDownList).toBeVisible();
    // await expect(this.ThemeSwitcher).toBeVisible();
    await expect(this.Settings).toBeVisible();
    await expect(this.LogoutBttn).toBeVisible();
  }

  async clickOnSettings() {
    await this.Settings.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async clickOnTheme() {
    await this.ThemeSwitcherBlock.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async clickOnLogOut() {
    await this.LogoutBttn.click();
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }
}
