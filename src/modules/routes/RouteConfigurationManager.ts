import {
    AUTHORIZATION_SELECTION_STRATEGY,
    AuthorizationOption,
    ROUTER_AUTHORIZATIONS,
    RouteAuthorizations,
    RouteDetails,
} from "./const";

export class RouteConfigurationManager {
    constructor(
        private routeConfiguration: Map<string, RouteDetails>,
        private basePath: string = ""
    ) {}
    public getRouteDetails(): Map<string, RouteDetails> {
        return this.routeConfiguration;
    }
    public getRouteUrl(key: string): string {
        return this.basePath + this.routeConfiguration.get(key)?.url;
    }
    public shouldEscapeMiddleware(key: string): boolean {
        return this.routeConfiguration.get(key)?.escapeAllMiddlewares || false;
    }
    public getTemplateFile(key: string, userAuthorizations: ROUTER_AUTHORIZATIONS[]): string {
        const authOption = this.getAuthorizationOption(key, userAuthorizations)
        return authOption?.hbsTemplate || this.routeConfiguration.get(key)?.defaultHbsTemplate || "missing-template.handlebars";
    }
    public getAuthorizationOption(key: string, userAuthorizations: ROUTER_AUTHORIZATIONS[] ): AuthorizationOption | undefined {
        try {
            const routerDetails = this.routeConfiguration.get(key) as RouteAuthorizations;
            const selectedAuthorizations = routerDetails.authorizationOptions.filter(
                (authOption: AuthorizationOption) => {
                    if (userAuthorizations.includes(authOption.authorization)) {
                        return true;
                    }
                    return false;
                }
            );
            if (
                routerDetails.authorizationSelectionStrategy ===
                AUTHORIZATION_SELECTION_STRATEGY.BEST_SCORE_FOR_THE_USER
            ) {
                return selectedAuthorizations.sort((a, b) => b.score - a.score).shift();
            }
            if (
                routerDetails.authorizationSelectionStrategy ===
                AUTHORIZATION_SELECTION_STRATEGY.LEAST_SCORE_FOR_THE_USER
            ) {
                return selectedAuthorizations.sort((a, b) => b.score - a.score).pop();
            }
        } catch (err) {
            throw new Error(
                "No authorization option found for the given user authorizations, please refer the documentations"
            );
        }
    }
}
