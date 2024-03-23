import { Collection, Db, MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv";
import Logger from "../logger/Logger";
import { Collections } from "./const";

export default class Mongo{
    private static __self:Mongo;
    private __client: MongoClient;
    private static Instance():Mongo{
        if(Mongo.__self == null){
            Mongo.__self = new Mongo();
        }
        return Mongo.__self;
    }
    public static insert(data: MongoRecord){
        try{
             Mongo.Instance().insert(data)
        } catch(error){
            throw new Error("data insertion failed");
        }
    }
    private constructor(){
        dotenv.config();
        const connectionString = process.env.DB_CONN_STRING || "";
        this.__client = new MongoClient(connectionString);
    }
    private async insert(data: MongoRecord){
        dotenv.config();
        const connection = await this.__client.connect();
        const db: Db = this.__client.db(process.env.DB_NAME);
        const collection = db.collection(data.collection);
        if (Array.isArray( data.record)){
            data.record.forEach(async one => await collection.insertOne(one));
        }
        else {
            await collection.insertOne(data.record);
        }
        await connection.close();
    }
}

export interface MongoRecord {
    collection: Collections;
    record: DBRecord | DBRecord [];
}
export interface DBRecord {
    __id?:string;
    [field:string]: string | number | boolean | object | string[] | number[] | object[] | unknown;
}