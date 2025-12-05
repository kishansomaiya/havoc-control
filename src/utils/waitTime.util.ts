export const getWaitTime = (locationCount: number | undefined): number[] => {
    if (!locationCount || locationCount <= 100) {
        return [1, 5];
    } else if (locationCount <= 1000) {
        return [5, 10];
    } else if (locationCount <= 5000) {
        return [10, 30];
    } else {
        return [30, 60];
    }
};
