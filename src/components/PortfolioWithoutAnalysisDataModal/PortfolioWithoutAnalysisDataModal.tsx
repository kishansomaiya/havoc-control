import { ComponentProps, FC, useCallback, useState } from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Modal,
    Typography,
} from '@mui/material';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { useAnalysisDataNoticeUpdate } from '../../context/AnalysisDataNoticeProvider';

type ExcludedProps = 'open' | 'children';

interface PortfolioWithoutAnalysisDataModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    onClose: () => void;
}

export const PortfolioWithoutAnalysisDataModal: FC<
    PortfolioWithoutAnalysisDataModalProps
> = ({ onClose, ...props }) => {
    const setIsHidden = useAnalysisDataNoticeUpdate();
    const [dontDisplayAnymore, setDontDisplayAnymore] = useState(false);

    const toggleCheckbox = useCallback(() => {
        setDontDisplayAnymore((isChecked) => !isChecked);
    }, []);

    const handleClose = useCallback(() => {
        if (dontDisplayAnymore) {
            setIsHidden(true);
        }

        onClose();
    }, [dontDisplayAnymore, setIsHidden, onClose]);

    return (
        <ConfirmModal
            data-testid="no-analysis-data-title"
            isOpen
            title="You have portfolio(s) without Analysis Data"
            message={
                <Box>
                    <Typography
                        variant="body1"
                        color="grey.300"
                        data-testid="no-analysis-data-text"
                    >
                        Due to migration to a new application Analysis Data
                        needs to be regenerated for the previously created
                        portfolios. Such portfolios are marked with “No Analysis
                        available” on their cards. To re-generate analysis data
                        please follow the instruction:
                    </Typography>
                    <ul data-testid="no-analysis-data-ul">
                        <li>
                            Click on “…” button at the top-right corner of the
                            Portfolio card
                        </li>
                        <li>Click on “Edit Settings & Analysis” option</li>
                        <li>
                            On next screen check “Change Analysis Type” checkbox
                        </li>
                        <li>
                            Select needed “Data Version” (“3.2.0” is selected by
                            default)
                        </li>
                        <li>
                            Select one of the Analysis Types (“Perils and
                            Scores” and “Perils, Scores, and Economic Impact”
                            are two pre-set types while “Custom” provides an
                            option to customize all settings)
                        </li>
                        <li>Click on “Save Changes” button”</li>
                    </ul>
                    <Typography
                        variant="body1"
                        color="grey.300"
                        data-testid="no-analysis-data-text2"
                    >
                        After that data generation will be executed for the
                        Portfolio (it will take some time, based on the number
                        of location and Analysis settings). After data is
                        generated you can download analyses or view Portfolio
                        Dashboards by selecting the Portfolio from the list and
                        clicking on the “Launch” button at the top-right corner
                        of the screen.
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox
                                color="secondary"
                                checked={dontDisplayAnymore}
                                onChange={toggleCheckbox}
                                data-testid="dont-display-checkbox"
                            />
                        }
                        label={
                            <Typography
                                variant="body1"
                                data-testid="dont-display-checkbox-text"
                            >
                                Don't display this message any more
                            </Typography>
                        }
                    />
                </Box>
            }
            cancelLabel=""
            confirmLabel="Close"
            onConfirm={handleClose}
            {...props}
        />
    );
};
