import { Page, Locator, expect } from '@playwright/test';
// import { waitForContentLoaded } from '@utils/helpers';

export enum RolePermission {
  ADMIN = 'ADMIN',
  READ_ONLY = 'READ_ONLY',
  NO_ACCESS = 'NO_ACCESS',
}

export class RoleManagement {
  readonly page: Page;

  // Navigation Elements
  readonly userSettingsTab: Locator;
  readonly roleManagementTab: Locator;
  readonly userGroupManagementTab: Locator;
  readonly portfolioSharingTab: Locator;

  // Main Content Elements
  readonly emptyStateMessage: Locator;
  readonly addNewRoleButton: Locator;
  readonly searchRoleInput: Locator;

  // Form Elements
  readonly roleItemNameInput: Locator;
  readonly roleItemDescriptionInput: Locator;
  readonly roleFormSaveButton: Locator;
  readonly roleFormCancelButton: Locator;

  // Permission Radio Buttons
  readonly roleManagementRoleManagerRadioButton: Locator;
  readonly roleManagementNoAccessRadioButton: Locator;
  readonly portfolioManagementAdministratorRadioButton: Locator;
  readonly portfolioManagementNoAccessRadioButton: Locator;
  readonly portfolioCreationNoAccessRadioButton: Locator;
  readonly portfolioCreationCreatorRadioButton: Locator;
  readonly portfolioCreationReadOnlyRadioButton: Locator;
  readonly portfolioSharingNoAccessRadioButton: Locator;
  readonly portfolioSharingSharerRadioButton: Locator;

  // List Elements
  readonly roleList: Locator;
  readonly roleListContextMenu: Locator;
  readonly roleListItemUserCount: Locator;
  readonly roleItemNameandDescription: Locator;

  // Context Menu Elements
  readonly roleContextMenu: Locator;
  readonly viewEditRoleItem: Locator;
  readonly viewEditUsersItem: Locator;
  readonly makeDefaultRoleItem: Locator;
  readonly deleteRoleItem: Locator;

  // Modal Elements
  readonly roleConfirmModal: Locator;
  readonly roleConfirmModalCancelButton: Locator;
  readonly roleConfirmModalConfirmButton: Locator;
  readonly roleConfirmModalMessage: Locator;
  readonly roleConfirmModalTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation Elements
    this.userSettingsTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('User Settings');
    this.roleManagementTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('Role Management');
    this.userGroupManagementTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('User Group Management');
    this.portfolioSharingTab = page
      .getByTestId('[data-testid="tab-item"]')
      .locator('Portfolio Sharing');

    // Main Content Elements
    this.emptyStateMessage = page.getByTestId('empty-state-message');
    this.addNewRoleButton = page.getByTestId('add-new-role-button');
    this.searchRoleInput = page
      .getByTestId('role-list-search-field')
      .locator('[id="search"]');

    // Form Elements
    this.roleItemNameInput = page.locator('[name="roleName"]');
    this.roleItemDescriptionInput = page.locator('[name="roleDescription"]');
    this.roleFormSaveButton = page.getByTestId('save-button');
    this.roleFormCancelButton = page.getByTestId('cancel-button');

    // Permission Radio Buttons
    this.roleManagementRoleManagerRadioButton = page
      .getByTestId('role-permission-radio-group-0')
      .locator('[data-testid="Role Manager"]');
    this.roleManagementNoAccessRadioButton = page
      .getByTestId('role-permission-radio-group-0')
      .locator('[data-testid="No Access"]');
    this.portfolioManagementAdministratorRadioButton = page
      .getByTestId('role-permission-radio-group-1')
      .locator('[data-testid="Administrator"]');
    this.portfolioManagementNoAccessRadioButton = page
      .getByTestId('role-permission-radio-group-1')
      .locator('[data-testid="No Access"]');
    this.portfolioCreationNoAccessRadioButton = page
      .getByTestId('role-permission-radio-group-2')
      .locator('[data-testid="No Access"]');
    this.portfolioCreationCreatorRadioButton = page
      .getByTestId('role-permission-radio-group-2')
      .locator('[data-testid="Creator"]');
    this.portfolioCreationReadOnlyRadioButton = page
      .getByTestId('role-permission-radio-group-2')
      .locator('[data-testid="Read-Only"]');
    this.portfolioSharingNoAccessRadioButton = page
      .getByTestId('role-permission-radio-group-3')
      .locator('[data-testid="No Access"]');
    this.portfolioSharingSharerRadioButton = page
      .getByTestId('role-permission-radio-group-3')
      .locator('[data-testid="Sharer"]');

