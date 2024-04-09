import { AuthenticationService } from "../services/Authentication";
import { DBRecord, DBRecordInsertionStatus, User, UserDataMin } from "../const";
import Entity from "./Entity";
import Logger from "../../logger/Logger";
import { ERRORS } from "../error/ErrorConst";
import Mongo from "../../mongodb/Mongo";

import { UserDBService } from "../services/UserDBService";
import { RoleEntity } from "./Role";
import moment from "moment";
import { RolesDBService } from "../services/RolesDBService";
import { ROUTER_AUTHORIZATIONS } from "../../routes/const";

export class UserEntity extends Entity implements User {
    private _username = "";
    constructor(userId:string){
        super(userId, "User");
        this.username = userId;
    }
    get username():string {
       return this._username;
    }
    set username(name:string) {
        this._username = name;
     }
    async validateUsername():Promise<boolean> {
        let valid = false;
        try{
            if (await UserDBService.checkIfUserExistByName(this._username)){
                valid = true;
            }
        }catch(error){
            Logger.Error({message: `${this._username} is not registered user`, loggingItem: error as object}); // TODO: Need to introduce request uuid and stack trace
            throw new Error( ERRORS.USER_NOT_REGISTERED); // TODO: Need to introduce exception handling and stack trace
        }
        return valid;
     }

     async getPasswordHash():Promise<string>{
        const userDetails = await UserDBService.getUserDetailsByUsername(this._username);
        if (userDetails != null ){
            return userDetails.passwordHash;
        }
        return "";
     }

     async login(passwordText:string){
        const userDetails = await UserDBService.getUserDetailsByUsername(this._username);
        let passwordHash = "";
        if (userDetails != null ){
            passwordHash = userDetails.passwordHash;
        }
        const loginSuccess = await AuthenticationService.validatePassword(passwordText, passwordHash);
        Logger.Debug({"message":"User:login", loggingItem:{
            passwordHash,
            passwordText,
            loginSuccess
        }})
        if(loginSuccess && userDetails != null){
            return AuthenticationService.createBearer({username:userDetails.username, hash: passwordHash});
        }
     }

     async validateLogin(token:string):Promise<boolean>{
        const username = this._username;
        const passwordHash = await this.getPasswordHash();
        return await AuthenticationService.verifyBearer(token);
     }

    public static async createNewUser(userDetails:UserDataMin):Promise<DBRecordInsertionStatus | DBRecordInsertionStatus[] | undefined>{
        const userExist = await UserDBService.checkIfUserExistByName(userDetails.username);
        if(!userExist){
            return await UserDBService.createNewUser(userDetails);
        }
    }
    async assignRoleToUser(role:string, roleAssignedTo:string): Promise<DBRecordInsertionStatus | DBRecordInsertionStatus[] | undefined>{
        return RolesDBService.createUserRole({
            createdBy:this.username,
            creationTime: parseInt(moment().format()),
            creatorRoleIds: (await this.getRoles())?.map(role => role?.roleId as string) || [],
            enabled:true,
            expirationTime:new Date(moment().add(1, 'year').format('YY-MM-DD-hh-mm-ss')).getTime(),
            roleId: role,
            username:roleAssignedTo
        });
    }
    async getUserDetails():Promise<DBRecord|undefined>{
        const result = await UserDBService.getUserDetailsByUsername(this.username);
        return result;
    }
    async getRouteAuthorizations(routeKey:string): Promise<ROUTER_AUTHORIZATIONS[]> {
        const result = await UserDBService.getUserAuthorizationByRole(this.username, routeKey);
        return result;
    }
}