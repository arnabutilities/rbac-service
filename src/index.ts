// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Logger from "./modules/logger/Logger";
import Mongo from "./modules/mongodb/Mongo";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/mongo", (req: Request, res: Response) => {
  Mongo.insert({
    collection: "logger",
    record: {
      name: "Arnab",
      date: new Date().getTime().toString()
    }
  })
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  Logger.Info({message: `[server]: Server is running at http://localhost:${port}`});
});