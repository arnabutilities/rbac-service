import { AuthenticationService } from "../services/Authentication";
import { User } from "../const";
import Entity from "./Entity";
import Logger from "../../logger/Logger";
import { ERRORS } from "../error/ErrorConst";
import Mongo, { DBRecord } from "../../mongodb/Mongo";
import { DBService } from "../services/DBService";

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
        try{
            if (DBService.checkUserByName(name)){
                this._username = name;
            }
        }catch(error){
            Logger.Error({message: `${name} is not registered user`, loggingItem: error as object}); // TODO: Need to introduce request uuid and stack trace
            throw new Error( ERRORS.USER_NOT_REGISTERED); // TODO: Need to introduce exception handling and stack trace
        }
     }

    public static createUser(user:User):UserEntity{
        let reviewUser:User;
        try {
            reviewUser = new UserEntity(user.username);
        } catch (e){
            if(e === ERRORS.USER_NOT_REGISTERED){
                Mongo.insert({collection: "registeredUsers", record: user as unknown as DBRecord}); // TODO: Mongo should not exposed, user record need to create separately
            }
        }
        return new UserEntity(user.username);
    }
}