import {
    FileValidationMessageLocationResponse,
    FileValidationMessageRowResponse,
    FileValidationResponse,
} from '../api/jupiterapi/models';

export interface IFileValidationResponse extends FileValidationResponse {
    rowErrorMessages?: FileValidationMessageRowResponse[];
    locationErrorMessages?: FileValidationMessageLocationResponse[];
}
