import { NextFunction, Request, Response, Router } from "express";
import { AuthenticationService } from "../base/services/Authentication";
import Logger from "../logger/Logger";
import { BearerData } from "../base/const";
import { UserEntity } from "../base/entity/User";
import { RouteEntity } from "../base/entity/Route";
import { ERRORS } from "../base/error/ErrorConst";
import { AdditionalRequestOptions, RequestData, ResponseData, ResponseError, RouteDetails } from "./const";

export interface RouteFunctionality{
  applyRoutePaths():void;
}
export default abstract class BaseRoute {
  private readonly router: Router = Router();
  private basePath: string = "/";
  private registeredRoutes: Map<string,RouteDetails> = new Map();
  private routeDetails:Map<string,RouteDetails> = new Map();

  constructor(basePath: string) {
    this.basePath += basePath;
  }

  private async authenticationMiddleware(
    bearer:string
  ): Promise<boolean | undefined> {
    try {
      const verified = await AuthenticationService.verifyBearer(bearer);
      if (!verified) {
        throw new Error("user not valid: not verified");
      }
      return true;
    } catch (e) {
      Logger.Debug({ message: "Bearer failure", loggingItem: { e } });
      return false;
    }
  }
  private async authorizationMiddleware(
    url:string,bearer:string
  ): Promise<boolean | undefined> {
    const { username } = (await AuthenticationService.retrieveBearerData(
      bearer
    )) as BearerData;
    const user = new UserEntity(username);
    const route = new RouteEntity(url);
    return await this.isApiAccessible(user, route);
  }
  private async isApiAccessible(
    user: UserEntity,
    route: RouteEntity
  ): Promise<boolean> {
    const userRoles = (await user.getRoles())
      ?.filter((role) => role?.roleId != null)
      .map((role) => role?.roleId);
    const routeRoles = (await route?.getRoles())
      ?.filter((role) => role?.roleId != null)
      .map((role) => role?.roleId);
    if (routeRoles?.length == 0) {
      // if there is no role assigned, url should be accessible to all
      return true;
    }
    if (
      userRoles != null &&
      routeRoles != null &&
      userRoles?.some((userRole) => routeRoles.indexOf(userRole) > -1)
    ) {
      return true;
    }
      return false;
  }
  setGetAPI(path: string, ApiFunctionality: (reqData:RequestData)=>Promise<ResponseData>, options?: AdditionalRequestOptions ){
    this.router.get(
      this.basePath + path,
      async (req: Request, res: Response, next: NextFunction) => {
        if (options?.escapeAllMiddlewares) {
          Logger.Debug({ message: "Escaping all middlewares" });
          next();
        } else {
          const bearer =
            req.header("Authorization")?.replace("Bearer ", "") || "";
          if (!(await this.authenticationMiddleware(bearer))) {
            const err: ResponseError = {
              errorType: ERRORS.USER_NOT_REGISTERED,
              message: "Please login to get the access",
            };
            return res.status(401).json(err);
          }
          if (
            !(await this.authorizationMiddleware(this.basePath + path, bearer))
          ) {
            const err: ResponseError = {
              errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
              message: "user don't have permission to access this api",
            };
            return res.status(401).json(err);
          }
          next();
        }
      },
      async (req: Request, res: Response) => {
        if(options?.escapeAllMiddlewares){
            const username = "anonymous";
            const resp = await ApiFunctionality({
              username,
              params: req.params,
              body: req.body,
              query: req.query,
              headers: req.headers,
            });
            res.status(200).json(resp);
        } else {
            const bearer =
            req.header("Authorization")?.replace("Bearer ", "") || null;
            const { username } =
            bearer != null
              ? ((await AuthenticationService.retrieveBearerData(
                  bearer
                )) as BearerData)
              : { username: "anonymous" };
          const resp = await ApiFunctionality({
            username,
            params: req.params,
            body: req.body,
            query: req.query,
            headers: req.headers,
          });
          res.status(200).json(resp);
        }
       
        
      }
    );
    this.registeredRoutes.set(this.basePath + path,{method:"GET", url: this.basePath + path});
  }
  setGetRender(path: string, ApiFunctionality: (reqData:RequestData)=>Promise<ResponseData>, options?: AdditionalRequestOptions ){
    this.router.get(
      this.basePath + path,
      async (req: Request, res: Response, next: NextFunction) => {
        if (options?.escapeAllMiddlewares) {
          Logger.Debug({ message: "Escaping all middlewares" });
          next();
        } else {
          const bearer =
            req.header("Authorization")?.replace("Bearer ", "") || "";
          if (!(await this.authenticationMiddleware(bearer))) {
            const err: ResponseError = {
              errorType: ERRORS.USER_NOT_REGISTERED,
              message: "Please login to get the access",
            };
            return res.status(401).json(err);
          }
          if (
            !(await this.authorizationMiddleware(this.basePath + path, bearer))
          ) {
            const err: ResponseError = {
              errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
              message: "user don't have permission to access this api",
            };
            return res.status(401).json(err);
          }
          next();
        }
      },
      async (req: Request, res: Response) => {
        Logger.Debug({message: "BaseRoute::setGetAPI -> Request received"});
        if(options?.escapeAllMiddlewares){
            const username = "anonymous";
            const resp = await ApiFunctionality({
              username,
              params: req.params,
              body: req.body,
              query: req.query,
              headers: req.headers,
            });
            res.status(200).render(options?.templateFileName || "login.handlebars", resp);
        } else {
            const bearer =
            req.header("Authorization")?.replace("Bearer ", "") || null;
            const { username } =
            bearer != null
              ? ((await AuthenticationService.retrieveBearerData(
                  bearer
                )) as BearerData)
              : { username: "anonymous" };
          const resp = await ApiFunctionality({
            username,
            params: req.params,
            body: req.body,
            query: req.query,
            headers: req.headers,
          });
          res.status(200).render(options?.templateFileName || "login.handlebars", resp);
        }
       
        
      }
    );
    this.registeredRoutes.set(this.basePath + path,{method:"GET", url: this.basePath + path});
  }
  setPostAPI(path: string, ApiFunctionality: (reqData:RequestData)=>Promise<ResponseData>, options?: AdditionalRequestOptions){
    this.router.post(this.basePath + path, async (req: Request, res: Response, next:NextFunction) => {
      if(options?.escapeAllMiddlewares){
        next();
      } else {
        const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
        if(!await this.authenticationMiddleware(bearer)){
          const err:ResponseError = {
            errorType: ERRORS.USER_NOT_REGISTERED,
            message: "Please login to get the access"
          };
          return res.status(401).json(err);
        }
        if(!await this.authorizationMiddleware(this.basePath + path, bearer)){
          const err:ResponseError = {
            errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
            message: "user don't have permission to access this api"
          };
          return res.status(401).json(err);
        }
        next();
      }
    },async (req:Request, res:Response) => {
      if(options?.escapeAllMiddlewares){
        const username = "anonymous";
        const resp = await ApiFunctionality({
          username,
          params: req.params,
          body: req.body,
          query: req.query,
          headers: req.headers,
        });
        res.status(200).json(resp);
      } else {
        const bearer = req.header("Authorization")?.replace("Bearer ", "") || null;
        const { username } = bearer != null ? (await AuthenticationService.retrieveBearerData(
          bearer
        )) as BearerData : {username: "anonymous"};
        const resp = await ApiFunctionality({username, params: req.params, body: req.body, query: req.query, headers: req.headers});
        res.status(200).json(resp);
      }
      
    });
    this.registeredRoutes.set(this.basePath + path,{method:"POST", url: this.basePath + path});;
  }
  getRouter() {
    return this.router;
  }
  getRoutePaths():string[]{
    return {...Array.from(this.registeredRoutes.keys())};
  }
  setRouteDetails(paths:Map<string,RouteDetails>){
    this.routeDetails = paths;
  }
  getRouteDetails():Map<string,RouteDetails>{
    return this.routeDetails;
  }
  getBasePath(){
    return this.basePath;
  }
}