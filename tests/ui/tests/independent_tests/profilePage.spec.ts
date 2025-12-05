import { ProfilePage } from '@pages/ProfilePage';
import test from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await test.step(`Navigate to the homepage`, async () => {
      const profilePage = new ProfilePage(page);
      await profilePage.navigateByURL();
    });
  });

  test('Validate client creation', async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await test.step('Create client', async () => {
      await profilePage.createNewClient();
    });
    await test.step('Delete client', async () => {
      await profilePage.deleteFirstClient();
    });
  });

  test('Validate usage tracking', async ({ page }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.verifyUsageTracking();
  });
});
