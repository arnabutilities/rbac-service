// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Logger from "./modules/logger/Logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  Logger.Info({message: `[server]: Server is running at http://localhost:${port}`});
});