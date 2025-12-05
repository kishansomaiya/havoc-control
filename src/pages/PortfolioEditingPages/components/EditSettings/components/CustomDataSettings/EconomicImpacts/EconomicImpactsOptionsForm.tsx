import {
    ChangeEvent,
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../hooks/useFormikContextHelpers';
import * as Icon from 'react-feather';
import { DefaultBuildingAttributesSectionForm } from './DefaultBuildingAttributes/DefaultBuildingAttributesSectionForm';
import { DefaultAssetValuesSectionForm } from './DefaultAssetValues/DefaultAssetValuesSectionForm';
import { AdvancedParametersSectionForm } from './AdvancedParameters/AdvancedParametersSectionForm';
import { FinancialParametersSectionForm } from './FinancialParameters/FinancialParametersSectionForm';
import { SectionSet } from '../../SectionSet';
import { IPortfolio } from '../../../../../types/portfolio';
import { Peril } from '../../../../../../../types';

const perilsRequiredToEnableEconomicImpacts = [
    Peril.CombinedFlood,
    Peril.Wind,
    Peril.Heat,
    Peril.Fire,
    Peril.Drought,
];

interface EconomicImpactsOptionsFormProps
    extends Omit<ComponentProps<typeof Accordion>, 'children'> {}

export const EconomicImpactsOptionsForm: FC<
    EconomicImpactsOptionsFormProps
> = ({ ...props }) => {
    const [expanded, setExpanded] = useState(false);
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setFields } = formik;
    const { isEconomicImpactsEnabled, custom } = formik.values;

    const isRequiredPerilPresentForEconomicImpacts = useMemo(() => {
        return perilsRequiredToEnableEconomicImpacts.some((peril) =>
            custom.perilMetrics.perils.includes(peril)
        );
    }, [custom.perilMetrics.perils]);

    useEffect(() => {
        if (!isRequiredPerilPresentForEconomicImpacts) {
            setFields({ isEconomicImpactsEnabled: false });
        }
    }, [isRequiredPerilPresentForEconomicImpacts, setFields]);

    const handleExpand = useCallback(
        (_event: SyntheticEvent, expanded: boolean) => {
            if (
                !isEconomicImpactsEnabled ||
                !isRequiredPerilPresentForEconomicImpacts
            ) {
                return;
            }
            setExpanded(expanded);
        },
        [isEconomicImpactsEnabled, isRequiredPerilPresentForEconomicImpacts]
    );

    useEffect(() => {
        if (
            !isEconomicImpactsEnabled ||
            !isRequiredPerilPresentForEconomicImpacts
        ) {
            setExpanded(false); // Collapse the accordion
        }
    }, [isEconomicImpactsEnabled, isRequiredPerilPresentForEconomicImpacts]);

    const handleEconomicImpactsToggle = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const isEconomicImpactsEnabled = event.target.checked;
            await setFields({
                isEconomicImpactsEnabled,
                isPerilMetricsEnabled: isEconomicImpactsEnabled
                    ? true
                    : undefined,
            });
        },
        [setFields]
    );

    const switchControl = (
        <FormControlLabel
            control={
                <Switch
                    color="secondary"
                    checked={isEconomicImpactsEnabled}
                    onChange={handleEconomicImpactsToggle}
                />
            }
            label="Economic Impacts"
            onClick={(event) => {
                event.stopPropagation();
            }}
        />
    );

    return (
        <Accordion
            {...props}
            expanded={expanded}
            onChange={handleExpand}
            disabled={!isRequiredPerilPresentForEconomicImpacts} // Disable accordion if required perils are not present
        >
            <AccordionSummary expandIcon={<Icon.ChevronDown />}>
                {switchControl}
            </AccordionSummary>
            <AccordionDetails>
                <SectionSet>
                    <DefaultBuildingAttributesSectionForm />
                    <DefaultAssetValuesSectionForm />
                    <AdvancedParametersSectionForm />
                    <FinancialParametersSectionForm />
                </SectionSet>
            </AccordionDetails>
        </Accordion>
    );
};
