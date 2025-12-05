import { ComponentProps, FC } from 'react';
import { Box } from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { ECONOMIC_IMPACT_DISABLED_OPTIONS } from '../../../../../../../../const';
import { Section } from '../../../Section';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { IPortfolio } from '../../../../../../types/portfolio';
import { FormPriceTextField } from '../../../../../../../../components/Inputs/FormPriceTextField';

interface DefaultAssetValuesSectionFormProps
    extends ComponentProps<typeof Box> {}

export const DefaultAssetValuesSectionForm: FC<
    DefaultAssetValuesSectionFormProps
> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const { total, building, contents, inventory, downtime } =
        custom.economicImpacts.defaultAssetValues;

    const touched = formik.touched.custom?.economicImpacts?.defaultAssetValues;
    const errors = formik.errors.custom?.economicImpacts?.defaultAssetValues;
    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];

    const totalError = errors?.total;
    const isTotalError = touched?.total && totalError !== undefined;

    const buildingError = errors?.building;
    const isBuildingError = touched?.building && buildingError !== undefined;

    const contentsError = errors?.contents;
    const isContentsError = touched?.contents && contentsError !== undefined;

    const inventoryError = errors?.inventory;
    const isInventoryError = touched?.inventory && inventoryError !== undefined;

    const downtimeError = errors?.downtime;
    const isDowntimeError = touched?.downtime && downtimeError !== undefined;

    return (
        <Section
            {...props}
            title="Default Asset Values"
        >
            <GridFieldSet>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.defaultAssetValues.total"
                        label="Total Value"
                        placeholder="Enter Value"
                        value={total}
                        setField={setField}
                        fullWidth
                        error={isTotalError}
                        helperText={isTotalError ? totalError : ''}
                    />
                </GridField>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.defaultAssetValues.building"
                        label="Building Value"
                        placeholder="Enter Value"
                        value={building}
                        setField={setField}
                        fullWidth
                        error={isBuildingError}
                        helperText={isBuildingError ? buildingError : ''}
                    />
                </GridField>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.defaultAssetValues.contents"
                        label="Contents Value"
                        placeholder="Enter Value"
                        value={contents}
                        setField={setField}
                        fullWidth
                        error={isContentsError}
                        helperText={isContentsError ? contentsError : ''}
                    />
                </GridField>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.defaultAssetValues.inventory"
                        label="Inventory Value"
                        placeholder="Enter Value"
                        value={inventory}
                        setField={setField}
                        fullWidth
                        error={isInventoryError}
                        helperText={isInventoryError ? inventoryError : ''}
                    />
                </GridField>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.defaultAssetValues.downtime"
                        label="Downtime Value"
                        placeholder="Enter Value"
                        value={downtime}
                        setField={setField}
                        fullWidth
                        error={isDowntimeError}
                        helperText={
                            isDowntimeError
                                ? downtimeError
                                : 'Annual revenue associated with a given asset'
                        }
                        disabled={disabled.downtimeValue}
                    />
                </GridField>
            </GridFieldSet>
        </Section>
    );
};
