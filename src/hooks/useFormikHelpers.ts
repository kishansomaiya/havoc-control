import { useCallback } from 'react';
import { FormikContextType, FormikValues, useFormik } from 'formik';

export function useFormikHelpers<Value extends FormikValues = FormikValues>(
    formik: ReturnType<typeof useFormik<Value>> | FormikContextType<Value>
) {
    const { setFieldValue, setFieldTouched, ...rest } = formik;

    const setField = useCallback(
        async (field: string, value: unknown) => {
            await setFieldValue(field, value);
            setFieldTouched(field);
        },
        [setFieldTouched, setFieldValue]
    );

    const setFields = useCallback(
        async (fields: { [field: string]: unknown | undefined }) => {
            const fieldsWithValues = Object.entries(fields).filter(
                ([, value]) => value !== undefined
            );
            for (const [field, value] of fieldsWithValues) {
                await setFieldValue(field, value);
            }
            for (const [field] of fieldsWithValues) {
                setFieldTouched(field);
            }
        },
        [setFieldTouched, setFieldValue]
    );

    // Intentionally omit setFieldValue, it's error-prone to call it directly
    return { setField, setFields, setFieldTouched, ...rest };
}
