export type EntityType = "User" | "Service" | "Application" | "AppData";
export type SocialNetworkActivity = "Low" | "Medium" | "High";
export type AvailableDBService = "Mongo" | "Postgres";
export type Collections = "logger" | "registeredUsers";

export interface BarerData{
    username: string;
    hash: string;
    loginTime?: string;
}
export interface DBClient{
    insertRecord(data:DBClientRecord):Promise<string | string[]>;
    findRecords(data:DBClientRecord):Promise<DBClientRecord | DBClientRecord[]>;
}
export interface DBRecord {
    __id?:string;
    [field:string]: string | number | boolean | object | string[] | number[] | object[] | unknown;
}
export interface DBClientRecord{
    dataSource: Collections;
    record: DBRecord | DBRecord [];
}
export interface Entity{
   
}
export interface Location{
    timestamp: string;
    lat:string;
    long:string;
}
export interface SocialId{
    id:string;
    url:string;
    activity: SocialNetworkActivity;
}
export interface User extends Entity{
    username: string;
    currentLocation?:Location;
}
export interface UserDataMin extends DBRecord {
    username:string;
    passwordHash:string;
    address: string[];
    contactNo: string[];
    emails: string[];
    socialIds: SocialId[];
}

export interface AppData extends Entity{
    entityType: "AppData";
    application: string;
    user: string;
}