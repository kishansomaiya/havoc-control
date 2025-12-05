// tests/ui/components/SingleLocationHeader.ts

import { Page, Locator,expect } from '@playwright/test';
import { waitForContentLoaded } from '@utils/helpers';

export class MetricsTable {
  readonly page: Page;

  // Metrics
  readonly Metrics: Locator;
  readonly MetricsInfo: Locator;

  readonly MetricsTitle: Locator;
  readonly MetricsTooltip: Locator;
  readonly MetricsYearFrom: Locator;
  readonly MetricsYearFromLabel: Locator;
  readonly MetricsYearFromValue: Locator;
  readonly MetricsYearTo: Locator;
  readonly MetricsYearToLabel: Locator;
  readonly MetricsYearToValue: Locator;
  readonly MetricsYearToValuePercent: Locator;

  readonly YearSelectBox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Metrics
    this.Metrics = page.getByTestId('metrics');
    this.MetricsInfo = page.getByTestId('metrics-info');

    this.MetricsTitle = page.getByTestId('metrics-title');
    this.MetricsTooltip = page.getByTestId('metrics-tooltip');
    this.MetricsYearFrom = page.getByTestId('metrics-year-from');
    this.MetricsYearFromLabel = page.getByTestId('metrics-year-from-label');
    this.MetricsYearFromValue = page.getByTestId('metrics-year-from-value');
    this.MetricsYearTo = page.getByTestId('metrics-year-to');
    this.MetricsYearToLabel = page.getByTestId('metrics-year-to-label');
    this.MetricsYearToValue = page.getByTestId('metrics-year-to-value');
    this.MetricsYearToValuePercent = page.getByTestId(
      'metrics-year-to-value-percent',
    );

    this.YearSelectBox = page.getByTestId('year-field-select');
  }

  async validateMetricsControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Metrics).toBeVisible();

    // TODO: commenting since there are more than 1 element by these locators below
    // await expect(this.MetricsInfo).toBeVisible();
    // await expect(this.MetricsTitle).toBeVisible();
    // await expect(this.MetricsTooltip).toBeVisible();
    // await expect(this.MetricsYearFrom).toBeVisible();
    // await expect(this.MetricsYearFromLabel).toBeVisible();
    // await expect(this.MetricsYearFromValue).toBeVisible();
    // await expect(this.MetricsYearTo).toBeVisible();
    // await expect(this.MetricsYearToLabel).toBeVisible();
    // await expect(this.MetricsYearToValue).toBeVisible();
    // await expect(this.MetricsYearToValuePercent).toBeVisible();
  }

  // Set Year
  async setYear(year: string) {
    await this.YearSelectBox.click();
    const option = await this.page.getByRole('option', { name: year });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.YearSelectBox).toContainText(year);
  }

  async verifyMetricsTableVisibility(
    metricsTitleText: string,
    tooltipText: string,
    year: string,
  ) {
    // Set the year in the dropdown using the provided year
    await this.setYear(year);

    // Locate the specific metric based on the title and verify its visibility
    const metricsInfo = this.MetricsInfo.filter({
      has: this.MetricsTitle.filter({ hasText: metricsTitleText }),
    });

    // Check if the title is visible
    await expect(metricsInfo.locator(this.MetricsTitle)).toBeVisible();

    // Check if the tooltip is visible and has the correct aria-label
    await expect(metricsInfo.locator(this.MetricsTooltip)).toBeVisible();

    await expect(metricsInfo.locator(this.MetricsTooltip)).toHaveAttribute(
      'aria-label',
      tooltipText,
    );

    // Verify the year-to-label matches the selected year
    await expect(metricsInfo.locator(this.MetricsYearToLabel)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearToLabel)).toHaveText(year);

    // Check that the rest of the metric elements are visible
    await expect(metricsInfo.locator(this.MetricsYearFromLabel)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearFromValue)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearToValue)).toBeVisible();

    // Check if the year-to-value equals 0 or 0.0, then the percentage should be hidden
    const yearFromValueText = await metricsInfo
      .locator(this.MetricsYearFromValue)
      .textContent();

    const yearToValueText = await metricsInfo
      .locator(this.MetricsYearToValue)
      .textContent();

    if (
      yearToValueText?.trim() === '0' ||
      yearToValueText?.trim() === '0.0' ||
      yearToValueText?.trim() === '-' ||
      yearFromValueText === yearToValueText
    ) {
      // If value is 0 or 0.0 or -, expect the percentage element to be hidden
      await expect(
        metricsInfo.locator(this.MetricsYearToValuePercent),
      ).toBeHidden();
    } else {
      // Otherwise, expect the percentage element to be visible
      await expect(
        metricsInfo.locator(this.MetricsYearToValuePercent),
      ).toBeVisible();
    }
  }
}
