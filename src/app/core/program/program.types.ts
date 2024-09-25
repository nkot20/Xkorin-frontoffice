export interface Program {
    _id: string;
    institutionId?: string;
    name?: string;
    targetInstitutionId?: string;
    targetName?: string;
    archived?: boolean;
    code?: string;
    targetInstitution?: targetInstitution;
    numberOfParticipants?: number;
    amount?: number
}

export interface  targetInstitution {
    _id?: string;
    name?: string;
}
