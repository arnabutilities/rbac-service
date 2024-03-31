// src/index.js
import { Express } from "express";
import dotenv from "dotenv";
import Logger from "./modules/logger/Logger";
import { ExpressService } from "./modules/base/services/ExpressService";
import { routes } from "./modules/routes";

dotenv.config();

const app: Express = ExpressService.getApp(routes,{enableHandlebar:true});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  Logger.Info({message: `[server]: Server is running at http://localhost:${port}`});
});