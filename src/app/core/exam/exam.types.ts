import {Institution} from "../institution/institution.type";

export interface Exam {
    _id: string,
    institutionId: Institution,
    personId: string,
    aim: string,
    amount: number,
    createdAt?: Date,
    audited: boolean,
    completed?: boolean,

}
