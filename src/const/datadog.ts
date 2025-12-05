import { DefaultPrivacyLevel } from '@datadog/browser-rum';
import { ddEnv } from '../config';

export const DATA_DOG_RUM_CONFIG = {
    applicationId: '3c532f4d-3543-444a-ac9d-00dcfc920c4f',
    clientToken: 'pub567fbaf4389d7337af9f30dcad322338',
    site: 'datadoghq.com',
    service: 'jupiter-csg-frontend-redux',
    env: ddEnv,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100, // if not included, the default is 100
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    enableExperimentalFeatures: ['feature_flags'],
    defaultPrivacyLevel: DefaultPrivacyLevel.MASK_USER_INPUT,
};
