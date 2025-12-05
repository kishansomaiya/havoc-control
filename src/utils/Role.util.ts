import { numberFormatter } from './formatter.util';

export const getUserCountLabel = (userCount?: number): string =>
    `${userCount ? numberFormatter(userCount) : 0} User${
        userCount !== 1 ? 's' : ''
    }`;
