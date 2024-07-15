export enum UserRoles {

    COMPANY_ADMIN= 3,
    COMPANY_EMPLOYEE = 4,
    INSTITUTION_ADMI = 5,
    INSTITUTION_EMPLOYE = 6,
    AUDITOR= 7,
}

export const UserRoleNames = {
    [UserRoles.INSTITUTION_ADMI]: 'Institution admin',
    [UserRoles.INSTITUTION_EMPLOYE]: 'Institution employee',
    [UserRoles.COMPANY_ADMIN]: 'Company Admin',
    [UserRoles.COMPANY_EMPLOYEE]: 'Company Employee',
    [UserRoles.AUDITOR]: 'Auditor',

};
