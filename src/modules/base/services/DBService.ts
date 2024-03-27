import Mongo from "../../mongodb/Mongo";
import { AvailableDBService, DBClient, DBClientRecord } from "../const";
import dotenv from "dotenv";
import { ERRORS } from "../error/ErrorConst";

export class DBService{
    private __dbInstance:DBClient;
    private static service = new Map<AvailableDBService,DBService>();
    private constructor(service:AvailableDBService){
        dotenv.config();
        switch(service){
            default:
                this.__dbInstance = Mongo;
                break;
            case "Mongo":
                this.__dbInstance = Mongo;
                break;
        }
    }
    public async create(record:DBClientRecord):Promise<string|string[]>{
        return await this.__dbInstance.insertRecord(record);
    }
    public async find(record:DBClientRecord):Promise<string|string[]>{
        return await this.__dbInstance.find(record);
    }
    private static async instance(service:AvailableDBService): Promise<DBService|undefined>{
        if(DBService.service.get(service) == null){
            DBService.service.set(service, new DBService(service));
        }
        return DBService.service.get(service);
    }
    public static async createRecord(record:DBClientRecord):Promise<string|undefined>{
        const defaultDBService:AvailableDBService = process.env.DEFAULT_DB_SERVICE as AvailableDBService || "Mongo";
        const dbInstance = await DBService.instance(defaultDBService);
        if(dbInstance != null){
            dbInstance.create(record);
        }
        return;
    }
    public static async findRecordById(recordId:string):Promise<string|undefined>{
        const defaultDBService:AvailableDBService = process.env.DEFAULT_DB_SERVICE as AvailableDBService || "Mongo";
        const dbInstance = await DBService.instance(defaultDBService);
        if(dbInstance != null){
            dbInstance.find({__id:recordId});
        }
        return;
    }

}