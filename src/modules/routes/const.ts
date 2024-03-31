import { Role } from "../base/const";

export interface ResponseJSON{
    error:ResponseError | null;
    data: any;
}
export interface ResponseError{
    message:string;
    error:RESPONSE_ERROR;
}
export interface RouteUri{
    uri:string;
    roleNames:string[];
}
export enum RESPONSE_ERROR{
    USER_NOT_AUTHORIZED
}