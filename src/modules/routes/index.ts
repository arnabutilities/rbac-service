/**
 * Configures the routes for the Express app.
 *
 * Imports route handlers from other files and attaches them to the router.
 * Exports the configured router.
 */
import express from "express";
import { allRoutes } from "./const";
import BaseRoute, { RouteFunctionality } from "./BaseRoute";
import Logger from "../logger/Logger";



export const routes = express.Router();

allRoutes.forEach((oneRoute) => {
  (oneRoute as BaseRoute & RouteFunctionality)
  .applyRoutePaths();
  routes.use(oneRoute.getRouter());
})

