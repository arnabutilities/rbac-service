import moment from "moment";
import { DBClientRecord, DBRecord, DBRecordInsertionStatus, Role } from "../const";
import { RolesDBService } from "../services/RolesDBService";
import Entity from "./Entity";
import { UserEntity } from "./User";
import Logger from "../../logger/Logger";

export class RoleEntity extends Entity{
    private __roleName = "";
    constructor(roleId:string){
        super(roleId, "Role");
        this.__roleName = roleId;
    }
    async getRoleDetails(roleName:string):Promise<DBRecord|undefined>{
        const result = await RolesDBService.getRoleDetails({
            roleName:roleName
        } as Role);
        if (Array.isArray(result?.record)){
            return result?.record[0];
        }
        if (result?.record){
            return result?.record;
        }
    }
    public static async getAllRoles():Promise<DBRecord  | DBRecord[]| undefined>{
        const roleData = await RolesDBService.getRoleDetails({});
        return roleData?.record;
    }
    public static async createRole(role:Role):Promise<DBRecordInsertionStatus  | DBRecordInsertionStatus[]| undefined>{
        const roleData = await RolesDBService.createRoleDetails(role);
        return roleData;
    }
}