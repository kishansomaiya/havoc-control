import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography,
    Checkbox,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { ComponentProps, useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Policy } from './CreateRole';
import { Info } from 'react-feather';

interface FormValues {
    roleName: string;
    roleDescription: string;
    rolePermissions: Policy[];
    setAsDefaultRole: boolean;
}

interface RoleFormProps extends ComponentProps<typeof Box> {
    isEditable?: boolean;
    onFormValidationChange: (isValid: boolean) => void;
    isDefaultRole?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
    isEditable = false,
    onFormValidationChange,
    isDefaultRole = false,
}) => {
    const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        errors,
        touched,
        isValid,
    } = useFormikContext<FormValues>();

    // Initialize expanded state for accordions
    const [expanded, setExpanded] = useState<string[]>(
        values.rolePermissions.map((_, index) => `panel${index}`)
    );

    // Handle accordion expand/collapse
    const handleAccordionChange = (panel: string) => {
        setExpanded((prev) =>
            prev.includes(panel)
                ? prev.filter((p) => p !== panel)
                : [...prev, panel]
        );
    };

    // Handle permission change for a specific policy
    const handlePermissionChange = (policyIndex: number, value: string) => {
        const updatedPolicies = [...values.rolePermissions];
        updatedPolicies[policyIndex].selectedPermission = value;
        setFieldValue('rolePermissions', updatedPolicies);
    };

    // Update expanded state when rolePermissions change
    useEffect(() => {
        if (values.rolePermissions.length > 0) {
            setExpanded(
                values.rolePermissions.map((_, index) => `panel${index}`)
            );
        }
    }, [values.rolePermissions]);

    useEffect(() => {
        onFormValidationChange(isValid);
    }, [isValid, onFormValidationChange]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            my={4}
            sx={{ width: '100%' }}
        >
            {/* Role Name Input */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    gap: 2,
                    borderRadius: 2,
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '60%',
                    }}
                >
                    <Typography variant="h6">ROLE NAME</Typography>
                    <TextField
                        data-testid="role-name-input"
                        value={values.roleName}
                        name="roleName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.roleName && Boolean(errors.roleName)}
                        helperText={
                            touched.roleName && Boolean(errors.roleName)
                                ? errors.roleName
                                : ''
                        }
                        placeholder="Risk Analyst"
                        sx={{ borderRadius: 1 }}
                        disabled={!isEditable}
                    />
                </Box>

                {/* Role Description Input */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '60%',
                    }}
                >
                    <Typography variant="h6">ROLE DESCRIPTION</Typography>
                    <TextField
                        data-testid="role-description-input"
                        value={values.roleDescription}
                        name="roleDescription"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={3}
                        error={
                            touched.roleDescription &&
                            Boolean(errors.roleDescription)
                        }
                        helperText={
                            touched.roleDescription &&
                            Boolean(errors.roleDescription)
                                ? errors.roleDescription
                                : ''
                        }
                        placeholder="Can access portfolio insights and reports"
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '60%',
                    }}
                >
                    <Checkbox
                        checked={values.setAsDefaultRole}
                        onChange={handleChange}
                        name="setAsDefaultRole"
                        color="secondary"
                        disabled={isDefaultRole}
                        sx={{ p: 0 }}
                    />
                    <Typography
                        variant="body1"
                        onClick={() => {
                            if (isDefaultRole) return;
                            setFieldValue(
                                'setAsDefaultRole',
                                !values.setAsDefaultRole
                            );
                        }}
                    >
                        Set as Default Role
                    </Typography>
                    <Tooltip
                        title={
                            isDefaultRole
                                ? 'You cannot unselect a role as default. Please navigate to another role and set as "default", which will override this setting.'
                                : 'Selecting "Set as Default" will assign this role to all new users in your tenant.'
                        }
                        arrow
                        placement="right"
                    >
                        <Info size="0.9rem" />
                    </Tooltip>
                </Box>
            </Box>

            {/* Role Permissions */}
            <Box sx={{ width: '100%', mt: 2 }}>
                {values.rolePermissions.map((policy, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded.includes(`panel${index}`)}
                        onChange={() => handleAccordionChange(`panel${index}`)}
                        sx={{
                            margin: '0rem !important',
                            border: '1px solid #5B6368',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<Icon.ChevronDown />}
                            sx={{ borderBottom: '1px solid #5B6368' }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                <Typography>{policy.title}</Typography>
                                <Tooltip
                                    title={policy.rolePolicyDescription}
                                    arrow
                                    placement="bottom-start"
                                >
                                    <Info size="0.9rem" />
                                </Tooltip>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    data-testid={`role-permission-radio-group-${index}`}
                                    value={policy.selectedPermission}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                >
                                    {policy.permissions.map((permission) => (
                                        <FormControlLabel
                                            key={permission.id}
                                            value={permission.value}
                                            control={
                                                <Radio color="secondary" />
                                            }
                                            label={permission.label}
                                            data-testid={permission.label}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

export default RoleForm;
