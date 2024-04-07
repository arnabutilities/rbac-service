import { UserDataMin } from "../base/const";
import { UserEntity } from "../base/entity/User";
import { AuthenticationService } from "../base/services/Authentication";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import apiRoute from "./apiRoute";
import { RequestData, ResponseData, RouteDetails, userRouteUris } from "./const";

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
  private constructor() {
    super("users");
  }
  public static instance(routeUris?: Map<string, RouteDetails>){
    if(!UserRoute._singleton){
      UserRoute._singleton = new UserRoute();
    }
    if(routeUris){
      UserRoute._singleton.setRouteDetails(routeUris);
    }
    return UserRoute._singleton;
  }
  public applyRoutePaths() {
    this.setGetAPI(this.getRouteDetails().get("GET_All_APIS")?.url as string, async (data:RequestData) => {
      const routeData:string[] = [];
      
      const resp:ResponseData = {
        error:null,
        data:routeData,
        success:true
      };
      return resp;
    },{escapeAllMiddlewares: this.getRouteDetails().get("GET_All_APIS")?.escapeAllMiddlewares || false});

    this.setGetAPI(this.getRouteDetails().get("GET_All_ROLES")?.url as string,  async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getRoles();
      const resp:ResponseData = {
        error:null,
        data: record,
        success:true
      };
      return resp;
    },{escapeAllMiddlewares: this.getRouteDetails().get("GET_All_ROLES")?.escapeAllMiddlewares || false});

    this.setGetAPI(this.getRouteDetails().get("GET_USER_DETAILS")?.url as string, async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getUserDetails();
      const resp:ResponseData = {
        error:null,
        data: record,
        success:true
      };
      return resp;
    },{escapeAllMiddlewares: this.getRouteDetails().get("GET_USER_DETAILS")?.escapeAllMiddlewares || false});

    this.setPostAPI(this.getRouteDetails().get("SET_USER_LOGIN")?.url as string, async (data:RequestData) => {
      const postData = data.body as LoginData;
      const user = new UserEntity(postData.username);
      const barer = await user.login(postData.password);
      const resp:ResponseData = {
        error:null,
        data: {barer:barer,data},
        success:true
      };
      return resp;
    },{escapeAllMiddlewares: this.getRouteDetails().get("SET_USER_LOGIN")?.escapeAllMiddlewares || false});
    
    this.setPostAPI(this.getRouteDetails().get("REGISTER_USER_DETAILS")?.url as string, async (data:RequestData) => {
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
    },{escapeAllMiddlewares: this.getRouteDetails().get("REGISTER_USER_DETAILS")?.escapeAllMiddlewares || false});
  }
}


export default UserRoute;