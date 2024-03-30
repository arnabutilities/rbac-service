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
            return AuthenticationService.createBarer({username:userDetails.username, hash: passwordHash});
        }
     }

     async validateLogin(token:string):Promise<boolean>{
        const username = this._username;
        const passwordHash = await this.getPasswordHash();
        return await AuthenticationService.validateBarer({username, hash: passwordHash}, token);
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