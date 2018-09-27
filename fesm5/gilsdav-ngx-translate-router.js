import { Inject, InjectionToken, Pipe, ChangeDetectorRef, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, forwardRef, NgModule, APP_INITIALIZER, SkipSelf, Injector, NgModuleFactoryLoader } from '@angular/core';
import { __extends, __spread, __read } from 'tslib';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { Location, CommonModule } from '@angular/common';
import { Router, NavigationStart, ActivatedRoute, ROUTES, RouterModule } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Guard to make sure we have single initialization of forRoot
 */
var /** @type {?} */ LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 */
var /** @type {?} */ RAW_ROUTES = new InjectionToken('RAW_ROUTES');
/**
 * Namespace for fail proof access of CacheMechanism
 */
var CacheMechanism;
/**
 * Namespace for fail proof access of CacheMechanism
 */
(function (CacheMechanism) {
    CacheMechanism.LocalStorage = 'LocalStorage';
    CacheMechanism.Cookie = 'Cookie';
})(CacheMechanism || (CacheMechanism = {}));
/**
 * Boolean to indicate whether to use cached language value
 */
var /** @type {?} */ USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
var /** @type {?} */ CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 */
var /** @type {?} */ CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 */
var /** @type {?} */ DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
var /** @type {?} */ ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
var /** @type {?} */ LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
var LocalizeRouterSettings = /** @class */ (function () {
    /**
     * Settings for localize router
     */
    function LocalizeRouterSettings(useCachedLang, alwaysSetPrefix, cacheMechanism, cacheName, defaultLangFunction) {
        if (useCachedLang === void 0) { useCachedLang = true; }
        if (alwaysSetPrefix === void 0) { alwaysSetPrefix = true; }
        if (cacheMechanism === void 0) { cacheMechanism = CacheMechanism.LocalStorage; }
        if (cacheName === void 0) { cacheName = LOCALIZE_CACHE_NAME; }
        if (defaultLangFunction === void 0) { defaultLangFunction = void 0; }
        this.useCachedLang = useCachedLang;
        this.alwaysSetPrefix = alwaysSetPrefix;
        this.cacheMechanism = cacheMechanism;
        this.cacheName = cacheName;
        this.defaultLangFunction = defaultLangFunction;
    }
    /** @nocollapse */
    LocalizeRouterSettings.ctorParameters = function () { return [
        { type: Boolean, decorators: [{ type: Inject, args: [USE_CACHED_LANG,] }] },
        { type: Boolean, decorators: [{ type: Inject, args: [ALWAYS_SET_PREFIX,] }] },
        { type: CacheMechanism, decorators: [{ type: Inject, args: [CACHE_MECHANISM,] }] },
        { type: String, decorators: [{ type: Inject, args: [CACHE_NAME,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_LANG_FUNCTION,] }] }
    ]; };
    return LocalizeRouterSettings;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
            children = __spread(this.routes); // shallow copy of routes
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
/**
 * Manually set configuration
 */
var  /**
 * Manually set configuration
 */
ManualParserLoader = /** @class */ (function (_super) {
    __extends(ManualParserLoader, _super);
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
var DummyLocalizeParser = /** @class */ (function (_super) {
    __extends(DummyLocalizeParser, _super);
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Localization service
 * modifyRoutes
 */
var LocalizeRouterService = /** @class */ (function () {
    /**
     * CTOR
     */
    function LocalizeRouterService(parser, settings, router, route) {
        this.parser = parser;
        this.settings = settings;
        this.router = router;
        this.route = route;
        this.routerEvents = new Subject();
    }
    /**
     * Start up the service
     */
    /**
     * Start up the service
     * @return {?}
     */
    LocalizeRouterService.prototype.init = /**
     * Start up the service
     * @return {?}
     */
    function () {
        this.router.resetConfig(this.parser.routes);
        // subscribe to router events
        this.router.events
            .pipe(filter(function (event) { return event instanceof NavigationStart; }), pairwise())
            .subscribe(this._routeChanged());
    };
    /**
     * Change language and navigate to translated route
     */
    /**
     * Change language and navigate to translated route
     * @param {?} lang
     * @param {?=} extras
     * @param {?=} useNavigateMethod
     * @return {?}
     */
    LocalizeRouterService.prototype.changeLanguage = /**
     * Change language and navigate to translated route
     * @param {?} lang
     * @param {?=} extras
     * @param {?=} useNavigateMethod
     * @return {?}
     */
    function (lang, extras, useNavigateMethod) {
        var _this = this;
        if (this.route) {
            console.log(this.route);
        }
        if (lang !== this.parser.currentLang) {
            var /** @type {?} */ rootSnapshot_1 = this.router.routerState.snapshot.root;
            this.parser.translateRoutes(lang).subscribe(function () {
                var /** @type {?} */ url = _this.traverseRouteSnapshot(rootSnapshot_1);
                url = /** @type {?} */ (_this.translateRoute(url));
                if (!_this.settings.alwaysSetPrefix) {
                    var /** @type {?} */ urlSegments = url.split('/');
                    var /** @type {?} */ languageSegmentIndex = urlSegments.indexOf(_this.parser.currentLang);
                    // If the default language has no prefix make sure to remove and add it when necessary
                    if (_this.parser.currentLang === _this.parser.defaultLang) {
                        // Remove the language prefix from url when current language is the default language
                        if (languageSegmentIndex === 0 || (languageSegmentIndex === 1 && urlSegments[0] === '')) {
                            // Remove the current aka default language prefix from the url
                            urlSegments = urlSegments.slice(0, languageSegmentIndex).concat(urlSegments.slice(languageSegmentIndex + 1));
                        }
                    }
                    else {
                        // When coming from a default language it's possible that the url doesn't contain the language, make sure it does.
                        if (languageSegmentIndex === -1) {
                            // If the url starts with a slash make sure to keep it.
                            var /** @type {?} */ injectionIndex = urlSegments[0] === '' ? 1 : 0;
                            urlSegments = urlSegments.slice(0, injectionIndex).concat(_this.parser.currentLang, urlSegments.slice(injectionIndex));
                        }
                    }
                    url = urlSegments.join('/');
                }
                _this.router.resetConfig(_this.parser.routes);
                if (useNavigateMethod) {
                    _this.router.navigate([url], extras);
                }
                else {
                    _this.router.navigateByUrl(url, extras);
                }
            });
        }
    };
    /**
     * Traverses through the tree to assemble new translated url
     * @param {?} snapshot
     * @return {?}
     */
    LocalizeRouterService.prototype.traverseRouteSnapshot = /**
     * Traverses through the tree to assemble new translated url
     * @param {?} snapshot
     * @return {?}
     */
    function (snapshot) {
        if (snapshot.firstChild && snapshot.routeConfig) {
            return this.parseSegmentValue(snapshot) + "/" + this.traverseRouteSnapshot(snapshot.firstChild);
        }
        else if (snapshot.firstChild) {
            return this.traverseRouteSnapshot(snapshot.firstChild);
        }
        else {
            return this.parseSegmentValue(snapshot);
        }
        /* if (snapshot.firstChild && snapshot.firstChild.routeConfig && snapshot.firstChild.routeConfig.path) {
              if (snapshot.firstChild.routeConfig.path !== '**') {
                return this.parseSegmentValue(snapshot) + '/' + this.traverseRouteSnapshot(snapshot.firstChild);
              } else {
                return this.parseSegmentValue(snapshot.firstChild);
              }
            }
            return this.parseSegmentValue(snapshot); */
    };
    /**
     * Extracts new segment value based on routeConfig and url
     * @param {?} snapshot
     * @return {?}
     */
    LocalizeRouterService.prototype.parseSegmentValue = /**
     * Extracts new segment value based on routeConfig and url
     * @param {?} snapshot
     * @return {?}
     */
    function (snapshot) {
        if (snapshot.data["localizeRouter"]) {
            var /** @type {?} */ path = snapshot.data["localizeRouter"].path;
            var /** @type {?} */ subPathSegments = path.split('/');
            return subPathSegments.map(function (s, i) { return s.indexOf(':') === 0 ? snapshot.url[i].path : s; }).join('/');
        }
        else {
            return '';
        }
        /* if (snapshot.routeConfig) {
              if (snapshot.routeConfig.path === '**') {
                return snapshot.url.filter((segment: UrlSegment) => segment.path).map((segment: UrlSegment) => segment.path).join('/');
              } else {
                const subPathSegments = snapshot.routeConfig.path.split('/');
                return subPathSegments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
              }
            }
            return ''; */
    };
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     */
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     * @param {?} path
     * @return {?}
     */
    LocalizeRouterService.prototype.translateRoute = /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        if (typeof path === 'string') {
            var /** @type {?} */ url = this.parser.translateRoute(path);
            return !path.indexOf('/') ? "/" + this.parser.urlPrefix + url : url;
        }
        // it's an array
        var /** @type {?} */ result = [];
        (/** @type {?} */ (path)).forEach(function (segment, index) {
            if (typeof segment === 'string') {
                var /** @type {?} */ res = _this.parser.translateRoute(segment);
                if (!index && !segment.indexOf('/')) {
                    result.push("/" + _this.parser.urlPrefix + res);
                }
                else {
                    result.push(res);
                }
            }
            else {
                result.push(segment);
            }
        });
        return result;
    };
    /**
     * Event handler to react on route change
     * @return {?}
     */
    LocalizeRouterService.prototype._routeChanged = /**
     * Event handler to react on route change
     * @return {?}
     */
    function () {
        var _this = this;
        return function (_a) {
            var _b = __read(_a, 2), previousEvent = _b[0], currentEvent = _b[1];
            var /** @type {?} */ previousLang = _this.parser.getLocationLang(previousEvent.url) || _this.parser.defaultLang;
            var /** @type {?} */ currentLang = _this.parser.getLocationLang(currentEvent.url) || _this.parser.defaultLang;
            if (currentLang !== previousLang) {
                _this.parser.translateRoutes(currentLang).subscribe(function () {
                    _this.router.resetConfig(_this.parser.routes);
                    // Fire route change event
                    // Fire route change event
                    _this.routerEvents.next(currentLang);
                });
            }
        };
    };
    /** @nocollapse */
    LocalizeRouterService.ctorParameters = function () { return [
        { type: LocalizeParser, decorators: [{ type: Inject, args: [LocalizeParser,] }] },
        { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] },
        { type: Router, decorators: [{ type: Inject, args: [Router,] }] },
        { type: ActivatedRoute, decorators: [{ type: Inject, args: [ActivatedRoute,] }] }
    ]; };
    return LocalizeRouterService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Compare if two objects are same
 * @param {?} o1
 * @param {?} o2
 * @return {?}
 */
function equals(o1, o2) {
    if (o1 === o2) {
        return true;
    }
    if (o1 === null || o2 === null) {
        return false;
    }
    if (o1 !== o1 && o2 !== o2) {
        return true; // NaN === NaN
    }
    var /** @type {?} */ t1 = typeof o1, /** @type {?} */
    t2 = typeof o2;
    var /** @type {?} */ length, /** @type {?} */
    key, /** @type {?} */
    keySet;
    if (t1 === t2 && t1 === 'object') {
        if (Array.isArray(o1)) {
            if (!Array.isArray(o2)) {
                return false;
            }
            if ((length = o1.length) === o2.length) {
                for (key = 0; key < length; key++) {
                    if (!equals(o1[key], o2[key])) {
                        return false;
                    }
                }
                return true;
            }
        }
        else {
            if (Array.isArray(o2)) {
                return false;
            }
            keySet = Object.create(null);
            for (key in o1) {
                if (o1.hasOwnProperty(key)) {
                    if (!equals(o1[key], o2[key])) {
                        return false;
                    }
                    keySet[key] = true;
                }
            }
            for (key in o2) {
                if (o2.hasOwnProperty(key)) {
                    if (!(key in keySet) && typeof o2[key] !== 'undefined') {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    return false;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ VIEW_DESTROYED_STATE = 128;
var LocalizeRouterPipe = /** @class */ (function () {
    /**
     * CTOR
     */
    function LocalizeRouterPipe(localize, _ref) {
        var _this = this;
        this.localize = localize;
        this._ref = _ref;
        this.value = '';
        this.subscription = this.localize.routerEvents.subscribe(function () {
            _this.transform(_this.lastKey);
        });
    }
    /**
     * @return {?}
     */
    LocalizeRouterPipe.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    /**
     * Transform current url to localized one
     */
    /**
     * Transform current url to localized one
     * @param {?} query
     * @return {?}
     */
    LocalizeRouterPipe.prototype.transform = /**
     * Transform current url to localized one
     * @param {?} query
     * @return {?}
     */
    function (query) {
        if (!query || query.length === 0 || !this.localize.parser.currentLang) {
            return query;
        }
        if (equals(query, this.lastKey) && equals(this.lastLanguage, this.localize.parser.currentLang)) {
            return this.value;
        }
        this.lastKey = query;
        this.lastLanguage = this.localize.parser.currentLang;
        /** translate key and update values */
        this.value = this.localize.translateRoute(query);
        this.lastKey = query;
        // if view is already destroyed, ignore firing change detection
        if ((/** @type {?} */ (this._ref))._view.state & VIEW_DESTROYED_STATE) {
            return this.value;
        }
        this._ref.detectChanges();
        return this.value;
    };
    LocalizeRouterPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'localize',
                    pure: false // required to update the value when the promise is resolved
                },] },
    ];
    /** @nocollapse */
    LocalizeRouterPipe.ctorParameters = function () { return [
        { type: LocalizeRouterService },
        { type: ChangeDetectorRef }
    ]; };
    return LocalizeRouterPipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
var LocalizeRouterConfigLoader = /** @class */ (function (_super) {
    __extends(LocalizeRouterConfigLoader, _super);
    function LocalizeRouterConfigLoader(localize, _compiler, config) {
        var _this = _super.call(this, _compiler, config) || this;
        _this.localize = localize;
        return _this;
    }
    /**
     * Extend load with custom functionality
     */
    /**
     * Extend load with custom functionality
     * @param {?} path
     * @return {?}
     */
    LocalizeRouterConfigLoader.prototype.load = /**
     * Extend load with custom functionality
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        return _super.prototype.load.call(this, path).then(function (factory) {
            return {
                moduleType: factory.moduleType,
                create: function (parentInjector) {
                    var /** @type {?} */ module = factory.create(parentInjector);
                    var /** @type {?} */ getMethod = module.injector.get.bind(module.injector);
                    module.injector['get'] = function (token, notFoundValue) {
                        var /** @type {?} */ getResult = getMethod(token, notFoundValue);
                        if (token === ROUTES) {
                            // translate lazy routes
                            return _this.localize.initChildRoutes([].concat.apply([], __spread(getResult)));
                        }
                        else {
                            return getResult;
                        }
                    };
                    return module;
                }
            };
        });
    };
    LocalizeRouterConfigLoader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LocalizeRouterConfigLoader.ctorParameters = function () { return [
        { type: LocalizeParser, decorators: [{ type: Inject, args: [forwardRef(function () { return LocalizeParser; }),] }] },
        { type: Compiler },
        { type: SystemJsNgModuleLoaderConfig, decorators: [{ type: Optional }] }
    ]; };
    return LocalizeRouterConfigLoader;
}(SystemJsNgModuleLoader));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
/**
 * @param {?} p
 * @param {?} parser
 * @param {?} routes
 * @return {?}
 */
function getAppInitializer(p, parser, routes) {
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
/**
 * @param {?} localizeRouterModule
 * @return {?}
 */
function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error("LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.");
    }
    return 'guarded';
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ParserInitializer, getAppInitializer, LocalizeRouterModule, provideForRootGuard, LocalizeParser, ManualParserLoader, DummyLocalizeParser, LocalizeRouterService, LocalizeRouterPipe, LOCALIZE_ROUTER_FORROOT_GUARD, RAW_ROUTES, CacheMechanism, USE_CACHED_LANG, CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, ALWAYS_SET_PREFIX, LocalizeRouterSettings, LocalizeRouterConfigLoader };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1uZ3gtdHJhbnNsYXRlLXJvdXRlci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnNlcnZpY2UudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi91dGlsLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnBpcGUudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyIsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLm1vZHVsZSc7XG5cbi8qKlxuICogR3VhcmQgdG8gbWFrZSBzdXJlIHdlIGhhdmUgc2luZ2xlIGluaXRpYWxpemF0aW9uIG9mIGZvclJvb3RcbiAqL1xuZXhwb3J0IGNvbnN0IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJEID0gbmV3IEluamVjdGlvblRva2VuPExvY2FsaXplUm91dGVyTW9kdWxlPignTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQnKTtcblxuLyoqXG4gKiBTdGF0aWMgcHJvdmlkZXIgZm9yIGtlZXBpbmcgdHJhY2sgb2Ygcm91dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBSQVdfUk9VVEVTOiBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48Um91dGVzW10+KCdSQVdfUk9VVEVTJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgQ2FjaGluZyBvZiBkZWZhdWx0IGxhbmd1YWdlXG4gKi9cbmV4cG9ydCB0eXBlIENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZScgfCAnQ29va2llJztcblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIGZhaWwgcHJvb2YgYWNjZXNzIG9mIENhY2hlTWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2FjaGVNZWNoYW5pc20ge1xuICBleHBvcnQgY29uc3QgTG9jYWxTdG9yYWdlOiBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnO1xuICBleHBvcnQgY29uc3QgQ29va2llOiBDYWNoZU1lY2hhbmlzbSA9ICdDb29raWUnO1xufVxuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciB0byB1c2UgY2FjaGVkIGxhbmd1YWdlIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBVU0VfQ0FDSEVEX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ1VTRV9DQUNIRURfTEFORycpO1xuLyoqXG4gKiBDYWNoZSBtZWNoYW5pc20gdHlwZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTUVDSEFOSVNNID0gbmV3IEluamVjdGlvblRva2VuPENhY2hlTWVjaGFuaXNtPignQ0FDSEVfTUVDSEFOSVNNJyk7XG4vKipcbiAqIENhY2hlIG5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IENBQ0hFX05BTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignQ0FDSEVfTkFNRScpO1xuXG4vKipcbiAqIFR5cGUgZm9yIGRlZmF1bHQgbGFuZ3VhZ2UgZnVuY3Rpb25cbiAqIFVzZWQgdG8gb3ZlcnJpZGUgYmFzaWMgYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCB0eXBlIERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gKGxhbmd1YWdlczogc3RyaW5nW10sIGNhY2hlZExhbmc/OiBzdHJpbmcsIGJyb3dzZXJMYW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogRnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFOR19GVU5DVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbj4oJ0RFRkFVTFRfTEFOR19GVU5DVElPTicpO1xuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciBwcmVmaXggc2hvdWxkIGJlIHNldCBmb3Igc2luZ2xlIGxhbmd1YWdlIHNjZW5hcmlvc1xuICovXG5leHBvcnQgY29uc3QgQUxXQVlTX1NFVF9QUkVGSVggPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0FMV0FZU19TRVRfUFJFRklYJyk7XG5cbi8qKlxuICogQ29uZmlnIGludGVyZmFjZSBmb3IgTG9jYWxpemVSb3V0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIHBhcnNlcj86IFByb3ZpZGVyO1xuICB1c2VDYWNoZWRMYW5nPzogYm9vbGVhbjtcbiAgY2FjaGVNZWNoYW5pc20/OiBDYWNoZU1lY2hhbmlzbTtcbiAgY2FjaGVOYW1lPzogc3RyaW5nO1xuICBkZWZhdWx0TGFuZ0Z1bmN0aW9uPzogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb247XG4gIGFsd2F5c1NldFByZWZpeD86IGJvb2xlYW47XG59XG5cbmNvbnN0IExPQ0FMSVpFX0NBQ0hFX05BTUUgPSAnTE9DQUxJWkVfREVGQVVMVF9MQU5HVUFHRSc7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIGltcGxlbWVudHMgTG9jYWxpemVSb3V0ZXJDb25maWcge1xuICAvKipcbiAgICogU2V0dGluZ3MgZm9yIGxvY2FsaXplIHJvdXRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChVU0VfQ0FDSEVEX0xBTkcpIHB1YmxpYyB1c2VDYWNoZWRMYW5nOiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KEFMV0FZU19TRVRfUFJFRklYKSBwdWJsaWMgYWx3YXlzU2V0UHJlZml4OiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KENBQ0hFX01FQ0hBTklTTSkgcHVibGljIGNhY2hlTWVjaGFuaXNtOiBDYWNoZU1lY2hhbmlzbSA9IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSxcbiAgICBASW5qZWN0KENBQ0hFX05BTUUpIHB1YmxpYyBjYWNoZU5hbWU6IHN0cmluZyA9IExPQ0FMSVpFX0NBQ0hFX05BTUUsXG4gICAgQEluamVjdChERUZBVUxUX0xBTkdfRlVOQ1RJT04pIHB1YmxpYyBkZWZhdWx0TGFuZ0Z1bmN0aW9uOiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IHZvaWQgMFxuICApIHtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm91dGVzLCBSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2FjaGVNZWNoYW5pc20sIExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmNvbnN0IENPT0tJRV9FWFBJUlkgPSAzMDsgLy8gMSBtb250aFxuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIGZvciBwYXJzaW5nIGxvY2FsaXphdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9jYWxpemVQYXJzZXIge1xuICBsb2NhbGVzOiBBcnJheTxzdHJpbmc+O1xuICBjdXJyZW50TGFuZzogc3RyaW5nO1xuICByb3V0ZXM6IFJvdXRlcztcbiAgZGVmYXVsdExhbmc6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfdHJhbnNsYXRpb25PYmplY3Q6IGFueTtcbiAgcHJpdmF0ZSBfd2lsZGNhcmRSb3V0ZTogUm91dGU7XG4gIHByaXZhdGUgX2xhbmd1YWdlUm91dGU6IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBMb2FkZXIgY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVHJhbnNsYXRlU2VydmljZSkgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXG4gICAgQEluamVjdChMb2NhdGlvbikgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwcml2YXRlIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSB7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCByb3V0ZXMgYW5kIGZldGNoIG5lY2Vzc2FyeSBkYXRhXG4gICAqL1xuICBhYnN0cmFjdCBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+O1xuXG4gIC8qKlxuICogUHJlcGFyZSByb3V0ZXMgdG8gYmUgZnVsbHkgdXNhYmxlIGJ5IG5neC10cmFuc2xhdGUtcm91dGVyXG4gKiBAcGFyYW0gcm91dGVzXG4gKi9cbiAgLyogcHJpdmF0ZSBpbml0Um91dGVzKHJvdXRlczogUm91dGVzLCBwcmVmaXggPSAnJykge1xuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIuZnVsbFBhdGggPSBgJHtwcmVmaXh9LyR7cm91dGUucGF0aH1gO1xuICAgICAgICBpZiAocm91dGUuY2hpbGRyZW4gJiYgcm91dGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZS5jaGlsZHJlbiwgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9ICovXG5cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBsYW5ndWFnZSBhbmQgcm91dGVzXG4gICAqL1xuICBwcm90ZWN0ZWQgaW5pdChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IHNlbGVjdGVkTGFuZ3VhZ2U6IHN0cmluZztcblxuICAgIC8vIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZXMpO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzO1xuXG4gICAgaWYgKCF0aGlzLmxvY2FsZXMgfHwgIXRoaXMubG9jYWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLyoqIGRldGVjdCBjdXJyZW50IGxhbmd1YWdlICovXG4gICAgY29uc3QgbG9jYXRpb25MYW5nID0gdGhpcy5nZXRMb2NhdGlvbkxhbmcoKTtcbiAgICBjb25zdCBicm93c2VyTGFuZyA9IHRoaXMuX2dldEJyb3dzZXJMYW5nKCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKHRoaXMubG9jYWxlcywgdGhpcy5fY2FjaGVkTGFuZywgYnJvd3NlckxhbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5fY2FjaGVkTGFuZyB8fCBicm93c2VyTGFuZyB8fCB0aGlzLmxvY2FsZXNbMF07XG4gICAgfVxuICAgIHNlbGVjdGVkTGFuZ3VhZ2UgPSBsb2NhdGlvbkxhbmcgfHwgdGhpcy5kZWZhdWx0TGFuZztcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyh0aGlzLmRlZmF1bHRMYW5nKTtcblxuICAgIGxldCBjaGlsZHJlbjogUm91dGVzID0gW107XG4gICAgLyoqIGlmIHNldCBwcmVmaXggaXMgZW5mb3JjZWQgKi9cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIGNvbnN0IGJhc2VSb3V0ZSA9IHsgcGF0aDogJycsIHJlZGlyZWN0VG86IHRoaXMuZGVmYXVsdExhbmcsIHBhdGhNYXRjaDogJ2Z1bGwnIH07XG5cbiAgICAgIC8qKiBleHRyYWN0IHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xuICAgICAgY29uc3Qgd2lsZGNhcmRJbmRleCA9IHJvdXRlcy5maW5kSW5kZXgoKHJvdXRlOiBSb3V0ZSkgPT4gcm91dGUucGF0aCA9PT0gJyoqJyk7XG4gICAgICBpZiAod2lsZGNhcmRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fd2lsZGNhcmRSb3V0ZSA9IHJvdXRlcy5zcGxpY2Uod2lsZGNhcmRJbmRleCwgMSlbMF07XG4gICAgICB9XG4gICAgICBjaGlsZHJlbiA9IHRoaXMucm91dGVzLnNwbGljZSgwLCB0aGlzLnJvdXRlcy5sZW5ndGgsIGJhc2VSb3V0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkcmVuID0gWy4uLnRoaXMucm91dGVzXTsgLy8gc2hhbGxvdyBjb3B5IG9mIHJvdXRlc1xuICAgIH1cblxuICAgIC8qKiBleGNsdWRlIGNlcnRhaW4gcm91dGVzICovXG4gICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0uZGF0YSAmJiBjaGlsZHJlbltpXS5kYXRhWydza2lwUm91dGVMb2NhbGl6YXRpb24nXSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICAvLyBhZGQgZGlyZWN0bHkgdG8gcm91dGVzXG4gICAgICAgICAgdGhpcy5yb3V0ZXMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBhcHBlbmQgY2hpbGRyZW4gcm91dGVzICovXG4gICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMubG9jYWxlcy5sZW5ndGggPiAxIHx8IHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUgPSB7IGNoaWxkcmVuOiBjaGlsZHJlbiB9O1xuICAgICAgICB0aGlzLnJvdXRlcy51bnNoaWZ0KHRoaXMuX2xhbmd1YWdlUm91dGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiAuLi5hbmQgcG90ZW50aWFsIHdpbGRjYXJkIHJvdXRlICovXG4gICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIHRoaXMucm91dGVzLnB1c2godGhpcy5fd2lsZGNhcmRSb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqIHRyYW5zbGF0ZSByb3V0ZXMgKi9cbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlcyhzZWxlY3RlZExhbmd1YWdlKTtcbiAgICByZXR1cm4gcmVzLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgaW5pdENoaWxkUm91dGVzKHJvdXRlczogUm91dGVzKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlcyk7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGVzIHRvIHNlbGVjdGVkIGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZXMobGFuZ3VhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPGFueT4oKG9ic2VydmVyOiBPYnNlcnZlcjxhbnk+KSA9PiB7XG4gICAgICB0aGlzLl9jYWNoZWRMYW5nID0gbGFuZ3VhZ2U7XG4gICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICB0aGlzLl9sYW5ndWFnZVJvdXRlLnBhdGggPSBsYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKGxhbmd1YWdlKS5zdWJzY3JpYmUoKHRyYW5zbGF0aW9uczogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0ID0gdHJhbnNsYXRpb25zO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5nID0gbGFuZ3VhZ2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMuX2xhbmd1YWdlUm91dGUuY2hpbGRyZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyB3aWxkY2FyZCByb3V0ZVxuICAgICAgICAgIGlmICh0aGlzLl93aWxkY2FyZFJvdXRlICYmIHRoaXMuX3dpbGRjYXJkUm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkodGhpcy5fd2lsZGNhcmRSb3V0ZSwgJ3JlZGlyZWN0VG8nLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMucm91dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm5leHQodm9pZCAwKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0aGUgcm91dGUgbm9kZSBhbmQgcmVjdXJzaXZlbHkgY2FsbCBmb3IgYWxsIGl0J3MgY2hpbGRyZW5cbiAgICovXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXM6IFJvdXRlcyk6IHZvaWQge1xuICAgIHJvdXRlcy5mb3JFYWNoKChyb3V0ZTogUm91dGUpID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICYmIHJvdXRlLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkocm91dGUsICdwYXRoJyk7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3JlZGlyZWN0VG8nLCAhcm91dGUucmVkaXJlY3RUby5pbmRleE9mKCcvJykpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZS5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUubG9hZENoaWxkcmVuICYmICg8YW55PnJvdXRlKS5fbG9hZGVkQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSgoPGFueT5yb3V0ZSkuX2xvYWRlZENvbmZpZy5yb3V0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBwcm9wZXJ0eVxuICAgKiBJZiBmaXJzdCB0aW1lIHRyYW5zbGF0aW9uIHRoZW4gYWRkIG9yaWdpbmFsIHRvIHJvdXRlIGRhdGEgb2JqZWN0XG4gICAqL1xuICBwcml2YXRlIF90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZTogUm91dGUsIHByb3BlcnR5OiBzdHJpbmcsIHByZWZpeExhbmc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gc2V0IHByb3BlcnR5IHRvIGRhdGEgaWYgbm90IHRoZXJlIHlldFxuICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgaWYgKCFyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0pIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0gPSAoPGFueT5yb3V0ZSlbcHJvcGVydHldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlUm91dGUocm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSk7XG4gICAgKDxhbnk+cm91dGUpW3Byb3BlcnR5XSA9IHByZWZpeExhbmcgPyBgLyR7dGhpcy51cmxQcmVmaXh9JHtyZXN1bHR9YCA6IHJlc3VsdDtcbiAgfVxuXG4gIGdldCB1cmxQcmVmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4IHx8IHRoaXMuY3VycmVudExhbmcgIT09IHRoaXMuZGVmYXVsdExhbmcgPyB0aGlzLmN1cnJlbnRMYW5nIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIGFuZCByZXR1cm4gb2JzZXJ2YWJsZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVBhcnRzID0gcGF0aC5zcGxpdCgnPycpO1xuICAgIGlmIChxdWVyeVBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGVyZSBzaG91bGQgYmUgb25seSBvbmUgcXVlcnkgcGFyYW1ldGVyIGJsb2NrIGluIHRoZSBVUkwnKTtcbiAgICB9XG4gICAgY29uc3QgcGF0aFNlZ21lbnRzID0gcXVlcnlQYXJ0c1swXS5zcGxpdCgnLycpO1xuXG4gICAgLyoqIGNvbGxlY3Qgb2JzZXJ2YWJsZXMgICovXG4gICAgcmV0dXJuIHBhdGhTZWdtZW50c1xuICAgICAgLm1hcCgocGFydDogc3RyaW5nKSA9PiBwYXJ0Lmxlbmd0aCA/IHRoaXMudHJhbnNsYXRlVGV4dChwYXJ0KSA6IHBhcnQpXG4gICAgICAuam9pbignLycpICtcbiAgICAgIChxdWVyeVBhcnRzLmxlbmd0aCA+IDEgPyBgPyR7cXVlcnlQYXJ0c1sxXX1gIDogJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIHVybFxuICAgKi9cbiAgZ2V0TG9jYXRpb25MYW5nKHVybD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlQYXJhbVNwbGl0ID0gKHVybCB8fCB0aGlzLmxvY2F0aW9uLnBhdGgoKSkuc3BsaXQoJz8nKTtcbiAgICBsZXQgcGF0aFNsaWNlczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAocXVlcnlQYXJhbVNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhdGhTbGljZXMgPSBxdWVyeVBhcmFtU3BsaXRbMF0uc3BsaXQoJy8nKTtcbiAgICB9XG4gICAgaWYgKHBhdGhTbGljZXMubGVuZ3RoID4gMSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzFdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBwYXRoU2xpY2VzWzFdO1xuICAgIH1cbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YocGF0aFNsaWNlc1swXSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHVzZXIncyBsYW5ndWFnZSBzZXQgaW4gdGhlIGJyb3dzZXJcbiAgICovXG4gIHByaXZhdGUgX2dldEJyb3dzZXJMYW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHRoaXMudHJhbnNsYXRlLmdldEJyb3dzZXJMYW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXG4gICAqL1xuICBwcml2YXRlIGdldCBfY2FjaGVkTGFuZygpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aENvb2tpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBsYW5ndWFnZSB0byBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxuICAgKi9cbiAgcHJpdmF0ZSBzZXQgX2NhY2hlZExhbmcodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Db29raWUpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aENvb2tpZXModmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB2YWx1ZSB0byBsb2NhbCBzdG9yYWdlXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UodmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHdlaXJkIFNhZmFyaSBpc3N1ZSBpbiBwcml2YXRlIG1vZGUsIHdoZXJlIExvY2FsU3RvcmFnZSBpcyBkZWZpbmVkIGJ1dCB0aHJvd3MgZXJyb3Igb24gYWNjZXNzXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHZhbHVlIHZpYSBjb29raWVzXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhDb29raWVzKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQuY29va2llID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSk7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgY29uc3QgZDogRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIENPT0tJRV9FWFBJUlkgKiA4NjQwMDAwMCk7IC8vICogZGF5c1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke2VuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9O2V4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86XicgKyBuYW1lICsgJ3w7XFxcXHMqJyArIG5hbWUgKyAnKT0oLio/KSg/Ojt8JCknLCAnZycpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVnZXhwLmV4ZWMoZG9jdW1lbnQuY29va2llKTtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzFdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm47IC8vIHNob3VsZCBub3QgaGFwcGVuIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHZhbHVlIGV4aXN0cyBpbiBsb2NhbGVzIGxpc3RcbiAgICovXG4gIHByaXZhdGUgX3JldHVybklmSW5Mb2NhbGVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0cmFuc2xhdGVkIHZhbHVlXG4gICAqL1xuICBwcml2YXRlIHRyYW5zbGF0ZVRleHQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5fdHJhbnNsYXRpb25PYmplY3QpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLnByZWZpeCArIGtleTtcbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZS5nZXRQYXJzZWRSZXN1bHQodGhpcy5fdHJhbnNsYXRpb25PYmplY3QsIGZ1bGxLZXkpO1xuICAgIHJldHVybiByZXMgIT09IGZ1bGxLZXkgPyByZXMgOiBrZXk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYW51YWxseSBzZXQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgTWFudWFsUGFyc2VyTG9hZGVyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsIGxvY2F0aW9uOiBMb2NhdGlvbiwgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgbG9jYWxlczogc3RyaW5nW10gPSBbJ2VuJ10sIHByZWZpeDogc3RyaW5nID0gJ1JPVVRFUy4nKSB7XG4gICAgc3VwZXIodHJhbnNsYXRlLCBsb2NhdGlvbiwgc2V0dGluZ3MpO1xuICAgIHRoaXMubG9jYWxlcyA9IGxvY2FsZXM7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXggfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBvciBhcHBlbmQgcm91dGVzXG4gICAqL1xuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRHVtbXlMb2NhbGl6ZVBhcnNlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIFVybFNlZ21lbnQsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBzZXJ2aWNlXG4gKiBtb2RpZnlSb3V0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2VydmljZSB7XG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoTG9jYWxpemVQYXJzZXIpIHB1YmxpYyBwYXJzZXI6IExvY2FsaXplUGFyc2VyLFxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICBASW5qZWN0KFJvdXRlcikgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIEBJbmplY3QoQWN0aXZhdGVkUm91dGUpIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXG4gICAgKSB7XG4gICAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxuICAgKi9cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcbiAgICAgICAgcGFpcndpc2UoKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIGxhbmd1YWdlIGFuZCBuYXZpZ2F0ZSB0byB0cmFuc2xhdGVkIHJvdXRlXG4gICAqL1xuICBjaGFuZ2VMYW5ndWFnZShsYW5nOiBzdHJpbmcsIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXMsIHVzZU5hdmlnYXRlTWV0aG9kPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlKTtcbiAgICB9XG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICBjb25zdCByb290U25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC5yb290O1xuXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcblxuICAgICAgICBsZXQgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KTtcbiAgICAgICAgdXJsID0gdGhpcy50cmFuc2xhdGVSb3V0ZSh1cmwpIGFzIHN0cmluZztcblxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgbGV0IHVybFNlZ21lbnRzID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgbGFuZ3VhZ2VTZWdtZW50SW5kZXggPSB1cmxTZWdtZW50cy5pbmRleE9mKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVmYXVsdCBsYW5ndWFnZSBoYXMgbm8gcHJlZml4IG1ha2Ugc3VyZSB0byByZW1vdmUgYW5kIGFkZCBpdCB3aGVuIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5jdXJyZW50TGFuZyA9PT0gdGhpcy5wYXJzZXIuZGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdXJsIHdoZW4gY3VycmVudCBsYW5ndWFnZSBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZVxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAwIHx8IChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMSAmJiB1cmxTZWdtZW50c1swXSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBha2EgZGVmYXVsdCBsYW5ndWFnZSBwcmVmaXggZnJvbSB0aGUgdXJsXG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgbGFuZ3VhZ2VTZWdtZW50SW5kZXgpLmNvbmNhdCh1cmxTZWdtZW50cy5zbGljZShsYW5ndWFnZVNlZ21lbnRJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2hlbiBjb21pbmcgZnJvbSBhIGRlZmF1bHQgbGFuZ3VhZ2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSB1cmwgZG9lc24ndCBjb250YWluIHRoZSBsYW5ndWFnZSwgbWFrZSBzdXJlIGl0IGRvZXMuXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgc3RhcnRzIHdpdGggYSBzbGFzaCBtYWtlIHN1cmUgdG8ga2VlcCBpdC5cbiAgICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9uSW5kZXggPSB1cmxTZWdtZW50c1swXSA9PT0gJycgPyAxIDogMDtcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBpbmplY3Rpb25JbmRleCkuY29uY2F0KHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nLCB1cmxTZWdtZW50cy5zbGljZShpbmplY3Rpb25JbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cmwgPSB1cmxTZWdtZW50cy5qb2luKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICBpZiAodXNlTmF2aWdhdGVNZXRob2QpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSwgZXh0cmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCwgZXh0cmFzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aHJvdWdoIHRoZSB0cmVlIHRvIGFzc2VtYmxlIG5ldyB0cmFuc2xhdGVkIHVybFxuICAgKi9cbiAgcHJpdmF0ZSB0cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuXG4gICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KX0vJHt0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKX1gO1xuICAgIH0gZWxzZSBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgLyogaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGgpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpICsgJy8nICsgdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIG5ldyBzZWdtZW50IHZhbHVlIGJhc2VkIG9uIHJvdXRlQ29uZmlnIGFuZCB1cmxcbiAgICovXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIGlmIChzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICBjb25zdCBwYXRoID0gc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlci5wYXRoO1xuICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8qIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGggPT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHNuYXBzaG90LnVybC5maWx0ZXIoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkubWFwKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLmpvaW4oJy8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7ICovXG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIHRvIGN1cnJlbnQgbGFuZ3VhZ2VcbiAgICogSWYgbmV3IGxhbmd1YWdlIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQgdGhlbiByZXBsYWNlIGxhbmd1YWdlIHBhcnQgaW4gdXJsIHdpdGggbmV3IGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShwYXRoKTtcbiAgICAgIHJldHVybiAhcGF0aC5pbmRleE9mKCcvJykgPyBgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7dXJsfWAgOiB1cmw7XG4gICAgfVxuICAgIC8vIGl0J3MgYW4gYXJyYXlcbiAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gICAgKHBhdGggYXMgQXJyYXk8YW55PikuZm9yRWFjaCgoc2VnbWVudDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHNlZ21lbnQpO1xuICAgICAgICBpZiAoIWluZGV4ICYmICFzZWdtZW50LmluZGV4T2YoJy8nKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHtyZXN9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IG9uIHJvdXRlIGNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBfcm91dGVDaGFuZ2VkKCk6IChldmVudFBhaXI6IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHZvaWQge1xuICAgIHJldHVybiAoW3ByZXZpb3VzRXZlbnQsIGN1cnJlbnRFdmVudF06IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhwcmV2aW91c0V2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG4gICAgICBjb25zdCBjdXJyZW50TGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhjdXJyZW50RXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcblxuICAgICAgaWYgKGN1cnJlbnRMYW5nICE9PSBwcmV2aW91c0xhbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGN1cnJlbnRMYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgICAgLy8gRmlyZSByb3V0ZSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICB0aGlzLnJvdXRlckV2ZW50cy5uZXh0KGN1cnJlbnRMYW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwiLyoqXG4gKiBDb21wYXJlIGlmIHR3byBvYmplY3RzIGFyZSBzYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbHMobzE6IGFueSwgbzI6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAobzEgPT09IG8yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG8xID09PSBudWxsIHx8IG8yID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvMSAhPT0gbzEgJiYgbzIgIT09IG8yKSB7XG4gICAgcmV0dXJuIHRydWU7IC8vIE5hTiA9PT0gTmFOXG4gIH1cbiAgY29uc3QgdDEgPSB0eXBlb2YgbzEsXG4gICAgdDIgPSB0eXBlb2YgbzI7XG4gIGxldCBsZW5ndGg6IG51bWJlcixcbiAgICBrZXk6IGFueSxcbiAgICBrZXlTZXQ6IGFueTtcblxuICBpZiAodDEgPT09IHQyICYmIHQxID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG8xKSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG8yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKGxlbmd0aCA9IG8xLmxlbmd0aCkgPT09IG8yLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICBpZiAoIWVxdWFscyhvMVtrZXldLCBvMltrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobzIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGtleVNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBmb3IgKGtleSBpbiBvMSkge1xuICAgICAgICBpZiAobzEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmICghZXF1YWxzKG8xW2tleV0sIG8yW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGtleVNldFtrZXldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gbzIpIHtcbiAgICAgICAgaWYgKG8yLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoIShrZXkgaW4ga2V5U2V0KSAmJiB0eXBlb2YgbzJba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJpbXBvcnQgeyBQaXBlVHJhbnNmb3JtLCBQaXBlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZXF1YWxzIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgVklFV19ERVNUUk9ZRURfU1RBVEUgPSAxMjg7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2xvY2FsaXplJyxcbiAgcHVyZTogZmFsc2UgLy8gcmVxdWlyZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0sIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdmFsdWU6IHN0cmluZyB8IGFueVtdID0gJyc7XG4gIHByaXZhdGUgbGFzdEtleTogc3RyaW5nIHwgYW55W107XG4gIHByaXZhdGUgbGFzdExhbmd1YWdlOiBzdHJpbmc7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2NhbGl6ZS5yb3V0ZXJFdmVudHMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMubGFzdEtleSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBjdXJyZW50IHVybCB0byBsb2NhbGl6ZWQgb25lXG4gICAqL1xuICB0cmFuc2Zvcm0ocXVlcnk6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICghcXVlcnkgfHwgcXVlcnkubGVuZ3RoID09PSAwIHx8ICF0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykge1xuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgICBpZiAoZXF1YWxzKHF1ZXJ5LCB0aGlzLmxhc3RLZXkpICYmIGVxdWFscyh0aGlzLmxhc3RMYW5ndWFnZSwgdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgdGhpcy5sYXN0TGFuZ3VhZ2UgPSB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZztcblxuICAgIC8qKiB0cmFuc2xhdGUga2V5IGFuZCB1cGRhdGUgdmFsdWVzICovXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubG9jYWxpemUudHJhbnNsYXRlUm91dGUocXVlcnkpO1xuICAgIHRoaXMubGFzdEtleSA9IHF1ZXJ5O1xuICAgIC8vIGlmIHZpZXcgaXMgYWxyZWFkeSBkZXN0cm95ZWQsIGlnbm9yZSBmaXJpbmcgY2hhbmdlIGRldGVjdGlvblxuICAgIGlmICgoPGFueT4gdGhpcy5fcmVmKS5fdmlldy5zdGF0ZSAmIFZJRVdfREVTVFJPWUVEX1NUQVRFKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUk9VVEVTIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIsIE5nTW9kdWxlRmFjdG9yeSwgSW5qZWN0b3IsXG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcsIE9wdGlvbmFsLCBDb21waWxlciwgSW5qZWN0YWJsZSwgSW5qZWN0LCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuXG4vKipcbiAqIEV4dGVuc2lvbiBvZiBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIHRvIGVuYWJsZSBsb2NhbGl6YXRpb24gb2Ygcm91dGUgb24gbGF6eSBsb2FkXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciBleHRlbmRzIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIge1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBMb2NhbGl6ZVBhcnNlcikpIHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUGFyc2VyLFxuICAgIF9jb21waWxlcjogQ29tcGlsZXIsIEBPcHRpb25hbCgpIGNvbmZpZz86IFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcpIHtcbiAgICAgIHN1cGVyKF9jb21waWxlciwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlbmQgbG9hZCB3aXRoIGN1c3RvbSBmdW5jdGlvbmFsaXR5XG4gICAqL1xuICBsb2FkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PGFueT4+IHtcbiAgICByZXR1cm4gc3VwZXIubG9hZChwYXRoKS50aGVuKChmYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8YW55PikgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbW9kdWxlVHlwZTogZmFjdG9yeS5tb2R1bGVUeXBlLFxuICAgICAgICBjcmVhdGU6IChwYXJlbnRJbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICAgICAgICBjb25zdCBtb2R1bGUgPSBmYWN0b3J5LmNyZWF0ZShwYXJlbnRJbmplY3Rvcik7XG4gICAgICAgICAgY29uc3QgZ2V0TWV0aG9kID0gbW9kdWxlLmluamVjdG9yLmdldC5iaW5kKG1vZHVsZS5pbmplY3Rvcik7XG5cbiAgICAgICAgICBtb2R1bGUuaW5qZWN0b3JbJ2dldCddID0gKHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2V0UmVzdWx0ID0gZ2V0TWV0aG9kKHRva2VuLCBub3RGb3VuZFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRva2VuID09PSBST1VURVMpIHtcbiAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlIGxhenkgcm91dGVzXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsaXplLmluaXRDaGlsZFJvdXRlcyhbXS5jb25jYXQoLi4uZ2V0UmVzdWx0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIEFQUF9JTklUSUFMSVpFUiwgT3B0aW9uYWwsIFNraXBTZWxmLFxuICBJbmplY3RhYmxlLCBJbmplY3RvciwgTmdNb2R1bGVGYWN0b3J5TG9hZGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBEdW1teUxvY2FsaXplUGFyc2VyLCBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclBpcGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5waXBlJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFMV0FZU19TRVRfUFJFRklYLFxuICBDQUNIRV9NRUNIQU5JU00sIENBQ0hFX05BTUUsIERFRkFVTFRfTEFOR19GVU5DVElPTiwgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsIExvY2FsaXplUm91dGVyQ29uZmlnLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICBSQVdfUk9VVEVTLFxuICBVU0VfQ0FDSEVEX0xBTkdcbn0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQYXJzZXJJbml0aWFsaXplciB7XG4gIHBhcnNlcjogTG9jYWxpemVQYXJzZXI7XG4gIHJvdXRlczogUm91dGVzO1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge1xuICB9XG5cbiAgYXBwSW5pdGlhbGl6ZXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci5sb2FkKHRoaXMucm91dGVzKTtcbiAgICByZXMudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxpemVSb3V0ZXJTZXJ2aWNlKTtcbiAgICAgIGxvY2FsaXplLmluaXQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiAoKSA9PiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpO1xuICAgIHJldHVybiB0aGlzLmFwcEluaXRpYWxpemVyO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBJbml0aWFsaXplcihwOiBQYXJzZXJJbml0aWFsaXplciwgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6IGFueSB7XG4gIHJldHVybiBwLmdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyLCByb3V0ZXMpLmJpbmQocCk7XG59XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFJvdXRlck1vZHVsZSwgVHJhbnNsYXRlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTG9jYWxpemVSb3V0ZXJQaXBlXSxcbiAgZXhwb3J0czogW0xvY2FsaXplUm91dGVyUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJNb2R1bGUge1xuXG4gIHN0YXRpYyBmb3JSb290KHJvdXRlczogUm91dGVzLCBjb25maWc6IExvY2FsaXplUm91dGVyQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBwcm92aWRlRm9yUm9vdEd1YXJkLFxuICAgICAgICAgIGRlcHM6IFtbTG9jYWxpemVSb3V0ZXJNb2R1bGUsIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVVNFX0NBQ0hFRF9MQU5HLCB1c2VWYWx1ZTogY29uZmlnLnVzZUNhY2hlZExhbmcgfSxcbiAgICAgICAgeyBwcm92aWRlOiBBTFdBWVNfU0VUX1BSRUZJWCwgdXNlVmFsdWU6IGNvbmZpZy5hbHdheXNTZXRQcmVmaXggfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9OQU1FLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTmFtZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENBQ0hFX01FQ0hBTklTTSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU1lY2hhbmlzbSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERFRkFVTFRfTEFOR19GVU5DVElPTiwgdXNlVmFsdWU6IGNvbmZpZy5kZWZhdWx0TGFuZ0Z1bmN0aW9uIH0sXG4gICAgICAgIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICAgIGNvbmZpZy5wYXJzZXIgfHwgeyBwcm92aWRlOiBMb2NhbGl6ZVBhcnNlciwgdXNlQ2xhc3M6IER1bW15TG9jYWxpemVQYXJzZXIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xuICAgICAgICB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNlcnZpY2UsXG4gICAgICAgIFBhcnNlckluaXRpYWxpemVyLFxuICAgICAgICB7IHByb3ZpZGU6IE5nTW9kdWxlRmFjdG9yeUxvYWRlciwgdXNlQ2xhc3M6IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlRmFjdG9yeTogZ2V0QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW1BhcnNlckluaXRpYWxpemVyLCBMb2NhbGl6ZVBhcnNlciwgUkFXX1JPVVRFU11cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yQ2hpbGQocm91dGVzOiBSb3V0ZXMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVGb3JSb290R3VhcmQobG9jYWxpemVSb3V0ZXJNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlKTogc3RyaW5nIHtcbiAgaWYgKGxvY2FsaXplUm91dGVyTW9kdWxlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYExvY2FsaXplUm91dGVyTW9kdWxlLmZvclJvb3QoKSBjYWxsZWQgdHdpY2UuIExhenkgbG9hZGVkIG1vZHVsZXMgc2hvdWxkIHVzZSBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JDaGlsZCgpIGluc3RlYWQuYCk7XG4gIH1cbiAgcmV0dXJuICdndWFyZGVkJztcbn1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fZXh0ZW5kcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7OztBQU9BLHFCQUFhLDZCQUE2QixHQUFHLElBQUksY0FBYyxDQUF1QiwrQkFBK0IsQ0FBQyxDQUFDOzs7O0FBS3ZILHFCQUFhLFVBQVUsR0FBNkIsSUFB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