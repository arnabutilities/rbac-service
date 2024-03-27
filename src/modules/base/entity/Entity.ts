import { EntityType } from "../const";

export default abstract class Entity implements Entity{
    private id;
    private entityType:EntityType;
    constructor(id:string, entityType:EntityType){
        this.id = id;
        this.entityType = entityType;
    }
}