/**
 * Logging utility
 */
export default class Logger{
    private static __self:Logger;
    private __enabledLoggingOptions: LoggingOptions[]
    private static Instance():Logger{
        if(Logger.__self == null){
            Logger.__self = new Logger();
        }
        return Logger.__self;
    }
    public static Error(log: LogMessage){
        Logger.Instance().writeMessage(log, "ERROR");
    }
    public static Warning(log: LogMessage){
        Logger.Instance().writeMessage(log, "WARNING");
    }
    public static Debug(log: LogMessage){
        Logger.Instance().writeMessage(log, "DEBUG");
    }
    public static Info(log: LogMessage){
        Logger.Instance().writeMessage(log, "INFO");
    }
    public static Performance(log: LogMessage){
        Logger.Instance().writeMessage(log, "PERFORMANCE");
    }
    private constructor(){
        this.__enabledLoggingOptions =  ["ERROR", "WARNING", "DEBUG", "INFO", "PERFORMANCE"]; //process.env.LOGGING_TYPE as LoggingOptions ||
    }
    writeMessage(log: LogMessage, type: LoggingOptions){
        if(this.__enabledLoggingOptions.includes(type)) {
            console.log([type, new Date()] ,log.message);
        }
    }
}

export interface LogMessage {
    message: string;
    loggingItem?: object | string | number | boolean;
    searchKey?: string | string[]
}

type LoggingOptions =  "ERROR"| "WARNING" | "DEBUG" | "INFO" | "PERFORMANCE";