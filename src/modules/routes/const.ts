import { Request } from "express";
import { Role } from "../base/const";
import { ERRORS } from "../base/error/ErrorConst";
import apiRoute from "./apiRoute";
import roleRoute from "./roleRoute";
import userRoute from "./userRoute";
import ApiRoute from "./apiRoute";
import RoleRoute from "./roleRoute";
import UserRoute from "./userRoute";
import BaseRoute from "./BaseRoute";
import WebUserInterfaceRoute from "./uiRoute";
import OtherRoute from "./otherRoute";

export interface ResponseJSON{
    error:ResponseError | null;
    data: any;
}
export interface ResponseError{
    message:string;
    errorType:ERRORS;
}
export interface RouteUri{
    uri:string;
    roleNames:string[];
}
export interface RouteDetails{
    method: string;
    url: string;
    escapeAllMiddlewares?: boolean;
    summary?: string;
    description?: string;
    templateFileName?: string;
  }
  export interface RequestData {
    username: string;
    params: Request["params"];
    body: Request["body"];
    query: Request["query"];
    headers: Request["headers"];
    [key:string]: string | number | object | undefined;
  }
  export interface ResponseData {
    error: ResponseError | null;
    data: object | undefined;
    success: boolean;
  }
  
  export interface AdditionalRequestOptions{
    escapeAllMiddlewares?: boolean;
    templateFileName?: string;
  }

export enum RESPONSE_ERROR{
    USER_NOT_AUTHORIZED
}

export const roleRouteUris: Map<string,RouteDetails> = new Map(
    [
    ["GET_All_ROLES", {
      method: "GET",
      url: "/getAll",
      escapeAllMiddlewares: true
    }]
  ]
);

export const userInterfaceRouteUris: Map<string,RouteDetails> = new Map(
    [
    ["LOGIN_UI", {
      method: "GET",
      url: "/login",
      escapeAllMiddlewares: true,
      templateFileName: 'login.handlebars'
    }]
  ]
);

export const apiRouteUris: Map<string,RouteDetails> = new Map(
  [
  ["GET_All_APIS", {
    method: "GET",
    url: "/getAll",
    escapeAllMiddlewares: true
  }]
]
);

export const userRouteUris: Map<string,RouteDetails> = new Map(
    [
    ["GET_All_ROLES", {
      method: "GET",
      url: "/getRoles"
    }],
    ["GET_USER_DETAILS", {
        method: "GET",
        url: "/getUserDetails"
      }],
      ["SET_USER_LOGIN", {
        method: "POST",
        url: "/login",
        escapeAllMiddlewares: true
      }],
      ["REGISTER_USER_DETAILS", {
        method: "POST",
        url: "/registerNewUser",
        escapeAllMiddlewares: true
      }],
  ]
);
export const otherRouteUris: Map<string,RouteDetails> = new Map(
  [
  ["GET_SOCIAL_DATA", {
    method: "POST",
    url: "/getSocialData"
  }]
]
);

export const allRoutes:BaseRoute[] = [
    WebUserInterfaceRoute.instance(userInterfaceRouteUris),
    ApiRoute.instance(apiRouteUris),
    RoleRoute.instance(roleRouteUris),
    UserRoute.instance(userRouteUris),
    OtherRoute.instance(otherRouteUris)
];