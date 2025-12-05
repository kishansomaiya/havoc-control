import { expect, extendedTest } from '@utils/authFixture';
import { RoleManagementPage } from '@pages/RoleManagementPage';
import { waitForContentLoaded } from '@utils/helpers';
import { LoginPage } from '@pages/LoginPage';
import { RolePermission } from '@components/RoleManagement';
import { roleManagementTestConfig } from '../../roleManagementTestConfig';

// No role creation in this spec; we just verify no-access messaging after login.

const roleData = {
  noAccess: {
    name: 'Role-Test-No-Access',
    description: 'Role-Test-No-Access-Description',
    permission: RolePermission.NO_ACCESS,
  },
};

const test = extendedTest.extend<{
  roleManagementPage: RoleManagementPage;
}>({
  loginPage: async ({ page, context }, use) => {
    await context.clearCookies();
    await use(new LoginPage(page));
  },
  roleManagementPage: async ({ page }, use) => {
    await use(new RoleManagementPage(page));
  },
});

test.describe('Role Management Page Tests', () => {
  test('Verify no-access user sees permission message and redirect copy', async ({
    page,
    loginPage,
    roleManagementPage,
  }) => {
    await loginPage.navigateByURL();
    await loginPage.loginToApplication(
      roleManagementTestConfig.dev.noAccessUsername,
      roleManagementTestConfig.dev.noAccessPassword,
    );
    await waitForContentLoaded(page);

    await expect(
      page.getByText(
        'You do not have necessary permissions, please contact your administrator.',
      ),
    ).toBeVisible();
    await expect(page.getByText('Click here')).toBeVisible();
    await expect(page.getByText('to redirect to home.')).toBeVisible();

    await page.getByText('Click here').click();
    await loginPage.validateControls();

    //cleanup
    await loginPage.loginToApplication(
      roleManagementTestConfig.dev.username,
      roleManagementTestConfig.dev.password,
    );
    await roleManagementPage.navigateBackToRoleListPage();
    await roleManagementPage.deleteRoleFromRoleList(
      roleData.noAccess.name,
      roleData.noAccess.description,
    );
  });
});
