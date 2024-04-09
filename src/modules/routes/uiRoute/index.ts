import { Request, Response, Router } from 'express';
import BaseRoute, { RouteFunctionality } from '../BaseRoute';
import { RequestData, ResponseData, RouteDetails } from '../const';
import Logger from '../../logger/Logger';

class WebUserInterfaceRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: WebUserInterfaceRoute;
  private constructor(routeUris:Map<string, RouteDetails>) {
    super("webui", routeUris);
  }
  public static instance(routeUris: Map<string, RouteDetails>){
    if(!WebUserInterfaceRoute._singleton){
      WebUserInterfaceRoute._singleton = new WebUserInterfaceRoute(routeUris);
    }
    return WebUserInterfaceRoute._singleton;
  }
  public applyRoutePaths() {
    Logger.Debug({message: "WebUserInterfaceRoute::applyRoutePaths"})
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