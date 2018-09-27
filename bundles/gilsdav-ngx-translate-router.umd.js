(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ngx-translate/core'), require('rxjs'), require('@angular/common'), require('@angular/router'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@gilsdav/ngx-translate-router', ['exports', '@angular/core', '@ngx-translate/core', 'rxjs', '@angular/common', '@angular/router', 'rxjs/operators'], factory) :
    (factory((global.gilsdav = global.gilsdav || {}, global.gilsdav['ngx-translate-router'] = {}),global.ng.core,null,global.rxjs,global.ng.common,global.ng.router,global.rxjs.operators));
}(this, (function (exports,core,core$1,rxjs,common,router,operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Guard to make sure we have single initialization of forRoot
     */
    var /** @type {?} */ LOCALIZE_ROUTER_FORROOT_GUARD = new core.InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
    /**
     * Static provider for keeping track of routes
     */
    var /** @type {?} */ RAW_ROUTES = new core.InjectionToken('RAW_ROUTES');
    /**
     * Namespace for fail proof access of CacheMechanism
     */
    (function (CacheMechanism) {
        CacheMechanism.LocalStorage = 'LocalStorage';
        CacheMechanism.Cookie = 'Cookie';
    })(exports.CacheMechanism || (exports.CacheMechanism = {}));
    /**
     * Boolean to indicate whether to use cached language value
     */
    var /** @type {?} */ USE_CACHED_LANG = new core.InjectionToken('USE_CACHED_LANG');
    /**
     * Cache mechanism type
     */
    var /** @type {?} */ CACHE_MECHANISM = new core.InjectionToken('CACHE_MECHANISM');
    /**
     * Cache name
     */
    var /** @type {?} */ CACHE_NAME = new core.InjectionToken('CACHE_NAME');
    /**
     * Function for calculating default language
     */
    var /** @type {?} */ DEFAULT_LANG_FUNCTION = new core.InjectionToken('DEFAULT_LANG_FUNCTION');
    /**
     * Boolean to indicate whether prefix should be set for single language scenarios
     */
    var /** @type {?} */ ALWAYS_SET_PREFIX = new core.InjectionToken('ALWAYS_SET_PREFIX');
    var /** @type {?} */ LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
    var LocalizeRouterSettings = (function () {
        /**
         * Settings for localize router
         */
        function LocalizeRouterSettings(useCachedLang, alwaysSetPrefix, cacheMechanism, cacheName, defaultLangFunction) {
            if (useCachedLang === void 0) {
                useCachedLang = true;
            }
            if (alwaysSetPrefix === void 0) {
                alwaysSetPrefix = true;
            }
            if (cacheMechanism === void 0) {
                cacheMechanism = exports.CacheMechanism.LocalStorage;
            }
            if (cacheName === void 0) {
                cacheName = LOCALIZE_CACHE_NAME;
            }
            if (defaultLangFunction === void 0) {
                defaultLangFunction = void 0;
            }
            this.useCachedLang = useCachedLang;
            this.alwaysSetPrefix = alwaysSetPrefix;
            this.cacheMechanism = cacheMechanism;
            this.cacheName = cacheName;
            this.defaultLangFunction = defaultLangFunction;
        }
        /** @nocollapse */
        LocalizeRouterSettings.ctorParameters = function () {
            return [
                { type: Boolean, decorators: [{ type: core.Inject, args: [USE_CACHED_LANG,] }] },
                { type: Boolean, decorators: [{ type: core.Inject, args: [ALWAYS_SET_PREFIX,] }] },
                { type: exports.CacheMechanism, decorators: [{ type: core.Inject, args: [CACHE_MECHANISM,] }] },
                { type: String, decorators: [{ type: core.Inject, args: [CACHE_NAME,] }] },
                { type: undefined, decorators: [{ type: core.Inject, args: [DEFAULT_LANG_FUNCTION,] }] }
            ];
        };
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
    var LocalizeParser = (function () {
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
                return new rxjs.Observable(function (observer) {
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
                    if (route.loadChildren && ((route))._loadedConfig) {
                        _this._translateRouteTree(((route))._loadedConfig.routes);
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
                    routeData.localizeRouter[property] = ((route))[property];
                }
                var /** @type {?} */ result = this.translateRoute(routeData.localizeRouter[property]);
                ((route))[property] = prefixLang ? "/" + this.urlPrefix + result : result;
            };
        Object.defineProperty(LocalizeParser.prototype, "urlPrefix", {
            get: /**
             * @return {?}
             */ function () {
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
             */ function () {
                if (!this.settings.useCachedLang) {
                    return;
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.LocalStorage) {
                    return this._cacheWithLocalStorage();
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.Cookie) {
                    return this._cacheWithCookies();
                }
            },
            set: /**
             * Save language to local storage or cookie
             * @param {?} value
             * @return {?}
             */ function (value) {
                if (!this.settings.useCachedLang) {
                    return;
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.LocalStorage) {
                    this._cacheWithLocalStorage(value);
                }
                if (this.settings.cacheMechanism === exports.CacheMechanism.Cookie) {
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
                catch (e) {
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
                catch (e) {
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
        LocalizeParser.ctorParameters = function () {
            return [
                { type: core$1.TranslateService, decorators: [{ type: core.Inject, args: [core$1.TranslateService,] }] },
                { type: common.Location, decorators: [{ type: core.Inject, args: [common.Location,] }] },
                { type: LocalizeRouterSettings, decorators: [{ type: core.Inject, args: [LocalizeRouterSettings,] }] }
            ];
        };
        return LocalizeParser;
    }());
    /**
     * Manually set configuration
     */
    var /**
     * Manually set configuration
     */ ManualParserLoader = (function (_super) {
        __extends(ManualParserLoader, _super);
        /**
         * CTOR
         */
        function ManualParserLoader(translate, location, settings, locales, prefix) {
            if (locales === void 0) {
                locales = ['en'];
            }
            if (prefix === void 0) {
                prefix = 'ROUTES.';
            }
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
    var DummyLocalizeParser = (function (_super) {
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
    var LocalizeRouterService = (function () {
        /**
         * CTOR
         */
        function LocalizeRouterService(parser, settings, router$$1, route) {
            this.parser = parser;
            this.settings = settings;
            this.router = router$$1;
            this.route = route;
            this.routerEvents = new rxjs.Subject();
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
                    .pipe(operators.filter(function (event) { return event instanceof router.NavigationStart; }), operators.pairwise())
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
                ((path)).forEach(function (segment, index) {
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
        LocalizeRouterService.ctorParameters = function () {
            return [
                { type: LocalizeParser, decorators: [{ type: core.Inject, args: [LocalizeParser,] }] },
                { type: LocalizeRouterSettings, decorators: [{ type: core.Inject, args: [LocalizeRouterSettings,] }] },
                { type: router.Router, decorators: [{ type: core.Inject, args: [router.Router,] }] },
                { type: router.ActivatedRoute, decorators: [{ type: core.Inject, args: [router.ActivatedRoute,] }] }
            ];
        };
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
        var /** @type {?} */ t1 = typeof o1, /** @type {?} */ t2 = typeof o2;
        var /** @type {?} */ length, /** @type {?} */ key, /** @type {?} */ keySet;
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
    var LocalizeRouterPipe = (function () {
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
                if (((this._ref))._view.state & VIEW_DESTROYED_STATE) {
                    return this.value;
                }
                this._ref.detectChanges();
                return this.value;
            };
        LocalizeRouterPipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'localize',
                        pure: false // required to update the value when the promise is resolved
                    },] },
        ];
        /** @nocollapse */
        LocalizeRouterPipe.ctorParameters = function () {
            return [
                { type: LocalizeRouterService },
                { type: core.ChangeDetectorRef }
            ];
        };
        return LocalizeRouterPipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
     */
    var LocalizeRouterConfigLoader = (function (_super) {
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
                                if (token === router.ROUTES) {
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
            { type: core.Injectable },
        ];
        /** @nocollapse */
        LocalizeRouterConfigLoader.ctorParameters = function () {
            return [
                { type: LocalizeParser, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return LocalizeParser; }),] }] },
                { type: core.Compiler },
                { type: core.SystemJsNgModuleLoaderConfig, decorators: [{ type: core.Optional }] }
            ];
        };
        return LocalizeRouterConfigLoader;
    }(core.SystemJsNgModuleLoader));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ParserInitializer = (function () {
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
            { type: core.Injectable },
        ];
        /** @nocollapse */
        ParserInitializer.ctorParameters = function () {
            return [
                { type: core.Injector }
            ];
        };
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
    var LocalizeRouterModule = (function () {
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
                if (config === void 0) {
                    config = {};
                }
                return {
                    ngModule: LocalizeRouterModule,
                    providers: [
                        {
                            provide: LOCALIZE_ROUTER_FORROOT_GUARD,
                            useFactory: provideForRootGuard,
                            deps: [[LocalizeRouterModule, new core.Optional(), new core.SkipSelf()]]
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
                        { provide: core.NgModuleFactoryLoader, useClass: LocalizeRouterConfigLoader },
                        {
                            provide: core.APP_INITIALIZER,
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
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, router.RouterModule, core$1.TranslateModule],
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

    exports.ParserInitializer = ParserInitializer;
    exports.getAppInitializer = getAppInitializer;
    exports.LocalizeRouterModule = LocalizeRouterModule;
    exports.provideForRootGuard = provideForRootGuard;
    exports.LocalizeParser = LocalizeParser;
    exports.ManualParserLoader = ManualParserLoader;
    exports.DummyLocalizeParser = DummyLocalizeParser;
    exports.LocalizeRouterService = LocalizeRouterService;
    exports.LocalizeRouterPipe = LocalizeRouterPipe;
    exports.LOCALIZE_ROUTER_FORROOT_GUARD = LOCALIZE_ROUTER_FORROOT_GUARD;
    exports.RAW_ROUTES = RAW_ROUTES;
    exports.USE_CACHED_LANG = USE_CACHED_LANG;
    exports.CACHE_MECHANISM = CACHE_MECHANISM;
    exports.CACHE_NAME = CACHE_NAME;
    exports.DEFAULT_LANG_FUNCTION = DEFAULT_LANG_FUNCTION;
    exports.ALWAYS_SET_PREFIX = ALWAYS_SET_PREFIX;
    exports.LocalizeRouterSettings = LocalizeRouterSettings;
    exports.LocalizeRouterConfigLoader = LocalizeRouterConfigLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1uZ3gtdHJhbnNsYXRlLXJvdXRlci51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnNlcnZpY2UudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi91dGlsLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnBpcGUudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyIsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3QsIEluamVjdGlvblRva2VuLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyTW9kdWxlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIubW9kdWxlJztcblxuLyoqXG4gKiBHdWFyZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBzaW5nbGUgaW5pdGlhbGl6YXRpb24gb2YgZm9yUm9vdFxuICovXG5leHBvcnQgY29uc3QgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TG9jYWxpemVSb3V0ZXJNb2R1bGU+KCdMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCcpO1xuXG4vKipcbiAqIFN0YXRpYyBwcm92aWRlciBmb3Iga2VlcGluZyB0cmFjayBvZiByb3V0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IFJBV19ST1VURVM6IEluamVjdGlvblRva2VuPFJvdXRlc1tdPiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4oJ1JBV19ST1VURVMnKTtcblxuLyoqXG4gKiBUeXBlIGZvciBDYWNoaW5nIG9mIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IHR5cGUgQ2FjaGVNZWNoYW5pc20gPSAnTG9jYWxTdG9yYWdlJyB8ICdDb29raWUnO1xuXG4vKipcbiAqIE5hbWVzcGFjZSBmb3IgZmFpbCBwcm9vZiBhY2Nlc3Mgb2YgQ2FjaGVNZWNoYW5pc21cbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBDYWNoZU1lY2hhbmlzbSB7XG4gIGV4cG9ydCBjb25zdCBMb2NhbFN0b3JhZ2U6IENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZSc7XG4gIGV4cG9ydCBjb25zdCBDb29raWU6IENhY2hlTWVjaGFuaXNtID0gJ0Nvb2tpZSc7XG59XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHRvIHVzZSBjYWNoZWQgbGFuZ3VhZ2UgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IFVTRV9DQUNIRURfTEFORyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignVVNFX0NBQ0hFRF9MQU5HJyk7XG4vKipcbiAqIENhY2hlIG1lY2hhbmlzbSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBDQUNIRV9NRUNIQU5JU00gPSBuZXcgSW5qZWN0aW9uVG9rZW48Q2FjaGVNZWNoYW5pc20+KCdDQUNIRV9NRUNIQU5JU00nKTtcbi8qKlxuICogQ2FjaGUgbmFtZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTkFNRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdDQUNIRV9OQU1FJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgZGVmYXVsdCBsYW5ndWFnZSBmdW5jdGlvblxuICogVXNlZCB0byBvdmVycmlkZSBiYXNpYyBiZWhhdmlvdXJcbiAqL1xuZXhwb3J0IHR5cGUgRGVmYXVsdExhbmd1YWdlRnVuY3Rpb24gPSAobGFuZ3VhZ2VzOiBzdHJpbmdbXSwgY2FjaGVkTGFuZz86IHN0cmluZywgYnJvd3Nlckxhbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuLyoqXG4gKiBGdW5jdGlvbiBmb3IgY2FsY3VsYXRpbmcgZGVmYXVsdCBsYW5ndWFnZVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQU5HX0ZVTkNUSU9OID0gbmV3IEluamVjdGlvblRva2VuPERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uPignREVGQVVMVF9MQU5HX0ZVTkNUSU9OJyk7XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHByZWZpeCBzaG91bGQgYmUgc2V0IGZvciBzaW5nbGUgbGFuZ3VhZ2Ugc2NlbmFyaW9zXG4gKi9cbmV4cG9ydCBjb25zdCBBTFdBWVNfU0VUX1BSRUZJWCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQUxXQVlTX1NFVF9QUkVGSVgnKTtcblxuLyoqXG4gKiBDb25maWcgaW50ZXJmYWNlIGZvciBMb2NhbGl6ZVJvdXRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsaXplUm91dGVyQ29uZmlnIHtcbiAgcGFyc2VyPzogUHJvdmlkZXI7XG4gIHVzZUNhY2hlZExhbmc/OiBib29sZWFuO1xuICBjYWNoZU1lY2hhbmlzbT86IENhY2hlTWVjaGFuaXNtO1xuICBjYWNoZU5hbWU/OiBzdHJpbmc7XG4gIGRlZmF1bHRMYW5nRnVuY3Rpb24/OiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbjtcbiAgYWx3YXlzU2V0UHJlZml4PzogYm9vbGVhbjtcbn1cblxuY29uc3QgTE9DQUxJWkVfQ0FDSEVfTkFNRSA9ICdMT0NBTElaRV9ERUZBVUxUX0xBTkdVQUdFJztcblxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2V0dGluZ3MgaW1wbGVtZW50cyBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXR0aW5ncyBmb3IgbG9jYWxpemUgcm91dGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFVTRV9DQUNIRURfTEFORykgcHVibGljIHVzZUNhY2hlZExhbmc6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQUxXQVlTX1NFVF9QUkVGSVgpIHB1YmxpYyBhbHdheXNTZXRQcmVmaXg6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQ0FDSEVfTUVDSEFOSVNNKSBwdWJsaWMgY2FjaGVNZWNoYW5pc206IENhY2hlTWVjaGFuaXNtID0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlLFxuICAgIEBJbmplY3QoQ0FDSEVfTkFNRSkgcHVibGljIGNhY2hlTmFtZTogc3RyaW5nID0gTE9DQUxJWkVfQ0FDSEVfTkFNRSxcbiAgICBASW5qZWN0KERFRkFVTFRfTEFOR19GVU5DVElPTikgcHVibGljIGRlZmF1bHRMYW5nRnVuY3Rpb246IERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gdm9pZCAwXG4gICkge1xuICB9XG59XG4iLCJpbXBvcnQgeyBSb3V0ZXMsIFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDYWNoZU1lY2hhbmlzbSwgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5pbXBvcnQgeyBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgQ09PS0lFX0VYUElSWSA9IDMwOyAvLyAxIG1vbnRoXG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgZm9yIHBhcnNpbmcgbG9jYWxpemF0aW9uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhbGl6ZVBhcnNlciB7XG4gIGxvY2FsZXM6IEFycmF5PHN0cmluZz47XG4gIGN1cnJlbnRMYW5nOiBzdHJpbmc7XG4gIHJvdXRlczogUm91dGVzO1xuICBkZWZhdWx0TGFuZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBwcmVmaXg6IHN0cmluZztcblxuICBwcml2YXRlIF90cmFuc2xhdGlvbk9iamVjdDogYW55O1xuICBwcml2YXRlIF93aWxkY2FyZFJvdXRlOiBSb3V0ZTtcbiAgcHJpdmF0ZSBfbGFuZ3VhZ2VSb3V0ZTogUm91dGU7XG5cbiAgLyoqXG4gICAqIExvYWRlciBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChUcmFuc2xhdGVTZXJ2aWNlKSBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgICBASW5qZWN0KExvY2F0aW9uKSBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBASW5qZWN0KExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHByaXZhdGUgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHJvdXRlcyBhbmQgZmV0Y2ggbmVjZXNzYXJ5IGRhdGFcbiAgICovXG4gIGFic3RyYWN0IGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT47XG5cbiAgLyoqXG4gKiBQcmVwYXJlIHJvdXRlcyB0byBiZSBmdWxseSB1c2FibGUgYnkgbmd4LXRyYW5zbGF0ZS1yb3V0ZXJcbiAqIEBwYXJhbSByb3V0ZXNcbiAqL1xuICAvKiBwcml2YXRlIGluaXRSb3V0ZXMocm91dGVzOiBSb3V0ZXMsIHByZWZpeCA9ICcnKSB7XG4gICAgcm91dGVzLmZvckVhY2gocm91dGUgPT4ge1xuICAgICAgaWYgKHJvdXRlLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgY29uc3Qgcm91dGVEYXRhOiBhbnkgPSByb3V0ZS5kYXRhID0gcm91dGUuZGF0YSB8fCB7fTtcbiAgICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyID0ge307XG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlci5mdWxsUGF0aCA9IGAke3ByZWZpeH0vJHtyb3V0ZS5wYXRofWA7XG4gICAgICAgIGlmIChyb3V0ZS5jaGlsZHJlbiAmJiByb3V0ZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5pbml0Um91dGVzKHJvdXRlLmNoaWxkcmVuLCByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIuZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gKi9cblxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGxhbmd1YWdlIGFuZCByb3V0ZXNcbiAgICovXG4gIHByb3RlY3RlZCBpbml0KHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICBsZXQgc2VsZWN0ZWRMYW5ndWFnZTogc3RyaW5nO1xuXG4gICAgLy8gdGhpcy5pbml0Um91dGVzKHJvdXRlcyk7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXM7XG5cbiAgICBpZiAoIXRoaXMubG9jYWxlcyB8fCAhdGhpcy5sb2NhbGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvKiogZGV0ZWN0IGN1cnJlbnQgbGFuZ3VhZ2UgKi9cbiAgICBjb25zdCBsb2NhdGlvbkxhbmcgPSB0aGlzLmdldExvY2F0aW9uTGFuZygpO1xuICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gdGhpcy5fZ2V0QnJvd3NlckxhbmcoKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmRlZmF1bHRMYW5nRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRMYW5nRnVuY3Rpb24odGhpcy5sb2NhbGVzLCB0aGlzLl9jYWNoZWRMYW5nLCBicm93c2VyTGFuZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSB0aGlzLl9jYWNoZWRMYW5nIHx8IGJyb3dzZXJMYW5nIHx8IHRoaXMubG9jYWxlc1swXTtcbiAgICB9XG4gICAgc2VsZWN0ZWRMYW5ndWFnZSA9IGxvY2F0aW9uTGFuZyB8fCB0aGlzLmRlZmF1bHRMYW5nO1xuICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKHRoaXMuZGVmYXVsdExhbmcpO1xuXG4gICAgbGV0IGNoaWxkcmVuOiBSb3V0ZXMgPSBbXTtcbiAgICAvKiogaWYgc2V0IHByZWZpeCBpcyBlbmZvcmNlZCAqL1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgY29uc3QgYmFzZVJvdXRlID0geyBwYXRoOiAnJywgcmVkaXJlY3RUbzogdGhpcy5kZWZhdWx0TGFuZywgcGF0aE1hdGNoOiAnZnVsbCcgfTtcblxuICAgICAgLyoqIGV4dHJhY3QgcG90ZW50aWFsIHdpbGRjYXJkIHJvdXRlICovXG4gICAgICBjb25zdCB3aWxkY2FyZEluZGV4ID0gcm91dGVzLmZpbmRJbmRleCgocm91dGU6IFJvdXRlKSA9PiByb3V0ZS5wYXRoID09PSAnKionKTtcbiAgICAgIGlmICh3aWxkY2FyZEluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLl93aWxkY2FyZFJvdXRlID0gcm91dGVzLnNwbGljZSh3aWxkY2FyZEluZGV4LCAxKVswXTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yb3V0ZXMuc3BsaWNlKDAsIHRoaXMucm91dGVzLmxlbmd0aCwgYmFzZVJvdXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4gPSBbLi4udGhpcy5yb3V0ZXNdOyAvLyBzaGFsbG93IGNvcHkgb2Ygcm91dGVzXG4gICAgfVxuXG4gICAgLyoqIGV4Y2x1ZGUgY2VydGFpbiByb3V0ZXMgKi9cbiAgICBmb3IgKGxldCBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChjaGlsZHJlbltpXS5kYXRhICYmIGNoaWxkcmVuW2ldLmRhdGFbJ3NraXBSb3V0ZUxvY2FsaXphdGlvbiddKSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICAgIC8vIGFkZCBkaXJlY3RseSB0byByb3V0ZXNcbiAgICAgICAgICB0aGlzLnJvdXRlcy5wdXNoKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIGFwcGVuZCBjaGlsZHJlbiByb3V0ZXMgKi9cbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5sb2NhbGVzLmxlbmd0aCA+IDEgfHwgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2VSb3V0ZSA9IHsgY2hpbGRyZW46IGNoaWxkcmVuIH07XG4gICAgICAgIHRoaXMucm91dGVzLnVuc2hpZnQodGhpcy5fbGFuZ3VhZ2VSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIC4uLmFuZCBwb3RlbnRpYWwgd2lsZGNhcmQgcm91dGUgKi9cbiAgICBpZiAodGhpcy5fd2lsZGNhcmRSb3V0ZSAmJiB0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgdGhpcy5yb3V0ZXMucHVzaCh0aGlzLl93aWxkY2FyZFJvdXRlKTtcbiAgICB9XG5cbiAgICAvKiogdHJhbnNsYXRlIHJvdXRlcyAqL1xuICAgIGNvbnN0IHJlcyA9IHRoaXMudHJhbnNsYXRlUm91dGVzKHNlbGVjdGVkTGFuZ3VhZ2UpO1xuICAgIHJldHVybiByZXMudG9Qcm9taXNlKCk7XG4gIH1cblxuICBpbml0Q2hpbGRSb3V0ZXMocm91dGVzOiBSb3V0ZXMpIHtcbiAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUocm91dGVzKTtcbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZXMgdG8gc2VsZWN0ZWQgbGFuZ3VhZ2VcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlcyhsYW5ndWFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8YW55Pigob2JzZXJ2ZXI6IE9ic2VydmVyPGFueT4pID0+IHtcbiAgICAgIHRoaXMuX2NhY2hlZExhbmcgPSBsYW5ndWFnZTtcbiAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUucGF0aCA9IGxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpLnN1YnNjcmliZSgodHJhbnNsYXRpb25zOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25PYmplY3QgPSB0cmFuc2xhdGlvbnM7XG4gICAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5ndWFnZTtcblxuICAgICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9sYW5ndWFnZVJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUodGhpcy5fbGFuZ3VhZ2VSb3V0ZS5jaGlsZHJlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIHdpbGRjYXJkIHJvdXRlXG4gICAgICAgICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5fd2lsZGNhcmRSb3V0ZS5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eSh0aGlzLl93aWxkY2FyZFJvdXRlLCAncmVkaXJlY3RUbycsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90cmFuc2xhdGVSb3V0ZVRyZWUodGhpcy5yb3V0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh2b2lkIDApO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHRoZSByb3V0ZSBub2RlIGFuZCByZWN1cnNpdmVseSBjYWxsIGZvciBhbGwgaXQncyBjaGlsZHJlblxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlczogUm91dGVzKTogdm9pZCB7XG4gICAgcm91dGVzLmZvckVhY2goKHJvdXRlOiBSb3V0ZSkgPT4ge1xuICAgICAgaWYgKHJvdXRlLnBhdGggJiYgcm91dGUucGF0aCAhPT0gJyoqJykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3BhdGgnKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5yZWRpcmVjdFRvKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlLCAncmVkaXJlY3RUbycsICFyb3V0ZS5yZWRpcmVjdFRvLmluZGV4T2YoJy8nKSk7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUuY2hpbGRyZW4pIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlLmNoaWxkcmVuKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3V0ZS5sb2FkQ2hpbGRyZW4gJiYgKDxhbnk+cm91dGUpLl9sb2FkZWRDb25maWcpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKCg8YW55PnJvdXRlKS5fbG9hZGVkQ29uZmlnLnJvdXRlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHByb3BlcnR5XG4gICAqIElmIGZpcnN0IHRpbWUgdHJhbnNsYXRpb24gdGhlbiBhZGQgb3JpZ2luYWwgdG8gcm91dGUgZGF0YSBvYmplY3RcbiAgICovXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVByb3BlcnR5KHJvdXRlOiBSb3V0ZSwgcHJvcGVydHk6IHN0cmluZywgcHJlZml4TGFuZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvLyBzZXQgcHJvcGVydHkgdG8gZGF0YSBpZiBub3QgdGhlcmUgeWV0XG4gICAgY29uc3Qgcm91dGVEYXRhOiBhbnkgPSByb3V0ZS5kYXRhID0gcm91dGUuZGF0YSB8fCB7fTtcbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcikge1xuICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyID0ge307XG4gICAgfVxuICAgIGlmICghcm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSkge1xuICAgICAgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSA9ICg8YW55PnJvdXRlKVtwcm9wZXJ0eV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVSb3V0ZShyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXJbcHJvcGVydHldKTtcbiAgICAoPGFueT5yb3V0ZSlbcHJvcGVydHldID0gcHJlZml4TGFuZyA/IGAvJHt0aGlzLnVybFByZWZpeH0ke3Jlc3VsdH1gIDogcmVzdWx0O1xuICB9XG5cbiAgZ2V0IHVybFByZWZpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXggfHwgdGhpcy5jdXJyZW50TGFuZyAhPT0gdGhpcy5kZWZhdWx0TGFuZyA/IHRoaXMuY3VycmVudExhbmcgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGUgYW5kIHJldHVybiBvYnNlcnZhYmxlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5UGFydHMgPSBwYXRoLnNwbGl0KCc/Jyk7XG4gICAgaWYgKHF1ZXJ5UGFydHMubGVuZ3RoID4gMikge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RoZXJlIHNob3VsZCBiZSBvbmx5IG9uZSBxdWVyeSBwYXJhbWV0ZXIgYmxvY2sgaW4gdGhlIFVSTCcpO1xuICAgIH1cbiAgICBjb25zdCBwYXRoU2VnbWVudHMgPSBxdWVyeVBhcnRzWzBdLnNwbGl0KCcvJyk7XG5cbiAgICAvKiogY29sbGVjdCBvYnNlcnZhYmxlcyAgKi9cbiAgICByZXR1cm4gcGF0aFNlZ21lbnRzXG4gICAgICAubWFwKChwYXJ0OiBzdHJpbmcpID0+IHBhcnQubGVuZ3RoID8gdGhpcy50cmFuc2xhdGVUZXh0KHBhcnQpIDogcGFydClcbiAgICAgIC5qb2luKCcvJykgK1xuICAgICAgKHF1ZXJ5UGFydHMubGVuZ3RoID4gMSA/IGA/JHtxdWVyeVBhcnRzWzFdfWAgOiAnJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxhbmd1YWdlIGZyb20gdXJsXG4gICAqL1xuICBnZXRMb2NhdGlvbkxhbmcodXJsPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVBhcmFtU3BsaXQgPSAodXJsIHx8IHRoaXMubG9jYXRpb24ucGF0aCgpKS5zcGxpdCgnPycpO1xuICAgIGxldCBwYXRoU2xpY2VzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmIChxdWVyeVBhcmFtU3BsaXQubGVuZ3RoID4gMCkge1xuICAgICAgcGF0aFNsaWNlcyA9IHF1ZXJ5UGFyYW1TcGxpdFswXS5zcGxpdCgnLycpO1xuICAgIH1cbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggPiAxICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHBhdGhTbGljZXNbMV0pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHBhdGhTbGljZXNbMV07XG4gICAgfVxuICAgIGlmIChwYXRoU2xpY2VzLmxlbmd0aCAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzBdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBwYXRoU2xpY2VzWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdXNlcidzIGxhbmd1YWdlIHNldCBpbiB0aGUgYnJvd3NlclxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QnJvd3NlckxhbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXModGhpcy50cmFuc2xhdGUuZ2V0QnJvd3NlckxhbmcoKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxhbmd1YWdlIGZyb20gbG9jYWwgc3RvcmFnZSBvciBjb29raWVcbiAgICovXG4gIHByaXZhdGUgZ2V0IF9jYWNoZWRMYW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLnVzZUNhY2hlZExhbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWNoZU1lY2hhbmlzbSA9PT0gQ2FjaGVNZWNoYW5pc20uQ29va2llKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVXaXRoQ29va2llcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGxhbmd1YWdlIHRvIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXG4gICAqL1xuICBwcml2YXRlIHNldCBfY2FjaGVkTGFuZyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLnVzZUNhY2hlZExhbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSkge1xuICAgICAgdGhpcy5fY2FjaGVXaXRoTG9jYWxTdG9yYWdlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xuICAgICAgdGhpcy5fY2FjaGVXaXRoQ29va2llcyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHZhbHVlIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fcmV0dXJuSWZJbkxvY2FsZXMod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gd2VpcmQgU2FmYXJpIGlzc3VlIGluIHByaXZhdGUgbW9kZSwgd2hlcmUgTG9jYWxTdG9yYWdlIGlzIGRlZmluZWQgYnV0IHRocm93cyBlcnJvciBvbiBhY2Nlc3NcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgdmFsdWUgdmlhIGNvb2tpZXNcbiAgICovXG4gIHByaXZhdGUgX2NhY2hlV2l0aENvb2tpZXModmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBkb2N1bWVudC5jb29raWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBuYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuc2V0dGluZ3MuY2FjaGVOYW1lKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBjb25zdCBkOiBEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgQ09PS0lFX0VYUElSWSAqIDg2NDAwMDAwKTsgLy8gKiBkYXlzXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKX07ZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKCcoPzpeJyArIG5hbWUgKyAnfDtcXFxccyonICsgbmFtZSArICcpPSguKj8pKD86O3wkKScsICdnJyk7XG4gICAgICBjb25zdCByZXN1bHQgPSByZWdleHAuZXhlYyhkb2N1bWVudC5jb29raWUpO1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMV0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybjsgLy8gc2hvdWxkIG5vdCBoYXBwZW4gYnV0IGJldHRlciBzYWZlIHRoYW4gc29ycnlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdmFsdWUgZXhpc3RzIGluIGxvY2FsZXMgbGlzdFxuICAgKi9cbiAgcHJpdmF0ZSBfcmV0dXJuSWZJbkxvY2FsZXModmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlICYmIHRoaXMubG9jYWxlcy5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRyYW5zbGF0ZWQgdmFsdWVcbiAgICovXG4gIHByaXZhdGUgdHJhbnNsYXRlVGV4dChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLl90cmFuc2xhdGlvbk9iamVjdCkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgY29uc3QgZnVsbEtleSA9IHRoaXMucHJlZml4ICsga2V5O1xuICAgIGNvbnN0IHJlcyA9IHRoaXMudHJhbnNsYXRlLmdldFBhcnNlZFJlc3VsdCh0aGlzLl90cmFuc2xhdGlvbk9iamVjdCwgZnVsbEtleSk7XG4gICAgcmV0dXJuIHJlcyAhPT0gZnVsbEtleSA/IHJlcyA6IGtleTtcbiAgfVxufVxuXG4vKipcbiAqIE1hbnVhbGx5IHNldCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBNYW51YWxQYXJzZXJMb2FkZXIgZXh0ZW5kcyBMb2NhbGl6ZVBhcnNlciB7XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSwgbG9jYXRpb246IExvY2F0aW9uLCBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICBsb2NhbGVzOiBzdHJpbmdbXSA9IFsnZW4nXSwgcHJlZml4OiBzdHJpbmcgPSAnUk9VVEVTLicpIHtcbiAgICBzdXBlcih0cmFuc2xhdGUsIGxvY2F0aW9uLCBzZXR0aW5ncyk7XG4gICAgdGhpcy5sb2NhbGVzID0gbG9jYWxlcztcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCB8fCAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG9yIGFwcGVuZCByb3V0ZXNcbiAgICovXG4gIGxvYWQocm91dGVzOiBSb3V0ZXMpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmluaXQocm91dGVzKS50aGVuKHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teUxvY2FsaXplUGFyc2VyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25TdGFydCwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgTmF2aWdhdGlvbkV4dHJhcywgVXJsU2VnbWVudCwgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBwYWlyd2lzZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLmNvbmZpZyc7XG5cbi8qKlxuICogTG9jYWxpemF0aW9uIHNlcnZpY2VcbiAqIG1vZGlmeVJvdXRlc1xuICovXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIHtcbiAgcm91dGVyRXZlbnRzOiBTdWJqZWN0PHN0cmluZz47XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEluamVjdChMb2NhbGl6ZVBhcnNlcikgcHVibGljIHBhcnNlcjogTG9jYWxpemVQYXJzZXIsXG4gICAgICBASW5qZWN0KExvY2FsaXplUm91dGVyU2V0dGluZ3MpIHB1YmxpYyBzZXR0aW5nczogTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICAgIEBJbmplY3QoUm91dGVyKSBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgQEluamVjdChBY3RpdmF0ZWRSb3V0ZSkgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGVcbiAgICApIHtcbiAgICAgIHRoaXMucm91dGVyRXZlbnRzID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHVwIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgLy8gc3Vic2NyaWJlIHRvIHJvdXRlciBldmVudHNcbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpLFxuICAgICAgICBwYWlyd2lzZSgpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHRoaXMuX3JvdXRlQ2hhbmdlZCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgbGFuZ3VhZ2UgYW5kIG5hdmlnYXRlIHRvIHRyYW5zbGF0ZWQgcm91dGVcbiAgICovXG4gIGNoYW5nZUxhbmd1YWdlKGxhbmc6IHN0cmluZywgZXh0cmFzPzogTmF2aWdhdGlvbkV4dHJhcywgdXNlTmF2aWdhdGVNZXRob2Q/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucm91dGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucm91dGUpO1xuICAgIH1cbiAgICBpZiAobGFuZyAhPT0gdGhpcy5wYXJzZXIuY3VycmVudExhbmcpIHtcbiAgICAgIGNvbnN0IHJvb3RTbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCA9IHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90LnJvb3Q7XG5cbiAgICAgIHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlcyhsYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChyb290U25hcHNob3QpO1xuICAgICAgICB1cmwgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlKHVybCkgYXMgc3RyaW5nO1xuXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICBsZXQgdXJsU2VnbWVudHMgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCBsYW5ndWFnZVNlZ21lbnRJbmRleCA9IHVybFNlZ21lbnRzLmluZGV4T2YodGhpcy5wYXJzZXIuY3VycmVudExhbmcpO1xuICAgICAgICAgIC8vIElmIHRoZSBkZWZhdWx0IGxhbmd1YWdlIGhhcyBubyBwcmVmaXggbWFrZSBzdXJlIHRvIHJlbW92ZSBhbmQgYWRkIGl0IHdoZW4gbmVjZXNzYXJ5XG4gICAgICAgICAgaWYgKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nID09PSB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBsYW5ndWFnZSBwcmVmaXggZnJvbSB1cmwgd2hlbiBjdXJyZW50IGxhbmd1YWdlIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDAgfHwgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAxICYmIHVybFNlZ21lbnRzWzBdID09PSAnJykpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBjdXJyZW50IGFrYSBkZWZhdWx0IGxhbmd1YWdlIHByZWZpeCBmcm9tIHRoZSB1cmxcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBsYW5ndWFnZVNlZ21lbnRJbmRleCkuY29uY2F0KHVybFNlZ21lbnRzLnNsaWNlKGxhbmd1YWdlU2VnbWVudEluZGV4ICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXaGVuIGNvbWluZyBmcm9tIGEgZGVmYXVsdCBsYW5ndWFnZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlIHVybCBkb2Vzbid0IGNvbnRhaW4gdGhlIGxhbmd1YWdlLCBtYWtlIHN1cmUgaXQgZG9lcy5cbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIHVybCBzdGFydHMgd2l0aCBhIHNsYXNoIG1ha2Ugc3VyZSB0byBrZWVwIGl0LlxuICAgICAgICAgICAgICBjb25zdCBpbmplY3Rpb25JbmRleCA9IHVybFNlZ21lbnRzWzBdID09PSAnJyA/IDEgOiAwO1xuICAgICAgICAgICAgICB1cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzLnNsaWNlKDAsIGluamVjdGlvbkluZGV4KS5jb25jYXQodGhpcy5wYXJzZXIuY3VycmVudExhbmcsIHVybFNlZ21lbnRzLnNsaWNlKGluamVjdGlvbkluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHVybCA9IHVybFNlZ21lbnRzLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgIGlmICh1c2VOYXZpZ2F0ZU1ldGhvZCkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxdLCBleHRyYXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsLCBleHRyYXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhdmVyc2VzIHRocm91Z2ggdGhlIHRyZWUgdG8gYXNzZW1ibGUgbmV3IHRyYW5zbGF0ZWQgdXJsXG4gICAqL1xuICBwcml2YXRlIHRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG5cbiAgICBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgcmV0dXJuIGAke3RoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpfS8ke3RoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpfWA7XG4gICAgfSBlbHNlIGlmIChzbmFwc2hvdC5maXJzdENoaWxkKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICAvKiBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnICYmIHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCkge1xuICAgICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcucGF0aCAhPT0gJyoqJykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCkgKyAnLycgKyB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7ICovXG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgbmV3IHNlZ21lbnQgdmFsdWUgYmFzZWQgb24gcm91dGVDb25maWcgYW5kIHVybFxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG4gICAgaWYgKHNuYXBzaG90LmRhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyLnBhdGg7XG4gICAgICBjb25zdCBzdWJQYXRoU2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLyogaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnKSB7XG4gICAgICBpZiAoc25hcHNob3Qucm91dGVDb25maWcucGF0aCA9PT0gJyoqJykge1xuICAgICAgICByZXR1cm4gc25hcHNob3QudXJsLmZpbHRlcigoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5tYXAoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkuam9pbignLycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gc25hcHNob3Qucm91dGVDb25maWcucGF0aC5zcGxpdCgnLycpO1xuICAgICAgICByZXR1cm4gc3ViUGF0aFNlZ21lbnRzLm1hcCgoczogc3RyaW5nLCBpOiBudW1iZXIpID0+IHMuaW5kZXhPZignOicpID09PSAwID8gc25hcHNob3QudXJsW2ldLnBhdGggOiBzKS5qb2luKCcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJzsgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGUgdG8gY3VycmVudCBsYW5ndWFnZVxuICAgKiBJZiBuZXcgbGFuZ3VhZ2UgaXMgZXhwbGljaXRseSBwcm92aWRlZCB0aGVuIHJlcGxhY2UgbGFuZ3VhZ2UgcGFydCBpbiB1cmwgd2l0aCBuZXcgbGFuZ3VhZ2VcbiAgICovXG4gIHRyYW5zbGF0ZVJvdXRlKHBhdGg6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHBhdGgpO1xuICAgICAgcmV0dXJuICFwYXRoLmluZGV4T2YoJy8nKSA/IGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHt1cmx9YCA6IHVybDtcbiAgICB9XG4gICAgLy8gaXQncyBhbiBhcnJheVxuICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgICAocGF0aCBhcyBBcnJheTxhbnk+KS5mb3JFYWNoKChzZWdtZW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VnbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUoc2VnbWVudCk7XG4gICAgICAgIGlmICghaW5kZXggJiYgIXNlZ21lbnQuaW5kZXhPZignLycpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goYC8ke3RoaXMucGFyc2VyLnVybFByZWZpeH0ke3Jlc31gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQucHVzaChyZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgdG8gcmVhY3Qgb24gcm91dGUgY2hhbmdlXG4gICAqL1xuICBwcml2YXRlIF9yb3V0ZUNoYW5nZWQoKTogKGV2ZW50UGFpcjogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuIChbcHJldmlvdXNFdmVudCwgY3VycmVudEV2ZW50XTogW05hdmlnYXRpb25TdGFydCwgTmF2aWdhdGlvblN0YXJ0XSkgPT4ge1xuICAgICAgY29uc3QgcHJldmlvdXNMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKHByZXZpb3VzRXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcbiAgICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gdGhpcy5wYXJzZXIuZ2V0TG9jYXRpb25MYW5nKGN1cnJlbnRFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xuXG4gICAgICBpZiAoY3VycmVudExhbmcgIT09IHByZXZpb3VzTGFuZykge1xuICAgICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMoY3VycmVudExhbmcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAgICAgICAvLyBGaXJlIHJvdXRlIGNoYW5nZSBldmVudFxuICAgICAgICAgIHRoaXMucm91dGVyRXZlbnRzLm5leHQoY3VycmVudExhbmcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCIvKipcbiAqIENvbXBhcmUgaWYgdHdvIG9iamVjdHMgYXJlIHNhbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxdWFscyhvMTogYW55LCBvMjogYW55KTogYm9vbGVhbiB7XG4gIGlmIChvMSA9PT0gbzIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobzEgPT09IG51bGwgfHwgbzIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG8xICE9PSBvMSAmJiBvMiAhPT0gbzIpIHtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gTmFOID09PSBOYU5cbiAgfVxuICBjb25zdCB0MSA9IHR5cGVvZiBvMSxcbiAgICB0MiA9IHR5cGVvZiBvMjtcbiAgbGV0IGxlbmd0aDogbnVtYmVyLFxuICAgIGtleTogYW55LFxuICAgIGtleVNldDogYW55O1xuXG4gIGlmICh0MSA9PT0gdDIgJiYgdDEgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobzEpKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobzIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgobGVuZ3RoID0gbzEubGVuZ3RoKSA9PT0gbzIubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgbGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgIGlmICghZXF1YWxzKG8xW2tleV0sIG8yW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAga2V5U2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGZvciAoa2V5IGluIG8xKSB7XG4gICAgICAgIGlmIChvMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKCFlcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2V5U2V0W2tleV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGtleSBpbiBvMikge1xuICAgICAgICBpZiAobzIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmICghKGtleSBpbiBrZXlTZXQpICYmIHR5cGVvZiBvMltrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImltcG9ydCB7IFBpcGVUcmFuc2Zvcm0sIFBpcGUsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBlcXVhbHMgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBWSUVXX0RFU1RST1lFRF9TVEFURSA9IDEyODtcblxuQFBpcGUoe1xuICBuYW1lOiAnbG9jYWxpemUnLFxuICBwdXJlOiBmYWxzZSAvLyByZXF1aXJlZCB0byB1cGRhdGUgdGhlIHZhbHVlIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWRcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nIHwgYW55W10gPSAnJztcbiAgcHJpdmF0ZSBsYXN0S2V5OiBzdHJpbmcgfCBhbnlbXTtcbiAgcHJpdmF0ZSBsYXN0TGFuZ3VhZ2U6IHN0cmluZztcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLCBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmxvY2FsaXplLnJvdXRlckV2ZW50cy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0odGhpcy5sYXN0S2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIGN1cnJlbnQgdXJsIHRvIGxvY2FsaXplZCBvbmVcbiAgICovXG4gIHRyYW5zZm9ybShxdWVyeTogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XG4gICAgaWYgKCFxdWVyeSB8fCBxdWVyeS5sZW5ndGggPT09IDAgfHwgIXRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuICAgIGlmIChlcXVhbHMocXVlcnksIHRoaXMubGFzdEtleSkgJiYgZXF1YWxzKHRoaXMubGFzdExhbmd1YWdlLCB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLmxhc3RLZXkgPSBxdWVyeTtcbiAgICB0aGlzLmxhc3RMYW5ndWFnZSA9IHRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nO1xuXG4gICAgLyoqIHRyYW5zbGF0ZSBrZXkgYW5kIHVwZGF0ZSB2YWx1ZXMgKi9cbiAgICB0aGlzLnZhbHVlID0gdGhpcy5sb2NhbGl6ZS50cmFuc2xhdGVSb3V0ZShxdWVyeSk7XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgLy8gaWYgdmlldyBpcyBhbHJlYWR5IGRlc3Ryb3llZCwgaWdub3JlIGZpcmluZyBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgaWYgKCg8YW55PiB0aGlzLl9yZWYpLl92aWV3LnN0YXRlICYgVklFV19ERVNUUk9ZRURfU1RBVEUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBST1VURVMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtcbiAgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciwgTmdNb2R1bGVGYWN0b3J5LCBJbmplY3RvcixcbiAgU3lzdGVtSnNOZ01vZHVsZUxvYWRlckNvbmZpZywgT3B0aW9uYWwsIENvbXBpbGVyLCBJbmplY3RhYmxlLCBJbmplY3QsIGZvcndhcmRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5cbi8qKlxuICogRXh0ZW5zaW9uIG9mIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIgdG8gZW5hYmxlIGxvY2FsaXphdGlvbiBvZiByb3V0ZSBvbiBsYXp5IGxvYWRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIGV4dGVuZHMgU3lzdGVtSnNOZ01vZHVsZUxvYWRlciB7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IExvY2FsaXplUGFyc2VyKSkgcHJpdmF0ZSBsb2NhbGl6ZTogTG9jYWxpemVQYXJzZXIsXG4gICAgX2NvbXBpbGVyOiBDb21waWxlciwgQE9wdGlvbmFsKCkgY29uZmlnPzogU3lzdGVtSnNOZ01vZHVsZUxvYWRlckNvbmZpZykge1xuICAgICAgc3VwZXIoX2NvbXBpbGVyLCBjb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZCBsb2FkIHdpdGggY3VzdG9tIGZ1bmN0aW9uYWxpdHlcbiAgICovXG4gIGxvYWQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8YW55Pj4ge1xuICAgIHJldHVybiBzdXBlci5sb2FkKHBhdGgpLnRoZW4oKGZhY3Rvcnk6IE5nTW9kdWxlRmFjdG9yeTxhbnk+KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtb2R1bGVUeXBlOiBmYWN0b3J5Lm1vZHVsZVR5cGUsXG4gICAgICAgIGNyZWF0ZTogKHBhcmVudEluamVjdG9yOiBJbmplY3RvcikgPT4ge1xuICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGZhY3RvcnkuY3JlYXRlKHBhcmVudEluamVjdG9yKTtcbiAgICAgICAgICBjb25zdCBnZXRNZXRob2QgPSBtb2R1bGUuaW5qZWN0b3IuZ2V0LmJpbmQobW9kdWxlLmluamVjdG9yKTtcblxuICAgICAgICAgIG1vZHVsZS5pbmplY3RvclsnZ2V0J10gPSAodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnZXRSZXN1bHQgPSBnZXRNZXRob2QodG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09IFJPVVRFUykge1xuICAgICAgICAgICAgICAvLyB0cmFuc2xhdGUgbGF6eSByb3V0ZXNcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxpemUuaW5pdENoaWxkUm91dGVzKFtdLmNvbmNhdCguLi5nZXRSZXN1bHQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycywgQVBQX0lOSVRJQUxJWkVSLCBPcHRpb25hbCwgU2tpcFNlbGYsXG4gIEluamVjdGFibGUsIEluamVjdG9yLCBOZ01vZHVsZUZhY3RvcnlMb2FkZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlJztcbmltcG9ydCB7IER1bW15TG9jYWxpemVQYXJzZXIsIExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSwgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyUGlwZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBpcGUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQUxXQVlTX1NFVF9QUkVGSVgsXG4gIENBQ0hFX01FQ0hBTklTTSwgQ0FDSEVfTkFNRSwgREVGQVVMVF9MQU5HX0ZVTkNUSU9OLCBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCwgTG9jYWxpemVSb3V0ZXJDb25maWcsIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gIFJBV19ST1VURVMsXG4gIFVTRV9DQUNIRURfTEFOR1xufSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci1jb25maWctbG9hZGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBhcnNlckluaXRpYWxpemVyIHtcbiAgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlcjtcbiAgcm91dGVzOiBSb3V0ZXM7XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gIH1cblxuICBhcHBJbml0aWFsaXplcigpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLmxvYWQodGhpcy5yb3V0ZXMpO1xuICAgIHJlcy50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGxvY2FsaXplOiBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChMb2NhbGl6ZVJvdXRlclNlcnZpY2UpO1xuICAgICAgbG9jYWxpemUuaW5pdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6ICgpID0+IFByb21pc2U8YW55PiB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXMucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSk7XG4gICAgcmV0dXJuIHRoaXMuYXBwSW5pdGlhbGl6ZXI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcEluaXRpYWxpemVyKHA6IFBhcnNlckluaXRpYWxpemVyLCBwYXJzZXI6IExvY2FsaXplUGFyc2VyLCByb3V0ZXM6IFJvdXRlc1tdKTogYW55IHtcbiAgcmV0dXJuIHAuZ2VuZXJhdGVJbml0aWFsaXplcihwYXJzZXIsIHJvdXRlcykuYmluZChwKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlLCBUcmFuc2xhdGVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtMb2NhbGl6ZVJvdXRlclBpcGVdLFxuICBleHBvcnRzOiBbTG9jYWxpemVSb3V0ZXJQaXBlXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB7XG5cbiAgc3RhdGljIGZvclJvb3Qocm91dGVzOiBSb3V0ZXMsIGNvbmZpZzogTG9jYWxpemVSb3V0ZXJDb25maWcgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJELFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IHByb3ZpZGVGb3JSb290R3VhcmQsXG4gICAgICAgICAgZGVwczogW1tMb2NhbGl6ZVJvdXRlck1vZHVsZSwgbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpXV1cbiAgICAgICAgfSxcbiAgICAgICAgeyBwcm92aWRlOiBVU0VfQ0FDSEVEX0xBTkcsIHVzZVZhbHVlOiBjb25maWcudXNlQ2FjaGVkTGFuZyB9LFxuICAgICAgICB7IHByb3ZpZGU6IEFMV0FZU19TRVRfUFJFRklYLCB1c2VWYWx1ZTogY29uZmlnLmFsd2F5c1NldFByZWZpeCB9LFxuICAgICAgICB7IHByb3ZpZGU6IENBQ0hFX05BTUUsIHVzZVZhbHVlOiBjb25maWcuY2FjaGVOYW1lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ0FDSEVfTUVDSEFOSVNNLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTWVjaGFuaXNtIH0sXG4gICAgICAgIHsgcHJvdmlkZTogREVGQVVMVF9MQU5HX0ZVTkNUSU9OLCB1c2VWYWx1ZTogY29uZmlnLmRlZmF1bHRMYW5nRnVuY3Rpb24gfSxcbiAgICAgICAgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyxcbiAgICAgICAgY29uZmlnLnBhcnNlciB8fCB7IHByb3ZpZGU6IExvY2FsaXplUGFyc2VyLCB1c2VDbGFzczogRHVtbXlMb2NhbGl6ZVBhcnNlciB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkFXX1JPVVRFUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VWYWx1ZTogcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIExvY2FsaXplUm91dGVyU2VydmljZSxcbiAgICAgICAgUGFyc2VySW5pdGlhbGl6ZXIsXG4gICAgICAgIHsgcHJvdmlkZTogTmdNb2R1bGVGYWN0b3J5TG9hZGVyLCB1c2VDbGFzczogTG9jYWxpemVSb3V0ZXJDb25maWdMb2FkZXIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBnZXRBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbUGFyc2VySW5pdGlhbGl6ZXIsIExvY2FsaXplUGFyc2VyLCBSQVdfUk9VVEVTXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JDaGlsZChyb3V0ZXM6IFJvdXRlcyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUZvclJvb3RHdWFyZChsb2NhbGl6ZVJvdXRlck1vZHVsZTogTG9jYWxpemVSb3V0ZXJNb2R1bGUpOiBzdHJpbmcge1xuICBpZiAobG9jYWxpemVSb3V0ZXJNb2R1bGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgTG9jYWxpemVSb3V0ZXJNb2R1bGUuZm9yUm9vdCgpIGNhbGxlZCB0d2ljZS4gTGF6eSBsb2FkZWQgbW9kdWxlcyBzaG91bGQgdXNlIExvY2FsaXplUm91dGVyTW9kdWxlLmZvckNoaWxkKCkgaW5zdGVhZC5gKTtcbiAgfVxuICByZXR1cm4gJ2d1YXJkZWQnO1xufVxuIl0sIm5hbWVzIjpbIkluamVjdGlvblRva2VuIiwiQ2FjaGVNZWNoYW5pc20iLCJJbmplY3QiLCJPYnNlcnZhYmxlIiwiVHJhbnNsYXRlU2VydmljZSIsIkxvY2F0aW9uIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJyb3V0ZXIiLCJTdWJqZWN0IiwiZmlsdGVyIiwiTmF2aWdhdGlvblN0YXJ0IiwicGFpcndpc2UiLCJSb3V0ZXIiLCJBY3RpdmF0ZWRSb3V0ZSIsIlBpcGUiLCJDaGFuZ2VEZXRlY3RvclJlZiIsIlJPVVRFUyIsIkluamVjdGFibGUiLCJmb3J3YXJkUmVmIiwiQ29tcGlsZXIiLCJTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyQ29uZmlnIiwiT3B0aW9uYWwiLCJTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIiwiSW5qZWN0b3IiLCJTa2lwU2VsZiIsIk5nTW9kdWxlRmFjdG9yeUxvYWRlciIsIkFQUF9JTklUSUFMSVpFUiIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiUm91dGVyTW9kdWxlIiwiVHJhbnNsYXRlTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0Is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