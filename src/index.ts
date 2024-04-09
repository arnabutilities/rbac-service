// src/index.js
import { Express } from "express";
import dotenv from "dotenv";
import Logger from "./modules/logger/Logger";
import { ExpressService } from "./modules/base/services/ExpressService";

dotenv.config();
ExpressService.getApp({enableHandlebar:true}).then((app:Express) => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    Logger.Info({message: `[server]: Server is running at http://localhost:${port}`});
  });
});