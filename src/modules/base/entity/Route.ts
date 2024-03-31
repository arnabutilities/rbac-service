import { RouteUri } from "../../routes/const";
import { DBClientRecord, DBRecord, DBRecordInsertionStatus, Role, RouteRole } from "../const";
import { RolesDBService } from "../services/RolesDBService";
import Entity from "./Entity";
import { UserEntity } from "./User";

export class RouteEntity extends Entity{
    private __uri = "";
    constructor(routeUri:string){
        super(routeUri, "Route");
    }

    public static async assignRole(role:RouteRole):Promise<DBRecordInsertionStatus  | DBRecordInsertionStatus[]| undefined>{
        const roleData = await RolesDBService.createRouteRole(role);
        return roleData;
    }
}