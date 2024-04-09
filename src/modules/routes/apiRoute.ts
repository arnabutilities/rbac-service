import Logger from "../logger/Logger";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { apiRouteUris, roleRouteUris, userRouteUris } from "./RouteConfiguration";
import { RequestData, ResponseData, RouteDetails} from "./const";
import UserRoute from "./userRoute";

class ApiRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: ApiRoute;
  private constructor(routeUris: Map<string, RouteDetails>) {
    super("apis",routeUris);
  }
  public static instance(routeUris: Map<string, RouteDetails>){
    if(!ApiRoute._singleton){
      ApiRoute._singleton = new ApiRoute(routeUris);
    }
    return ApiRoute._singleton;
  }
  public applyRoutePaths() {
    Logger.Debug({message: "ApiRoute::applyRoutePaths"});
    this.setGetAPI("GET_All_APIS", async (data:RequestData) => {
      const routeData:RouteDetails[] = [];
      Array.from(userRouteUris.values()).forEach(route => {
        routeData.push(route);
      });
      Array.from(roleRouteUris.values()).forEach(route => {
        routeData.push(route);
      });
      Array.from(apiRouteUris.values()).forEach(route => {
        routeData.push(route);
      });
      
      const resp:ResponseData = {
        error:null,
        data:routeData,
        success:true
      };
      return resp;
    });
    
  }
}


export default ApiRoute;