// tests/ui/components/Map.ts

import { Page, Locator,expect } from '@playwright/test';

export class Map {
  readonly page: Page;
  readonly Map: Locator;

  readonly MapControls: Locator;
  readonly ZoomIn: Locator;
  readonly ZoomOut: Locator;

  readonly MapLayer: Locator;

  readonly MapLayerDropDown: Locator;
  readonly MapLayerList: Locator;
  readonly MapLayerDropDownTitle: Locator;
  readonly MapLayerDropDownTitleSubHeader: Locator;
  readonly MapLayerDropDownItem: Locator;

  readonly PortfolioOverviewScoreMapLegend: Locator;
  readonly PortfolioHazardScoreMapLegend: Locator;

  readonly ScoreLevelsMapLegend: Locator;
  readonly ScoreLevelsMapLegendTitle: Locator;
  readonly ScoreLevelsMapLegendValues: Locator;
  readonly ScoreLevelsMapLegendValue: Locator;
  readonly ScoreLevelsMapLegendScoreLevelLowest: Locator;
  readonly ScoreLevelsMapLegendScoreLevelHighest: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Map = page.getByTestId('mapboxgl-map');
    this.MapControls = page.getByTestId('map-controls');
    this.ZoomIn = page.getByTestId('map-controls-zoom-in');
    this.ZoomOut = page.getByTestId('map-controls-zoom-out');
    this.MapLayer = page.getByTestId('map-controls-layer');
    this.MapLayerDropDown = page.getByTestId('map-layer-popover');
    this.MapLayerList = page.getByTestId('map-layer-menu');
    this.MapLayerDropDownTitle = page.getByTestId('map-layer-menu-title');
    this.MapLayerDropDownTitleSubHeader = page.getByTestId(
      'portfolio-details-export-menu-sub-header',
    );
    this.MapLayerDropDownTitle = page.getByTestId('map-layer-menu-title');
    this.MapLayerDropDownItem = page.getByTestId('map-layer-menu-item');
    this.PortfolioOverviewScoreMapLegend = page.getByTestId(
      'portfolio-overview-score-map-legend',
    );
    this.PortfolioHazardScoreMapLegend = page.getByTestId(
      'portfolio-hazard-score-map-legend',
    );

    this.ScoreLevelsMapLegend = page.getByTestId('score-levels-map-legend');
    this.ScoreLevelsMapLegendTitle = page.getByTestId(
      'score-levels-map-legend-title',
    );
    this.ScoreLevelsMapLegendValues = page.getByTestId(
      'score-levels-map-legend-values',
    );
    this.ScoreLevelsMapLegendValue = page.getByTestId(
      'score-levels-map-legend-value',
    );
    this.ScoreLevelsMapLegendScoreLevelLowest = page.getByTestId(
      'score-levels-map-legend-score-level-lowest',
    );
    this.ScoreLevelsMapLegendScoreLevelHighest = page.getByTestId(
      'score-levels-map-legend-score-level-highest',
    );
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Map).toBeVisible();
    await expect(this.MapControls).toBeVisible();
    await expect(this.ZoomIn).toBeVisible();
    await expect(this.ZoomOut).toBeVisible();
    await expect(this.MapLayer).toBeVisible();
  }

  async validateLegendControls() {
    await this.page.waitForLoadState('load');
    await expect(this.ScoreLevelsMapLegend).toBeVisible();
    await expect(this.ScoreLevelsMapLegendTitle).toBeVisible();
    await expect(this.ScoreLevelsMapLegendValues).toBeVisible();
    await expect(this.ScoreLevelsMapLegendScoreLevelLowest).toBeVisible();
    await expect(this.ScoreLevelsMapLegendScoreLevelHighest).toBeVisible();
  }
}
