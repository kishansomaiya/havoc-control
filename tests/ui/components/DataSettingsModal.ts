// tests/ui/components/DataSettingsModal.ts

import { Page, Locator, expect } from '@playwright/test';
import { waitForContentLoaded } from '@utils/helpers';

export class DataSettingsModal {
  readonly page: Page;

  readonly Body: Locator;
  readonly Title: Locator;
  readonly Description: Locator;
  readonly CategorySection: Locator;
  readonly Category: Locator;
  readonly CategoryToggle: Locator;
  readonly CategoryToggleTitle: Locator;
  readonly CategoryToggleButton: Locator;

  readonly CategoryTypeOption: Locator;
  readonly CategoryTypeOptionCheckbox: Locator;
  readonly CategoryTypeOptionCheckboxSelectAll: Locator;
  readonly CategoryTypeOptionCheckboxSelectAllButton: Locator;
  readonly CategoryTypeOptionCheckboxLabel: Locator;
  readonly CategoryTypeOptionCheckboxButton: Locator;

  // Temperature
  readonly CategoryTemperature: Locator;
  readonly CategoryTemperatureToggleButton: Locator;
  readonly CategoryTemperatureChronicSelectAll: Locator;
  readonly CategoryTemperatureSelectAll: Locator;
  readonly CategoryTemperatureSelectAllButton: Locator;

  // Wind
  readonly CategoryWind: Locator;
  readonly CategoryWindToggleButton: Locator;

  // Water
  readonly CategoryWater: Locator;
  readonly CategoryWaterToggleButton: Locator;

  // Solid Mass
  readonly CategorySolidMass: Locator;
  readonly CategorySolidMassToggleButton: Locator;

  // Buttons
  readonly ApplyButton: Locator;
  readonly CancelButton: Locator;
  readonly XIcon: Locator;
  readonly ErrorMessage: Locator;

  // "Unsaved Changes" modal
  readonly UnsavedChangesModal: Locator;
  readonly UnsavedChangesModalTitle: Locator;
  readonly UnsavedChangesModalDescription: Locator;
  readonly UnsavedChangesModalGoBackButton: Locator;
  readonly UnsavedChangesModalDiscardChangesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.Body = page.getByTestId('data-settings-modal');
    this.Title = page.getByTestId('data-settings-modal-title');
    this.Description = page.getByTestId('data-settings-modal-description');

    // Categories
    this.CategorySection = page.getByTestId(
      'data-settings-modal-hazards-category-section',
    );
    this.Category = page.getByTestId('data-settings-modal-hazard-category');
    this.CategoryToggle = page.getByTestId(
      'data-settings-modal-hazard-category-toggle',
    );
    this.CategoryToggleTitle = page.getByTestId(
      'data-settings-modal-hazard-category-toggle-title',
    );
    this.CategoryToggleButton = page.getByTestId(
      'data-settings-modal-hazard-category-toggle-button',
    );

    this.CategoryTypeOption = page.getByTestId(
      'data-settings-modal-disclosure-type-option',
    ); // Chronic Options, Acute Options
    this.CategoryTypeOptionCheckbox = page.getByTestId(
      'data-settings-modal-checkbox',
    );
    this.CategoryTypeOptionCheckboxSelectAll = page.getByTestId(
      'data-settings-modal-checkbox-select-all',
    );
    this.CategoryTypeOptionCheckboxSelectAllButton = page.getByTestId(
      'data-settings-modal-checkbox-select-all-button',
    );
    this.CategoryTypeOptionCheckboxLabel = page.getByTestId(
      'data-settings-modal-checkbox-label',
    );
    this.CategoryTypeOptionCheckboxButton = page.getByTestId(
      'data-settings-modal-checkbox-button',
    );

