import { string, object, boolean } from 'yup';
import { ALLOWED_SYMBOLS_REGEX } from '../../../../../const';

export const roleFormSchema = object({
    roleName: string()
        .trim()
        .required('Role name is required')
        .test(
            'no-illegal-characters',
            "Name can have only letters (a-z, A-Z), numbers (0-9), and some symbols (&, +, !, (, ), *, :, ', .)",
            (value) => {
                if (!value) return true;
                return value.match(ALLOWED_SYMBOLS_REGEX) !== null;
            }
        ),
    roleDescription: string()
        .trim()
        .max(250, 'Role description cannot exceed 250 characters'),
    setAsDefaultRole: boolean().optional(),
});
