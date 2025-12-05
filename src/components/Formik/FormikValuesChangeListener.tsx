import { FC, useEffect } from 'react';
import { FormikValues } from 'formik/dist/types';
import { useDebounce } from '../../hooks/useDebounce';

export const FormikValuesChangeListener: FC<{
    values: FormikValues;
    onValuesChange?: (v: FormikValues) => void;
    debounceTime?: number;
}> = ({ values, onValuesChange, debounceTime = 200 }) => {
    const triggerFormChangeWithDebounce = useDebounce(
        (formValues: FormikValues) => {
            onValuesChange?.(formValues);
        },
        debounceTime
    );

    useEffect(() => {
        triggerFormChangeWithDebounce(values);
    }, [triggerFormChangeWithDebounce, values]);

    return null;
};
