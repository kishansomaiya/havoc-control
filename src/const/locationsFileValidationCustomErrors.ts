import { FileValidationMessage } from '../api/jupiterapi/models';
import { PORTFOLIO_LOCATIONS_COUNT_LIMIT } from './portfolioLocationsCountLimit';

export const UPLOADED_FILE_TOO_LARGE_ERROR: FileValidationMessage = {
    code: 'E103',
    message: `The file you have uploaded is too large. Please make sure your file does not exceed ${PORTFOLIO_LOCATIONS_COUNT_LIMIT} rows.`,
    type: 'critical',
};

export const UPLOADED_FILE_UNKNOWN_ERROR: FileValidationMessage = {
    code: 'E102',
    message:
        'The file you have uploaded is invalid. Please try to upload another file.',
    type: 'critical',
};
