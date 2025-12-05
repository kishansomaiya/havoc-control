import { User } from "../api/openapi/auto-generated-admin";

export interface IUser extends User {
    /**
     * Indicates whether the user is selected
     * @type {boolean}
     * @memberof IUser
     */
    selected?: boolean;
    disabled?: boolean;
}
