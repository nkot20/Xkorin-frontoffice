import {User} from "../user/user.types";

export interface Institution {
    _id: string,
    adminId?: User[],
    name: string,
    email: string,
    status: string,
    business_code: string,
    description: string,
    customization?: Customization
}

export interface Customization {
    logo: string;
    signature: string;
}
