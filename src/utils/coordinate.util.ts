export const isValidLatitude = (lat: number): boolean => lat > -90 && lat < 90;

export const isValidLongitude = (lng: number): boolean =>
    lng > -180 && lng < 180;

const isCoercedNumber = (val: string): boolean =>
    !Number.isNaN(parseFloat(val));

export const numberHasDecimalPlace = (num: string): boolean =>
    !Number.isInteger(parseFloat(num));

export const bothCoordsHaveDecimal = (coordsStr: string): boolean => {
    const arr = coordsStr.split(',');
    return (
        arr.length === 2 &&
        arr.every(isCoercedNumber) &&
        arr.every(numberHasDecimalPlace)
    );
};

export const inputIsNumberCommaNumber = (coordsStr: string): boolean => {
    const arr = coordsStr.split(',');
    return arr.length === 2 && arr.every(isCoercedNumber);
};

export const validateCoordsInput = (coordsStr: string): boolean => {
    const arr = coordsStr.split(',');
    if (arr.length !== 2) return false;
    const [lat, lng] = arr;
    return (
        isCoercedNumber(lat) &&
        isCoercedNumber(lng) &&
        isValidLatitude(parseFloat(lat)) &&
        isValidLongitude(parseFloat(lng))
    );
};

export default validateCoordsInput;
