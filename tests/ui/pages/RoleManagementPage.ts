import { expect } from '@playwright/test';
import { Page, Locator } from '@playwright/test';
// import { testConfig } from 'testConfig';
import { waitForContentLoaded } from '@utils/helpers';
import { RoleManagement, RolePermission } from '../components/RoleManagement';
import { Header } from '../components/Header';

export class RoleManagementPage {
  readonly page: Page;
  readonly roleManagement: RoleManagement;
  readonly header: Header;

  // Page-specific elements
  readonly pageTitle: Locator;
  readonly emptyStateMessage: Locator;
  readonly addNewRoleButton: Locator;

  readonly roleManagementTab: Locator;
  readonly userGroupManagementTab: Locator;
  readonly portfolioSharingTab: Locator;
  readonly contextMenu: Locator;

  readonly saveRoleSpinner: Locator;

  readonly roleList: Locator;
  readonly roleListItemName: Locator;
  readonly roleListItemDescription: Locator;

  readonly moveUsersRight: Locator;
  readonly moveUsersLeft: Locator;
  readonly selectAllAvailableUsers: Locator;
  readonly selectAllAvailableUsersCheckbox: Locator;
  readonly selectAllAvailableUsersCheckboxInput: Locator;
  readonly availableUserItem: Locator;
  readonly selectedUserItem: Locator;

  readonly saveRoleUsers: Locator;
  readonly cancelRoleUsers: Locator;

  readonly loadMoreRolesButton: Locator;
  readonly cancelModalConfirmButton: Locator;
  readonly cancelModalCancelButton: Locator;

  readonly searchAvailableUsersInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roleManagement = new RoleManagement(page);
    this.header = new Header(page);

    // Page-specific elements

    this.emptyStateMessage = page.getByTestId('empty-state-message');

    this.addNewRoleButton = page.getByTestId('add-new-role-button');
    this.roleManagementTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('Role Management');
    this.userGroupManagementTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('User Group Management');
    this.portfolioSharingTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('Portfolio Sharing');
    this.contextMenu = this.roleManagement.roleListContextMenu;
    this.saveRoleSpinner = page.getByRole('progressbar');
    this.roleList = page.getByTestId('role-list');
    this.roleListItemName = page.getByTestId('role-item-name');
    this.roleListItemDescription = page.getByTestId('role-item-description');

