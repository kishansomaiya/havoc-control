import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import {
    Box,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
} from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../../../../types/portfolio';
import { Section } from '../../../Section';
import { MeshType } from '../../../../../../../../api/openapi/auto-generated';
import { meshTypeTitle } from '../../../../../../../../types/meshTypeEnum';
import { useUserContext } from '../../../../../../../../context/UserContextProvider';

interface SizeGridSectionFormProps extends ComponentProps<typeof Box> {}

export const SizeGridSectionForm: FC<SizeGridSectionFormProps> = ({
    sx,
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { custom } = formik.values;
    const { canAccessLargeGrid } = useUserContext();

    const { type } = custom.floodMesh.mesh;

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField('custom.floodMesh.mesh.type', event.target.value);
        },
        [setField]
    );

    return (
        <Section
            {...props}
            sx={{ ...sx, gap: 1 }}
            title="Grid Size"
        >
            <RadioGroup
                value={type}
                onChange={handleChange}
            >
                <FormControlLabel
                    control={<Radio color='secondary' />}
                    value={MeshType.fixed}
                    label={meshTypeTitle(MeshType.fixed)}
                    disabled={!canAccessLargeGrid}
                />
                {!canAccessLargeGrid && (
                    <FormHelperText
                        sx={{
                            margin: 0,
                        }}
                    >
                        This option creates a large mesh around the center
                        point. If you are interested in learning more about this
                        feature, please speak to your CSA about upgrading.
                    </FormHelperText>
                )}
                <FormControlLabel
                    control={<Radio color='secondary' />}
                    value={MeshType.dynamic}
                    label={meshTypeTitle(MeshType.dynamic)}
                />
            </RadioGroup>
        </Section>
    );
};
