import { Collection, Db, InsertOneResult, MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv";
import Logger from "../logger/Logger";
import { DBClient, DBClientRecord, DBRecord } from "../base/const";

export default class Mongo implements DBClient{
    private static __self:Mongo;
    private __client: MongoClient;
    private static Instance():Mongo{
        if(Mongo.__self == null){
            Mongo.__self = new Mongo();
        }
        return Mongo.__self;
    }
    public static async insertRecord(data: MongoRecord): Promise<string|string[]>{
        try{
             return Mongo.Instance().insertRecord(data);
        } catch(error){
            throw new Error("data insertion failed");
        }
    }
    public static async findRecords(data: MongoRecord): Promise<DBClientRecord |DBClientRecord []>{
        try{
             return Mongo.Instance().findRecords(data);
        } catch(error){
            throw new Error("data insertion failed");
        }
    }
    private constructor(){
        dotenv.config();
        const connectionString = process.env.DB_CONN_STRING || "";
        this.__client = new MongoClient(connectionString);
    }
    public async insertRecord(data: MongoRecord): Promise<string|string[]>{
        dotenv.config();
        const connection = await this.__client.connect();
        const db: Db = this.__client.db(process.env.DB_NAME);
        const collection = db.collection(data.dataSource);

        if (Array.isArray( data.record)){
            data.record.forEach(async one => {
                const oneRecord = await collection.insertOne(one);
            });
        }
        else {
            [await collection.insertOne(data.record)];
        }
        await connection.close();
        return [];
    }
    public async findRecords(data: MongoRecord): Promise<DBClientRecord |DBClientRecord []>{
        dotenv.config();
        const connection = await this.__client.connect();
        const db: Db = this.__client.db(process.env.DB_NAME);
        const collection = db.collection(data.dataSource);
        let results:DBRecord[] = [];

        if (Array.isArray( data.record)){
            data.record.forEach(async one => {
                const fetchedData = await collection.find(one).toArray() as DBRecord[];
                results.push( ...fetchedData);
            });
        }
        else {
            const fetchedData = await collection.find(data.record).toArray() as DBRecord[];
            results = [...fetchedData];
        }
        await connection.close();
        return {dataSource:data.dataSource, record: results};
    }
}

export interface MongoRecord extends DBClientRecord {
    
}
