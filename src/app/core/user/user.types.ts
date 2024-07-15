import {Company} from "../company/company.types";
import {Person} from "../person/person.types";
import {Institution} from "../institution/institution.type";

export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    role?: number[];
    company?: Company;
    person?: Person;
    institution?: Institution;
    langage?: string;
    alreadyLogin?: boolean;
}
