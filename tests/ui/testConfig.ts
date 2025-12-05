// tests/ui/testConfig.ts
export const testConfig = {
  local: {
    appUrl: process.env.LOCAL_URL || '',
    apiUrl: process.env.LOCAL_API_URL || '',
    username: process.env.DEV_TEST_USERNAME || '',
    password: process.env.DEV_TEST_PASSWORD || '',
    noCsrDUsername: process.env.TEST_NO_CSRD_USERNAME || '',
    noCsrDPassword: process.env.TEST_NO_CSRD_PASSWORD || '',
  },
  dev: {
    appUrl: process.env.DEV_URL || '',
    apiUrl: process.env.DEV_API_URL || '',
    username: process.env.DEV_TEST_USERNAME || '',
    password: process.env.DEV_TEST_PASSWORD || '',
    noCsrDUsername: process.env.TEST_NO_CSRD_USERNAME || '',
    noCsrDPassword: process.env.TEST_NO_CSRD_PASSWORD || '',
  },
  stg: {
    appUrl: process.env.STG_URL || '',
    apiUrl: process.env.STG_API_URL || '',
    username: process.env.STG_TEST_USERNAME || '',
    password: process.env.STG_TEST_PASSWORD || '',
    noCsrDUsername: process.env.TEST_NO_CSRD_USERNAME || '',
    noCsrDPassword: process.env.TEST_NO_CSRD_PASSWORD || '',
  },
  prod: {
    appUrl: process.env.PROD_URL || '',
    apiUrl: process.env.PROD_API_URL || '',
    username: process.env.PROD_TEST_USERNAME || '',
    password: process.env.PROD_TEST_PASSWORD || '',
    noCsrDUsername: process.env.TEST_NO_CSRD_USERNAME || '',
    noCsrDPassword: process.env.TEST_NO_CSRD_PASSWORD || '',
  },
};
