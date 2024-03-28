// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Logger from "./modules/logger/Logger";
import { UserEntity } from "./modules/base/entity/User";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/createUser", async (req: Request, res: Response) => {
  const user = new UserEntity("arnabxxx@gmail.com");
  await user.createNewUser({
    username: "arnabxxxxx@gmail.com",
    address: [
      "101, Estella Ornate, 10th Main Road, Shubh Enclave",
      "Harlur Road, xxxx"
    ],
    contactNo: ["+9xxxxxxxxxxx"],
    emails: ["arnabxxxx@gmail.com","arnablanc@gmail.com"],
    socialIds: [
      {
        "id":"arnabxxxx@gmail.com",
        "url":"https://www.linkedin.com",
        "activity":"High"
      }
    ]
  })
  res.send(`User present:${await user.validateUsername()}`);
});

app.listen(port, () => {
  Logger.Info({message: `[server]: Server is running at http://localhost:${port}`});
});