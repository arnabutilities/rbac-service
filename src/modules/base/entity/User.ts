import { AuthenticationService } from "../services/Authentication";
import { DBRecord, User, UserDataMin } from "../const";
import Entity from "./Entity";
import Logger from "../../logger/Logger";
import { ERRORS } from "../error/ErrorConst";
import Mongo from "../../mongodb/Mongo";

import { UserDBService } from "../services/UserDBService";

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

    async createNewUser(userDetails:UserDataMin):Promise<boolean>{
        const userExist = await UserDBService.checkIfUserExistByName(userDetails.username);
        if(!userExist){
            await UserDBService.createNewUser(userDetails);
            return true;
        }
        return false;
    }
}