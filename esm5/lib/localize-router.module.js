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
var ParserInitializer = /** @class */ (function () {
    /**
     * CTOR
     */
    function ParserInitializer(injector) {
        this.injector = injector;
    }
    /**
     * @return {?}
     */
    ParserInitializer.prototype.appInitializer = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ res = this.parser.load(this.routes);
        res.then(function () {
            var /** @type {?} */ localize = _this.injector.get(LocalizeRouterService);
            localize.init();
        });
        return res;
    };
    /**
     * @param {?} parser
     * @param {?} routes
     * @return {?}
     */
    ParserInitializer.prototype.generateInitializer = /**
     * @param {?} parser
     * @param {?} routes
     * @return {?}
     */
    function (parser, routes) {
        this.parser = parser;
        this.routes = routes.reduce(function (a, b) { return a.concat(b); });
        return this.appInitializer;
    };
    ParserInitializer.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ParserInitializer.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return ParserInitializer;
}());
export { ParserInitializer };
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
var LocalizeRouterModule = /** @class */ (function () {
    function LocalizeRouterModule() {
    }
    /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    LocalizeRouterModule.forRoot = /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    function (routes, config) {
        if (config === void 0) { config = {}; }
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
    };
    /**
     * @param {?} routes
     * @return {?}
     */
    LocalizeRouterModule.forChild = /**
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
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
    };
    LocalizeRouterModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, TranslateModule],
                    declarations: [LocalizeRouterPipe],
                    exports: [LocalizeRouterPipe]
                },] },
    ];
    return LocalizeRouterModule;
}());
export { LocalizeRouterModule };
/**
 * @param {?} localizeRouterModule
 * @return {?}
 */
export function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error("LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.");
    }
    return 'guarded';
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxRQUFRLEVBQXVCLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUNsRSxVQUFVLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUM1QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixlQUFlLEVBQUUsVUFBVSxFQUFFLHFCQUFxQixFQUFFLDZCQUE2QixFQUF3QixzQkFBc0IsRUFDL0gsVUFBVSxFQUNWLGVBQWUsRUFDaEIsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQzs7SUFPM0U7O09BRUc7SUFDSCwyQkFBb0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtLQUNyQzs7OztJQUVELDBDQUFjOzs7SUFBZDtRQUFBLGlCQVFDO1FBUEMscUJBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxHQUFH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RixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3RELFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDOUI7OytCQXRERDs7U0F1RGEsb0JBQW9COzs7OztBQWtEakMsTUFBTSw4QkFBOEIsb0JBQTBDO0lBQzVFLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksS0FBSyxDQUNiLHNIQUFzSCxDQUFDLENBQUM7S0FDM0g7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0NBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIEFQUF9JTklUSUFMSVpFUiwgT3B0aW9uYWwsIFNraXBTZWxmLFxuICBJbmplY3RhYmxlLCBJbmplY3RvciwgTmdNb2R1bGVGYWN0b3J5TG9hZGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBEdW1teUxvY2FsaXplUGFyc2VyLCBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclBpcGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5waXBlJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFMV0FZU19TRVRfUFJFRklYLFxuICBDQUNIRV9NRUNIQU5JU00sIENBQ0hFX05BTUUsIERFRkFVTFRfTEFOR19GVU5DVElPTiwgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsIExvY2FsaXplUm91dGVyQ29uZmlnLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICBSQVdfUk9VVEVTLFxuICBVU0VfQ0FDSEVEX0xBTkdcbn0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQYXJzZXJJbml0aWFsaXplciB7XG4gIHBhcnNlcjogTG9jYWxpemVQYXJzZXI7XG4gIHJvdXRlczogUm91dGVzO1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge1xuICB9XG5cbiAgYXBwSW5pdGlhbGl6ZXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci5sb2FkKHRoaXMucm91dGVzKTtcbiAgICByZXMudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxpemVSb3V0ZXJTZXJ2aWNlKTtcbiAgICAgIGxvY2FsaXplLmluaXQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiAoKSA9PiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpO1xuICAgIHJldHVybiB0aGlzLmFwcEluaXRpYWxpemVyO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBJbml0aWFsaXplcihwOiBQYXJzZXJJbml0aWFsaXplciwgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6IGFueSB7XG4gIHJldHVybiBwLmdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyLCByb3V0ZXMpLmJpbmQocCk7XG59XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFJvdXRlck1vZHVsZSwgVHJhbnNsYXRlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTG9jYWxpemVSb3V0ZXJQaXBlXSxcbiAgZXhwb3J0czogW0xvY2FsaXplUm91dGVyUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJNb2R1bGUge1xuXG4gIHN0YXRpYyBmb3JSb290KHJvdXRlczogUm91dGVzLCBjb25maWc6IExvY2FsaXplUm91dGVyQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBwcm92aWRlRm9yUm9vdEd1YXJkLFxuICAgICAgICAgIGRlcHM6IFtbTG9jYWxpemVSb3V0ZXJNb2R1bGUsIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVVNFX0NBQ0hFRF9MQU5HLCB1c2VWYWx1ZTogY29uZmlnLnVzZUNhY2hlZExhbmcgfSxcbiAgICAgICAgeyBwcm92aWRlOiBBTFdBWVNfU0VUX1BSRUZJWCwgdXNlVmFsdWU6IGNvbmZpZy5hbHdheXNTZXRQcmVmaXggfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9OQU1FLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTmFtZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENBQ0hFX01FQ0hBTklTTSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU1lY2hhbmlzbSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERFRkFVTFRfTEFOR19GVU5DVElPTiwgdXNlVmFsdWU6IGNvbmZpZy5kZWZhdWx0TGFuZ0Z1bmN0aW9uIH0sXG4gICAgICAgIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICAgIGNvbmZpZy5wYXJzZXIgfHwgeyBwcm92aWRlOiBMb2NhbGl6ZVBhcnNlciwgdXNlQ2xhc3M6IER1bW15TG9jYWxpemVQYXJzZXIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xuICAgICAgICB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNlcnZpY2UsXG4gICAgICAgIFBhcnNlckluaXRpYWxpemVyLFxuICAgICAgICB7IHByb3ZpZGU6IE5nTW9kdWxlRmFjdG9yeUxvYWRlciwgdXNlQ2xhc3M6IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlRmFjdG9yeTogZ2V0QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW1BhcnNlckluaXRpYWxpemVyLCBMb2NhbGl6ZVBhcnNlciwgUkFXX1JPVVRFU11cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yQ2hpbGQocm91dGVzOiBSb3V0ZXMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVGb3JSb290R3VhcmQobG9jYWxpemVSb3V0ZXJNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlKTogc3RyaW5nIHtcbiAgaWYgKGxvY2FsaXplUm91dGVyTW9kdWxlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYExvY2FsaXplUm91dGVyTW9kdWxlLmZvclJvb3QoKSBjYWxsZWQgdHdpY2UuIExhenkgbG9hZGVkIG1vZHVsZXMgc2hvdWxkIHVzZSBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JDaGlsZCgpIGluc3RlYWQuYCk7XG4gIH1cbiAgcmV0dXJuICdndWFyZGVkJztcbn1cbiJdfQ==