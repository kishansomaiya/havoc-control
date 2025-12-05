export function withErrorMessage<Result>(
    errorMessage: string,
    callback: (errorMessage: string) => Result
) {
    return callback(errorMessage);
}

const subIndustryCodeRegex = /^(?!00000000)\d{8}$/;

export function isValidGICSSubIndustryCode(value: string) {
    return subIndustryCodeRegex.test(value);
}
