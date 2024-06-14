import {Company} from "../company/company.types";
import {Person} from "../person/person.types";

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
}
