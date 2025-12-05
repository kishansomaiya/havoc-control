import { checkCurrentEnvFlagged } from '../utils/env.util';

export const PORTFOLIO_LOCATIONS_COUNT_LIMIT = checkCurrentEnvFlagged([
    'local',
    'dev',
])
    ? 50000
    : 10000; // feature flagged for local and dev to test it.
