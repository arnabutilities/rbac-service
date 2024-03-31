export type EntityType = "User" | "Service" | "Application" | "AppData" | "Role" | "Route";
export type SocialNetworkActivity = "Low" | "Medium" | "High";
export type AvailableDBService = "Mongo" | "Postgres";
export type Collections = "logger" | "registeredUsers" | "userRoles" | "roleDetails" | "routeRoles";

export interface BearerData{
    username: string;
    hash: string;
    loginTime?: string;
}
export interface DBClient{
    insertRecord(data:DBClientRecord):Promise<DBRecordInsertionStatus | DBRecordInsertionStatus[]|undefined>;
    findRecords(data:DBClientRecord):Promise<DBClientRecord>;
}
export interface DBRecord {
    __id?:string;
    [field:string]: string | number | boolean | object | string[] | number[] | object[] | unknown;
}
export interface DBRecordInsertionStatus{
    "acknowledged":boolean;
    "insertedId":string;
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
export interface UserRole extends DBRecord {
    __id?:string;
    username:string;
    roleId: string;
    creationTime: number;
    createdBy: string;
    expirationTime: number;
    creatorRoleIds: string[];
    enabled: boolean;
}
export interface RouteRole extends DBRecord {
    __id?:string;
    routeUri:string;
    roleId: string;
    creationTime: number;
    createdBy: string;
    expirationTime: number;
    creatorRoleIds: string[];
    enabled: boolean;
}

export interface Role extends DBRecord {
    __id?:string;
    roleName:string;
    creationTime: number;
    createdBy: string;
    expirationTime: number;
    creatorRoleId: string;
    parentRoleId: string;
    enabled: boolean;
}

export interface AppData extends Entity{
    entityType: "AppData";
    application: string;
    user: string;
}