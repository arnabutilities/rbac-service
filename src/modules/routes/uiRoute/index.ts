import { Request, Response, Router } from 'express';
import BaseRoute, { RouteFunctionality } from '../BaseRoute';
import { RequestData, ResponseData, RouteDetails } from '../const';

class WebUserInterfaceRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: WebUserInterfaceRoute;
  private constructor() {
    super("webui");
  }
  public static instance(routeUris?: Map<string, RouteDetails>){
    if(!WebUserInterfaceRoute._singleton){
      WebUserInterfaceRoute._singleton = new WebUserInterfaceRoute();
    }
    if(routeUris){
      WebUserInterfaceRoute._singleton.setRouteDetails(routeUris);
    }
    return WebUserInterfaceRoute._singleton;
  }
  public applyRoutePaths() {
    this.setGetRender("LOGIN_UI", async (data:RequestData) => {
      const resp:ResponseData = {
        error:null,
        data:[],
        success:true
      };
      return resp;
    });
  }
}


export default WebUserInterfaceRoute;