import express, { Express, NextFunction, Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import Logger from "../../logger/Logger";
import { RouteManager } from "../../routes";
import { allRoutes } from "../../routes/RouteConfiguration";

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
    public static async getApp ( conf?:{enableHandlebar:boolean}):Promise<Express> {
        await RouteManager.Initialize(allRoutes);
        const expressService = ExpressService.Initialize();
        let app = expressService.init();
        const routes = RouteManager.getRoute();
        if(conf?.enableHandlebar){
            Logger.Debug({message: "ExpressService::getApp - hbs enabled"})
            app.engine('handlebars', engine());
            app.set('view engine', 'handlebars');
            app.set('views', './src/views');
        }
        if(routes != null){
            Logger.Debug({message:"debugging route",loggingItem:{routes}});
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