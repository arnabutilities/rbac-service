/**
 * Configures the routes for the Express app.
 *
 * Imports route handlers from other files and attaches them to the router.
 * Exports the configured router.
 */
import {Router} from "express";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import Logger from "../logger/Logger";

export class RouteManager{
  private static routes = Router();
  public static Initialize(allRoutes:BaseRoute[]){
    allRoutes.forEach( (oneRoute) => {
      (oneRoute as BaseRoute & RouteFunctionality).applyRoutePaths();
      RouteManager.routes.use(oneRoute.getRouter());
      Logger.Debug({"message":"checking each route",loggingItem:{router: oneRoute.getRoutePaths()}});
    });
  }
  public static getRoute():Router{
    return RouteManager.routes;
  }
}

export const routes = RouteManager;

