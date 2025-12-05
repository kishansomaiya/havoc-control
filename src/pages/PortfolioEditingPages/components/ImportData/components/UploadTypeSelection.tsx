import { ComponentProps, FC, useCallback } from 'react';
import {
    Box,
    Button,
    List,
    ListItemButton,
    Radio,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { UploadLocationsType } from '../types/uploadLocationsTypeEnum';
import * as Icon from 'react-feather';
import { downloadFile } from '../../../../../utils';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
const CSV_EXAMPLE_URL = '/Sample_Input_for_Loss.csv';

interface StyledListItemProps extends ComponentProps<typeof ListItemButton> {
    selected: boolean;
    onSelect: () => void;
    title: string;
    description: string;
}

const StyledListItem: FC<StyledListItemProps> = ({
    selected,
    onSelect,
    title,
    description,
}) => {
    return (
        <ListItemButton
            selected={selected}
            sx={{
                borderRadius: '0.25rem',
                borderWidth: '0.0625rem',
                borderColor: 'grey.500',
                borderStyle: 'solid',
            }}
            onClick={onSelect}
            onSelect={onSelect}
        >
            <Box
                display="flex"
                flexDirection="row"
                gap={0.5}
                alignItems="flex-start"
            >
                <Box>
                    <Radio
                        checked={selected}
                        onChange={onSelect}
                        name="radio-buttons"
                        color="secondary"
                        inputProps={{ 'aria-label': 'A' }}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={0.5}
                >
                    <Typography
                        variant="h3"
                        pt={1.5}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        pb={1.5}
                    >
                        {description}
                    </Typography>
                </Box>
            </Box>
        </ListItemButton>
    );
};

interface UploadTypeSelectionProps extends ComponentProps<typeof Box> {
    type: UploadLocationsType;
    onTypeChange: (type: UploadLocationsType) => void;
}

export const UploadTypeSelection: FC<UploadTypeSelectionProps> = ({
    type,
    onTypeChange,
    ...props
}) => {
    const formatMessage = useFormatMessage();
    const handleImportFileSelection = useCallback(() => {
        onTypeChange(UploadLocationsType.ImportFile);
    }, [onTypeChange]);

    const handleEnterLatLongSelection = useCallback(() => {
        onTypeChange(UploadLocationsType.EnterLatLong);
    }, [onTypeChange]);

    const handleEnterAddressSelection = useCallback(() => {
        onTypeChange(UploadLocationsType.EnterAddress);
    }, [onTypeChange]);

    const handleDownloadTemplate = useCallback(() => {
        downloadFile(CSV_EXAMPLE_URL, 'Sample Input for Loss.csv');
    }, []);

    return (
        <Box {...props}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    textTransform="uppercase"
                    data-testid="upload-type-label"
                >
                    {formatMessage('create_portfolio.upload_type.label')}
                </Typography>
                <Button
                    variant="outlined"
                    endIcon={<Icon.Download size="1rem" />}
                    onClick={handleDownloadTemplate}
                    data-testid="download-template-button"
                >
                    {formatMessage('create_portfolio.download_template_button')}
                </Button>
            </Box>
            <List>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        xs={12}
                        data-testid="upload-csv-radio-button"
                    >
                        <StyledListItem
                            title={formatMessage(
                                'create_portfolio.upload_type.import_file'
                            )}
                            description={formatMessage(
                                'create_portfolio.upload_type.import_file.description'
                            )}
                            selected={type === UploadLocationsType.ImportFile}
                            onSelect={handleImportFileSelection}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        data-testid="enter-lat-long-radio-button"
                    >
                        <StyledListItem
                            title={formatMessage(
                                'create_portfolio.upload_type.enter_lat_long'
                            )}
                            description={formatMessage(
                                'create_portfolio.upload_type.enter_lat_long.description'
                            )}
                            selected={type === UploadLocationsType.EnterLatLong}
                            onSelect={handleEnterLatLongSelection}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        data-testid="enter-address-radio-button"
                    >
                        <StyledListItem
                            title={formatMessage(
                                'create_portfolio.upload_type.enter_address'
                            )}
                            description={formatMessage(
                                'create_portfolio.upload_type.enter_address.description'
                            )}
                            selected={type === UploadLocationsType.EnterAddress}
                            onSelect={handleEnterAddressSelection}
                        />
                    </Grid>
                </Grid>
            </List>
        </Box>
    );
};
