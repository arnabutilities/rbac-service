import { Entity } from "../const";
import * as bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { ERRORS } from "../error/ErrorConst";

export class AuthenticationService {
    public static async authenticate(username:string, password:string):Promise<boolean>{
        
        return false;
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