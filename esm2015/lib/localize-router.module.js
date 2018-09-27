/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, APP_INITIALIZER, Optional, SkipSelf, Injectable, Injector, NgModuleFactoryLoader } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import { RouterModule } from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ALWAYS_SET_PREFIX, CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, LOCALIZE_ROUTER_FORROOT_GUARD, LocalizeRouterSettings, RAW_ROUTES, USE_CACHED_LANG } from './localize-router.config';
import { LocalizeRouterConfigLoader } from './localize-router-config-loader';
export class ParserInitializer {
    /**
     * CTOR
     * @param {?} injector
     */
    constructor(injector) {
        this.injector = injector;
    }
    /**
     * @return {?}
     */
    appInitializer() {
        const /** @type {?} */ res = this.parser.load(this.routes);
        res.then(() => {
            const /** @type {?} */ localize = this.injector.get(LocalizeRouterService);
            localize.init();
        });
        return res;
    }
    /**
     * @param {?} parser
     * @param {?} routes
     * @return {?}
     */
    generateInitializer(parser, routes) {
        this.parser = parser;
        this.routes = routes.reduce((a, b) => a.concat(b));
        return this.appInitializer;
    }
}
ParserInitializer.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ParserInitializer.ctorParameters = () => [
    { type: Injector }
];
function ParserInitializer_tsickle_Closure_declarations() {
    /** @type {?} */
    ParserInitializer.prototype.parser;
    /** @type {?} */
    ParserInitializer.prototype.routes;
    /** @type {?} */
    ParserInitializer.prototype.injector;
}
/**
 * @param {?} p
 * @param {?} parser
 * @param {?} routes
 * @return {?}
 */
export function getAppInitializer(p, parser, routes) {
    return p.generateInitializer(parser, routes).bind(p);
}
export class LocalizeRouterModule {
    /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    static forRoot(routes, config = {}) {
        return {
            ngModule: LocalizeRouterModule,
            providers: [
                {
                    provide: LOCALIZE_ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[LocalizeRouterModule, new Optional(), new SkipSelf()]]
                },
                { provide: USE_CACHED_LANG, useValue: config.useCachedLang },
                { provide: ALWAYS_SET_PREFIX, useValue: config.alwaysSetPrefix },
                { provide: CACHE_NAME, useValue: config.cacheName },
                { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
                { provide: DEFAULT_LANG_FUNCTION, useValue: config.defaultLangFunction },
                LocalizeRouterSettings,
                config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
                {
                    provide: RAW_ROUTES,
                    multi: true,
                    useValue: routes
                },
                LocalizeRouterService,
                ParserInitializer,
                { provide: NgModuleFactoryLoader, useClass: LocalizeRouterConfigLoader },
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: getAppInitializer,
                    deps: [ParserInitializer, LocalizeParser, RAW_ROUTES]
                }
            ]
        };
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    static forChild(routes) {
        return {
            ngModule: LocalizeRouterModule,
            providers: [
                {
                    provide: RAW_ROUTES,
                    multi: true,
                    useValue: routes
                }
            ]
        };
    }
}
LocalizeRouterModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, RouterModule, TranslateModule],
                declarations: [LocalizeRouterPipe],
                exports: [LocalizeRouterPipe]
            },] },
];
/**
 * @param {?} localizeRouterModule
 * @return {?}
 */