    // List Elements
    this.roleList = page.getByTestId('role-list');
    this.roleListContextMenu = page.getByTestId('role-item-menu-icon');
    this.roleListItemUserCount = page.getByTestId('role-item-user-count');
    this.roleItemNameandDescription = page.getByTestId('role-item-info');

    // Context Menu Elements
    this.roleContextMenu = page.getByTestId('role-item-menu-icon');
    this.viewEditRoleItem = page.getByTestId('view-edit-role-item');
    this.viewEditUsersItem = page.getByTestId('view-edit-users-item');
    this.makeDefaultRoleItem = page.getByTestId('make-default-role-item');
    this.deleteRoleItem = page.getByTestId('delete-role-item');

    // Modal Elements
    this.roleConfirmModal = page.getByTestId('confirm-modal');
    this.roleConfirmModalCancelButton = page.getByTestId(
      'confirm-modal-button-cancel',
    );
    this.roleConfirmModalConfirmButton = page.getByTestId(
      'confirm-modal-button-confirm',
    );
    this.roleConfirmModalMessage = page.getByTestId(
      'confirm-modal-message-box',
    );
    this.roleConfirmModalTitle = page.getByTestId('confirm-modal-title');
  }

  async verifyEmptyState() {
    // Wait for the page to be in a stable state
    await this.page.waitForLoadState('networkidle');

    // Check if we have any roles
    const hasRoles = await this.roleList.isVisible();

    if (hasRoles) {
      // If roles exist, verify the role list is visible and empty state is hidden
      await expect(this.roleList).toBeVisible();
      await expect(this.emptyStateMessage).toBeHidden();
    } else {
      // If no roles exist, verify the empty state message and its content
      await expect(this.emptyStateMessage).toBeVisible();
      await expect(this.emptyStateMessage).toHaveText(
        ':( YOU HAVE NO ROLES DEFINED.',
      );
    }

    // Verify the add new role button is always visible
    await expect(this.addNewRoleButton).toBeVisible();
  }

  async verifyNavigationTabs() {
    await expect(this.userSettingsTab).toBeVisible();
    await expect(this.roleManagementTab).toBeVisible();
    await expect(this.userGroupManagementTab).toBeVisible();
    await expect(this.portfolioSharingTab).toBeVisible();
    //Change this once portfolio sharing and user group management is implemented on UI
    await expect(this.userGroupManagementTab).toBeDisabled();
    await expect(this.portfolioSharingTab).toBeDisabled();
  }

  async verifyActiveTab() {
    await expect(this.roleManagementTab).toHaveClass(/active/);
  }

  async clickAddNewRole() {
    await this.addNewRoleButton.click();
  }

  async verifyRoleFormElements() {
    await expect(this.roleItemNameInput).toBeVisible();
    await expect(this.roleItemDescriptionInput).toBeVisible();
    await expect(this.roleFormSaveButton).toBeVisible();
    await expect(this.roleFormCancelButton).toBeVisible();
    await expect(this.roleManagementRoleManagerRadioButton).toBeVisible();
    await expect(this.roleManagementNoAccessRadioButton).toBeVisible();
    await expect(
      this.portfolioManagementAdministratorRadioButton,
    ).toBeVisible();
    await expect(this.portfolioManagementNoAccessRadioButton).toBeVisible();
    await expect(this.portfolioCreationNoAccessRadioButton).toBeVisible();
    await expect(this.portfolioCreationCreatorRadioButton).toBeVisible();
    await expect(this.portfolioCreationReadOnlyRadioButton).toBeVisible();
  }

  async verifyRoleItemContent(roleName: string, roleDescription: string) {
    await expect(this.roleItemNameandDescription).toBeVisible();
    await expect(this.roleItemNameandDescription).toHaveText(
      roleName + roleDescription,
    );
  }

  async verifyRoleItemUserCount(userCount: number) {
    await expect(this.roleListItemUserCount).toBeVisible();
    await expect(this.roleListItemUserCount).toHaveText(
      `${userCount.toString()} Users`,
    );
  }

  async searchCreatedRole(roleName: string, roleDescription: string) {
    await this.searchRoleInput.fill(roleName);
    await expect(this.roleList).toBeVisible();
    await this.verifyRoleItemContent(roleName, roleDescription);
  }

  async findRoleByName(roleName: string) {
    const roleItems = await this.page
      .locator('[data-testid="role-list"]')
      .all();

    for (const roleItem of roleItems) {
      const currentRoleName = await roleItem
        .locator('[data-testid="role-item-name"]')
        .textContent();
      if (currentRoleName === roleName) {
        return roleItem;
      }
    }

    throw new Error(`Role "${roleName}" not found in the role list`);
  }

  async setPermission(permission: RolePermission) {
    switch (permission) {
      case RolePermission.ADMIN:
        // Set role management permissions
        await this.roleManagementRoleManagerRadioButton.click();
        await expect(this.roleManagementRoleManagerRadioButton).toBeChecked();

        // Set portfolio management permissions
        await this.portfolioManagementAdministratorRadioButton.click();
        await expect(
          this.portfolioManagementAdministratorRadioButton,
        ).toBeChecked();

        // Set portfolio creation permissions
        await this.portfolioCreationCreatorRadioButton.click();
        await expect(this.portfolioCreationCreatorRadioButton).toBeChecked();

        // Set portfolio sharing permissions
        await this.portfolioSharingSharerRadioButton.click();
        await expect(this.portfolioSharingSharerRadioButton).toBeChecked();
        break;

      case RolePermission.READ_ONLY:
        // Set role management permissions to admin
        await this.roleManagementRoleManagerRadioButton.click();
        await expect(this.roleManagementRoleManagerRadioButton).toBeChecked();

        // Set portfolio management permissions to admin
        await this.portfolioManagementAdministratorRadioButton.click();
        await expect(
          this.portfolioManagementAdministratorRadioButton,
        ).toBeChecked();

        // Set portfolio creation permissions to read-only
        await this.portfolioCreationReadOnlyRadioButton.click();
        await expect(this.portfolioCreationReadOnlyRadioButton).toBeChecked();

        // Set portfolio sharing permissions to admin
        await this.portfolioSharingSharerRadioButton.click();
        await expect(this.portfolioSharingSharerRadioButton).toBeChecked();
        break;

      case RolePermission.NO_ACCESS:
        // Set all permissions to No Access
        await this.roleManagementNoAccessRadioButton.click();
        await expect(this.roleManagementNoAccessRadioButton).toBeChecked();

        await this.portfolioManagementNoAccessRadioButton.click();
        await expect(this.portfolioManagementNoAccessRadioButton).toBeChecked();

        await this.portfolioCreationNoAccessRadioButton.click();
        await expect(this.portfolioCreationNoAccessRadioButton).toBeChecked();

        await this.portfolioSharingNoAccessRadioButton.click();
        await expect(this.portfolioSharingNoAccessRadioButton).toBeChecked();
        break;
    }
  }

  async verifyCreatedRolePermission(permission: RolePermission) {
    switch (permission) {
      case RolePermission.ADMIN:
        await expect(this.roleManagementRoleManagerRadioButton).toBeChecked();

        await expect(
          this.portfolioManagementAdministratorRadioButton,
        ).toBeChecked();

        await expect(this.portfolioCreationCreatorRadioButton).toBeChecked();

        await expect(this.portfolioSharingSharerRadioButton).toBeChecked();
        break;

      case RolePermission.READ_ONLY:
        await expect(this.roleManagementRoleManagerRadioButton).toBeChecked();

        await expect(
          this.portfolioManagementAdministratorRadioButton,
        ).toBeChecked();

        await expect(this.portfolioCreationReadOnlyRadioButton).toBeChecked();

        await expect(this.portfolioSharingSharerRadioButton).toBeChecked();
        break;

      case RolePermission.NO_ACCESS:
        await expect(this.roleManagementNoAccessRadioButton).toBeChecked();

        await expect(this.portfolioManagementNoAccessRadioButton).toBeChecked();

        await expect(this.portfolioCreationNoAccessRadioButton).toBeChecked();

        await expect(this.portfolioSharingNoAccessRadioButton).toBeChecked();
        break;
    }
  }
}
