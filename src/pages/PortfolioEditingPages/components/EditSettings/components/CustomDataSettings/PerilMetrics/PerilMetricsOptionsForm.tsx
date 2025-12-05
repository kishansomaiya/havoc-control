import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useState,
    SyntheticEvent,
    useEffect,
} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    FormControlLabel,
    Switch,
} from '@mui/material';
import * as Icon from 'react-feather';
import { useFormikContextHelpers } from '../../../../../../../hooks/useFormikContextHelpers';
import { SectionSet } from '../../SectionSet';
import { PerilsSectionForm } from './Perils/PerilsSectionForm';
import { YearsSectionForm } from './Years/YearsSectionForm';
import { ScenariosSectionForm } from './Scenarios/ScenariosSectionForm';
import { FloodDefenseSectionForm } from './FloodDefense/FloodDefenseSectionForm';
import { IPortfolio } from '../../../../../types/portfolio';

interface PerilMetricsOptionsFormProps
    extends Omit<ComponentProps<typeof Accordion>, 'children'> {}

export const PerilMetricsOptionsForm: FC<PerilMetricsOptionsFormProps> = ({
    ...props
}) => {
    const [expanded, setExpanded] = useState(true);
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setFields } = formik;
    const { isPerilMetricsEnabled } = formik.values;

    const handleExpand = useCallback(
        (_event: SyntheticEvent, expanded: boolean) => {
            if (!isPerilMetricsEnabled) {
                return;
            }
            setExpanded(expanded);
        },
        [isPerilMetricsEnabled]
    );

    useEffect(() => {
        if (!isPerilMetricsEnabled) {
            setExpanded(false);
        }
    }, [isPerilMetricsEnabled]);

    const handlePerilMetricsToggle = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const isPerilMetricsEnabled = event.target.checked;
            await setFields({
                isPerilMetricsEnabled,
                isEconomicImpactsEnabled: !isPerilMetricsEnabled
                    ? false
                    : undefined,
            });
        },
        [setFields]
    );

    return (
        <Accordion
            {...props}
            expanded={expanded}
            onChange={handleExpand}
        >
            <AccordionSummary expandIcon={<Icon.ChevronDown />}>
                <FormControlLabel
                    control={
                        <Switch
                            color="secondary"
                            checked={isPerilMetricsEnabled}
                            onChange={handlePerilMetricsToggle}
                        />
                    }
                    label="Peril Metrics"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                />
            </AccordionSummary>
            <AccordionDetails>
                <SectionSet>
                    <PerilsSectionForm />
                    <YearsSectionForm />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        <ScenariosSectionForm sx={{ flex: 1 }} />
                        <FloodDefenseSectionForm sx={{ flex: 1 }} />
                    </Box>
                </SectionSet>
            </AccordionDetails>
        </Accordion>
    );
};
