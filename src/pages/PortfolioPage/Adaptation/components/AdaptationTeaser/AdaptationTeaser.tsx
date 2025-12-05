import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { useSessionStorage } from '../../../../../hooks/useSessionStorage';
import oHeap from '../../../../../heap-analytics';
import { NOTIFY_ME_CLICK } from '../../../../../const/heap';
import { TeaserPopup } from '../../../../../components/TeaserPopup/TeaserPopup';
import { AdaptationVisualizations } from '../AdaptationVisualizations/AdaptationVisualizations';

const ADAPTATION_NOTIFY_TRACKER = 'adaptation_notify_clicked';

export function AdaptationTeaser() {
    const formatMessage = useFormatMessage();
    const [isDismissed, setDismissed] = useState(false);
    const [isNotifyClicked, setNotifyClicked] = useSessionStorage(
        ADAPTATION_NOTIFY_TRACKER,
        false
    );

    const handleClick = useCallback(() => {
        oHeap.trackCustomEvent(NOTIFY_ME_CLICK);
        setNotifyClicked(true);
    }, [setNotifyClicked]);

    const handleClose = useCallback(() => {
        setDismissed(true);
    }, [setDismissed]);

    return (
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                minHeight: '0',
            }}
        >
            <AdaptationVisualizations
                setView={() => null}
                analysisId={''}
                selectedLocationIds={[]}
            />
            <TeaserPopup
                titleText={formatMessage('adaptation.teaser.title')}
                bodyText={formatMessage('adaptation.teaser.text')}
                closeText={formatMessage('general.close')}
                proceedText={formatMessage('general.notify_me')}
                disableOnProceed={isNotifyClicked}
                subtitleText={
                    isNotifyClicked
                        ? formatMessage('adaptation.teaser.subtitle')
                        : undefined
                }
                onClose={handleClose}
                onProceed={handleClick}
                dismiss={isDismissed}
            />
        </Box>
    );
}
