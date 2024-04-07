import { UserDataMin } from "../base/const";
import { UserEntity } from "../base/entity/User";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { RequestData, ResponseData, RouteDetails, allRoutes, apiRouteUris, roleRouteUris, userRouteUris } from "./const";

class OtherRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: OtherRoute;
  private constructor() {
    super("apis");
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
    this.setPostAPI(this.getRouteDetails().get("GET_SOCIAL_DATA")?.url as string, async (data:RequestData) => {
      const user = new UserEntity(data.username);
      const record = await user.getUserDetails() as UserDataMin;
      const userSocialData = record?.socialIds;
      const resp:ResponseData = {
        error:null,
        data:userSocialData,
        success:true
      };
      return resp;
    },{escapeAllMiddlewares: this.getRouteDetails().get("GET_SOCIAL_DATA")?.escapeAllMiddlewares || false});
    
  }
}


export default OtherRoute;