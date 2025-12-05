import { FileValidationMessage } from '../api/jupiterapi/models';
import { EnteredLocation } from '../pages/PortfolioEditingPages/components/ImportData/components/EnterLatLongForm';
import { EnteredAddressLocation } from '../pages/PortfolioEditingPages/components/ImportData/components/EnterAddressForm';
import { IFileValidationResponse } from '../types/fileValidationTypes';
import { sleep } from './general.util';
import { VoidApiResponse } from '../api/openapi/auto-generated';

export async function downloadFileFromRawResponse(res: VoidApiResponse) {
    const disposition = res.raw.headers.get('Content-Disposition');
    let filename = 'downloaded-file';

    if (disposition && disposition.includes('filename=')) {
        const matches = disposition.match(
            /filename\*=UTF-8''(.+)|filename="?([^"]+)"?/
        );
        if (matches) {
            filename = decodeURIComponent(matches[1] || matches[2]);
        }
    }

    return res.raw.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(blobUrl);
    });
}

export const downloadFile = (url: string, fileName?: string) => {
    const link = document.createElement('a');
    link.setAttribute('href', url);
    if (fileName) {
        link.setAttribute('download', fileName);
    }
    link.click();
    link.remove();
};

export const downloadMultipleFiles = async (
    files: { url: string; filename?: string }[]
) => {
    const links = files.map(({ url, filename }) => {
        const iFrame = document.createElement('iframe');
        iFrame.setAttribute('name', `download-frame-${url}`);
        iFrame.style.display = 'none';
        document.body.appendChild(iFrame);

        const link = document.createElement('a');
        link.setAttribute('href', url);

        if (iFrame.contentDocument) {
            iFrame.contentDocument.body.appendChild(link);
        } else {
            link.setAttribute('target', iFrame.name);
            link.style.display = 'none';
        }

        if (filename) {
            link.setAttribute('download', filename);
        }

        return { link, iFrame };
    });

    links.forEach(({ link }) => link.click());

    await sleep(1000 * links.length);

    links.forEach(({ link, iFrame }) => {
        link.remove();
        iFrame.remove();
    });
};

const fallbackCopyTextToClipboard = (text: string): void => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');

    document.body.removeChild(textArea);
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
};

export const captureDebugLog = (json: unknown, prefix: string = 'data') => {
    const user = localStorage.getItem('idToken');

    const timestamp = new Date();
    const context = {
        url: window.location.origin,
        timestamp,
        datetime: timestamp.toLocaleString(),
        user,
    };

    const stringifiedContext = JSON.stringify(context, null, 2);

    const stringifiedJson = JSON.stringify(json, null, 2);

    void copyTextToClipboard(
        [
            '>>>>>>>>>>>>>>>>>>> DEBUG_LOG_START',
            'Context:',
            '-------------------',
            stringifiedContext,
            '-------------------',
            `${prefix}:`,
            '-------------------',
            stringifiedJson,
            '>>>>>>>>>>>>>>>>>>> DEBUG_LOG_END',
        ].join('\n')
    );
};

export const getFileValidationErrors = (
    validationResult: IFileValidationResponse
): Array<FileValidationMessage> => {
    const { fileMessages } = validationResult;
    if (!fileMessages) {
        return [];
    }

    return fileMessages;
    // Add below filter if it's needed even after new file validation changes
    // .filter(({ code }) =>
    //     ['E101', 'E102', 'E103', 'E201', 'E202'].includes(code || '')
    // )
    // .map(({ code = '', message = '', type = '' }) => {
    //     return {
    //         code,
    //         message,
    //         type,
    //     };
    // });
};

export const getLocationValidationErrors = (
    validationResult: IFileValidationResponse
): Array<{ code: string; message: string; rowNumber: number }> => {
    const { locationErrorMessages } = validationResult;
    if (!locationErrorMessages) {
        return [];
    }

    return locationErrorMessages.flatMap(
        ({ messages = [], customerLocationId = 0 }) =>
            messages.map(({ code = '', message = '' }) => ({
                code,
                message,
                rowNumber: customerLocationId,
            }))
    );

    // return locationErrorMessages;
    // Add below filter if it's needed even after new file validation changes
    // .filter(({ code }) =>
    //     [
    //         'E301',
    //         'E302',
    //         'E303',
    //         'E304',
    //         'E306',
    //         'W101',
    //         'W102',
    //         'W103',
    //         'W104',
    //         'W105',
    //         'W106',
    //         'W107',
    //         'W109',
    //     ].includes(code || '')
    // )
    // .map(({ code = '', description = '', rowNumber = 0 }) => {
    //     return {
    //         code,
    //         description,
    //         rowNumber,
    //     };
    // })
    // .sort((errorA, errorB) =>
    //     errorA.rowNumber > errorB.rowNumber ? 1 : -1
    // )
};

export const getRowValidationErrors = (
    validationResult: IFileValidationResponse
): Array<{ code: string; message: string; rowNumber: number }> => {
    const { rowErrorMessages } = validationResult;
    if (!rowErrorMessages) {
        return [];
    }

    const x = rowErrorMessages.flatMap(({ messages = [], rowIndex = 0 }) =>
        messages.map(({ code = '', message = '' }) => ({
            code,
            message,
            rowNumber: rowIndex,
        }))
    );

    return x.sort((errorA, errorB) =>
        errorA.rowNumber < errorB.rowNumber ? -1 : 1
    );

    // Add below filter if it's needed even after new file validation changes
    // .filter(({ code }) =>
    //     [
    //         'E301',
    //         'E302',
    //         'E303',
    //         'E304',
    //         'E306',
    //         'W101',
    //         'W102',
    //         'W103',
    //         'W104',
    //         'W105',
    //         'W106',
    //         'W107',
    //         'W109',
    //     ].includes(code || '')
    // )
    // .map(({ code = '', description = '', rowNumber = 0 }) => {
    //     return {
    //         code,
    //         description,
    //         rowNumber,
    //     };
    // })
    // .sort((errorA, errorB) =>
    //     errorA.rowNumber > errorB.rowNumber ? 1 : -1
    // )
};

export const getErrorLocationRowNumbers = (
    validationResult: IFileValidationResponse
): Array<number> => {
    const locationErrors = getLocationValidationErrors(validationResult);
    if (!locationErrors) {
        return [];
    }
    return locationErrors
        .filter(({ code, rowNumber }) => {
            return code?.startsWith('E') && !!rowNumber;
        })
        .map(({ rowNumber }) => rowNumber as number);
};

export const convertLocationsToCSVContent = (
    locations: EnteredLocation[]
): string => {
    const header = 'locationId,latitude,longitude';
    const rows = locations.map(
        (location) =>
            `${location.id},${location.latitude},${location.longitude}`
    );
    return [header, ...rows].join('\n');
};

export const convertAddressLocationsToCSVContent = (
    locations: EnteredAddressLocation[]
): string => {
    const header = 'locationId,latitude,longitude,streetAddress';
    const rows = locations.map(
        (location) =>
            `${location.id},${location.latitude},${location.longitude},"${location.streetAddress}"`
    );
    return [header, ...rows].join('\n');
};

export const createCSVFile = (
    content: string,
    fileName: string = 'locations'
): File => {
    const blob = new Blob([content], { type: 'text/csv' });
    return new File([blob], `${fileName}.csv`, { type: 'text/csv' });
};

export const removeFileExtension = (filename: string = '') => {
    if (!filename) {
        return '';
    }

    const lastIndex = filename.lastIndexOf('.');
    if (lastIndex === -1) {
        return filename; // No extension found
    }
    return filename.slice(0, lastIndex);
};
