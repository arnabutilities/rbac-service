export type EntityType = "User" | "Service" | "Application" | "AppData";
export type SocialNetworkActivity = "Low" | "Medium" | "High";
export type AvailableDBService = "Mongo" | "Postgres";
export interface DBClient{
    insertRecord(data:DBClientRecord):Promise<string | string[]>;
    findRecords(data:DBClientRecord):void;
}
export interface DBClientRecord{
    
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
export interface UserDataMin {
    username:string;
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