export function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error(`LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
    }
    return 'guarded';
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxRQUFRLEVBQXVCLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUNsRSxVQUFVLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUM1QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLDZCQUE2QixFQUF3QixzQkFBc0IsRUFDL0gsVUFBVSxFQUNWLGVBQWUsRUFDaEIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUc3RSxNQUFNOzs7OztJQU9KLFlBQW9CLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7S0FDckM7Ozs7SUFFRCxjQUFjO1FBQ1osdUJBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLHVCQUFNLFFBQVEsR0FBMEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNqRixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDakIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUNaOzs7Ozs7SUFFRCxtQkFBbUIsQ0FBQyxNQUFzQixFQUFFLE1BQWdCO1FBQzFELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztLQUM1Qjs7O1lBekJGLFVBQVU7Ozs7WUFoQkcsUUFBUTs7Ozs7Ozs7Ozs7Ozs7OztBQTRDdEIsTUFBTSw0QkFBNEIsQ0FBb0IsRUFBRSxNQUFzQixFQUFFLE1BQWdCO0lBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN0RDtBQU9ELE1BQU07Ozs7OztJQUVKLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBYyxFQUFFLFNBQStCLEVBQUU7UUFDOUQsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLDZCQUE2QjtvQkFDdEMsVUFBVSxFQUFFLG1CQUFtQjtvQkFDL0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUM1RCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLGVBQWUsRUFBRTtnQkFDaEUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNuRCxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUU7Z0JBQzdELEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ3hFLHNCQUFzQjtnQkFDdEIsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFO2dCQUMzRTtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2dCQUNELHFCQUFxQjtnQkFDckIsaUJBQWlCO2dCQUNqQixFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUU7Z0JBQ3hFO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxVQUFVLEVBQUUsaUJBQWlCO29CQUM3QixJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO2lCQUN0RDthQUNGO1NBQ0YsQ0FBQztLQUNIOzs7OztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYztRQUM1QixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7OztZQXBERixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7Z0JBQ3RELFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUM5Qjs7Ozs7O0FBbURELE1BQU0sOEJBQThCLG9CQUEwQztJQUM1RSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FDYixzSEFBc0gsQ0FBQyxDQUFDO0tBQzNIO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztDQUNsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBBUFBfSU5JVElBTElaRVIsIE9wdGlvbmFsLCBTa2lwU2VsZixcbiAgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nTW9kdWxlRmFjdG9yeUxvYWRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHVtbXlMb2NhbGl6ZVBhcnNlciwgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJQaXBlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGlwZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTFdBWVNfU0VUX1BSRUZJWCxcbiAgQ0FDSEVfTUVDSEFOSVNNLCBDQUNIRV9OQU1FLCBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJELCBMb2NhbGl6ZVJvdXRlckNvbmZpZywgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgUkFXX1JPVVRFUyxcbiAgVVNFX0NBQ0hFRF9MQU5HXG59IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLWNvbmZpZy1sb2FkZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGFyc2VySW5pdGlhbGl6ZXIge1xuICBwYXJzZXI6IExvY2FsaXplUGFyc2VyO1xuICByb3V0ZXM6IFJvdXRlcztcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgfVxuXG4gIGFwcEluaXRpYWxpemVyKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIubG9hZCh0aGlzLnJvdXRlcyk7XG4gICAgcmVzLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsaXplUm91dGVyU2VydmljZSk7XG4gICAgICBsb2NhbGl6ZS5pbml0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2VuZXJhdGVJbml0aWFsaXplcihwYXJzZXI6IExvY2FsaXplUGFyc2VyLCByb3V0ZXM6IFJvdXRlc1tdKTogKCkgPT4gUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcy5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpKTtcbiAgICByZXR1cm4gdGhpcy5hcHBJbml0aWFsaXplcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwSW5pdGlhbGl6ZXIocDogUGFyc2VySW5pdGlhbGl6ZXIsIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiBhbnkge1xuICByZXR1cm4gcC5nZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlciwgcm91dGVzKS5iaW5kKHApO1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFRyYW5zbGF0ZU1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0xvY2FsaXplUm91dGVyUGlwZV0sXG4gIGV4cG9ydHM6IFtMb2NhbGl6ZVJvdXRlclBpcGVdXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyTW9kdWxlIHtcblxuICBzdGF0aWMgZm9yUm9vdChyb3V0ZXM6IFJvdXRlcywgY29uZmlnOiBMb2NhbGl6ZVJvdXRlckNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogcHJvdmlkZUZvclJvb3RHdWFyZCxcbiAgICAgICAgICBkZXBzOiBbW0xvY2FsaXplUm91dGVyTW9kdWxlLCBuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCldXVxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGU6IFVTRV9DQUNIRURfTEFORywgdXNlVmFsdWU6IGNvbmZpZy51c2VDYWNoZWRMYW5nIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQUxXQVlTX1NFVF9QUkVGSVgsIHVzZVZhbHVlOiBjb25maWcuYWx3YXlzU2V0UHJlZml4IH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTkFNRSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU5hbWUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9NRUNIQU5JU00sIHVzZVZhbHVlOiBjb25maWcuY2FjaGVNZWNoYW5pc20gfSxcbiAgICAgICAgeyBwcm92aWRlOiBERUZBVUxUX0xBTkdfRlVOQ1RJT04sIHVzZVZhbHVlOiBjb25maWcuZGVmYXVsdExhbmdGdW5jdGlvbiB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgICAgICBjb25maWcucGFyc2VyIHx8IHsgcHJvdmlkZTogTG9jYWxpemVQYXJzZXIsIHVzZUNsYXNzOiBEdW1teUxvY2FsaXplUGFyc2VyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLFxuICAgICAgICBQYXJzZXJJbml0aWFsaXplcixcbiAgICAgICAgeyBwcm92aWRlOiBOZ01vZHVsZUZhY3RvcnlMb2FkZXIsIHVzZUNsYXNzOiBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGdldEFwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtQYXJzZXJJbml0aWFsaXplciwgTG9jYWxpemVQYXJzZXIsIFJBV19ST1VURVNdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKHJvdXRlczogUm91dGVzKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogcm91dGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRm9yUm9vdEd1YXJkKGxvY2FsaXplUm91dGVyTW9kdWxlOiBMb2NhbGl6ZVJvdXRlck1vZHVsZSk6IHN0cmluZyB7XG4gIGlmIChsb2NhbGl6ZVJvdXRlck1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JSb290KCkgY2FsbGVkIHR3aWNlLiBMYXp5IGxvYWRlZCBtb2R1bGVzIHNob3VsZCB1c2UgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQoKSBpbnN0ZWFkLmApO1xuICB9XG4gIHJldHVybiAnZ3VhcmRlZCc7XG59XG4iXX0=