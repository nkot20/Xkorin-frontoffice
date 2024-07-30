export enum UserRoles {

    COMPANY_ADMIN= 3,
    COMPANY_EMPLOYEE = 4,
    INSTITUTION_ADMIN = 5,
    INSTITUTION_EMPLOYEE = 6,
    AUDITOR= 7,
}

export const UserRoleNames = {
    [UserRoles.INSTITUTION_ADMIN]: 'Institution admin',
    [UserRoles.INSTITUTION_EMPLOYEE]: 'Institution employee',
    [UserRoles.COMPANY_ADMIN]: 'Company Admin',
    [UserRoles.COMPANY_EMPLOYEE]: 'Company Employee',
    [UserRoles.AUDITOR]: 'Auditor',

};