    this.selectAllAvailableUsers = page.getByTestId(
      'select-all-available-users',
    );
    this.selectAllAvailableUsersCheckbox = page.getByTestId(
      'select-all-available-users-checkbox',
    );
    this.selectAllAvailableUsersCheckboxInput =
      this.selectAllAvailableUsersCheckbox.locator('input[type="checkbox"]');
    this.availableUserItem = page.getByTestId('available-user-item');
    this.selectedUserItem = page.getByTestId('selected-user-item');
    this.moveUsersRight = page.getByTestId('move-users-right');
    this.moveUsersLeft = page.getByTestId('move-users-left');
    this.saveRoleUsers = page.getByTestId('save-role-users');
    this.cancelRoleUsers = page.getByTestId('cancel-role-users');
    this.loadMoreRolesButton = page.getByTestId('load-more-roles-button');
    this.cancelModalConfirmButton = page.getByTestId(
      'confirm-modal-button-confirm',
    );
    this.cancelModalCancelButton = page.getByTestId(
      'confirm-modal-button-cancel',
    );
    this.searchAvailableUsersInput = page.getByTestId(
      'search-available-users-input',
    );
  }

  // Page-level methods
  async navigateToRoleManagementPage() {
    await this.page.goto('/profile/role-management');
    await this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/v1/roles') && response.status() === 200,
    );
    await waitForContentLoaded(this.page);
  }

  async createNewRole(
    roleName: string,
    roleDescription: string,
    permission: RolePermission,
  ) {
    await this.addNewRoleButton.click();
    // Validate inputs
    await expect(roleName?.trim() ?? '', 'Role name is required').not.toBe('');
    await expect(
      roleDescription?.trim() ?? '',
      'Role description is required',
    ).not.toBe('');

    // Verify we're on the role creation form
    await expect(this.roleManagement.roleItemNameInput).toBeVisible();
    await expect(this.roleManagement.roleItemDescriptionInput).toBeVisible();

    // Fill role information
    await this.roleManagement.roleItemNameInput.fill(roleName);
    await this.roleManagement.roleItemDescriptionInput.fill(roleDescription);

    // Set permissions
    await this.roleManagement.setPermission(permission);

    // Verify save button is enabled
    await expect(this.roleManagement.roleFormSaveButton).toBeEnabled();

    await this.roleManagement.roleFormSaveButton.click();

    await waitForContentLoaded(this.page);
    await expect(this.saveRoleSpinner).toBeHidden();

    await this.cancelRoleUsers.click();
    await expect(this.cancelModalConfirmButton).toBeEnabled();
    await this.cancelModalConfirmButton.click();

    await waitForContentLoaded(this.page, '60000');

    // Verify the role was created successfully
    try {
      await this.verifyRoleExists(roleName, roleDescription);
    } catch (error) {
      throw new Error(`Failed to verify role creation: ${error.message}`);
    }
  }

  async addUserToRole(
    roleName: string,
    roleDescription: string,
    userToAdd: string,
  ) {
    await this.roleManagement.searchCreatedRole(roleName, roleDescription);
    await this.roleManagement.roleContextMenu.click();
    await this.roleManagement.viewEditUsersItem.click();
    await this.searchAvailableUsersInput.fill(userToAdd);
    await this.availableUserItem.locator('input[type="checkbox"]').click();
    await this.moveUsersRight.click();
    await this.saveRoleUsers.click();
    await waitForContentLoaded(this.page, '60000');
    await this.verifyRoleExists(roleName, roleDescription);
  }

  async verifyRoleExists(roleName: string, roleDescription: string) {
    await expect(this.roleList).toBeVisible();
    await this.roleManagement.searchCreatedRole(roleName, roleDescription);
  }

  async verifyCreatedRolePermission(
    roleName: string,
    roleDescription: string,
    permission: RolePermission,
  ) {
    await expect(this.roleList).toBeVisible();
    await this.roleManagement.searchCreatedRole(roleName, roleDescription);
    await this.roleManagement.roleContextMenu.click();
    await this.roleManagement.viewEditRoleItem.click();
    await this.roleManagement.verifyCreatedRolePermission(permission);
  }

  async navigateBackToRoleListPage() {
    await this.roleManagement.roleFormCancelButton.click();
    await this.roleManagement.roleConfirmModalConfirmButton.click();
    await expect(this.roleList).toBeVisible();
  }

  async deleteRoleFromRoleList(roleName: string, roleDescription: string) {
    await this.roleManagement.searchCreatedRole(roleName, roleDescription);
    await this.roleManagement.roleContextMenu.click();
    await this.roleManagement.deleteRoleItem.click();
    await expect(this.roleManagement.roleConfirmModalMessage).toHaveText(
      'Are you sure you want to delete this role? This action cannot be undone. (Note: If there are any users currently associated to this role, they will move to an “unassigned” state until they are assigned to another role.)',
    );
    await this.roleManagement.roleConfirmModalConfirmButton.click();
    await expect(this.saveRoleSpinner).toBeHidden();

    // Check if role was deleted with a longer timeout
    await expect(this.roleManagement.roleList).not.toContainText(roleName, {
      timeout: 10000,
    });

    // Verify either the role list is visible or empty state is shown
    await this.roleManagement.verifyEmptyState();
  }

  async deleteRoleFromEditRolePage() {
    await this.roleManagement.roleContextMenu.click();
    await this.roleManagement.deleteRoleItem.click();
    await expect(this.roleManagement.roleConfirmModalMessage).toHaveText(
      'Are you sure you want to delete this role? This action cannot be undone. (Note: If there are any users currently associated to this role, they will move to an “unassigned” state until they are assigned to another role.)',
    );
    await this.roleManagement.roleConfirmModalConfirmButton.click();

    // Verify either the role list is visible or empty state is shown
    const hasOtherRoles = await this.roleManagement.roleList.isVisible();
    if (hasOtherRoles) {
      await expect(this.roleManagement.roleList).toBeVisible();
    } else {
      await expect(this.emptyStateMessage).toBeVisible();
    }
  }
}
