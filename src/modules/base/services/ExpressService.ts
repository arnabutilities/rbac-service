import express, { Express, NextFunction, Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import Logger from "../../logger/Logger";

export class ExpressService {
    private static __expressService:ExpressService;
    private constructor(){

    }
    private static Initialize(){
        if(ExpressService.__expressService == null){
            ExpressService.__expressService = new ExpressService();
        }
        return ExpressService.__expressService;
    }
    public static getApp (routes?:Router, conf?:{enableHandlebar:boolean}):Express {
        const expressService = ExpressService.Initialize();
        let app = expressService.init();
        if(conf?.enableHandlebar){
            Logger.Debug({message: "hbs enabled"})
            app.engine('handlebars', engine());
            app.set('view engine', 'handlebars');
            app.set('views', './src/views');
        }
        if(routes != null){
            app.use('/', routes);
        }
        return app;        
    }
    public init():Express {
        const newApp = express();
        newApp.use(bodyParser.json({limit: "100mb"}));
        newApp.use(bodyParser.urlencoded({limit:"50mb", extended: true}));
        newApp.use(express.static('public'));
        return newApp;
    }
}