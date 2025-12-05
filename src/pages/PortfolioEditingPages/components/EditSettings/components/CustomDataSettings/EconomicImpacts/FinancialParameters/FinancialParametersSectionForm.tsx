import { ComponentProps, FC } from 'react';
import { Box } from '@mui/material';
import { Section } from '../../../Section';
import { FinancialMetricsSubSectionForm } from './FinancialMetricsSubSectionForm';

interface FinancialParametersSectionFormProps
    extends ComponentProps<typeof Box> {}

export const FinancialParametersSectionForm: FC<
    FinancialParametersSectionFormProps
> = ({ ...props }) => {
    return (
        <Section
            {...props}
            title="Financial Parameters"
        >
            <FinancialMetricsSubSectionForm />
        </Section>
    );
};
