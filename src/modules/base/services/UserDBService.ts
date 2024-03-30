import Logger from "../../logger/Logger";
import { UserDataMin } from "../const";
import { DBService } from "./DBService";

export class UserDBService {

    public static async checkIfUserExistByName(name:string):Promise<boolean> {
        const result = await DBService.findRecord({
            dataSource: "registeredUsers",
            record: {
                username: name
            }
        });
        Logger.Debug({message: "Fetching user details",loggingItem: {
            location: "UserDBService::checkIfUserExistByName",
            data: result
        }});
        if(Array.isArray(result) && result.length > 0 ){
            return true;
        }
        if(typeof result != null && Array.isArray(result) === false){
            if( Array.isArray(result?.record)){
                return result.record.length > 0;
            }
            if(result?.record != null){
                return true;
            }
        }
        return false;
    }
    public static async createNewUser(userDetails:UserDataMin):Promise<string| undefined>{
        return await DBService.createRecord({
            dataSource: "registeredUsers",
            record: userDetails
        });

    }
    public static async getUserDetailsByUsername(username:string):Promise<UserDataMin|undefined>{
        const result = await DBService.findRecord({
            dataSource: "registeredUsers",
            record: {
                username: username
            }
        });
        if(typeof result != null && Array.isArray(result) === false){
            if( Array.isArray(result?.record)){
                return result.record[0] as UserDataMin;
            }
        }
        return undefined;
    }
}