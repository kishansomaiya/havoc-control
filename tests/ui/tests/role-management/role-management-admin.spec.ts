import { extendedTest, expect } from '@utils/authFixture';
import { RoleManagementPage } from '@pages/RoleManagementPage';
import { waitForContentLoaded } from '@utils/helpers';
import { RolePermission } from '@components/RoleManagement';
import { PortfolioList } from '@components/PortfolioList';
import { roleManagementTestConfig } from '../../roleManagementTestConfig';

const roleData = {
  admin: {
    name: 'Role-Test-Admin',
    description: 'Role-Test-Admin-Description',
    permission: RolePermission.ADMIN,
  },
  readOnly: {
    name: 'Role-Test-Read-Only',
    description: 'Role-Test-Read-Only-Description',
    permission: RolePermission.READ_ONLY,
  },
  noAccess: {
    name: 'Role-Test-No-Access',
    description: 'Role-Test-No-Access-Description',
    permission: RolePermission.NO_ACCESS,
  },
};

const test = extendedTest.extend<{
  roleManagementPage: RoleManagementPage;
  portfolioList: PortfolioList;
}>({
  roleManagementPage: async ({ page }, use) => {
    await use(new RoleManagementPage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
});

test.describe('Role Management Page Tests', () => {
  test.beforeEach(
    'Navigate to Role Management Page',
    async ({ page, roleManagementPage }) => {
      await roleManagementPage.navigateToRoleManagementPage();
      await waitForContentLoaded(page);
    },
  );

  test('Create New Admin role, add and verify user permissions', async ({
    page,
    roleManagementPage,
    portfolioList,
  }) => {
    await roleManagementPage.createNewRole(
      roleData.admin.name,
      roleData.admin.description,
      roleData.admin.permission,
    );
    await roleManagementPage.verifyCreatedRolePermission(
      roleData.admin.name,
      roleData.admin.description,
      roleData.admin.permission,
    );

    await page.goto('/');
    await waitForContentLoaded(page);
    // Verify Create Portfolio button is enabled for admin role
    await expect(portfolioList.CreatePortfolioButton).toBeVisible();
    await expect(portfolioList.CreatePortfolioButton).toBeEnabled();

    // Verify all tabs are visible for admin role
    await expect(portfolioList.MyPortfoliosTab).toBeVisible();
    await expect(portfolioList.PortfoliosSharedWithMeTab).toBeVisible();
    await expect(portfolioList.MyTeamsPortfoliosTab).toBeVisible();
  });

  test('Create New Read Only role with no users, add and verify user permissions', async ({
    roleManagementPage,
  }) => {
    await roleManagementPage.createNewRole(
      roleData.readOnly.name,
      roleData.readOnly.description,
      roleData.readOnly.permission,
    );
    await roleManagementPage.verifyCreatedRolePermission(
      roleData.readOnly.name,
      roleData.readOnly.description,
      roleData.readOnly.permission,
    );

    await roleManagementPage.addUserToRole(
      roleData.readOnly.name,
      roleData.readOnly.description,
      roleManagementTestConfig.dev.readOnlyUsername,
    );
    await roleManagementPage.verifyCreatedRolePermission(
      roleData.readOnly.name,
      roleData.readOnly.description,
      roleData.readOnly.permission,
    );
  });

  // no-access role creation
  test('Create new role with no access, add and verify user permissions', async ({
    roleManagementPage,
  }) => {
    await roleManagementPage.createNewRole(
      roleData.noAccess.name,
      roleData.noAccess.description,
      roleData.noAccess.permission,
    );
    await roleManagementPage.verifyCreatedRolePermission(
      roleData.noAccess.name,
      roleData.noAccess.description,
      roleData.noAccess.permission,
    );

    await roleManagementPage.addUserToRole(
      roleData.noAccess.name,
      roleData.noAccess.description,
      roleManagementTestConfig.dev.noAccessUsername,
    );
    await roleManagementPage.verifyCreatedRolePermission(
      roleData.readOnly.name,
      roleData.readOnly.description,
      roleData.readOnly.permission,
    );
  });
});
