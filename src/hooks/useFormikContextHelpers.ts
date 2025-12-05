import { FormikValues, useFormikContext } from 'formik';
import { useFormikHelpers } from './useFormikHelpers';

export function useFormikContextHelpers<
    Value extends FormikValues = FormikValues,
>() {
    const formik = useFormikContext<Value>();
    return useFormikHelpers<Value>(formik);
}
