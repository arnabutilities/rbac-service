import { Collection, Db, InsertOneResult, MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv";
import Logger from "../logger/Logger";
import { DBClient, DBClientRecord, DBRecord, DBRecordInsertionStatus } from "../base/const";

export default class Mongo implements DBClient{
    private static __self:Mongo;
    private __client: MongoClient;
    private static Instance():Mongo{
        if(Mongo.__self == null){
            Mongo.__self = new Mongo();
        }
        return Mongo.__self;
    }
    public static async insertRecord(data: MongoRecord): Promise<DBRecordInsertionStatus|DBRecordInsertionStatus[] | undefined>{
        try{
             return Mongo.Instance().insertRecord(data);
        } catch(error){
            throw new Error("data insertion failed");
        }
    }
    public static async findRecords(data: MongoRecord): Promise<DBClientRecord>{
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
    public async insertRecord(data: MongoRecord): Promise<DBRecordInsertionStatus|DBRecordInsertionStatus[]|undefined>{
        dotenv.config();
        const connection = await this.__client.connect();
        const db: Db = this.__client.db(process.env.DB_NAME);
        const collection = db.collection(data.dataSource);
        let result:DBRecordInsertionStatus | DBRecordInsertionStatus[] | undefined ;

        if (Array.isArray( data.record)){
            result = await data.record.map( (one) => {
                return collection.insertOne(one) as unknown as DBRecordInsertionStatus;
            });
            Logger.Debug({message:">>",loggingItem:{result:JSON.stringify(result)}});
        }
        else {
            result = [(await collection.insertOne(data.record)) as unknown as DBRecordInsertionStatus];
            Logger.Debug({message:">>>",loggingItem:{result:JSON.stringify(result)}});
        }
        await connection.close();
        
        return result;
    }
    public async findRecords(data: MongoRecord): Promise<DBClientRecord>{
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
