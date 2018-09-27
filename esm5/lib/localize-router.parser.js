/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { CacheMechanism, LocalizeRouterSettings } from './localize-router.config';
import { Inject } from '@angular/core';
var /** @type {?} */ COOKIE_EXPIRY = 30;
/**
 * Abstract class for parsing localization
 * @abstract
 */
var LocalizeParser = /** @class */ (function () {
    /**
     * Loader constructor
     */
    function LocalizeParser(translate, location, settings) {
        this.translate = translate;
        this.location = location;
        this.settings = settings;
    }
    /**
   * Prepare routes to be fully usable by ngx-translate-router
   * @param routes
   */
    /* private initRoutes(routes: Routes, prefix = '') {
      routes.forEach(route => {
        if (route.path !== '**') {
          const routeData: any = route.data = route.data || {};
          routeData.localizeRouter = {};
          routeData.localizeRouter.fullPath = `${prefix}/${route.path}`;
          if (route.children && route.children.length > 0) {
            this.initRoutes(route.children, routeData.localizeRouter.fullPath);
          }
        }
      });
    } */
    /**
     * Initialize language and routes
     */
    /**
     * Initialize language and routes
     * @param {?} routes
     * @return {?}
     */
    LocalizeParser.prototype.init = /**
     * Initialize language and routes
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        var /** @type {?} */ selectedLanguage;
        // this.initRoutes(routes);
        this.routes = routes;
        if (!this.locales || !this.locales.length) {
            return Promise.resolve();
        }
        /**
         * detect current language
         */
        var /** @type {?} */ locationLang = this.getLocationLang();
        var /** @type {?} */ browserLang = this._getBrowserLang();
        if (this.settings.defaultLangFunction) {
            this.defaultLang = this.settings.defaultLangFunction(this.locales, this._cachedLang, browserLang);
        }
        else {
            this.defaultLang = this._cachedLang || browserLang || this.locales[0];
        }
        selectedLanguage = locationLang || this.defaultLang;
        this.translate.setDefaultLang(this.defaultLang);
        var /** @type {?} */ children = [];
        /** if set prefix is enforced */
        if (this.settings.alwaysSetPrefix) {
            var /** @type {?} */ baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
            /**
             * extract potential wildcard route
             */
            var /** @type {?} */ wildcardIndex = routes.findIndex(function (route) { return route.path === '**'; });
            if (wildcardIndex !== -1) {
                this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
            }
            children = this.routes.splice(0, this.routes.length, baseRoute);
        }
        else {
            children = tslib_1.__spread(this.routes); // shallow copy of routes
        }
        /** exclude certain routes */
        for (var /** @type {?} */ i = children.length - 1; i >= 0; i--) {
            if (children[i].data && children[i].data['skipRouteLocalization']) {
                if (this.settings.alwaysSetPrefix) {
                    // add directly to routes
                    this.routes.push(children[i]);
                }
                children.splice(i, 1);
            }
        }
        /** append children routes */
        if (children && children.length) {
            if (this.locales.length > 1 || this.settings.alwaysSetPrefix) {
                this._languageRoute = { children: children };
                this.routes.unshift(this._languageRoute);
            }
        }
        /** ...and potential wildcard route */
        if (this._wildcardRoute && this.settings.alwaysSetPrefix) {
            this.routes.push(this._wildcardRoute);
        }
        /**
         * translate routes
         */
        var /** @type {?} */ res = this.translateRoutes(selectedLanguage);
        return res.toPromise();
    };
    /**
     * @param {?} routes
     * @return {?}
     */
    LocalizeParser.prototype.initChildRoutes = /**
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        this._translateRouteTree(routes);
        return routes;
    };
    /**
     * Translate routes to selected language
     */
    /**
     * Translate routes to selected language
     * @param {?} language
     * @return {?}
     */
    LocalizeParser.prototype.translateRoutes = /**
     * Translate routes to selected language
     * @param {?} language
     * @return {?}
     */
    function (language) {
        var _this = this;
        return new Observable(function (observer) {
            _this._cachedLang = language;
            if (_this._languageRoute) {
                _this._languageRoute.path = language;
            }
            _this.translate.use(language).subscribe(function (translations) {
                _this._translationObject = translations;
                _this.currentLang = language;
                if (_this._languageRoute) {
                    if (_this._languageRoute) {
                        _this._translateRouteTree(_this._languageRoute.children);
                    }
                    // if there is wildcard route
                    if (_this._wildcardRoute && _this._wildcardRoute.redirectTo) {
                        _this._translateProperty(_this._wildcardRoute, 'redirectTo', true);
                    }
                }
                else {
                    _this._translateRouteTree(_this.routes);
                }
                observer.next(void 0);
                observer.complete();
            });
        });
    };
    /**
     * Translate the route node and recursively call for all it's children
     * @param {?} routes
     * @return {?}
     */
    LocalizeParser.prototype._translateRouteTree = /**
     * Translate the route node and recursively call for all it's children
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        var _this = this;
        routes.forEach(function (route) {
            if (route.path && route.path !== '**') {
                _this._translateProperty(route, 'path');
            }
            if (route.redirectTo) {
                _this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
            }
            if (route.children) {
                _this._translateRouteTree(route.children);
            }
            if (route.loadChildren && (/** @type {?} */ (route))._loadedConfig) {
                _this._translateRouteTree((/** @type {?} */ (route))._loadedConfig.routes);
            }
        });
    };
    /**
     * Translate property
     * If first time translation then add original to route data object
     * @param {?} route
     * @param {?} property
     * @param {?=} prefixLang
     * @return {?}
     */
    LocalizeParser.prototype._translateProperty = /**
     * Translate property
     * If first time translation then add original to route data object
     * @param {?} route
     * @param {?} property
     * @param {?=} prefixLang
     * @return {?}
     */
    function (route, property, prefixLang) {
        // set property to data if not there yet
        var /** @type {?} */ routeData = route.data = route.data || {};
        if (!routeData.localizeRouter) {
            routeData.localizeRouter = {};
        }
        if (!routeData.localizeRouter[property]) {
            routeData.localizeRouter[property] = (/** @type {?} */ (route))[property];
        }
        var /** @type {?} */ result = this.translateRoute(routeData.localizeRouter[property]);
        (/** @type {?} */ (route))[property] = prefixLang ? "/" + this.urlPrefix + result : result;
    };
    Object.defineProperty(LocalizeParser.prototype, "urlPrefix", {
        get: /**
         * @return {?}
         */
        function () {
            return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Translate route and return observable
     */
    /**
     * Translate route and return observable
     * @param {?} path
     * @return {?}
     */
    LocalizeParser.prototype.translateRoute = /**
     * Translate route and return observable
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        var /** @type {?} */ queryParts = path.split('?');
        if (queryParts.length > 2) {
            throw Error('There should be only one query parameter block in the URL');
        }
        var /** @type {?} */ pathSegments = queryParts[0].split('/');
        /** collect observables  */
        return pathSegments
            .map(function (part) { return part.length ? _this.translateText(part) : part; })
            .join('/') +
            (queryParts.length > 1 ? "?" + queryParts[1] : '');
    };
    /**
     * Get language from url
     */
    /**
     * Get language from url
     * @param {?=} url
     * @return {?}
     */
    LocalizeParser.prototype.getLocationLang = /**
     * Get language from url
     * @param {?=} url
     * @return {?}
     */
    function (url) {
        var /** @type {?} */ queryParamSplit = (url || this.location.path()).split('?');
        var /** @type {?} */ pathSlices = [];
        if (queryParamSplit.length > 0) {
            pathSlices = queryParamSplit[0].split('/');
        }
        if (pathSlices.length > 1 && this.locales.indexOf(pathSlices[1]) !== -1) {
            return pathSlices[1];
        }
        if (pathSlices.length && this.locales.indexOf(pathSlices[0]) !== -1) {
            return pathSlices[0];
        }
        return null;
    };
    /**
     * Get user's language set in the browser
     * @return {?}
     */
    LocalizeParser.prototype._getBrowserLang = /**
     * Get user's language set in the browser
     * @return {?}
     */
    function () {
        return this._returnIfInLocales(this.translate.getBrowserLang());
    };
    Object.defineProperty(LocalizeParser.prototype, "_cachedLang", {
        get: /**
         * Get language from local storage or cookie
         * @return {?}
         */
        function () {
            if (!this.settings.useCachedLang) {
                return;
            }
            if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
                return this._cacheWithLocalStorage();
            }
            if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
                return this._cacheWithCookies();
            }
        },
        set: /**
         * Save language to local storage or cookie
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (!this.settings.useCachedLang) {
                return;
            }
            if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
                this._cacheWithLocalStorage(value);
            }
            if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
                this._cacheWithCookies(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cache value to local storage
     * @param {?=} value
     * @return {?}
     */
    LocalizeParser.prototype._cacheWithLocalStorage = /**
     * Cache value to local storage
     * @param {?=} value
     * @return {?}
     */
    function (value) {
        if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
            return;
        }
        try {
            if (value) {
                window.localStorage.setItem(this.settings.cacheName, value);
                return;
            }
            return this._returnIfInLocales(window.localStorage.getItem(this.settings.cacheName));
        }
        catch (/** @type {?} */ e) {
            // weird Safari issue in private mode, where LocalStorage is defined but throws error on access
            return;
        }
    };
    /**
     * Cache value via cookies
     * @param {?=} value
     * @return {?}
     */
    LocalizeParser.prototype._cacheWithCookies = /**
     * Cache value via cookies
     * @param {?=} value
     * @return {?}
     */
    function (value) {
        if (typeof document === 'undefined' || typeof document.cookie === 'undefined') {
            return;
        }
        try {
            var /** @type {?} */ name_1 = encodeURIComponent(this.settings.cacheName);
            if (value) {
                var /** @type {?} */ d = new Date();
                d.setTime(d.getTime() + COOKIE_EXPIRY * 86400000); // * days
                document.cookie = name_1 + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString();
                return;
            }
            var /** @type {?} */ regexp = new RegExp('(?:^' + name_1 + '|;\\s*' + name_1 + ')=(.*?)(?:;|$)', 'g');
            var /** @type {?} */ result = regexp.exec(document.cookie);
            return decodeURIComponent(result[1]);
        }
        catch (/** @type {?} */ e) {
            return; // should not happen but better safe than sorry
        }
    };
    /**
     * Check if value exists in locales list
     * @param {?} value
     * @return {?}
     */
    LocalizeParser.prototype._returnIfInLocales = /**
     * Check if value exists in locales list
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value && this.locales.indexOf(value) !== -1) {
            return value;
        }
        return null;
    };
    /**
     * Get translated value
     * @param {?} key
     * @return {?}
     */
    LocalizeParser.prototype.translateText = /**
     * Get translated value
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (!this._translationObject) {
            return key;
        }
        var /** @type {?} */ fullKey = this.prefix + key;
        var /** @type {?} */ res = this.translate.getParsedResult(this._translationObject, fullKey);
        return res !== fullKey ? res : key;
    };
    /** @nocollapse */
    LocalizeParser.ctorParameters = function () { return [
        { type: TranslateService, decorators: [{ type: Inject, args: [TranslateService,] }] },
        { type: Location, decorators: [{ type: Inject, args: [Location,] }] },
        { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] }
    ]; };
    return LocalizeParser;
}());
export { LocalizeParser };
function LocalizeParser_tsickle_Closure_declarations() {
    /** @type {?} */
    LocalizeParser.prototype.locales;
    /** @type {?} */
    LocalizeParser.prototype.currentLang;
    /** @type {?} */
    LocalizeParser.prototype.routes;
    /** @type {?} */
    LocalizeParser.prototype.defaultLang;
    /** @type {?} */
    LocalizeParser.prototype.prefix;
    /** @type {?} */
    LocalizeParser.prototype._translationObject;
    /** @type {?} */
    LocalizeParser.prototype._wildcardRoute;
    /** @type {?} */
    LocalizeParser.prototype._languageRoute;
    /** @type {?} */
    LocalizeParser.prototype.translate;
    /** @type {?} */
    LocalizeParser.prototype.location;
    /** @type {?} */
    LocalizeParser.prototype.settings;
    /**
     * Load routes and fetch necessary data
     * @abstract
     * @param {?} routes
     * @return {?}
     */
    LocalizeParser.prototype.load = function (routes) { };
}
/**
 * Manually set configuration
 */
