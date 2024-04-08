import BaseRoute from "./BaseRoute";
import ApiRoute from "./apiRoute";
import { RoleBasedRoutes, RouteDetails } from "./const";
import OtherRoute from "./otherRoute";
import RoleRoute from "./roleRoute";
import WebUserInterfaceRoute from "./uiRoute";
import UserRoute from "./userRoute";

export const roleRouteUris: Map<string, RouteDetails> = new Map([
    [
      "GET_All_ROLES",
      {
        method: "GET",
        url: "/getAll",
        escapeAllMiddlewares: true,
      },
    ],
  ]);
  
  export const userInterfaceRouteUris: Map<string, RoleBasedRoutes> = new Map([
    [
      "LOGIN_UI",
      {
        method: "GET",
        url: "/login",
        escapeAllMiddlewares: true,
        templateFileName: "login.handlebars",
      },
    ],
  ]);
  
  export const apiRouteUris: Map<string, RouteDetails> = new Map([
    [
      "GET_All_APIS",
      {
        method: "GET",
        url: "/getAll",
        escapeAllMiddlewares: true,
      },
    ],
  ]);
  
  export const userRouteUris: Map<string, RouteDetails> = new Map([
    [
      "GET_All_ROLES",
      {
        method: "GET",
        url: "/getRoles",
      },
    ],
    [
      "GET_USER_DETAILS",
      {
        method: "GET",
        url: "/getUserDetails",
      },
    ],
    [
      "SET_USER_LOGIN",
      {
        method: "POST",
        url: "/login",
        escapeAllMiddlewares: true,
      },
    ],
    [
      "REGISTER_USER_DETAILS",
      {
        method: "POST",
        url: "/registerNewUser",
        escapeAllMiddlewares: true,
      },
    ],
  ]);
  export const otherRouteUris: Map<string, RouteDetails> = new Map([
    [
      "GET_SOCIAL_DATA",
      {
        method: "POST",
        url: "/getSocialData",
      },
    ],
  ]);
  
  export const allRoutes: BaseRoute[] = [
    WebUserInterfaceRoute.instance(userInterfaceRouteUris),
    ApiRoute.instance(apiRouteUris),
    RoleRoute.instance(roleRouteUris),
    UserRoute.instance(userRouteUris),
    OtherRoute.instance(otherRouteUris),
  ];
  