// tests/ui/components/RunFloodMeshModal.ts

import { Page, Locator ,expect} from '@playwright/test';
import { SingleLocationHeader } from './SingleLocationHeader';

export class RunFloodMeshModal {
  readonly page: Page;
  readonly singleLocationHeader: SingleLocationHeader;
  readonly RunFloodMesh_Modal: Locator;
  readonly Modal_Title: Locator;
  readonly DataDisplay_Label: Locator;
  readonly Dynamic_Label: Locator;
  readonly _15x15_Label: Locator;

  readonly RadioButtons: Locator;
  readonly RadioButton_Dynamic: Locator;
  readonly DynamicRadioButton: Locator;

  readonly RadioButton_15x15: Locator;
  readonly RadioButton_15x15_HelpText: Locator;
  readonly _15x15RadioButton: Locator;

  readonly EditPortfolio_Text: Locator;
  readonly EditPortfolio_Link: Locator;

  readonly Run_Button: Locator;
  readonly Cancel_Button: Locator;

  readonly ProgressBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singleLocationHeader = new SingleLocationHeader(this.page);
    this.RunFloodMesh_Modal = page.getByTestId('create-flood-mesh-modal-box');
    this.Modal_Title = page.getByTestId('create-flood-mesh-modal-title');
    this.DataDisplay_Label = page.getByTestId(
      'create-flood-mesh-modal-type-title',
    );

    this.RadioButtons = page.getByTestId('create-flood-mesh-modal-type');
    this.RadioButton_Dynamic = page.getByTestId(
      'create-flood-mesh-radio-button-dynamic',
    );
    this.DynamicRadioButton = page.getByLabel('Dynamic');

    this.RadioButton_15x15 = page.getByTestId(
      'create-flood-mesh-radio-button-15x15',
    );
    this.RadioButton_15x15_HelpText = page.getByTestId(
      'radio-button-15x15-helptext',
    );
    this._15x15RadioButton = page.getByLabel('15x15');

    this.EditPortfolio_Text = page.getByTestId(
      'create-flood-mesh-modal-edit-portfolio-title',
    );
    this.EditPortfolio_Link = page.getByTestId(
      'create-flood-mesh-modal-edit-portfolio-link',
    );

    // Buttons
    this.Cancel_Button = page.getByTestId(
      'create-flood-mesh-modal-button-cancel',
    );
    this.Run_Button = page.getByTestId(
      'create-flood-mesh-modal-button-confirm',
    );

    this.ProgressBar = page.getByRole('progressbar').getByRole('img');
  }

  async clickOnEditSettingsLink() {
    await expect(this.EditPortfolio_Link).toBeVisible();
    await this.EditPortfolio_Link.click();
    await this.RunFloodMesh_Modal.waitFor({
      state: 'hidden',
    });
  }

  async clickOnCancel() {
    await expect(this.Cancel_Button).toBeVisible();
    await this.Cancel_Button.click();
    await this.RunFloodMesh_Modal.waitFor({
      state: 'hidden',
    });
    await this.RunFloodMesh_Modal.waitFor({
      state: 'hidden',
    });
  }

  async clickOnRun() {
    await expect(this.Run_Button).toBeVisible();
    await this.Run_Button.click();
    await expect(this.Run_Button).toBeDisabled();
    await this.Run_Button.waitFor({
      state: 'hidden',
    });
    await expect(
      this.singleLocationHeader.FloodMeshTab.filter({ has: this.ProgressBar }),
    ).toBeVisible();
    await expect(this.singleLocationHeader.FloodMeshTab).toHaveAttribute(
      'aria-label',
      'Loading',
    );
  }

  async runFloodMeshAndWaitForResults_Dynamic() {
    await this.selectDynamic();
    await this.clickOnRun();
    await this.ProgressBar.waitFor({ state: 'hidden' });
  }

  async selectDynamic() {
    const isChecked = await this.DynamicRadioButton.isChecked();
    if (!isChecked) {
      await this.DynamicRadioButton.check();
    }

    const newState = await this.DynamicRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this._15x15RadioButton).not.toBeChecked();
  }

  async select_15x15() {
    const isChecked = await this._15x15RadioButton.isChecked();
    if (!isChecked) {
      await this._15x15RadioButton.check();
    }

    const newState = await this._15x15RadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.DynamicRadioButton).not.toBeChecked();
  }

  async verifyDefaultState() {
    await expect(this.DynamicRadioButton).toBeVisible();
    await expect(this.DynamicRadioButton).toBeChecked();
    await expect(this._15x15RadioButton).toBeDisabled();
    await expect(this._15x15RadioButton).not.toBeChecked();
    await expect(this.Run_Button).toBeEnabled();
    await expect(this.Cancel_Button).toBeEnabled();
  }

  async validateModalText() {
    const modalTitleText = 'Run Flood Mesh';
    const dataDisplayText = 'Data Display';

    await expect(this.Modal_Title).toBeVisible();
    await expect(this.Modal_Title).toHaveText(modalTitleText);
    await expect(this.DataDisplay_Label).toBeVisible();
    await expect(this.DataDisplay_Label).toHaveText(dataDisplayText);
    await expect(this.RadioButton_Dynamic).toBeVisible();
    await expect(this.RadioButton_Dynamic).toHaveText('Dynamic');
    await expect(this.RadioButton_15x15).toBeVisible();
    await expect(this.RadioButton_15x15).toHaveText('15x15');

    await expect(this.Cancel_Button).toHaveText('Cancel');
    await expect(this.Run_Button).toHaveText('Run');
  }
}
