export interface Company {
    _id: string;
    name: string;
    email?: string;
    status: string;
    phoneNumber?: string;
    address?: Address;
    description?: string;
    country?: string;
    logo?:string;
    signature?: string;
}

export interface Address {
    rue: string;
    city: string;
    country: string;
}
