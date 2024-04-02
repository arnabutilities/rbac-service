/**
 * Gets all roles from the database.
 *
 * 1. Authenticates the request using a middleware.
 * 2. Authorizes the request using a middleware.
 * 3. Gets all roles from the RoleEntity and returns them.
 */
import { NextFunction, Request, Response, Router } from "express";
import { ResponseJSON } from "./const";
import { RoleEntity } from "../base/entity/Role";
import { CustomMiddleware } from "./customMiddleware";

export const roleRoute = Router();

const middleware = new CustomMiddleware();
middleware.setRouteProps("/role/getAll");
roleRoute.get(
  "/role/getAll",
  async (req: Request, res: Response, next: NextFunction) => {
    const authenticated = await middleware.authenticationMiddleware(req, res);
    if (authenticated) {
      next();
    } else {
      res
        .status(401)
        .json({ error: { message: "authentication failure" } } as ResponseJSON);
    }
  },

  async (req: Request, res: Response, next: NextFunction) => {
    const authorized = await middleware.authorizationMiddleware(req, res);
    if (authorized) {
      next();
    } else {
      res
        .status(401)
        .json({
          error: { message: "user don't have right permission" },
          data: null,
        } as ResponseJSON);
    }
  },
  async (req: Request, res: Response) => {
    const roles = await RoleEntity.getAllRoles();
    res.status(200).json(roles);
  }
);