    // Temperature
    this.CategoryTemperature = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: 'Temperature' }),
      },
    );
    this.CategoryTemperatureToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: 'Temperature' });

    this.CategoryTemperatureSelectAll = page
      .locator('[data-testid="data-settings-modal-checkbox-select-all"]')
      .filter({ hasText: 'Temperature' });

    this.CategoryTemperatureSelectAllButton = page
      .locator('[data-testid="data-settings-modal-checkbox-select-all"]')
      .filter({ hasText: 'Temperature' })
      .locator('input');

    // Wind
    this.CategoryWind = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: 'Wind' }),
      },
    );
    this.CategoryWindToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: 'Wind' });

    // Water
    this.CategoryWater = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: 'Water' }),
      },
    );
    this.CategoryWaterToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: 'Water' });

    // Solid Mass
    this.CategorySolidMass = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: 'Solid Mass' }),
      },
    );
    this.CategorySolidMassToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: 'Solid Mass' });

    // Buttons
    this.CancelButton = page.getByTestId('data-settings-modal-cancel-button');
    this.ApplyButton = page.getByTestId('data-settings-modal-apply-button');
    this.XIcon = page.getByTestId('data-settings-modal-x-icon');

    // Error message
    this.ErrorMessage = page.getByTestId('data-settings-modal-error-message');

    // Unsaved Changes
    this.UnsavedChangesModal = page.getByTestId('confirm-modal-box');
    this.UnsavedChangesModalTitle = page.getByTestId('confirm-modal-title');
    this.UnsavedChangesModalDescription = page.getByTestId(
      'confirm-modal-message-box',
    );
    this.UnsavedChangesModalGoBackButton = page.getByTestId(
      'confirm-modal-button-cancel',
    );
    this.UnsavedChangesModalDiscardChangesButton = page.getByTestId(
      'confirm-modal-button-confirm',
    );
  }

  async validateControlsAll() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.Title).toBeVisible();
    await expect(this.Description).toBeVisible();
    await expect(this.XIcon).toBeVisible();
    await expect(this.CategorySection).toBeVisible();
    await this.CategoryTemperature.scrollIntoViewIfNeeded();
    await expect(this.CategoryTemperature).toBeVisible();
    await this.CategoryWind.scrollIntoViewIfNeeded();
    await expect(this.CategoryWind).toBeVisible();
    await this.CategoryWater.scrollIntoViewIfNeeded({});
    await expect(this.CategoryWater).toBeVisible();
    await this.CategorySolidMass.scrollIntoViewIfNeeded();
    await expect(this.CategorySolidMass).toBeVisible();
    await expect(this.CancelButton).toBeVisible();
    await expect(this.ApplyButton).toBeVisible();
  }

  async validateControlsSingle(category: string) {
    const categoryTabLocator = this.page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      { has: this.page.locator('h6', { hasText: `${category}` }) },
    );
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.Title).toBeVisible();
    await expect(this.Description).toBeVisible();
    await expect(this.XIcon).toBeVisible();
    await expect(this.CategorySection).toBeVisible();
    await categoryTabLocator.scrollIntoViewIfNeeded();
    await expect(categoryTabLocator).toBeVisible();
    await expect(this.CategoryToggle).not.toBeVisible();
  }

  async validateUnsavedChangesModalControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.UnsavedChangesModal).toBeVisible();
    await expect(this.UnsavedChangesModalTitle).toBeVisible();
    await expect(this.UnsavedChangesModalTitle).toContainText(
      'Unsaved Changes',
    );
    await expect(this.UnsavedChangesModalDescription).toBeVisible();
    await expect(this.UnsavedChangesModalDescription).toContainText(
      'Would you like to continue without applying the changes?',
    );
    await expect(this.UnsavedChangesModalGoBackButton).toBeVisible();
    await expect(this.UnsavedChangesModalGoBackButton).toContainText('Go Back');
    await expect(this.UnsavedChangesModalDiscardChangesButton).toBeVisible();
    await expect(this.UnsavedChangesModalDiscardChangesButton).toContainText(
      'Discard Changes',
    );
  }

  async clickOnCancelNoChanges() {
    await expect(this.CancelButton).toBeVisible();
    await this.CancelButton.click();
    await this.Body.waitFor({
      state: 'hidden',
    });
  }

  async clickOnCancelWithChanges() {
    await expect(this.CancelButton).toBeVisible();
    await this.CancelButton.click();
    await expect(this.UnsavedChangesModal).toBeVisible();
  }

  async clickOnXIconNoChanges() {
    await expect(this.CancelButton).toBeVisible();
    await this.CancelButton.click();
    await this.Body.waitFor({
      state: 'hidden',
    });
  }

  async clickOnXIconWithChanges() {
    await expect(this.CancelButton).toBeVisible();
    await this.CancelButton.click();
    await expect(this.UnsavedChangesModal).toBeVisible();
  }

  async clickOnApply() {
    await expect(this.ApplyButton).toBeVisible();
    await this.ApplyButton.click();
    await this.Body.waitFor({
      state: 'hidden',
    });
  }

  // Method to Disable Toggle by it's name
  async disableToggle(toggleName) {
    // Locate the toggle button inside the specified hazard category
    const toggle = this.page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: toggleName })
      .locator(
        '[data-testid="data-settings-modal-hazard-category-toggle-button"]',
      );

    // Ensure the toggle is in view by scrolling to it if it's not visible
    await toggle.scrollIntoViewIfNeeded();

    // Check if the toggle is currently selected (checked)
    const isChecked = await toggle.evaluate((element) =>
      element.classList.contains('Mui-checked'),
    );

    // If it's checked, click to disable it
    if (isChecked) {
      await toggle.click();
    }

    // Assert that the toggle is now disabled
    const isCheckedAfter = await toggle.evaluate((element) =>
      element.classList.contains('Mui-checked'),
    );
    if (isCheckedAfter) {
      throw new Error(
        `The ${toggleName} toggle button is still enabled after attempting to disable it.`,
      );
    }
  }

  // Method to ENABLE Toggle by its name
  async enableToggle(toggleName) {
    // Locate the toggle button inside the specified hazard category
    const toggle = this.page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: toggleName })
      .locator(
        '[data-testid="data-settings-modal-hazard-category-toggle-button"]',
      );

    // Ensure the toggle is in view by scrolling to it if it's not visible
    await toggle.scrollIntoViewIfNeeded();

    // Check if the toggle is currently selected (checked)
    const isChecked = await toggle.evaluate((element) =>
      element.classList.contains('Mui-checked'),
    );

    // If it's not checked, click to enable it
    if (!isChecked) {
      await toggle.click();
    }

    // Assert that the toggle is now enabled (checked)
    const isCheckedAfter = await toggle.evaluate((element) =>
      element.classList.contains('Mui-checked'),
    );
    if (!isCheckedAfter) {
      throw new Error(
        `The ${toggleName} toggle button is still disabled after attempting to enable it.`,
      );
    }
  }
}
