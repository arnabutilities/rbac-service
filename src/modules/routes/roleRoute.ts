/**
 * Gets all roles from the database.
 *
 * 1. Authenticates the request using a middleware.
 * 2. Authorizes the request using a middleware.
 * 3. Gets all roles from the RoleEntity and returns them.
 */

import { RoleEntity } from "../base/entity/Role";
import Logger from "../logger/Logger";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import { RequestData, ResponseData, RouteDetails, roleRouteUris } from "./const";

class RoleRoute extends BaseRoute implements RouteFunctionality {
  private static _singleton: RoleRoute;
  private constructor() {
    super("roles");
  }
  public static instance(routeUris?: Map<string, RouteDetails>){
    if(!RoleRoute._singleton){
      RoleRoute._singleton = new RoleRoute();
    }
    if(routeUris){
      RoleRoute._singleton.setRouteDetails(routeUris);
    }
    return RoleRoute._singleton;
  }
  public applyRoutePaths() {
    this.setGetAPI("GET_All_ROLES", async (data:RequestData) => {
      const roles = await RoleEntity.getAllRoles();
      const resp:ResponseData = {
        error:null,
        data:roles,
        success:true
      };
      return resp;
    });
  }
}


export default RoleRoute;
