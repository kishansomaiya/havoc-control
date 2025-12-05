// tests/ui/components/PortfolioHeader.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioList } from '@components/PortfolioList';
import { waitForContentLoaded } from '@utils/helpers';
export class PortfolioHeader {
  readonly page: Page;
  readonly portfolioList: PortfolioList;

  readonly Header: Locator;
  readonly Breadcrumbs: Locator;
  readonly BreadcrumbsChevron: Locator;
  readonly PortfolioName: Locator;
  readonly AnalysisType: Locator;

  readonly Tabs: Locator;
  readonly TabList: Locator;
  readonly TabItem: Locator;
  readonly TabItemName: Locator;

  readonly OverviewTab: Locator;
  readonly HazardTab: Locator;
  readonly LocationsTab: Locator;
  readonly ImpactsTab: Locator;
  readonly ScoringTab: Locator;
  readonly ComplianceTab: Locator;

  // Data Not Available
  readonly DataNotAvailableTooltip: Locator;
  readonly DataNotAvailableTooltipTitle: Locator;
  readonly DataNotAvailableTooltipDescription: Locator;
  readonly DataNotAvailableTooltipEditSettingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portfolioList = new PortfolioList(this.page);

    // Header
    this.Tabs = page.getByTestId('portfolio-overview-tabs');
    this.TabList = page.getByTestId('tab-list');
    this.TabItem = page.getByTestId('tab-item');
    this.TabItemName = page.getByTestId('tab-item-name');

    this.OverviewTab = page.getByRole('tab', { name: 'Overview' });
    this.HazardTab = page.getByRole('tab', { name: 'Hazard' });
    this.LocationsTab = this.TabItemName.filter({ hasText: 'Locations' }); // new locator for flood mesh problem with tooltip
    this.ImpactsTab = page.getByRole('tab', { name: 'Impacts' });
    this.ScoringTab = page.getByRole('tab', { name: 'Scoring' });
    this.ComplianceTab = page.getByRole('tab', { name: 'Compliance' });

    this.Header = page.getByTestId('portfolio-overview-header');
    this.Breadcrumbs = page.getByTestId(
      'portfolio-overview-header-breadcrumbs',
    );
    this.BreadcrumbsChevron = page.getByTestId(
      'header-breadcrumbs-chevron-left-icon',
    );
    this.PortfolioName = page.getByTestId(
      'portfolio-overview-header-portfolio-name',
    );
    this.AnalysisType = page.getByTestId(
      'portfolio-overview-header-analysis-type',
    );

    // Data Not Available
    this.DataNotAvailableTooltip = page.getByTestId(
      'data-not-available-tooltip',
    );
    this.DataNotAvailableTooltipTitle = page.getByTestId(
      'data-not-available-tooltip-title',
    );
    this.DataNotAvailableTooltipDescription = page.getByTestId(
      'data-not-available-tooltip-description',
    );
    this.DataNotAvailableTooltipEditSettingsLink = page.getByTestId(
      'data-not-available-tooltip-edit-settings-link',
    );
  }

  async validateControls(
    portfolioName: string,
    analysisType: string,
    dataSetVersion: string,
  ) {
    await waitForContentLoaded(this.page);
    await expect(this.PortfolioName).toBeVisible();
    await expect(this.PortfolioName).toContainText(portfolioName);
    await expect(this.AnalysisType).toBeVisible();
    await expect(this.AnalysisType).toContainText(
      `${analysisType} (v${dataSetVersion})`,
    );
  }

  async validateBreadcrumbs() {
    const breadcrumbLocator = this.Breadcrumbs;
    const breadcrumbsChevron = this.BreadcrumbsChevron;
    await expect(breadcrumbLocator).toBeVisible();
    await expect(breadcrumbLocator).toHaveText('Home');
    await expect(breadcrumbLocator).toHaveAttribute('href', '/');
    await expect(breadcrumbsChevron).toBeVisible();
  }

  async validateTablist() {
    // Define the tab names you want to check
    const tabNames = [
      'Overview',
      'Hazard',
      'Locations',
      'Impacts',
      'Scoring',
      'Compliance',
    ];
    // Loop through each tab and check if it is visible
    for (const tabName of tabNames) {
      // Find the tab by its inner text and check if it's visible
      const tabLocator = this.TabItemName.locator(`text=${tabName}`);
      await expect(tabLocator).toBeVisible();
    }
  }

  async validateDefaultTabsState(defaultTabName: string) {
    // Get the locator for the selected tab
    const selectedTab = this.TabItem.filter({ hasText: defaultTabName });
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');

    // Define all possible tab names
    const allTabs = [
      'Overview',
      'Hazard',
      'Locations',
      'Impacts',
      'Scoring',
      'Compliance',
    ];

    // Filter out the defaultTabName from allTabs
    const otherTabs = allTabs.filter((tabName) => tabName !== defaultTabName);

    // Loop through each other tab and check that it's not selected
    for (const tabName of otherTabs) {
      const tabLocator = this.TabItem.filter({ hasText: tabName });
      await expect(tabLocator).toHaveAttribute('aria-selected', 'false');
    }
  }
}
