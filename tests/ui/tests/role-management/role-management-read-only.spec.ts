import { expect, extendedTest } from '@utils/authFixture';
import { RoleManagementPage } from '@pages/RoleManagementPage';
import { waitForContentLoaded } from '@utils/helpers';
import { RolePermission } from '@components/RoleManagement';
import { PortfolioList } from '@components/PortfolioList';
import { LoginPage } from '@pages/LoginPage';
import { Header } from '@components/Header';
import { MenuDropDown } from '@components/HeaderMenuDropDown';
import { roleManagementTestConfig } from 'roleManagementTestConfig';

const roleData = {
  readOnly: {
    name: 'Role-Test-Read-Only',
    description: 'Role-Test-Read-Only-Description',
    permission: RolePermission.READ_ONLY,
  },
};

const test = extendedTest.extend<{
  roleManagementPage: RoleManagementPage;
  portfolioList: PortfolioList;
  loginPage: LoginPage;
  header: Header;
  menuDropDown: MenuDropDown;
}>({
  loginPage: async ({ page, context }, use) => {
    await context.clearCookies();
    await use(new LoginPage(page));
  },
  roleManagementPage: async ({ page }, use) => {
    await use(new RoleManagementPage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  menuDropDown: async ({ page }, use) => {
    await use(new MenuDropDown(page));
  },
});

test.describe('Role Management Page Tests', () => {
  test('Verify Read Only role has no access to the application', async ({
    page,
    portfolioList,
    loginPage,
    roleManagementPage,
  }) => {
    await loginPage.navigateByURL();

    //Login with Read Only user
    await loginPage.loginToApplication(
      roleManagementTestConfig.dev.readOnlyUsername,
      roleManagementTestConfig.dev.readOnlyPassword,
    );
    await waitForContentLoaded(page);

    //Verify Read Only role has no access to the application
    await expect(portfolioList.CreatePortfolioButton).toBeVisible();
    await expect(portfolioList.CreatePortfolioButton).toBeDisabled();
    await expect(portfolioList.MyPortfoliosTab).not.toBeVisible();
    await expect(portfolioList.PortfoliosSharedWithMeTab).toBeVisible();
    await expect(portfolioList.MyPortfoliosTab).not.toBeVisible();
    await expect(portfolioList.PortfoliosSharedWithMeTab).toBeVisible();

    //cleanup
    await loginPage.loginToApplication(
      roleManagementTestConfig.dev.username,
      roleManagementTestConfig.dev.password,
    );
    await roleManagementPage.navigateBackToRoleListPage();
    await roleManagementPage.deleteRoleFromRoleList(
      roleData.readOnly.name,
      roleData.readOnly.description,
    );
  });
});
