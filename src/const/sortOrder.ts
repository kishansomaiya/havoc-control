import { SortOrder } from '../types';

export const sortComparisonValue = {
    [SortOrder.Asc]: {
        a_lt_b: -1,
        a_gt_b: 1,
    },
    [SortOrder.Desc]: {
        a_lt_b: 1,
        a_gt_b: -1,
    },
};
