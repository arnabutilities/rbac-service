import { UserDataMin } from "../base/const";
import { UserEntity } from "../base/entity/User";
import { AuthenticationService } from "../base/services/Authentication";
import Logger from "../logger/Logger";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { RequestData, ResponseData, RouteDetails } from "./const";

interface LoginData{
  username:string;
  password:string;
}
interface RegistrationData{
  username:string;
  password:string;
  address: UserDataMin["address"];
  contactNumber: UserDataMin["contactNumber"];
  email: UserDataMin["email"];
  socialIds: UserDataMin["socialIds"];
}

class UserRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: UserRoute;
  private constructor(routeUris: Map<string, RouteDetails>) {
    super("users", routeUris);
  }
  public static instance(routeUris: Map<string, RouteDetails>){
    if(!UserRoute._singleton){
      UserRoute._singleton = new UserRoute(routeUris);
    }
    return UserRoute._singleton;
  }
  public applyRoutePaths() {
    Logger.Debug({message: "UserRoute::applyRoutePaths"});
    this.setGetAPI("GET_All_ROLES",  async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getRoles();
      const resp:ResponseData = {
        error:null,
        data: record,
        success:true
      };
      return resp;
    });

    this.setGetAPI("GET_USER_DETAILS", async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getUserDetails();
      const resp:ResponseData = {
        error:null,
        data: record,
        success:true
      };
      return resp;
    });

    this.setPostAPI("SET_USER_LOGIN", async (data:RequestData) => {
      const postData = data.body as LoginData;
      const user = new UserEntity(postData.username);
      const barer = await user.login(postData.password);
      const resp:ResponseData = {
        error:null,
        data: {barer:barer,data},
        success:true
      };
      return resp;
    });
    
    this.setPostAPI("REGISTER_USER_DETAILS", async (data:RequestData) => {
      const postData = JSON.parse(data.body) as RegistrationData;
      const newUserData = {
                            username:postData.username,
                            address:postData.address,
                            contactNo:postData.contactNumber,
                            socialIds:postData.socialIds,
                            emails:postData.email,
                            passwordHash: (await AuthenticationService.createPasswordHash(postData.password)).toString()} as UserDataMin;
      const result = await UserEntity.createNewUser(newUserData);
      const resp:ResponseData = {
        error:null,
        data: {result},
        success:true
      };
      return resp;
    });
  }
}


export default UserRoute;