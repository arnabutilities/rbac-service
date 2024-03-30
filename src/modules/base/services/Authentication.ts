import { BarerData, Entity } from "../const";
import * as bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { ERRORS } from "../error/ErrorConst";
import Logger from "../../logger/Logger";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import moment from "moment";

export class AuthenticationService {
    public static async createBarer(barerData:BarerData):Promise<string> {
      dotenv.config();
      const barerLife = process.env.BARER_LIFE;
      barerData.loginTime = moment().format();
      const token = sign (barerData, process.env.SECRET_KEY as string, {expiresIn:barerLife});
      Logger.Debug({
        message:"barer token created successfully",
        loggingItem:{
          token
        }
      })
      return token;
    }
    public static async validateBarer(barerData:BarerData, barer:string):Promise<boolean>{
      dotenv.config();
      try{
        const {username, hash} = verify(barer, process.env.SECRET_KEY as string ) as JwtPayload;
        if(barerData.username === username && barerData.hash === hash){
          return true;
        }
        return false;
      } catch(e){
        return false;
      }
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
}