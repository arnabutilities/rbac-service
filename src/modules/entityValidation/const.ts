export type EntityType = "User" | "Application" | "AppEntity";
export interface Entity{
    entityType:EntityType;
    id: string;
}

export interface User extends Entity{
    entityType: "User";
    roleIds: string[]
}