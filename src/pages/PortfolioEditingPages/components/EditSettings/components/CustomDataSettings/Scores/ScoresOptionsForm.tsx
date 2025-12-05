import {
    ChangeEvent,
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
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
import { SectionSet } from '../../SectionSet';
import { ScoresSectionForm } from './Scores/ScoresSectionForm';
import { IPortfolio } from '../../../../../types/portfolio';

interface ScoresOptionsFormProps
    extends Omit<ComponentProps<typeof Accordion>, 'children'> {}

export const ScoresOptionsForm: FC<ScoresOptionsFormProps> = ({ ...props }) => {
    const [expanded, setExpanded] = useState(false);
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { isScoresEnabled } = formik.values;

    const handleExpand = useCallback(
        (_event: SyntheticEvent, expanded: boolean) => {
            if (!isScoresEnabled) {
                return;
            }
            setExpanded(expanded);
        },
        [isScoresEnabled]
    );

    useEffect(() => {
        if (!isScoresEnabled) {
            setExpanded(false);
        }
    }, [isScoresEnabled]);

    const handleScoresEnabledToggle = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField('isScoresEnabled', event.target.checked);
        },
        [setField]
    );

    const switchControl = (
        <FormControlLabel
            control={
                <Switch
                    color="secondary"
                    checked={isScoresEnabled}
                    onChange={handleScoresEnabledToggle}
                />
            }
            label="Scores"
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
                    <ScoresSectionForm />
                </SectionSet>
            </AccordionDetails>
        </Accordion>
    );
};
