import { BearerData, Entity } from "../const";
import * as bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { ERRORS } from "../error/ErrorConst";
import Logger from "../../logger/Logger";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import moment from "moment";
import { UserEntity } from "../entity/User";

export class AuthenticationService {
    public static async createBearer(bearerData:BearerData):Promise<string> {
      dotenv.config();
      const bearerLife = process.env.BEARER_LIFE;
      bearerData.loginTime = moment().format();
      const token = sign (bearerData, process.env.SECRET_KEY as string, {expiresIn:bearerLife});
      Logger.Debug({
        message:"bearer token created successfully",
        loggingItem:{
          token
        }
      })
      return token;
    }
    public static async retrieveBearerData(bearer:string):Promise<BearerData | undefined>{
      dotenv.config();
      const bearerData:BearerData = verify(bearer, process.env.SECRET_KEY as string ) as JwtPayload as BearerData;
      return bearerData;
    }
    public static async createPasswordHash(plainTextPassword:string): Promise<string>{
      dotenv.config();
        try {
            const salt = await bcrypt.genSalt(Number(process.env.SEED));
            return await bcrypt.hash(plainTextPassword, 10);
          } catch (error) {
            throw new Error(ERRORS.PASSWORD_HASH_CREATION_FAILED);
          }
    }
    public static async validatePassword(plainTextPassword:string, hashedPassword:string): Promise<boolean>{
      try {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
      } catch (error) {
        throw new Error(ERRORS.PASSWORD_HASH_VALIDATION_FAILED);
      }
    }
    public static async verifyBearer(bearer:string):Promise<boolean>{
      dotenv.config();
      const {username, hash} = verify(bearer, process.env.SECRET_KEY as string ) as JwtPayload;
      const user = new UserEntity(username);
      if(await user.validateUsername() && hash === await user.getPasswordHash()){
        return true;
      }
      return false;
    }
}