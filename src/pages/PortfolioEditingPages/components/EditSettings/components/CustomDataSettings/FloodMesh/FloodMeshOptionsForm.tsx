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
    Tooltip,
} from '@mui/material';
import * as Icon from 'react-feather';
import { useFormikContextHelpers } from '../../../../../../../hooks/useFormikContextHelpers';
import { SectionSet } from '../../SectionSet';
import { SizeGridSectionForm } from './SizeGrid/SizeGridSectionForm';
import { ScenariosSectionForm } from './Scenarios/ScenariosSectionForm';
import { YearsSectionForm } from './Years/YearsSectionForm';
import { FloodDefenseSectionForm } from './FloodDefense/FloodDefenseSectionForm';
import { IPortfolio } from '../../../../../types/portfolio';
import { FLOOD_MESH_LOCATION_COUNT_LIMIT } from '../../../../../../../const';

interface FloodMeshOptionsFormProps
    extends Omit<ComponentProps<typeof Accordion>, 'children'> {}

export const FloodMeshOptionsForm: FC<FloodMeshOptionsFormProps> = ({
    ...props
}) => {
    const [expanded, setExpanded] = useState(false);
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { isFloodMeshEnabled, locationCount } = formik.values;

    const handleExpand = useCallback(
        (_event: SyntheticEvent, expanded: boolean) => {
            if (!isFloodMeshEnabled) {
                return;
            }
            setExpanded(expanded);
        },
        [isFloodMeshEnabled]
    );

    useEffect(() => {
        if (!isFloodMeshEnabled) {
            setExpanded(false);
        }
    }, [isFloodMeshEnabled]);

    const handleFloodMeshEnabledToggle = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField('isFloodMeshEnabled', event.target.checked);
        },
        [setField]
    );

    const isDisabled = useMemo(
        () => locationCount > FLOOD_MESH_LOCATION_COUNT_LIMIT,
        [locationCount]
    );

    const switchControl = (
        <FormControlLabel
            control={
                <Switch
                    color="secondary"
                    checked={isFloodMeshEnabled}
                    onChange={handleFloodMeshEnabledToggle}
                />
            }
            label={
                <>
                    <span>Flood Mesh</span>
                    {isDisabled && (
                        <Tooltip
                            placement="top"
                            title="Please select a portfolio with 50 or fewer locations to run a Flood Mesh analysis"
                        >
                            <Icon.Info
                                size="1rem"
                                style={{
                                    marginLeft: '0.5rem',
                                    verticalAlign: 'middle',
                                }}
                            />
                        </Tooltip>
                    )}
                </>
            }
            disabled={isDisabled}
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
        >
            <AccordionSummary expandIcon={<Icon.ChevronDown />}>
                {switchControl}
            </AccordionSummary>
            <AccordionDetails>
                <SectionSet>
                    <SizeGridSectionForm />
                    <ScenariosSectionForm />
                    <YearsSectionForm />
                    <FloodDefenseSectionForm />
                </SectionSet>
            </AccordionDetails>
        </Accordion>
    );
};
