import { NextFunction, Request, Response, Router } from 'express';
import { UserEntity } from '../base/entity/User';
import { AuthenticationService } from '../base/services/Authentication';
import { RESPONSE_ERROR, ResponseJSON } from './const';
import Logger from '../logger/Logger';
import { RoleEntity } from '../base/entity/Role';
import moment from 'moment';
import { Role } from '../base/const';

export const userRoute = Router();


userRoute.post("/user/login", async (req: Request, res: Response) => {
  const {username, password} = req.body;
  if(username == null || password == null){
    res.status(401).send("invalid input parameters");
  }
  const user = new UserEntity(username);
  const bearerToken = await user.login(password);
  res.send(bearerToken);
});

userRoute.get("/user/roles", async (req:Request, res:Response, next:NextFunction) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            throw new Error("token not valid");
        }
        Logger.Debug({message: "Bearer", loggingItem: {token}})
        const verified = await AuthenticationService.verifyBearer(token);
        if(! verified){
            throw new Error("user not valid: not verified");
        }
    } catch(e){
        Logger.Debug({message: "Bearer failure", loggingItem: {e}})
        const response:ResponseJSON = {
            error:{
                error: RESPONSE_ERROR.USER_NOT_AUTHORIZED,
                message: "user not valid"
            },
            data: null
        }
        res.status(401).json(response);
    }
    next();
}, async (req: Request, res: Response) => {
    const response:ResponseJSON = {
        error: null,
        data: {
            message: "valid user"
        }
    }
    res.status(200).json(response);
})

// app.get("/user", async (req: Request, res: Response) => {
//   const user = new UserEntity("arnab.jis.it@gmail.com");
//   const bearerToken = await user.login("123@AAditri");
//   setTimeout(async () => {
//     const isValidBearer = await user.validateLogin(bearerToken as string);
//     res.send(isValidBearer);
//   }, 2000);
// });

userRoute.get("/user/createDefaultUser", async (req: Request, res: Response) => {
  const newUser = await UserEntity.createNewUser({
    username: "arnab.jis.it@gmail.com",
    address: [
      "101, Estella Ornate, 10th Main Road, Shubh Enclave",
      "Harlur Road, xxxx"
    ],
    passwordHash: await AuthenticationService.createPasswordHash("123@AAditri"),
    contactNo: ["+9886968680"],
    emails: ["arnab.jis.it@gmail.com","arnablanc@gmail.com"],
    socialIds: [
      {
        "id":"arnab.jis.it@gmail.com",
        "url":"https://www.linkedin.com/in/arnab-chaudhuri-bangalore-frontend-ui/",
        "activity":"High"
      }
    ]
  });
  Logger.Debug({message: "new user created",loggingItem: {
    newUser
  }})
  const role = await RoleEntity.createRole({
    createdBy:"INSTALLATION",
    creationTime: new Date().getTime(),
    creatorRoleId: "INSTALLATION",
    enabled:true,
    expirationTime: new Date(moment().add(1, 'year').format('YY-MM-DD-hh-mm-ss')).getTime(),
    parentRoleId: "NONE",
    roleName: "DEFAULT_ADMIN_USER"
  });
  Logger.Debug({message: "new role created",loggingItem: {
    role
  }})
  const user = new UserEntity("arnab.jis.it@gmail.com");
  const roleAssignment = await user.assignRoleToUser("DEFAULT_ADMIN_USER", "arnab.jis.it@gmail.com");
  Logger.Debug({message: "role assigned to user",loggingItem: {
    roleAssignment
  }})
  res.status(200).json(newUser);
});
