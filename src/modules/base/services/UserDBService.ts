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
        return Array.isArray(result) && result?.length > 0;
    }
    public static async createNewUser(userDetails:UserDataMin):Promise<string| undefined>{
        return await DBService.createRecord({
            dataSource: "registeredUsers",
            record: userDetails
        });

    }
}