var /**
 * Manually set configuration
 */
ManualParserLoader = /** @class */ (function (_super) {
    tslib_1.__extends(ManualParserLoader, _super);
    /**
     * CTOR
     */
    function ManualParserLoader(translate, location, settings, locales, prefix) {
        if (locales === void 0) { locales = ['en']; }
        if (prefix === void 0) { prefix = 'ROUTES.'; }
        var _this = _super.call(this, translate, location, settings) || this;
        _this.locales = locales;
        _this.prefix = prefix || '';
        return _this;
    }
    /**
     * Initialize or append routes
     */
    /**
     * Initialize or append routes
     * @param {?} routes
     * @return {?}
     */
    ManualParserLoader.prototype.load = /**
     * Initialize or append routes
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.init(routes).then(resolve);
        });
    };
    return ManualParserLoader;
}(LocalizeParser));
/**
 * Manually set configuration
 */
export { ManualParserLoader };
var DummyLocalizeParser = /** @class */ (function (_super) {
    tslib_1.__extends(DummyLocalizeParser, _super);
    function DummyLocalizeParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    DummyLocalizeParser.prototype.load = /**
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.init(routes).then(resolve);
        });
    };
    return DummyLocalizeParser;
}(LocalizeParser));
export { DummyLocalizeParser };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDbEYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2QyxxQkFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDOzs7Ozs7SUFpQnZCOztPQUVHO0lBQ0gsd0JBQThDLFNBQTJCLEVBQzdDLFFBQWtCLEVBQ0osUUFBZ0M7UUFGNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDN0MsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNKLGFBQVEsR0FBUixRQUFRLENBQXdCO0tBQ3pFO0lBT0Q7OztLQUdDO0lBQ0Q7Ozs7Ozs7Ozs7O1FBV0k7SUFHSjs7T0FFRzs7Ozs7O0lBQ08sNkJBQUk7Ozs7O0lBQWQsVUFBZSxNQUFjO1FBQzNCLHFCQUFJLGdCQUF3QixDQUFDOztRQUc3QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMxQjs7OztRQUVELHFCQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFD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QUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDLENBQUMsQ0FBQztLQUNKOzZCQXpXSDtFQXNWd0MsY0FBYyxFQW9CckQsQ0FBQTs7OztBQXBCRCw4QkFvQkM7QUFFRCxJQUFBO0lBQXlDLCtDQUFjOzs7Ozs7OztJQUNyRCxrQ0FBSTs7OztJQUFKLFVBQUssTUFBYztRQUFuQixpQkFJQztRQUhDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQVk7WUFDOUIsS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDO0tBQ0o7OEJBalhIO0VBNFd5QyxjQUFjLEVBTXRELENBQUE7QUFORCwrQkFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlcywgUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENhY2hlTWVjaGFuaXNtLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5jb25zdCBDT09LSUVfRVhQSVJZID0gMzA7IC8vIDEgbW9udGhcblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyBmb3IgcGFyc2luZyBsb2NhbGl6YXRpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExvY2FsaXplUGFyc2VyIHtcbiAgbG9jYWxlczogQXJyYXk8c3RyaW5nPjtcbiAgY3VycmVudExhbmc6IHN0cmluZztcbiAgcm91dGVzOiBSb3V0ZXM7XG4gIGRlZmF1bHRMYW5nOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHByZWZpeDogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3RyYW5zbGF0aW9uT2JqZWN0OiBhbnk7XG4gIHByaXZhdGUgX3dpbGRjYXJkUm91dGU6IFJvdXRlO1xuICBwcml2YXRlIF9sYW5ndWFnZVJvdXRlOiBSb3V0ZTtcblxuICAvKipcbiAgICogTG9hZGVyIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KFRyYW5zbGF0ZVNlcnZpY2UpIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxuICAgIEBJbmplY3QoTG9jYXRpb24pIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxuICAgIEBJbmplY3QoTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykgcHJpdmF0ZSBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykge1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgcm91dGVzIGFuZCBmZXRjaCBuZWNlc3NhcnkgZGF0YVxuICAgKi9cbiAgYWJzdHJhY3QgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PjtcblxuICAvKipcbiAqIFByZXBhcmUgcm91dGVzIHRvIGJlIGZ1bGx5IHVzYWJsZSBieSBuZ3gtdHJhbnNsYXRlLXJvdXRlclxuICogQHBhcmFtIHJvdXRlc1xuICovXG4gIC8qIHByaXZhdGUgaW5pdFJvdXRlcyhyb3V0ZXM6IFJvdXRlcywgcHJlZml4ID0gJycpIHtcbiAgICByb3V0ZXMuZm9yRWFjaChyb3V0ZSA9PiB7XG4gICAgICBpZiAocm91dGUucGF0aCAhPT0gJyoqJykge1xuICAgICAgICBjb25zdCByb3V0ZURhdGE6IGFueSA9IHJvdXRlLmRhdGEgPSByb3V0ZS5kYXRhIHx8IHt9O1xuICAgICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7fTtcbiAgICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoID0gYCR7cHJlZml4fS8ke3JvdXRlLnBhdGh9YDtcbiAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuICYmIHJvdXRlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmluaXRSb3V0ZXMocm91dGUuY2hpbGRyZW4sIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlci5mdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSAqL1xuXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbGFuZ3VhZ2UgYW5kIHJvdXRlc1xuICAgKi9cbiAgcHJvdGVjdGVkIGluaXQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIGxldCBzZWxlY3RlZExhbmd1YWdlOiBzdHJpbmc7XG5cbiAgICAvLyB0aGlzLmluaXRSb3V0ZXMocm91dGVzKTtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcblxuICAgIGlmICghdGhpcy5sb2NhbGVzIHx8ICF0aGlzLmxvY2FsZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIC8qKiBkZXRlY3QgY3VycmVudCBsYW5ndWFnZSAqL1xuICAgIGNvbnN0IGxvY2F0aW9uTGFuZyA9IHRoaXMuZ2V0TG9jYXRpb25MYW5nKCk7XG4gICAgY29uc3QgYnJvd3NlckxhbmcgPSB0aGlzLl9nZXRCcm93c2VyTGFuZygpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVmYXVsdExhbmdGdW5jdGlvbikge1xuICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdExhbmdGdW5jdGlvbih0aGlzLmxvY2FsZXMsIHRoaXMuX2NhY2hlZExhbmcsIGJyb3dzZXJMYW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHRoaXMuX2NhY2hlZExhbmcgfHwgYnJvd3NlckxhbmcgfHwgdGhpcy5sb2NhbGVzWzBdO1xuICAgIH1cbiAgICBzZWxlY3RlZExhbmd1YWdlID0gbG9jYXRpb25MYW5nIHx8IHRoaXMuZGVmYXVsdExhbmc7XG4gICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcodGhpcy5kZWZhdWx0TGFuZyk7XG5cbiAgICBsZXQgY2hpbGRyZW46IFJvdXRlcyA9IFtdO1xuICAgIC8qKiBpZiBzZXQgcHJlZml4IGlzIGVuZm9yY2VkICovXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICBjb25zdCBiYXNlUm91dGUgPSB7IHBhdGg6ICcnLCByZWRpcmVjdFRvOiB0aGlzLmRlZmF1bHRMYW5nLCBwYXRoTWF0Y2g6ICdmdWxsJyB9O1xuXG4gICAgICAvKiogZXh0cmFjdCBwb3RlbnRpYWwgd2lsZGNhcmQgcm91dGUgKi9cbiAgICAgIGNvbnN0IHdpbGRjYXJkSW5kZXggPSByb3V0ZXMuZmluZEluZGV4KChyb3V0ZTogUm91dGUpID0+IHJvdXRlLnBhdGggPT09ICcqKicpO1xuICAgICAgaWYgKHdpbGRjYXJkSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuX3dpbGRjYXJkUm91dGUgPSByb3V0ZXMuc3BsaWNlKHdpbGRjYXJkSW5kZXgsIDEpWzBdO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4gPSB0aGlzLnJvdXRlcy5zcGxpY2UoMCwgdGhpcy5yb3V0ZXMubGVuZ3RoLCBiYXNlUm91dGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZHJlbiA9IFsuLi50aGlzLnJvdXRlc107IC8vIHNoYWxsb3cgY29weSBvZiByb3V0ZXNcbiAgICB9XG5cbiAgICAvKiogZXhjbHVkZSBjZXJ0YWluIHJvdXRlcyAqL1xuICAgIGZvciAobGV0IGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGNoaWxkcmVuW2ldLmRhdGEgJiYgY2hpbGRyZW5baV0uZGF0YVsnc2tpcFJvdXRlTG9jYWxpemF0aW9uJ10pIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgLy8gYWRkIGRpcmVjdGx5IHRvIHJvdXRlc1xuICAgICAgICAgIHRoaXMucm91dGVzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogYXBwZW5kIGNoaWxkcmVuIHJvdXRlcyAqL1xuICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmxvY2FsZXMubGVuZ3RoID4gMSB8fCB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICB0aGlzLl9sYW5ndWFnZVJvdXRlID0geyBjaGlsZHJlbjogY2hpbGRyZW4gfTtcbiAgICAgICAgdGhpcy5yb3V0ZXMudW5zaGlmdCh0aGlzLl9sYW5ndWFnZVJvdXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogLi4uYW5kIHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xuICAgIGlmICh0aGlzLl93aWxkY2FyZFJvdXRlICYmIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICB0aGlzLnJvdXRlcy5wdXNoKHRoaXMuX3dpbGRjYXJkUm91dGUpO1xuICAgIH1cblxuICAgIC8qKiB0cmFuc2xhdGUgcm91dGVzICovXG4gICAgY29uc3QgcmVzID0gdGhpcy50cmFuc2xhdGVSb3V0ZXMoc2VsZWN0ZWRMYW5ndWFnZSk7XG4gICAgcmV0dXJuIHJlcy50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGluaXRDaGlsZFJvdXRlcyhyb3V0ZXM6IFJvdXRlcykge1xuICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXMpO1xuICAgIHJldHVybiByb3V0ZXM7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlcyB0byBzZWxlY3RlZCBsYW5ndWFnZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGVzKGxhbmd1YWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxhbnk+KChvYnNlcnZlcjogT2JzZXJ2ZXI8YW55PikgPT4ge1xuICAgICAgdGhpcy5fY2FjaGVkTGFuZyA9IGxhbmd1YWdlO1xuICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2VSb3V0ZS5wYXRoID0gbGFuZ3VhZ2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShsYW5ndWFnZSkuc3Vic2NyaWJlKCh0cmFuc2xhdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk9iamVjdCA9IHRyYW5zbGF0aW9ucztcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGxhbmd1YWdlO1xuXG4gICAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSh0aGlzLl9sYW5ndWFnZVJvdXRlLmNoaWxkcmVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gaWYgdGhlcmUgaXMgd2lsZGNhcmQgcm91dGVcbiAgICAgICAgICBpZiAodGhpcy5fd2lsZGNhcmRSb3V0ZSAmJiB0aGlzLl93aWxkY2FyZFJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHRoaXMuX3dpbGRjYXJkUm91dGUsICdyZWRpcmVjdFRvJywgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSh0aGlzLnJvdXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlci5uZXh0KHZvaWQgMCk7XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdGhlIHJvdXRlIG5vZGUgYW5kIHJlY3Vyc2l2ZWx5IGNhbGwgZm9yIGFsbCBpdCdzIGNoaWxkcmVuXG4gICAqL1xuICBwcml2YXRlIF90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGVzOiBSb3V0ZXMpOiB2b2lkIHtcbiAgICByb3V0ZXMuZm9yRWFjaCgocm91dGU6IFJvdXRlKSA9PiB7XG4gICAgICBpZiAocm91dGUucGF0aCAmJiByb3V0ZS5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlLCAncGF0aCcpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkocm91dGUsICdyZWRpcmVjdFRvJywgIXJvdXRlLnJlZGlyZWN0VG8uaW5kZXhPZignLycpKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGUuY2hpbGRyZW4pO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmxvYWRDaGlsZHJlbiAmJiAoPGFueT5yb3V0ZSkuX2xvYWRlZENvbmZpZykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUoKDxhbnk+cm91dGUpLl9sb2FkZWRDb25maWcucm91dGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcHJvcGVydHlcbiAgICogSWYgZmlyc3QgdGltZSB0cmFuc2xhdGlvbiB0aGVuIGFkZCBvcmlnaW5hbCB0byByb3V0ZSBkYXRhIG9iamVjdFxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlUHJvcGVydHkocm91dGU6IFJvdXRlLCBwcm9wZXJ0eTogc3RyaW5nLCBwcmVmaXhMYW5nPzogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIHNldCBwcm9wZXJ0eSB0byBkYXRhIGlmIG5vdCB0aGVyZSB5ZXRcbiAgICBjb25zdCByb3V0ZURhdGE6IGFueSA9IHJvdXRlLmRhdGEgPSByb3V0ZS5kYXRhIHx8IHt9O1xuICAgIGlmICghcm91dGVEYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldKSB7XG4gICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldID0gKDxhbnk+cm91dGUpW3Byb3BlcnR5XTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlKHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0pO1xuICAgICg8YW55PnJvdXRlKVtwcm9wZXJ0eV0gPSBwcmVmaXhMYW5nID8gYC8ke3RoaXMudXJsUHJlZml4fSR7cmVzdWx0fWAgOiByZXN1bHQ7XG4gIH1cblxuICBnZXQgdXJsUHJlZml4KCkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCB8fCB0aGlzLmN1cnJlbnRMYW5nICE9PSB0aGlzLmRlZmF1bHRMYW5nID8gdGhpcy5jdXJyZW50TGFuZyA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSBhbmQgcmV0dXJuIG9ic2VydmFibGVcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlQYXJ0cyA9IHBhdGguc3BsaXQoJz8nKTtcbiAgICBpZiAocXVlcnlQYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhlcmUgc2hvdWxkIGJlIG9ubHkgb25lIHF1ZXJ5IHBhcmFtZXRlciBibG9jayBpbiB0aGUgVVJMJyk7XG4gICAgfVxuICAgIGNvbnN0IHBhdGhTZWdtZW50cyA9IHF1ZXJ5UGFydHNbMF0uc3BsaXQoJy8nKTtcblxuICAgIC8qKiBjb2xsZWN0IG9ic2VydmFibGVzICAqL1xuICAgIHJldHVybiBwYXRoU2VnbWVudHNcbiAgICAgIC5tYXAoKHBhcnQ6IHN0cmluZykgPT4gcGFydC5sZW5ndGggPyB0aGlzLnRyYW5zbGF0ZVRleHQocGFydCkgOiBwYXJ0KVxuICAgICAgLmpvaW4oJy8nKSArXG4gICAgICAocXVlcnlQYXJ0cy5sZW5ndGggPiAxID8gYD8ke3F1ZXJ5UGFydHNbMV19YCA6ICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGFuZ3VhZ2UgZnJvbSB1cmxcbiAgICovXG4gIGdldExvY2F0aW9uTGFuZyh1cmw/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5UGFyYW1TcGxpdCA9ICh1cmwgfHwgdGhpcy5sb2NhdGlvbi5wYXRoKCkpLnNwbGl0KCc/Jyk7XG4gICAgbGV0IHBhdGhTbGljZXM6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKHF1ZXJ5UGFyYW1TcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICBwYXRoU2xpY2VzID0gcXVlcnlQYXJhbVNwbGl0WzBdLnNwbGl0KCcvJyk7XG4gICAgfVxuICAgIGlmIChwYXRoU2xpY2VzLmxlbmd0aCA+IDEgJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YocGF0aFNsaWNlc1sxXSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1sxXTtcbiAgICB9XG4gICAgaWYgKHBhdGhTbGljZXMubGVuZ3RoICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHBhdGhTbGljZXNbMF0pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHBhdGhTbGljZXNbMF07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB1c2VyJ3MgbGFuZ3VhZ2Ugc2V0IGluIHRoZSBicm93c2VyXG4gICAqL1xuICBwcml2YXRlIF9nZXRCcm93c2VyTGFuZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXR1cm5JZkluTG9jYWxlcyh0aGlzLnRyYW5zbGF0ZS5nZXRCcm93c2VyTGFuZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGFuZ3VhZ2UgZnJvbSBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgX2NhY2hlZExhbmcoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MudXNlQ2FjaGVkTGFuZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVXaXRoTG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Db29raWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhDb29raWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgbGFuZ3VhZ2UgdG8gbG9jYWwgc3RvcmFnZSBvciBjb29raWVcbiAgICovXG4gIHByaXZhdGUgc2V0IF9jYWNoZWRMYW5nKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MudXNlQ2FjaGVkTGFuZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlKSB7XG4gICAgICB0aGlzLl9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uQ29va2llKSB7XG4gICAgICB0aGlzLl9jYWNoZVdpdGhDb29raWVzKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgdmFsdWUgdG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBfY2FjaGVXaXRoTG9jYWxTdG9yYWdlKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9yZXR1cm5JZkluTG9jYWxlcyh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB3ZWlyZCBTYWZhcmkgaXNzdWUgaW4gcHJpdmF0ZSBtb2RlLCB3aGVyZSBMb2NhbFN0b3JhZ2UgaXMgZGVmaW5lZCBidXQgdGhyb3dzIGVycm9yIG9uIGFjY2Vzc1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB2YWx1ZSB2aWEgY29va2llc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2FjaGVXaXRoQ29va2llcyh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50LmNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGQ6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyBDT09LSUVfRVhQSVJZICogODY0MDAwMDApOyAvLyAqIGRheXNcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09JHtlbmNvZGVVUklDb21wb25lbnQodmFsdWUpfTtleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/Ol4nICsgbmFtZSArICd8O1xcXFxzKicgKyBuYW1lICsgJyk9KC4qPykoPzo7fCQpJywgJ2cnKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZ2V4cC5leGVjKGRvY3VtZW50LmNvb2tpZSk7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsxXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuOyAvLyBzaG91bGQgbm90IGhhcHBlbiBidXQgYmV0dGVyIHNhZmUgdGhhbiBzb3JyeVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB2YWx1ZSBleGlzdHMgaW4gbG9jYWxlcyBsaXN0XG4gICAqL1xuICBwcml2YXRlIF9yZXR1cm5JZkluTG9jYWxlcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdHJhbnNsYXRlZCB2YWx1ZVxuICAgKi9cbiAgcHJpdmF0ZSB0cmFuc2xhdGVUZXh0KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0KSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICBjb25zdCBmdWxsS2V5ID0gdGhpcy5wcmVmaXggKyBrZXk7XG4gICAgY29uc3QgcmVzID0gdGhpcy50cmFuc2xhdGUuZ2V0UGFyc2VkUmVzdWx0KHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0LCBmdWxsS2V5KTtcbiAgICByZXR1cm4gcmVzICE9PSBmdWxsS2V5ID8gcmVzIDoga2V5O1xuICB9XG59XG5cbi8qKlxuICogTWFudWFsbHkgc2V0IGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIE1hbnVhbFBhcnNlckxvYWRlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IodHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLCBsb2NhdGlvbjogTG9jYXRpb24sIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgIGxvY2FsZXM6IHN0cmluZ1tdID0gWydlbiddLCBwcmVmaXg6IHN0cmluZyA9ICdST1VURVMuJykge1xuICAgIHN1cGVyKHRyYW5zbGF0ZSwgbG9jYXRpb24sIHNldHRpbmdzKTtcbiAgICB0aGlzLmxvY2FsZXMgPSBsb2NhbGVzO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4IHx8ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgYXBwZW5kIHJvdXRlc1xuICAgKi9cbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIER1bW15TG9jYWxpemVQYXJzZXIgZXh0ZW5kcyBMb2NhbGl6ZVBhcnNlciB7XG4gIGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmluaXQocm91dGVzKS50aGVuKHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=