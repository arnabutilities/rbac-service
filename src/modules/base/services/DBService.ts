import Mongo from "../../mongodb/Mongo";
import { AvailableDBService, DBClient, DBClientRecord, DBRecord, DBRecordInsertionStatus } from "../const";
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
    public async create(record:DBClientRecord):Promise<DBRecordInsertionStatus|DBRecordInsertionStatus[]|undefined>{
        return await this.__dbInstance.insertRecord(record);
    }
    public async find(record:DBClientRecord):Promise<DBClientRecord>{
        return await this.__dbInstance.findRecords(record);
    }
    private static async instance(service:AvailableDBService): Promise<DBService|undefined>{
        if(DBService.service.get(service) == null){
            DBService.service.set(service, new DBService(service));
        }
        return DBService.service.get(service);
    }
    public static async createRecord(record:DBClientRecord):Promise<DBRecordInsertionStatus|DBRecordInsertionStatus[]|undefined>{
        const defaultDBService:AvailableDBService = process.env.DEFAULT_DB_SERVICE as AvailableDBService || "Mongo";
        const dbInstance = await DBService.instance(defaultDBService);
        if(dbInstance != null){
            return await dbInstance.create(record);
        }
        return;
    }

    public static async findRecord(record:DBClientRecord):Promise<DBClientRecord |undefined>{
        const defaultDBService:AvailableDBService = process.env.DEFAULT_DB_SERVICE as AvailableDBService || "Mongo";
        const dbInstance = await DBService.instance(defaultDBService);
        if(dbInstance != null){
           return await dbInstance.find(record);
        }
        return;
    }

    public static async updateRecord(record:DBClientRecord, updateValue:DBRecord):Promise<DBClientRecord |undefined>{
        const defaultDBService:AvailableDBService = process.env.DEFAULT_DB_SERVICE as AvailableDBService || "Mongo";
        const dbInstance = await DBService.instance(defaultDBService);
        if(dbInstance != null){
           const foundResult = await dbInstance.find(record);
           if(Array.isArray(foundResult.record)) {
            const updatedMap = foundResult.record.map(e => ({...e, ...updateValue}));
            foundResult.record = updatedMap;
           } else {
            const updatedMap = {...foundResult.record, ...updateValue};
            foundResult.record = updatedMap;
           }
           await dbInstance.create(foundResult)
        }
        return;
    }

}