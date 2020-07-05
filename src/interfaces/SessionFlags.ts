/**
 * Represents outstanding session flags for the user's acocunt.
 */
export interface SessionFlags {
    /**
     * @type {boolean}
     */
    confirm_email_banner: boolean;

    /**
     * Whether or not the user has an outstanding email to confirm.
     * @type {boolean}
     */
    has_outstanding_email_confirmed: boolean;

    /**
     * Whether or not the user must complete registration.
     * @type {boolean}
     */
    must_complete_registration: boolean;

    /**
     * Whether or not the user must reset password.
     * @type {boolean}
     */
    must_reset_password: boolean;

    /**
     * @type {boolean}
     */
    show_welcome: boolean;

    /**
     * @type {boolean}
     */
    unsupported_browser_banner: boolean;
}