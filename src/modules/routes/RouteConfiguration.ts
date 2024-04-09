import { Request, Response, Router } from "express";
import BaseRoute from "./BaseRoute";
import ApiRoute from "./apiRoute";
import { AUTHORIZATION_SELECTION_STRATEGY, ROUTER_AUTHORIZATIONS, RouteAuthorizations, RouteDetails } from "./const";
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
        escapeAllMiddlewares: true
      },
    ],
  ]);
  
  export const userInterfaceRouteUris: Map<string, RouteAuthorizations> = new Map([
    [
      "LOGIN_UI",
      {
        method: "GET",
        url: "/login",
        escapeAllMiddlewares: true,
        defaultHbsTemplate: "login.handlebars",
        authorizationSelectionStrategy: AUTHORIZATION_SELECTION_STRATEGY.BEST_SCORE_FOR_THE_USER,
        authorizationOptions: [
          {
            authorization: ROUTER_AUTHORIZATIONS.ANONYMOUS_ACCESS,
            score: 99,
            default: true,
            hbsTemplate: "user-login-with-username-password.handlebars"
          },
          {
            authorization: ROUTER_AUTHORIZATIONS.READ_ACCESS,
            score: 9,
            hbsTemplate:"login-help.handlebars"
          },
          {
            authorization: ROUTER_AUTHORIZATIONS.NO_ACCESS,
            score: 5,
            hbsTemplate:"no-access.handlebars"
          },
        ]
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
  export const testRouter = Router();
  testRouter.get('/test', (req:Request, res:Response) => {res.status(200).json({success:"true"});})
  
  export const allRoutes: BaseRoute[] = [
    WebUserInterfaceRoute.instance(userInterfaceRouteUris),
    ApiRoute.instance(apiRouteUris),
    RoleRoute.instance(roleRouteUris),
    UserRoute.instance(userRouteUris),
    OtherRoute.instance(otherRouteUris),
  ];
  