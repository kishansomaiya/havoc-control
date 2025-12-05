export enum APIFileType {
    CSV = 'csv',
    DOCX = 'docx',
}

export enum APIFilePurpose {
    PortfolioUpload = 'portfolio_upload',
    PortfolioExport = 'portfolio_export',
    GeocodeLog = 'geocode_log',
    ResultSetExport = 'result_set_export',
    SLRExport = 'single_location_report_export',
    UsageTrackingExport = 'usage_tracking_export',
}

export enum FileUploadingStatus {
    Uploading = 'Uploading',
    Error = 'Error',
    Completed = 'Completed',
}

export enum FileValidationRequestStatus {
    NotStarted = 'NotStarted',
    Validating = 'Validating',
    Error = 'Error',
    Completed = 'Completed',
    CompletedWithWarningsAndErrors = 'CompletedWithWarningsAndErrors',
    CompletedWithWarnings = 'CompletedWithWarnings',
    CompletedWithErrors = 'CompletedWithErrors',
}
