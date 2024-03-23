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
        Logger.Instance().writeMessage(log);
    }
    private constructor(){
        this.__enabledLoggingOptions =  ["ERROR", "WARNING", "DEBUG", "INFO", "PERFORMANCE"]; //process.env.LOGGING_TYPE as LoggingOptions ||
    }
    writeMessage(log: LogMessage){
        console.log(this.__enabledLoggingOptions, log);
    }
}

export interface LogMessage {
    message: string;
    loggingItem?: object | string | number | boolean;
    searchKey?: string | string[]
}

type LoggingOptions =  "ERROR"| "WARNING" | "DEBUG" | "INFO" | "PERFORMANCE";