// tests/ui/components/SingleLocationHeader.ts

import { Page, Locator,expect } from '@playwright/test';
import { waitForContentLoaded } from '@utils/helpers';

export class SingleLocationHeader {
  readonly page: Page;

  readonly Header: Locator;

  readonly Breadcrumbs: Locator;
  readonly BreadcrumbsChevron: Locator;
  readonly BreadcrumbsHome: Locator;
  readonly BreadcrumbsPortfolioName: Locator;
  readonly BreadcrumbsLocations: Locator;

  readonly LocationInfo: Locator;
  readonly LocationIdName: Locator;
  readonly Coordinates: Locator;

  readonly Tabs: Locator;
  readonly TabList: Locator;
  readonly TabItem: Locator;
  readonly TabItemName: Locator;

  readonly HazardTab: Locator;
  readonly DamageLossTab: Locator;
  readonly FinancialMetricsTab: Locator;
  readonly FloodMeshTab: Locator;

  readonly ReportButton: Locator;
  readonly ReportButtonIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.Header = page.getByTestId('location-header');
    this.Breadcrumbs = page.getByTestId('location-breadcrumbs');
    this.BreadcrumbsChevron = page.getByTestId('breadcrumbs-chevron-left-icon');
    this.BreadcrumbsHome = page.getByTestId('location-breadcrumbs-home');
    this.BreadcrumbsPortfolioName = page.getByTestId(
      'breadcrumbs-portfolio-name',
    );
    this.BreadcrumbsLocations = page.getByTestId('breadcrumbs-locations');
    this.LocationInfo = page.getByTestId('location-info');
    this.LocationIdName = page.getByTestId('location-id-name');
    this.Coordinates = page.getByTestId('location-coordinates');

    this.Tabs = page.getByTestId('location-tabs');
    this.TabList = page.getByTestId('tab-list');
    this.TabItem = page.getByTestId('tab-item');
    this.TabItemName = page.getByTestId('tab-item-name');

    // this.HazardTab = page.getByRole('tab', { name: 'Hazard' });
    this.HazardTab = page.getByTestId('tab-item-name').locator('text=Hazard');
    // this.DamageLossTab = page.getByRole('tab', { name: 'Damage & Loss' });
    this.DamageLossTab = page
      .getByTestId('tab-item-name')
      .locator('text=Damage & Loss');
    // this.FinancialMetricsTab = page.getByRole('tab', {name: 'Financial Metrics'});
    this.FinancialMetricsTab = page
      .getByTestId('tab-item-name')
      .locator('text=Financial Metrics');
    this.FloodMeshTab = page
      .getByTestId('tab-item-name')
      .locator('text=Flood Mesh');

    this.ReportButton = page.getByTestId('location-report-button');
    this.ReportButtonIcon = page.getByTestId('location-report-button-icon');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Breadcrumbs).toBeVisible();
    await expect(this.LocationIdName).toBeVisible();
    await expect(this.Coordinates).toBeVisible();
    await expect(this.ReportButton).toBeVisible();
    await expect(this.HazardTab).toBeVisible();
    await expect(this.DamageLossTab).toBeVisible();
    await expect(this.FinancialMetricsTab).toBeVisible();
    // await expect(this.FloodMeshTab).toBeVisible(); // TODO: If Flood Mesh result set was generated. Will check in test directly
  }

  async validateBreadcrumbs(portfolioId: string, portfolioName: string) {
    const breadcrumbsHome = this.BreadcrumbsHome;
    const breadcrumbsPortfolioName = this.BreadcrumbsPortfolioName;
    const breadcrumbsLocations = this.BreadcrumbsLocations;
    const breadcrumbsChevron = this.BreadcrumbsChevron;

    await waitForContentLoaded(this.page);
    await expect(breadcrumbsHome).toBeVisible();
    await expect(breadcrumbsHome).toHaveText('Home');
    await expect(breadcrumbsHome).toHaveAttribute('href', '/');
    await expect(breadcrumbsChevron).toBeVisible();
    await expect(breadcrumbsPortfolioName).toBeVisible();
    await expect(breadcrumbsLocations).toBeVisible();
    await expect(breadcrumbsLocations).toHaveText('Locations');
    await expect(breadcrumbsPortfolioName).toHaveText(portfolioName);
    await expect(breadcrumbsPortfolioName).toHaveAttribute(
      'href',
      `/portfolios/${portfolioId}`,
    );
    await expect(breadcrumbsLocations).toHaveAttribute(
      'href',
      `/portfolios/${portfolioId}/locations`,
    );
  }

  async validateTablist() {
    await waitForContentLoaded(this.page);
    // Define the tab names you want to check
    const tabNames = ['Hazard', 'Damage & Loss', 'Financial Metrics'];
    // Loop through each tab and check if it is visible
    for (const tabName of tabNames) {
      // Find the tab by its inner text and check if it's visible
      const tabLocator = this.TabItemName.locator(`text=${tabName}`);
      await expect(tabLocator).toBeVisible();
    }
  }

  async validateTablist_FloodMesh() {
    await waitForContentLoaded(this.page);
    // Define the tab names you want to check
    const tabNames = [
      'Hazard',
      'Damage & Loss',
      'Financial Metrics',
      'Flood Mesh',
    ];
    // Loop through each tab and check if it is visible
    for (const tabName of tabNames) {
      // Find the tab by its inner text and check if it's visible
      const tabLocator = this.TabItemName.locator(`text=${tabName}`);
      await expect(tabLocator).toBeVisible();
    }
  }

  async validateDefaultTabsState(defaultTabName: string) {
    await waitForContentLoaded(this.page);
    // Get the locator for the selected tab
    const selectedTab = this.TabItem.filter({ hasText: defaultTabName });
    await expect(selectedTab).toBeVisible();
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');

    // Define all possible tab names
    const allTabs = ['Hazard', 'Damage & Loss', 'Financial Metrics'];

    // Filter out the defaultTabName from allTabs
    const otherTabs = allTabs.filter((tabName) => tabName !== defaultTabName);

    // Loop through each other tab and check that it's not selected
    for (const tabName of otherTabs) {
      const tabLocator = this.TabItem.filter({ hasText: tabName });
      await expect(tabLocator).toBeVisible();
      await expect(tabLocator).toHaveAttribute('aria-selected', 'false');
    }
  }

  async validateDefaultTabsState_FloodMesh(defaultTabName: string) {
    await waitForContentLoaded(this.page);
    // Get the locator for the selected tab
    const selectedTab = this.TabItem.filter({ hasText: defaultTabName });
    await expect(selectedTab).toBeVisible();
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');

    // Define all possible tab names
    const allTabs = [
      'Hazard',
      'Damage & Loss',
      'Financial Metrics',
      'Flood Mesh',
    ];

    // Filter out the defaultTabName from allTabs
    const otherTabs = allTabs.filter((tabName) => tabName !== defaultTabName);

    // Loop through each other tab and check that it's not selected
    for (const tabName of otherTabs) {
      const tabLocator = this.TabItem.filter({ hasText: tabName });
      await expect(tabLocator).toBeVisible();
      await expect(tabLocator).toHaveAttribute('aria-selected', 'false');
    }
  }

  async clickOnReportButton() {
    await expect(this.ReportButton).toBeVisible();
    await expect(this.ReportButtonIcon).toBeVisible();
    await this.ReportButtonIcon.click();
    await waitForContentLoaded(this.page);
    await expect(this.page.getByTestId('download-slr-modal-box')).toBeVisible();
  }
}
