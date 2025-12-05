import { AUTH_FILE_PATH } from '@lib/constants';
import { devices, Project } from '@playwright/test';

const v3_0_0: Project[] = [
  {
    name: 'data_setup_3.0.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    testMatch: 'tests/setup/data.setup-3.0.0.ts',
    dependencies: ['auth_setup'],
  },
  {
    name: 'data_version_3.0.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    fullyParallel: false,
    testMatch: '**/data_version/v3.0.0/**/*.spec.ts',
    dependencies: ['data_setup_3.0.0'],
  },
];

const v3_1_0: Project[] = [
  {
    name: 'data_setup_3.1.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    testMatch: 'tests/setup/data.setup-3.1.0.ts',
    dependencies: ['auth_setup'],
  },
  {
    name: 'data_version_3.1.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    fullyParallel: false,
    testMatch: '**/data_version/v3.1.0/**/*.spec.ts',
    dependencies: ['data_setup_3.1.0'],
  },
];

const v3_2_0: Project[] = [
  {
    name: 'data_setup_3.2.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    testMatch: 'tests/setup/data.setup-3.2.0.ts',
    dependencies: ['auth_setup'],
  },
  {
    name: 'data_version_3.2.0',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    fullyParallel: false,
    testMatch: '**/data_version/v3.2.0/**/*.spec.ts',
    dependencies: ['data_setup_3.2.0'],
  },
];

const criticalPaths: Project[] = [
  {
    name: 'critical_paths',
    use: {
      storageState: AUTH_FILE_PATH,
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    },
    fullyParallel: false,
    testMatch: [
      '**/*.critical.spec.ts',
      '**/data_version/v3.2.0/**/*.spec.ts',
      '**/independent_tests/**/*.spec.ts',
    ],
    dependencies: ['data_setup_3.2.0'],
  },
];

export const combinedProjects = [
  ...v3_0_0,
  ...v3_1_0,
  ...v3_2_0,
  ...criticalPaths,
];
