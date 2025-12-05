// todo: not used now
import axios from 'axios';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';

if (testConfig[ENV] === 'local') {
  axios.defaults.validateStatus = () => true;
  axios.defaults.headers['Accept-Language'] = 'en';

  if (!testConfig[ENV].API_URL || testConfig[ENV].API_URL === '') {
    throw new Error('API_URL ENV var should be set');
  }
}
