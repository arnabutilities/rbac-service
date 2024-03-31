import { DBRecord, EntityType, UserRole } from "../const";
import { RolesDBService } from "../services/RolesDBService";

export default abstract class Entity implements Entity{
    private id;
    private entityType:EntityType;
    constructor(id:string, entityType:EntityType){
        this.id = id;
        this.entityType = entityType;
    }
    async getRoles():Promise<DBRecord[] | undefined>{
        if(this.entityType === "User" ){
           return RolesDBService.getActiveUserRoles(this.id);
        }
        if(this.entityType === "Route" ){
            return RolesDBService.getActiveRouteRoles(this.id);
         }
    }
}