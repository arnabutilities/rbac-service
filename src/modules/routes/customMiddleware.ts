/**
 * Middleware functions for handling authentication and authorization in Express routes.
 *
 * authenticationMiddleware verifies a JWT bearer token and returns true if valid, false if invalid.
 *
 * authorizationMiddleware checks if the user has a role that is allowed to access the requested route. Returns true if authorized, false otherwise.
 */
import { Request, Response } from "express";
import Logger from "../logger/Logger";
import { AuthenticationService } from "../base/services/Authentication";
import { BearerData } from "../base/const";
import { UserEntity } from "../base/entity/User";
import { RouteEntity } from "../base/entity/Route";

export class CustomMiddleware {
  private bearer: string = "";
  private routeUri = new Map<string, RouteEntity>();
  public async setRouteProps(routeUri: string) {
    this.routeUri.set(routeUri, new RouteEntity(routeUri));
  }
  public async authenticationMiddleware(
    req: Request,
    res: Response
  ): Promise<boolean | undefined> {
    try {
      this.bearer = req.header("Authorization")?.replace("Bearer ", "") || "";
      if (!this.bearer) {
        throw new Error("bearer not valid");
      }
      const verified = await AuthenticationService.verifyBearer(this.bearer);
      if (!verified) {
        throw new Error("user not valid: not verified");
      }
      return true;
    } catch (e) {
      Logger.Debug({ message: "Bearer failure", loggingItem: { e } });
      return false;
    }
  }
  async authorizationMiddleware(
    req: Request,
    res: Response
  ): Promise<boolean | undefined> {
    const { username } = (await AuthenticationService.retrieveBearerData(
      this.bearer
    )) as BearerData;
    const user = new UserEntity(username);
    const route = this.routeUri.get("/role/getAll");
    const userRoles = (await user.getRoles())
      ?.filter((role) => role?.roleId != null)
      .map((role) => role?.roleId);
    const routeRoles = (await route?.getRoles())
      ?.filter((role) => role?.roleId != null)
      .map((role) => role?.roleId);
    Logger.Debug({
      message: "authorizationMiddleware",
      loggingItem: JSON.stringify(req.url),
    });
    if (routeRoles?.length == 0) {
      return true;
    }
    if (
      userRoles != null &&
      routeRoles != null &&
      userRoles?.some((userRole) => routeRoles.indexOf(userRole) > -1)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
