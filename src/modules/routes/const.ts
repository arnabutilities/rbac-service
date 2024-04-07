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
import OtherRoute from "./apiRoute";

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
        method: "GET",
        url: "/login"
      }],
      ["REGISTER_USER_DETAILS", {
        method: "GET",
        url: "/registerNewUser",
        escapeAllMiddlewares: true
      }],
  ]
);
export const otherRouteUris: Map<string,RouteDetails> = new Map(
  [
  ["GET_SOCIAL_DATA", {
    method: "POST",
    url: "/getSocialData",
    escapeAllMiddlewares: true
  }]
]
);

export const allRoutes:BaseRoute[] = [
    ApiRoute.instance(apiRouteUris),
    RoleRoute.instance(roleRouteUris),
    UserRoute.instance(userRouteUris),
    OtherRoute.instance(otherRouteUris)
];