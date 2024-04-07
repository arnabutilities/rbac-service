import { UserDataMin } from "../base/const";
import { UserEntity } from "../base/entity/User";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { RequestData, ResponseData, RouteDetails } from "./const";

class OtherRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: OtherRoute;
  private constructor() {
    super("others");
  }
  public static instance(routeUris?: Map<string, RouteDetails>){
    if(!OtherRoute._singleton){
      OtherRoute._singleton = new OtherRoute();
    }
    if(routeUris){
      OtherRoute._singleton.setRouteDetails(routeUris);
    }
    return OtherRoute._singleton;
  }
  public applyRoutePaths() {
    this.setPostAPI("GET_SOCIAL_DATA", async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getUserDetails() as UserDataMin;
      const userSocialData = record?.socialIds;
      const resp:ResponseData = {
        error:null,
        data:userSocialData,
        success:true
      };
      return resp;
    });
    
  }
}


export default OtherRoute;