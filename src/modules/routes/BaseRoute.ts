import { NextFunction, Request, Response, Router } from "express";
import { AuthenticationService } from "../base/services/Authentication";
import Logger from "../logger/Logger";
import { BearerData } from "../base/const";
import { UserEntity } from "../base/entity/User";
import { RouteEntity } from "../base/entity/Route";
import { ERRORS } from "../base/error/ErrorConst";
import {
  AuthorizationOption,
    ROUTER_AUTHORIZATIONS,
    RequestData,
    ResponseData,
    ResponseError,
    RouteDetails,
} from "./const";
import { randomUUID } from "crypto";
import { RouteConfigurationManager } from "./RouteConfigurationManager";
import { testRouter } from "./RouteConfiguration";

export interface RouteFunctionality {
    applyRoutePaths(): void;
}
export default abstract class BaseRoute {
    private router: Router;
    private registeredRoutes: Map<string, RouteDetails> = new Map();
    private routeConfigurationManager:RouteConfigurationManager;

    constructor(basePath: string, routeUris:Map<string, RouteDetails>) {
        this.router = Router();
        this.routeConfigurationManager = new RouteConfigurationManager(routeUris,basePath);
    }

    private async authenticationMiddleware(bearer: string): Promise<boolean | undefined> {
        try {
            const verified = await AuthenticationService.verifyBearer(bearer);
            if (!verified) {
                throw new Error("user not valid: not verified");
            }
            return true;
        } catch (e) {
            Logger.Debug({ message: "Bearer failure", loggingItem: { e } });
            throw new Error("BaseRoute::authenticationMiddleware");
        }
    }
    private async getUserRouteAuthorizations(bearer: string, routeKey: string): Promise<AuthorizationOption | undefined> {
      const { username } = (await AuthenticationService.retrieveBearerData(bearer)) as BearerData;
      const user = new UserEntity(username);
      const routeAuthorization = await user.getRouteAuthorizations(routeKey);
      return this.routeConfigurationManager.getAuthorizationOption(routeKey, routeAuthorization);
  }
    public setGetAPI(key: string, ApiFunctionality: (reqData: RequestData) => Promise<ResponseData>) {
        const path = this.routeConfigurationManager.getRouteUrl(key);
        const options = { escapeAllMiddlewares: this.routeConfigurationManager.shouldEscapeMiddleware(key) };
        this.router.get(
            path,
            async (req: Request, res: Response, next: NextFunction) => {
                if (options?.escapeAllMiddlewares) {
                    next();
                } else {
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    if (!(await this.authenticationMiddleware(bearer))) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_REGISTERED,
                            message: "Please login to get the access",
                        };
                        return res.status(401).json(err);
                    }
                    next();
                }
            },
            async (req: Request, res: Response) => {
                if (options?.escapeAllMiddlewares) {
                    const username = "anonymous";
                    const resp = await ApiFunctionality({
                        username,
                        params: req.params,
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                    });
                    return res.status(200).json(resp);
                } else {
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    const electedAuthorization = await this.getUserRouteAuthorizations(bearer, path);
                    if (electedAuthorization == null) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
                            message: "user don't have permission to access this api",
                        };
                        return res.status(401).json(err);
                    }
                    const { username } =
                        bearer != null
                            ? ((await AuthenticationService.retrieveBearerData(bearer)) as BearerData)
                            : { username: "anonymous" };
                    const resp = await ApiFunctionality({
                        username,
                        params: req.params,
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        authorization: electedAuthorization
                    });
                    res.status(200).json(resp);
                }
            }
        );
        this.registeredRoutes.set(path, { method: "GET", url: path });
    }
    public setGetRender(key: string, ApiFunctionality: (reqData: RequestData) => Promise<ResponseData>) {
        const path = this.routeConfigurationManager.getRouteUrl(key);
        const options = { escapeAllMiddlewares: this.routeConfigurationManager.shouldEscapeMiddleware(key), defaultHbsTemplate: "" };
        this.router.get(
            path,
            async (req: Request, res: Response, next: NextFunction) => {
                if (options?.escapeAllMiddlewares) {
                    next();
                } else {
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    if (!(await this.authenticationMiddleware(bearer))) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_REGISTERED,
                            message: "Please login to get the access",
                        };
                        return res.status(401).json(err);
                    }
                    next();
                }
            },
            async (req: Request, res: Response) => {
                if (options?.escapeAllMiddlewares) {
                    const username = "anonymous";
                    const resp = await ApiFunctionality({
                        username,
                        params: req.params,
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                    });
                    const authOption = this.routeConfigurationManager.getAuthorizationOption(key, [
                        ROUTER_AUTHORIZATIONS.ANONYMOUS_ACCESS,
                        ROUTER_AUTHORIZATIONS.NO_ACCESS,
                        ROUTER_AUTHORIZATIONS.READ_ACCESS,
                    ]);
                    res.status(200).render(authOption?.hbsTemplate || "login.handlebars", resp);
                } else {
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    const electedAuthorization = await this.getUserRouteAuthorizations(bearer, path);
                    if (electedAuthorization == null) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
                            message: "user don't have permission to access this api",
                        };
                        return res.status(401).json(err);
                    }
                    const { username } =
                        bearer != null
                            ? ((await AuthenticationService.retrieveBearerData(bearer)) as BearerData)
                            : { username: "anonymous" };
                    const template = this.routeConfigurationManager.getTemplateFile(key, [
                      electedAuthorization.authorization
                    ]);
                    const resp = await ApiFunctionality({
                        username,
                        params: req.params,
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        authorization: electedAuthorization
                    });
                    res.status(200).render(template, resp);
                }
            }
        );
        this.registeredRoutes.set(path, { method: "GET", url: path });
    }
    public setPostAPI(key: string, ApiFunctionality: (reqData: RequestData) => Promise<ResponseData>) {
        const path = this.routeConfigurationManager.getRouteUrl(key);
        const options = { escapeAllMiddlewares: this.routeConfigurationManager.shouldEscapeMiddleware(key) };
        this.router.post(
            path,
            async (req: Request, res: Response, next: NextFunction) => {
                if (options?.escapeAllMiddlewares) {
                    next();
                } else {
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    if (!(await this.authenticationMiddleware(bearer))) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_REGISTERED,
                            message: "Please login to get the access",
                        };
                        return res.status(401).json(err);
                    }
                    next();
                }
            },
            async (req: Request, res: Response) => {
                if (options?.escapeAllMiddlewares) {
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
                    const bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
                    const electedAuthorization = await this.getUserRouteAuthorizations(bearer, path);
                    if (electedAuthorization == null) {
                        const err: ResponseError = {
                            errorType: ERRORS.USER_NOT_AUTHORIZED_TO_ACCESS,
                            message: "user don't have permission to access this api",
                        };
                        return res.status(401).json(err);
                    }
                    const { username } =
                        bearer != null
                            ? ((await AuthenticationService.retrieveBearerData(bearer)) as BearerData)
                            : { username: "anonymous" };
                    const resp = await ApiFunctionality({
                        username,
                        params: req.params,
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        authorization: electedAuthorization
                    });
                    res.status(200).json(resp);
                }
            }
        );
        this.registeredRoutes.set(path, { method: "POST", url: path });
    }
    public getRouter() {
        return this.router;
    }
    public getRoutePaths(): string[] {
      return { ...Array.from(this.registeredRoutes.keys()) };
    }
}
