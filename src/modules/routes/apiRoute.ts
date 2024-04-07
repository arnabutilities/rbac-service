import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { RequestData, ResponseData, RouteDetails, allRoutes, apiRouteUris, roleRouteUris, userRouteUris } from "./const";
import UserRoute from "./userRoute";

class ApiRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: ApiRoute;
  private constructor() {
    super("apis");
  }
  public static instance(routeUris?: Map<string, RouteDetails>){
    if(!ApiRoute._singleton){
      ApiRoute._singleton = new ApiRoute();
    }
    if(routeUris){
      ApiRoute._singleton.setRouteDetails(routeUris);
    }
    return ApiRoute._singleton;
  }
  public applyRoutePaths() {
    this.setGetAPI(this.getRouteDetails().get("GET_All_APIS")?.url as string, async (data:RequestData) => {
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
    },{escapeAllMiddlewares: this.getRouteDetails().get("GET_All_APIS")?.escapeAllMiddlewares || false});
    
  }
}


export default ApiRoute;