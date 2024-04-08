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

export interface ResponseJSON {
  error: ResponseError | null;
  data: any;
}
export interface ResponseError {
  message: string;
  errorType: ERRORS;
}
export interface RouteUri {
  uri: string;
  roleNames: string[];
}
export interface RouteDetails {
  method: string;
  url: string;
  escapeAllMiddlewares?: boolean;
  summary?: string;
  description?: string;
  defaultHbsTemplate?: string;
}
export interface RoleBasedRoutes extends RouteDetails{
  roleOptions?: RoleOptions[];
  roleSelectionStrategy?: ROLE_SELECTION_STRATEGY;

}
export interface RoleOptions {
  role:string;
  hbsTemplate?:string;
}
export interface RequestData {
  username: string;
  params: Request["params"];
  body: Request["body"];
  query: Request["query"];
  headers: Request["headers"];
  [key: string]: string | number | object | undefined;
}
export interface ResponseData {
  error: ResponseError | null;
  data: object | undefined;
  success: boolean;
}

export interface AdditionalRequestOptions {
  escapeAllMiddlewares?: boolean;
  templateFileName?: string;
}

export enum RESPONSE_ERROR {
  USER_NOT_AUTHORIZED,
}

export enum ROLE_SELECTION_STRATEGY {
  BEST_SCORED_ROLE_FOR_THE_USER,
  LEAST_SCORED_ROLE_FOR_THE_USER
}
