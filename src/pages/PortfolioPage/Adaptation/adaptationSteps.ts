import { AdaptationLandingPage } from './components/LandingPage/LandingPage';
import { AdaptationAnalysisPreferences } from './components/AdaptationAnalysisPreferences';
import { AdaptationVisualizations } from './components/AdaptationVisualizations/AdaptationVisualizations';
import { AdaptationMeasureSettings } from './components/AdaptationMeasureSettings/AdaptationMeasureSettings';

export const AdaptationSteps = {
    assetSelection: AdaptationLandingPage,
    settingsView: AdaptationAnalysisPreferences,
    visualizations: AdaptationVisualizations,
    measureSettings: AdaptationMeasureSettings,
};

export type AdaptationStepsType = keyof typeof AdaptationSteps;
