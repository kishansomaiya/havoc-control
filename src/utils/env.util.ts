import { environment } from '../config';

export const checkCurrentEnvFlagged = (envs: string[] = []): boolean => {
    if (!environment) {
        return false;
    }
    return envs.includes(environment);
};
