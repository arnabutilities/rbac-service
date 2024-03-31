import moment from "moment";
import { DBRecord, DBRecordInsertionStatus, Role, RouteRole, UserRole } from "../const";
import { DBService } from "./DBService";

export class RolesDBService{
    public static async getActiveUserRoles(username:string):Promise<UserRole[]|undefined>{
        const userRoles:UserRole[] = [];
        const result = await DBService.findRecord({
            dataSource: "userRoles",
            record: {
                username: username,
                enabled: true
            }
        });
        if(typeof result != null && Array.isArray(result) === false){
            if( Array.isArray(result?.record)){
                userRoles.push(result.record[0] as UserRole);
            }
            if(result != null){
                userRoles.push(result.record as UserRole);
            }
        }
        return userRoles;
    }
    public static async getActiveRouteRoles(routeUri:string):Promise<RouteRole[]|undefined>{
        const routeRoles:RouteRole[] = [];
        const result = await DBService.findRecord({
            dataSource: "routeRoles",
            record: {
                routeUri: routeUri,
                enabled: true
            }
        });
        if(typeof result != null && Array.isArray(result) === false){
            if( Array.isArray(result?.record)){
                routeRoles.push(result.record[0] as RouteRole);
            }
            if(result != null){
                routeRoles.push(result.record as RouteRole);
            }
        }
        return routeRoles;
    }
    public static async invalidateExpiredUserRoles(){
        const result = await DBService.updateRecord({
            dataSource: "userRoles",
            record: {
                expirationTime:{$lt: new Date(moment().add(1, 'year').format('YY-MM-DD-hh-mm-ss')).getTime()},
                enabled: true
            }
        }, {
            enabled: false
        });
    }
    public static async createUserRole(userRole:UserRole){
        return await DBService.createRecord({
            dataSource: "userRoles",
            record: userRole
        });
    }
    public static async createRouteRole(routeRole:RouteRole){
        return await DBService.createRecord({
            dataSource: "routeRoles",
            record: routeRole
        });
    }
    public static async getRoleDetails(role:DBRecord){
        return await DBService.findRecord({
            dataSource: "roleDetails",
            record: role
        });
    }
    public static async createRoleDetails(role:Role):Promise<DBRecordInsertionStatus |DBRecordInsertionStatus[] | undefined>{
        return await DBService.createRecord({
            dataSource: "roleDetails",
            record: role
        });
    }
    
}