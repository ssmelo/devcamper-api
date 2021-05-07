import { Document } from "mongoose";

interface IBootcamp extends Document{
    _id: string,
	user: string,
    name: string,
    description: string,
    website: string,
    phone: string,
    email: string,
    address: string,
    careers: [string],
    housing: boolean,
    jobAssistance: boolean,
    jobGuarantee: boolean,
    acceptGi: boolean
}

export { IBootcamp }