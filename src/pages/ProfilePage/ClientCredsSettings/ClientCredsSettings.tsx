import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { CheckSquare, Copy, Info, Trash } from 'react-feather';
import { copyTextToClipboard } from '../../../utils';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';
import { useClientsQuery } from '../../../api/queries/clientsQuery';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0User } from '../../../types';
import {
    useCreateClientMutation,
    useDeleteClientMutation,
} from '../../../api/mutations/clientsMutation';
import { useFormatMessage } from '../../../localization/useFormatMessage';

const textInputSX = {
    height: 36,
    '& .MuiInputBase-input': {
        cursor: 'default',
        caret: 'unset',
        caretColor: 'transparent',
    },
};

export const ClientCredsGrid: FC = () => {
    const formatMessage = useFormatMessage();
    const theme = useTheme();
    const { user } = useAuth0();

    const userId = useMemo(
        () => (user as Auth0User)['custom:jupiter-user-id'],
        [user]
    );

    const {
        clientsDetailsData: clients,
        isClientsLoading,
        reFetchClients,
    } = useClientsQuery(userId);
    const { createClient, isClientCreating } = useCreateClientMutation();
    const { deleteClient, isClientDeleting } = useDeleteClientMutation();

    const [listRecentlyCopied, setListRecentlyCopied] = useState<string[]>([]);
    const [clientIdToDelete, setClientIdToDelete] = useState<string>('');

    const isDeleteClientModalOpen = useMemo(
        () => Boolean(clientIdToDelete),
        [clientIdToDelete]
    );
    const isCreateClientDisabled = useMemo(
        () =>
            isClientsLoading ||
            isClientCreating ||
            (clients && clients.length >= 2),
        [clients, isClientCreating, isClientsLoading]
    );

    const copyData = async (text: string): Promise<void> => {
        await copyTextToClipboard(text);
        setListRecentlyCopied((pre) => [...pre, text]);
        // timeout to show successfully copied indicator as micro-intercation
        setTimeout(() => {
            setListRecentlyCopied((pre) => pre.filter((item) => item !== text));
        }, 500);
    };

    const handleCreateClient = useCallback(async () => {
        if (!userId) {
            return;
        }
        await createClient({
            createClientInput: {
                userId,
            },
        });
    }, [createClient, userId]);

    const handleDeleteClient = useCallback(
        (id: string) => {
            setClientIdToDelete(id);
        },
        [setClientIdToDelete]
    );

    const handleConfirmDeleteClient = useCallback(async () => {
        if (!userId || !clientIdToDelete) {
            return;
        }
        await deleteClient({ clientId: clientIdToDelete });
        setClientIdToDelete('');
        await reFetchClients();
    }, [userId, clientIdToDelete]);

    const handleCancelDeleteClient = useCallback(() => {
        setClientIdToDelete('');
    }, [setClientIdToDelete]);

    if (isClientsLoading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
            >
                <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={2}
                >
                    {clients?.map(({ id, clientId, clientSecret }, index) => (
                        <Fragment key={`${clientId}-${index}`}>
                            <Grid
                                item
                                xs={5.5}
                                flexGrow={1}
                            >
                                <TextField
                                    fullWidth
                                    label="Client ID"
                                    InputProps={{
                                        sx: textInputSX,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    sx={{
                                                        paddingX: 1,
                                                    }}
                                                    onClick={() => {
                                                        void copyData(clientId);
                                                    }}
                                                >
                                                    {listRecentlyCopied.includes(
                                                        clientId
                                                    ) ? (
                                                        <CheckSquare size="1rem" />
                                                    ) : (
                                                        <Copy size="1rem" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={clientId}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={5.5}
                                flexGrow={1}
                            >
                                <TextField
                                    fullWidth
                                    label="Secret"
                                    type="password"
                                    InputProps={{
                                        sx: textInputSX,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    sx={{
                                                        paddingX: 1,
                                                    }}
                                                    onClick={() => {
                                                        void copyData(
                                                            clientSecret
                                                        );
                                                    }}
                                                >
                                                    {listRecentlyCopied.includes(
                                                        clientSecret
                                                    ) ? (
                                                        <CheckSquare size="1rem" />
                                                    ) : (
                                                        <Copy size="1rem" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={clientSecret}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={1}
                            >
                                <IconButton
                                    sx={{
                                        p: 1.25,
                                        color: theme.palette.text.secondary,
                                    }}
                                    onClick={() => handleDeleteClient(id)}
                                    data-testid={'delete-client-btn'}
                                >
                                    <Trash size="1rem" />
                                </IconButton>
                            </Grid>
                        </Fragment>
                    ))}
                </Grid>
                <Box
                    display="flex"
                    alignItems="flex-start"
                    flexDirection="column"
                    gap={0.5}
                >
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        disabled={isCreateClientDisabled}
                        onClick={() => {
                            void handleCreateClient();
                        }}
                        data-testid={'create-api-client-btn'}
                    >
                        {formatMessage('profile.api_keys.create_client_id')}
                        {isClientCreating && (
                            <CircularProgress
                                size="1rem"
                                sx={{ marginLeft: theme.spacing(0.5) }}
                            />
                        )}
                    </Button>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            To get client-ID and secret
                        </Typography>
                        {clients && clients.length >= 2 && (
                            <Tooltip
                                placement="right"
                                title="You can only create maximum of 2 clients, to create new client please delete an existing one."
                            >
                                <Info
                                    size="1rem"
                                    color={theme.palette.text.secondary}
                                />
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>

            {isDeleteClientModalOpen && (
                <ConfirmModal
                    title="Delete Client"
                    message="You are requesting deletion of this ClientID and Secret. Once deleted, it will no longer be available in your account. Are you sure you want to continue?"
                    onConfirm={handleConfirmDeleteClient}
                    onCancel={handleCancelDeleteClient}
                    confirmLabel="Delete"
                    isLoading={isClientDeleting}
                    isDisabled={isClientDeleting}
                />
            )}
        </>
    );
};
