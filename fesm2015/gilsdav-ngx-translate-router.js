import { Inject, InjectionToken, Pipe, ChangeDetectorRef, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, forwardRef, NgModule, APP_INITIALIZER, SkipSelf, Injector, NgModuleFactoryLoader } from '@angular/core';
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
const /** @type {?} */ LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 */
const /** @type {?} */ RAW_ROUTES = new InjectionToken('RAW_ROUTES');
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
const /** @type {?} */ USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
const /** @type {?} */ CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 */
const /** @type {?} */ CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 */
const /** @type {?} */ DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
const /** @type {?} */ ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
const /** @type {?} */ LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
class LocalizeRouterSettings {
    /**
     * Settings for localize router
     * @param {?=} useCachedLang
     * @param {?=} alwaysSetPrefix
     * @param {?=} cacheMechanism
     * @param {?=} cacheName
     * @param {?=} defaultLangFunction
     */
    constructor(useCachedLang = true, alwaysSetPrefix = true, cacheMechanism = CacheMechanism.LocalStorage, cacheName = LOCALIZE_CACHE_NAME, defaultLangFunction = void 0) {
        this.useCachedLang = useCachedLang;
        this.alwaysSetPrefix = alwaysSetPrefix;
        this.cacheMechanism = cacheMechanism;
        this.cacheName = cacheName;
        this.defaultLangFunction = defaultLangFunction;
    }
}
/** @nocollapse */
LocalizeRouterSettings.ctorParameters = () => [
    { type: Boolean, decorators: [{ type: Inject, args: [USE_CACHED_LANG,] }] },
    { type: Boolean, decorators: [{ type: Inject, args: [ALWAYS_SET_PREFIX,] }] },
    { type: CacheMechanism, decorators: [{ type: Inject, args: [CACHE_MECHANISM,] }] },
    { type: String, decorators: [{ type: Inject, args: [CACHE_NAME,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_LANG_FUNCTION,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ COOKIE_EXPIRY = 30;
/**
 * Abstract class for parsing localization
 * @abstract
 */
class LocalizeParser {
    /**
     * Loader constructor
     * @param {?} translate
     * @param {?} location
     * @param {?} settings
     */
    constructor(translate, location, settings) {
        this.translate = translate;
        this.location = location;
        this.settings = settings;
    }
    /**
     * Initialize language and routes
     * @param {?} routes
     * @return {?}
     */
    init(routes) {
        let /** @type {?} */ selectedLanguage;
        // this.initRoutes(routes);
        this.routes = routes;
        if (!this.locales || !this.locales.length) {
            return Promise.resolve();
        }
        /**
         * detect current language
         */
        const /** @type {?} */ locationLang = this.getLocationLang();
        const /** @type {?} */ browserLang = this._getBrowserLang();
        if (this.settings.defaultLangFunction) {
            this.defaultLang = this.settings.defaultLangFunction(this.locales, this._cachedLang, browserLang);
        }
        else {
            this.defaultLang = this._cachedLang || browserLang || this.locales[0];
        }
        selectedLanguage = locationLang || this.defaultLang;
        this.translate.setDefaultLang(this.defaultLang);
        let /** @type {?} */ children = [];
        /** if set prefix is enforced */
        if (this.settings.alwaysSetPrefix) {
            const /** @type {?} */ baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
            /**
             * extract potential wildcard route
             */
            const /** @type {?} */ wildcardIndex = routes.findIndex((route) => route.path === '**');
            if (wildcardIndex !== -1) {
                this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
            }
            children = this.routes.splice(0, this.routes.length, baseRoute);
        }
        else {
            children = [...this.routes]; // shallow copy of routes
        }
        /** exclude certain routes */
        for (let /** @type {?} */ i = children.length - 1; i >= 0; i--) {
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
        const /** @type {?} */ res = this.translateRoutes(selectedLanguage);
        return res.toPromise();
    }
    /**
     * @param {?} routes
     * @return {?}
     */
    initChildRoutes(routes) {
        this._translateRouteTree(routes);
        return routes;
    }
    /**
     * Translate routes to selected language
     * @param {?} language
     * @return {?}
     */
    translateRoutes(language) {
        return new Observable((observer) => {
            this._cachedLang = language;
            if (this._languageRoute) {
                this._languageRoute.path = language;
            }
            this.translate.use(language).subscribe((translations) => {
                this._translationObject = translations;
                this.currentLang = language;
                if (this._languageRoute) {
                    if (this._languageRoute) {
                        this._translateRouteTree(this._languageRoute.children);
                    }
                    // if there is wildcard route
                    if (this._wildcardRoute && this._wildcardRoute.redirectTo) {
                        this._translateProperty(this._wildcardRoute, 'redirectTo', true);
                    }
                }
                else {
                    this._translateRouteTree(this.routes);
                }
                observer.next(void 0);
                observer.complete();
            });
        });
    }
    /**
     * Translate the route node and recursively call for all it's children
     * @param {?} routes
     * @return {?}
     */
    _translateRouteTree(routes) {
        routes.forEach((route) => {
            if (route.path && route.path !== '**') {
                this._translateProperty(route, 'path');
            }
            if (route.redirectTo) {
                this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
            }
            if (route.children) {
                this._translateRouteTree(route.children);
            }
            if (route.loadChildren && (/** @type {?} */ (route))._loadedConfig) {
                this._translateRouteTree((/** @type {?} */ (route))._loadedConfig.routes);
            }
        });
    }
    /**
     * Translate property
     * If first time translation then add original to route data object
     * @param {?} route
     * @param {?} property
     * @param {?=} prefixLang
     * @return {?}
     */
    _translateProperty(route, property, prefixLang) {
        // set property to data if not there yet
        const /** @type {?} */ routeData = route.data = route.data || {};
        if (!routeData.localizeRouter) {
            routeData.localizeRouter = {};
        }
        if (!routeData.localizeRouter[property]) {
            routeData.localizeRouter[property] = (/** @type {?} */ (route))[property];
        }
        const /** @type {?} */ result = this.translateRoute(routeData.localizeRouter[property]);
        (/** @type {?} */ (route))[property] = prefixLang ? `/${this.urlPrefix}${result}` : result;
    }
    /**
     * @return {?}
     */
    get urlPrefix() {
        return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
    }
    /**
     * Translate route and return observable
     * @param {?} path
     * @return {?}
     */
    translateRoute(path) {
        const /** @type {?} */ queryParts = path.split('?');
        if (queryParts.length > 2) {
            throw Error('There should be only one query parameter block in the URL');
        }
        const /** @type {?} */ pathSegments = queryParts[0].split('/');
        /** collect observables  */
        return pathSegments
            .map((part) => part.length ? this.translateText(part) : part)
            .join('/') +
            (queryParts.length > 1 ? `?${queryParts[1]}` : '');
    }
    /**
     * Get language from url
     * @param {?=} url
     * @return {?}
     */
    getLocationLang(url) {
        const /** @type {?} */ queryParamSplit = (url || this.location.path()).split('?');
        let /** @type {?} */ pathSlices = [];
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
    }
    /**
     * Get user's language set in the browser
     * @return {?}
     */
    _getBrowserLang() {
        return this._returnIfInLocales(this.translate.getBrowserLang());
    }
    /**
     * Get language from local storage or cookie
     * @return {?}
     */
    get _cachedLang() {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            return this._cacheWithLocalStorage();
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            return this._cacheWithCookies();
        }
    }
    /**
     * Save language to local storage or cookie
     * @param {?} value
     * @return {?}
     */
    set _cachedLang(value) {
        if (!this.settings.useCachedLang) {
            return;
        }
        if (this.settings.cacheMechanism === CacheMechanism.LocalStorage) {
            this._cacheWithLocalStorage(value);
        }
        if (this.settings.cacheMechanism === CacheMechanism.Cookie) {
            this._cacheWithCookies(value);
        }
    }
    /**
     * Cache value to local storage
     * @param {?=} value
     * @return {?}
     */
    _cacheWithLocalStorage(value) {
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
    }
    /**
     * Cache value via cookies
     * @param {?=} value
     * @return {?}
     */
    _cacheWithCookies(value) {
        if (typeof document === 'undefined' || typeof document.cookie === 'undefined') {
            return;
        }
        try {
            const /** @type {?} */ name = encodeURIComponent(this.settings.cacheName);
            if (value) {
                const /** @type {?} */ d = new Date();
                d.setTime(d.getTime() + COOKIE_EXPIRY * 86400000); // * days
                document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()}`;
                return;
            }
            const /** @type {?} */ regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
            const /** @type {?} */ result = regexp.exec(document.cookie);
            return decodeURIComponent(result[1]);
        }
        catch (/** @type {?} */ e) {
            return; // should not happen but better safe than sorry
        }
    }
    /**
     * Check if value exists in locales list
     * @param {?} value
     * @return {?}
     */
    _returnIfInLocales(value) {
        if (value && this.locales.indexOf(value) !== -1) {
            return value;
        }
        return null;
    }
    /**
     * Get translated value
     * @param {?} key
     * @return {?}
     */
    translateText(key) {
        if (!this._translationObject) {
            return key;
        }
        const /** @type {?} */ fullKey = this.prefix + key;
        const /** @type {?} */ res = this.translate.getParsedResult(this._translationObject, fullKey);
        return res !== fullKey ? res : key;
    }
}
/** @nocollapse */
LocalizeParser.ctorParameters = () => [
    { type: TranslateService, decorators: [{ type: Inject, args: [TranslateService,] }] },
    { type: Location, decorators: [{ type: Inject, args: [Location,] }] },
    { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] }
];
/**
 * Manually set configuration
 */
class ManualParserLoader extends LocalizeParser {
    /**
     * CTOR
     * @param {?} translate
     * @param {?} location
     * @param {?} settings
     * @param {?=} locales
     * @param {?=} prefix
     */
    constructor(translate, location, settings, locales = ['en'], prefix = 'ROUTES.') {
        super(translate, location, settings);
        this.locales = locales;
        this.prefix = prefix || '';
    }
    /**
     * Initialize or append routes
     * @param {?} routes
     * @return {?}
     */
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
}
class DummyLocalizeParser extends LocalizeParser {
    /**
     * @param {?} routes
     * @return {?}
     */
    load(routes) {
        return new Promise((resolve) => {
            this.init(routes).then(resolve);
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Localization service
 * modifyRoutes
 */
class LocalizeRouterService {
    /**
     * CTOR
     * @param {?} parser
     * @param {?} settings
     * @param {?} router
     * @param {?} route
     */
    constructor(parser, settings, router, route) {
        this.parser = parser;
        this.settings = settings;
        this.router = router;
        this.route = route;
        this.routerEvents = new Subject();
    }
    /**
     * Start up the service
     * @return {?}
     */
    init() {
        this.router.resetConfig(this.parser.routes);
        // subscribe to router events
        this.router.events
            .pipe(filter(event => event instanceof NavigationStart), pairwise())
            .subscribe(this._routeChanged());
    }
    /**
     * Change language and navigate to translated route
     * @param {?} lang
     * @param {?=} extras
     * @param {?=} useNavigateMethod
     * @return {?}
     */
    changeLanguage(lang, extras, useNavigateMethod) {
        if (this.route) {
            console.log(this.route);
        }
        if (lang !== this.parser.currentLang) {
            const /** @type {?} */ rootSnapshot = this.router.routerState.snapshot.root;
            this.parser.translateRoutes(lang).subscribe(() => {
                let /** @type {?} */ url = this.traverseRouteSnapshot(rootSnapshot);
                url = /** @type {?} */ (this.translateRoute(url));
                if (!this.settings.alwaysSetPrefix) {
                    let /** @type {?} */ urlSegments = url.split('/');
                    const /** @type {?} */ languageSegmentIndex = urlSegments.indexOf(this.parser.currentLang);
                    // If the default language has no prefix make sure to remove and add it when necessary
                    if (this.parser.currentLang === this.parser.defaultLang) {
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
                            const /** @type {?} */ injectionIndex = urlSegments[0] === '' ? 1 : 0;
                            urlSegments = urlSegments.slice(0, injectionIndex).concat(this.parser.currentLang, urlSegments.slice(injectionIndex));
                        }
                    }
                    url = urlSegments.join('/');
                }
                this.router.resetConfig(this.parser.routes);
                if (useNavigateMethod) {
                    this.router.navigate([url], extras);
                }
                else {
                    this.router.navigateByUrl(url, extras);
                }
            });
        }
    }
    /**
     * Traverses through the tree to assemble new translated url
     * @param {?} snapshot
     * @return {?}
     */
    traverseRouteSnapshot(snapshot) {
        if (snapshot.firstChild && snapshot.routeConfig) {
            return `${this.parseSegmentValue(snapshot)}/${this.traverseRouteSnapshot(snapshot.firstChild)}`;
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
    }
    /**
     * Extracts new segment value based on routeConfig and url
     * @param {?} snapshot
     * @return {?}
     */
    parseSegmentValue(snapshot) {
        if (snapshot.data["localizeRouter"]) {
            const /** @type {?} */ path = snapshot.data["localizeRouter"].path;
            const /** @type {?} */ subPathSegments = path.split('/');
            return subPathSegments.map((s, i) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
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
    }
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     * @param {?} path
     * @return {?}
     */
    translateRoute(path) {
        if (typeof path === 'string') {
            const /** @type {?} */ url = this.parser.translateRoute(path);
            return !path.indexOf('/') ? `/${this.parser.urlPrefix}${url}` : url;
        }
        // it's an array
        const /** @type {?} */ result = [];
        (/** @type {?} */ (path)).forEach((segment, index) => {
            if (typeof segment === 'string') {
                const /** @type {?} */ res = this.parser.translateRoute(segment);
                if (!index && !segment.indexOf('/')) {
                    result.push(`/${this.parser.urlPrefix}${res}`);
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
    }
    /**
     * Event handler to react on route change
     * @return {?}
     */
    _routeChanged() {
        return ([previousEvent, currentEvent]) => {
            const /** @type {?} */ previousLang = this.parser.getLocationLang(previousEvent.url) || this.parser.defaultLang;
            const /** @type {?} */ currentLang = this.parser.getLocationLang(currentEvent.url) || this.parser.defaultLang;
            if (currentLang !== previousLang) {
                this.parser.translateRoutes(currentLang).subscribe(() => {
                    this.router.resetConfig(this.parser.routes);
                    // Fire route change event
                    this.routerEvents.next(currentLang);
                });
            }
        };
    }
}
/** @nocollapse */
LocalizeRouterService.ctorParameters = () => [
    { type: LocalizeParser, decorators: [{ type: Inject, args: [LocalizeParser,] }] },
    { type: LocalizeRouterSettings, decorators: [{ type: Inject, args: [LocalizeRouterSettings,] }] },
    { type: Router, decorators: [{ type: Inject, args: [Router,] }] },
    { type: ActivatedRoute, decorators: [{ type: Inject, args: [ActivatedRoute,] }] }
];

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
    const /** @type {?} */ t1 = typeof o1, /** @type {?} */
    t2 = typeof o2;
    let /** @type {?} */ length, /** @type {?} */
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
const /** @type {?} */ VIEW_DESTROYED_STATE = 128;
class LocalizeRouterPipe {
    /**
     * CTOR
     * @param {?} localize
     * @param {?} _ref
     */
    constructor(localize, _ref) {
        this.localize = localize;
        this._ref = _ref;
        this.value = '';
        this.subscription = this.localize.routerEvents.subscribe(() => {
            this.transform(this.lastKey);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * Transform current url to localized one
     * @param {?} query
     * @return {?}
     */
    transform(query) {
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
    }
}
LocalizeRouterPipe.decorators = [
    { type: Pipe, args: [{
                name: 'localize',
                pure: false // required to update the value when the promise is resolved
            },] },
];
/** @nocollapse */
LocalizeRouterPipe.ctorParameters = () => [
    { type: LocalizeRouterService },
    { type: ChangeDetectorRef }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
class LocalizeRouterConfigLoader extends SystemJsNgModuleLoader {
    /**
     * @param {?} localize
     * @param {?} _compiler
     * @param {?=} config
     */
    constructor(localize, _compiler, config) {
        super(_compiler, config);
        this.localize = localize;
    }
    /**
     * Extend load with custom functionality
     * @param {?} path
     * @return {?}
     */
    load(path) {
        return super.load(path).then((factory) => {
            return {
                moduleType: factory.moduleType,
                create: (parentInjector) => {
                    const /** @type {?} */ module = factory.create(parentInjector);
                    const /** @type {?} */ getMethod = module.injector.get.bind(module.injector);
                    module.injector['get'] = (token, notFoundValue) => {
                        const /** @type {?} */ getResult = getMethod(token, notFoundValue);
                        if (token === ROUTES) {
                            // translate lazy routes
                            return this.localize.initChildRoutes([].concat(...getResult));
                        }
                        else {
                            return getResult;
                        }
                    };
                    return module;
                }
            };
        });
    }
}
LocalizeRouterConfigLoader.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LocalizeRouterConfigLoader.ctorParameters = () => [
    { type: LocalizeParser, decorators: [{ type: Inject, args: [forwardRef(() => LocalizeParser),] }] },
    { type: Compiler },
    { type: SystemJsNgModuleLoaderConfig, decorators: [{ type: Optional }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ParserInitializer {
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
/**
 * @param {?} p
 * @param {?} parser
 * @param {?} routes
 * @return {?}
 */
function getAppInitializer(p, parser, routes) {
    return p.generateInitializer(parser, routes).bind(p);
}
class LocalizeRouterModule {
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
function provideForRootGuard(localizeRouterModule) {
    if (localizeRouterModule) {
        throw new Error(`LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1uZ3gtdHJhbnNsYXRlLXJvdXRlci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnNlcnZpY2UudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi91dGlsLnRzIiwibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci9saWIvbG9jYWxpemUtcm91dGVyLnBpcGUudHMiLCJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyL2xpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyIsIm5nOi8vQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXIvbGliL2xvY2FsaXplLXJvdXRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlck1vZHVsZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLm1vZHVsZSc7XG5cbi8qKlxuICogR3VhcmQgdG8gbWFrZSBzdXJlIHdlIGhhdmUgc2luZ2xlIGluaXRpYWxpemF0aW9uIG9mIGZvclJvb3RcbiAqL1xuZXhwb3J0IGNvbnN0IExPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJEID0gbmV3IEluamVjdGlvblRva2VuPExvY2FsaXplUm91dGVyTW9kdWxlPignTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQnKTtcblxuLyoqXG4gKiBTdGF0aWMgcHJvdmlkZXIgZm9yIGtlZXBpbmcgdHJhY2sgb2Ygcm91dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBSQVdfUk9VVEVTOiBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48Um91dGVzW10+KCdSQVdfUk9VVEVTJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgQ2FjaGluZyBvZiBkZWZhdWx0IGxhbmd1YWdlXG4gKi9cbmV4cG9ydCB0eXBlIENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZScgfCAnQ29va2llJztcblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIGZhaWwgcHJvb2YgYWNjZXNzIG9mIENhY2hlTWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQ2FjaGVNZWNoYW5pc20ge1xuICBleHBvcnQgY29uc3QgTG9jYWxTdG9yYWdlOiBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnO1xuICBleHBvcnQgY29uc3QgQ29va2llOiBDYWNoZU1lY2hhbmlzbSA9ICdDb29raWUnO1xufVxuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciB0byB1c2UgY2FjaGVkIGxhbmd1YWdlIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBVU0VfQ0FDSEVEX0xBTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ1VTRV9DQUNIRURfTEFORycpO1xuLyoqXG4gKiBDYWNoZSBtZWNoYW5pc20gdHlwZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTUVDSEFOSVNNID0gbmV3IEluamVjdGlvblRva2VuPENhY2hlTWVjaGFuaXNtPignQ0FDSEVfTUVDSEFOSVNNJyk7XG4vKipcbiAqIENhY2hlIG5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IENBQ0hFX05BTUUgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignQ0FDSEVfTkFNRScpO1xuXG4vKipcbiAqIFR5cGUgZm9yIGRlZmF1bHQgbGFuZ3VhZ2UgZnVuY3Rpb25cbiAqIFVzZWQgdG8gb3ZlcnJpZGUgYmFzaWMgYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCB0eXBlIERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gKGxhbmd1YWdlczogc3RyaW5nW10sIGNhY2hlZExhbmc/OiBzdHJpbmcsIGJyb3dzZXJMYW5nPzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbi8qKlxuICogRnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTEFOR19GVU5DVElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbj4oJ0RFRkFVTFRfTEFOR19GVU5DVElPTicpO1xuXG4vKipcbiAqIEJvb2xlYW4gdG8gaW5kaWNhdGUgd2hldGhlciBwcmVmaXggc2hvdWxkIGJlIHNldCBmb3Igc2luZ2xlIGxhbmd1YWdlIHNjZW5hcmlvc1xuICovXG5leHBvcnQgY29uc3QgQUxXQVlTX1NFVF9QUkVGSVggPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0FMV0FZU19TRVRfUFJFRklYJyk7XG5cbi8qKlxuICogQ29uZmlnIGludGVyZmFjZSBmb3IgTG9jYWxpemVSb3V0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIHBhcnNlcj86IFByb3ZpZGVyO1xuICB1c2VDYWNoZWRMYW5nPzogYm9vbGVhbjtcbiAgY2FjaGVNZWNoYW5pc20/OiBDYWNoZU1lY2hhbmlzbTtcbiAgY2FjaGVOYW1lPzogc3RyaW5nO1xuICBkZWZhdWx0TGFuZ0Z1bmN0aW9uPzogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb247XG4gIGFsd2F5c1NldFByZWZpeD86IGJvb2xlYW47XG59XG5cbmNvbnN0IExPQ0FMSVpFX0NBQ0hFX05BTUUgPSAnTE9DQUxJWkVfREVGQVVMVF9MQU5HVUFHRSc7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIGltcGxlbWVudHMgTG9jYWxpemVSb3V0ZXJDb25maWcge1xuICAvKipcbiAgICogU2V0dGluZ3MgZm9yIGxvY2FsaXplIHJvdXRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChVU0VfQ0FDSEVEX0xBTkcpIHB1YmxpYyB1c2VDYWNoZWRMYW5nOiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KEFMV0FZU19TRVRfUFJFRklYKSBwdWJsaWMgYWx3YXlzU2V0UHJlZml4OiBib29sZWFuID0gdHJ1ZSxcbiAgICBASW5qZWN0KENBQ0hFX01FQ0hBTklTTSkgcHVibGljIGNhY2hlTWVjaGFuaXNtOiBDYWNoZU1lY2hhbmlzbSA9IENhY2hlTWVjaGFuaXNtLkxvY2FsU3RvcmFnZSxcbiAgICBASW5qZWN0KENBQ0hFX05BTUUpIHB1YmxpYyBjYWNoZU5hbWU6IHN0cmluZyA9IExPQ0FMSVpFX0NBQ0hFX05BTUUsXG4gICAgQEluamVjdChERUZBVUxUX0xBTkdfRlVOQ1RJT04pIHB1YmxpYyBkZWZhdWx0TGFuZ0Z1bmN0aW9uOiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IHZvaWQgMFxuICApIHtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm91dGVzLCBSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2FjaGVNZWNoYW5pc20sIExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmNvbnN0IENPT0tJRV9FWFBJUlkgPSAzMDsgLy8gMSBtb250aFxuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIGZvciBwYXJzaW5nIGxvY2FsaXphdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9jYWxpemVQYXJzZXIge1xuICBsb2NhbGVzOiBBcnJheTxzdHJpbmc+O1xuICBjdXJyZW50TGFuZzogc3RyaW5nO1xuICByb3V0ZXM6IFJvdXRlcztcbiAgZGVmYXVsdExhbmc6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfdHJhbnNsYXRpb25PYmplY3Q6IGFueTtcbiAgcHJpdmF0ZSBfd2lsZGNhcmRSb3V0ZTogUm91dGU7XG4gIHByaXZhdGUgX2xhbmd1YWdlUm91dGU6IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBMb2FkZXIgY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVHJhbnNsYXRlU2VydmljZSkgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXG4gICAgQEluamVjdChMb2NhdGlvbikgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwcml2YXRlIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSB7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCByb3V0ZXMgYW5kIGZldGNoIG5lY2Vzc2FyeSBkYXRhXG4gICAqL1xuICBhYnN0cmFjdCBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+O1xuXG4gIC8qKlxuICogUHJlcGFyZSByb3V0ZXMgdG8gYmUgZnVsbHkgdXNhYmxlIGJ5IG5neC10cmFuc2xhdGUtcm91dGVyXG4gKiBAcGFyYW0gcm91dGVzXG4gKi9cbiAgLyogcHJpdmF0ZSBpbml0Um91dGVzKHJvdXRlczogUm91dGVzLCBwcmVmaXggPSAnJykge1xuICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgICAgICByb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIuZnVsbFBhdGggPSBgJHtwcmVmaXh9LyR7cm91dGUucGF0aH1gO1xuICAgICAgICBpZiAocm91dGUuY2hpbGRyZW4gJiYgcm91dGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZS5jaGlsZHJlbiwgcm91dGVEYXRhLmxvY2FsaXplUm91dGVyLmZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9ICovXG5cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBsYW5ndWFnZSBhbmQgcm91dGVzXG4gICAqL1xuICBwcm90ZWN0ZWQgaW5pdChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgbGV0IHNlbGVjdGVkTGFuZ3VhZ2U6IHN0cmluZztcblxuICAgIC8vIHRoaXMuaW5pdFJvdXRlcyhyb3V0ZXMpO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzO1xuXG4gICAgaWYgKCF0aGlzLmxvY2FsZXMgfHwgIXRoaXMubG9jYWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLyoqIGRldGVjdCBjdXJyZW50IGxhbmd1YWdlICovXG4gICAgY29uc3QgbG9jYXRpb25MYW5nID0gdGhpcy5nZXRMb2NhdGlvbkxhbmcoKTtcbiAgICBjb25zdCBicm93c2VyTGFuZyA9IHRoaXMuX2dldEJyb3dzZXJMYW5nKCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0TGFuZ0Z1bmN0aW9uKHRoaXMubG9jYWxlcywgdGhpcy5fY2FjaGVkTGFuZywgYnJvd3NlckxhbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlZmF1bHRMYW5nID0gdGhpcy5fY2FjaGVkTGFuZyB8fCBicm93c2VyTGFuZyB8fCB0aGlzLmxvY2FsZXNbMF07XG4gICAgfVxuICAgIHNlbGVjdGVkTGFuZ3VhZ2UgPSBsb2NhdGlvbkxhbmcgfHwgdGhpcy5kZWZhdWx0TGFuZztcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyh0aGlzLmRlZmF1bHRMYW5nKTtcblxuICAgIGxldCBjaGlsZHJlbjogUm91dGVzID0gW107XG4gICAgLyoqIGlmIHNldCBwcmVmaXggaXMgZW5mb3JjZWQgKi9cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIGNvbnN0IGJhc2VSb3V0ZSA9IHsgcGF0aDogJycsIHJlZGlyZWN0VG86IHRoaXMuZGVmYXVsdExhbmcsIHBhdGhNYXRjaDogJ2Z1bGwnIH07XG5cbiAgICAgIC8qKiBleHRyYWN0IHBvdGVudGlhbCB3aWxkY2FyZCByb3V0ZSAqL1xuICAgICAgY29uc3Qgd2lsZGNhcmRJbmRleCA9IHJvdXRlcy5maW5kSW5kZXgoKHJvdXRlOiBSb3V0ZSkgPT4gcm91dGUucGF0aCA9PT0gJyoqJyk7XG4gICAgICBpZiAod2lsZGNhcmRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fd2lsZGNhcmRSb3V0ZSA9IHJvdXRlcy5zcGxpY2Uod2lsZGNhcmRJbmRleCwgMSlbMF07XG4gICAgICB9XG4gICAgICBjaGlsZHJlbiA9IHRoaXMucm91dGVzLnNwbGljZSgwLCB0aGlzLnJvdXRlcy5sZW5ndGgsIGJhc2VSb3V0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkcmVuID0gWy4uLnRoaXMucm91dGVzXTsgLy8gc2hhbGxvdyBjb3B5IG9mIHJvdXRlc1xuICAgIH1cblxuICAgIC8qKiBleGNsdWRlIGNlcnRhaW4gcm91dGVzICovXG4gICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0uZGF0YSAmJiBjaGlsZHJlbltpXS5kYXRhWydza2lwUm91dGVMb2NhbGl6YXRpb24nXSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgICAgICAvLyBhZGQgZGlyZWN0bHkgdG8gcm91dGVzXG4gICAgICAgICAgdGhpcy5yb3V0ZXMucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBhcHBlbmQgY2hpbGRyZW4gcm91dGVzICovXG4gICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMubG9jYWxlcy5sZW5ndGggPiAxIHx8IHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgIHRoaXMuX2xhbmd1YWdlUm91dGUgPSB7IGNoaWxkcmVuOiBjaGlsZHJlbiB9O1xuICAgICAgICB0aGlzLnJvdXRlcy51bnNoaWZ0KHRoaXMuX2xhbmd1YWdlUm91dGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiAuLi5hbmQgcG90ZW50aWFsIHdpbGRjYXJkIHJvdXRlICovXG4gICAgaWYgKHRoaXMuX3dpbGRjYXJkUm91dGUgJiYgdGhpcy5zZXR0aW5ncy5hbHdheXNTZXRQcmVmaXgpIHtcbiAgICAgIHRoaXMucm91dGVzLnB1c2godGhpcy5fd2lsZGNhcmRSb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqIHRyYW5zbGF0ZSByb3V0ZXMgKi9cbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZVJvdXRlcyhzZWxlY3RlZExhbmd1YWdlKTtcbiAgICByZXR1cm4gcmVzLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgaW5pdENoaWxkUm91dGVzKHJvdXRlczogUm91dGVzKSB7XG4gICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHJvdXRlcyk7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgcm91dGVzIHRvIHNlbGVjdGVkIGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZXMobGFuZ3VhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPGFueT4oKG9ic2VydmVyOiBPYnNlcnZlcjxhbnk+KSA9PiB7XG4gICAgICB0aGlzLl9jYWNoZWRMYW5nID0gbGFuZ3VhZ2U7XG4gICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICB0aGlzLl9sYW5ndWFnZVJvdXRlLnBhdGggPSBsYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKGxhbmd1YWdlKS5zdWJzY3JpYmUoKHRyYW5zbGF0aW9uczogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uT2JqZWN0ID0gdHJhbnNsYXRpb25zO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5nID0gbGFuZ3VhZ2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhbmd1YWdlUm91dGUpIHtcbiAgICAgICAgICBpZiAodGhpcy5fbGFuZ3VhZ2VSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMuX2xhbmd1YWdlUm91dGUuY2hpbGRyZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyB3aWxkY2FyZCByb3V0ZVxuICAgICAgICAgIGlmICh0aGlzLl93aWxkY2FyZFJvdXRlICYmIHRoaXMuX3dpbGRjYXJkUm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkodGhpcy5fd2lsZGNhcmRSb3V0ZSwgJ3JlZGlyZWN0VG8nLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdHJhbnNsYXRlUm91dGVUcmVlKHRoaXMucm91dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm5leHQodm9pZCAwKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0aGUgcm91dGUgbm9kZSBhbmQgcmVjdXJzaXZlbHkgY2FsbCBmb3IgYWxsIGl0J3MgY2hpbGRyZW5cbiAgICovXG4gIHByaXZhdGUgX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZXM6IFJvdXRlcyk6IHZvaWQge1xuICAgIHJvdXRlcy5mb3JFYWNoKChyb3V0ZTogUm91dGUpID0+IHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoICYmIHJvdXRlLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRlUHJvcGVydHkocm91dGUsICdwYXRoJyk7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICB0aGlzLl90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZSwgJ3JlZGlyZWN0VG8nLCAhcm91dGUucmVkaXJlY3RUby5pbmRleE9mKCcvJykpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZShyb3V0ZS5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgICBpZiAocm91dGUubG9hZENoaWxkcmVuICYmICg8YW55PnJvdXRlKS5fbG9hZGVkQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbGF0ZVJvdXRlVHJlZSgoPGFueT5yb3V0ZSkuX2xvYWRlZENvbmZpZy5yb3V0ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBwcm9wZXJ0eVxuICAgKiBJZiBmaXJzdCB0aW1lIHRyYW5zbGF0aW9uIHRoZW4gYWRkIG9yaWdpbmFsIHRvIHJvdXRlIGRhdGEgb2JqZWN0XG4gICAqL1xuICBwcml2YXRlIF90cmFuc2xhdGVQcm9wZXJ0eShyb3V0ZTogUm91dGUsIHByb3BlcnR5OiBzdHJpbmcsIHByZWZpeExhbmc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gc2V0IHByb3BlcnR5IHRvIGRhdGEgaWYgbm90IHRoZXJlIHlldFxuICAgIGNvbnN0IHJvdXRlRGF0YTogYW55ID0gcm91dGUuZGF0YSA9IHJvdXRlLmRhdGEgfHwge307XG4gICAgaWYgKCFyb3V0ZURhdGEubG9jYWxpemVSb3V0ZXIpIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0pIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhbGl6ZVJvdXRlcltwcm9wZXJ0eV0gPSAoPGFueT5yb3V0ZSlbcHJvcGVydHldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlUm91dGUocm91dGVEYXRhLmxvY2FsaXplUm91dGVyW3Byb3BlcnR5XSk7XG4gICAgKDxhbnk+cm91dGUpW3Byb3BlcnR5XSA9IHByZWZpeExhbmcgPyBgLyR7dGhpcy51cmxQcmVmaXh9JHtyZXN1bHR9YCA6IHJlc3VsdDtcbiAgfVxuXG4gIGdldCB1cmxQcmVmaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4IHx8IHRoaXMuY3VycmVudExhbmcgIT09IHRoaXMuZGVmYXVsdExhbmcgPyB0aGlzLmN1cnJlbnRMYW5nIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIGFuZCByZXR1cm4gb2JzZXJ2YWJsZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVBhcnRzID0gcGF0aC5zcGxpdCgnPycpO1xuICAgIGlmIChxdWVyeVBhcnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGVyZSBzaG91bGQgYmUgb25seSBvbmUgcXVlcnkgcGFyYW1ldGVyIGJsb2NrIGluIHRoZSBVUkwnKTtcbiAgICB9XG4gICAgY29uc3QgcGF0aFNlZ21lbnRzID0gcXVlcnlQYXJ0c1swXS5zcGxpdCgnLycpO1xuXG4gICAgLyoqIGNvbGxlY3Qgb2JzZXJ2YWJsZXMgICovXG4gICAgcmV0dXJuIHBhdGhTZWdtZW50c1xuICAgICAgLm1hcCgocGFydDogc3RyaW5nKSA9PiBwYXJ0Lmxlbmd0aCA/IHRoaXMudHJhbnNsYXRlVGV4dChwYXJ0KSA6IHBhcnQpXG4gICAgICAuam9pbignLycpICtcbiAgICAgIChxdWVyeVBhcnRzLmxlbmd0aCA+IDEgPyBgPyR7cXVlcnlQYXJ0c1sxXX1gIDogJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIHVybFxuICAgKi9cbiAgZ2V0TG9jYXRpb25MYW5nKHVybD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlQYXJhbVNwbGl0ID0gKHVybCB8fCB0aGlzLmxvY2F0aW9uLnBhdGgoKSkuc3BsaXQoJz8nKTtcbiAgICBsZXQgcGF0aFNsaWNlczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAocXVlcnlQYXJhbVNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhdGhTbGljZXMgPSBxdWVyeVBhcmFtU3BsaXRbMF0uc3BsaXQoJy8nKTtcbiAgICB9XG4gICAgaWYgKHBhdGhTbGljZXMubGVuZ3RoID4gMSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZihwYXRoU2xpY2VzWzFdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBwYXRoU2xpY2VzWzFdO1xuICAgIH1cbiAgICBpZiAocGF0aFNsaWNlcy5sZW5ndGggJiYgdGhpcy5sb2NhbGVzLmluZGV4T2YocGF0aFNsaWNlc1swXSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gcGF0aFNsaWNlc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHVzZXIncyBsYW5ndWFnZSBzZXQgaW4gdGhlIGJyb3dzZXJcbiAgICovXG4gIHByaXZhdGUgX2dldEJyb3dzZXJMYW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHRoaXMudHJhbnNsYXRlLmdldEJyb3dzZXJMYW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsYW5ndWFnZSBmcm9tIGxvY2FsIHN0b3JhZ2Ugb3IgY29va2llXG4gICAqL1xuICBwcml2YXRlIGdldCBfY2FjaGVkTGFuZygpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuY2FjaGVNZWNoYW5pc20gPT09IENhY2hlTWVjaGFuaXNtLkNvb2tpZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlV2l0aENvb2tpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBsYW5ndWFnZSB0byBsb2NhbCBzdG9yYWdlIG9yIGNvb2tpZVxuICAgKi9cbiAgcHJpdmF0ZSBzZXQgX2NhY2hlZExhbmcodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy51c2VDYWNoZWRMYW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aExvY2FsU3RvcmFnZSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhY2hlTWVjaGFuaXNtID09PSBDYWNoZU1lY2hhbmlzbS5Db29raWUpIHtcbiAgICAgIHRoaXMuX2NhY2hlV2l0aENvb2tpZXModmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWNoZSB2YWx1ZSB0byBsb2NhbCBzdG9yYWdlXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhMb2NhbFN0b3JhZ2UodmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zZXR0aW5ncy5jYWNoZU5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3JldHVybklmSW5Mb2NhbGVzKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHdlaXJkIFNhZmFyaSBpc3N1ZSBpbiBwcml2YXRlIG1vZGUsIHdoZXJlIExvY2FsU3RvcmFnZSBpcyBkZWZpbmVkIGJ1dCB0aHJvd3MgZXJyb3Igb24gYWNjZXNzXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHZhbHVlIHZpYSBjb29raWVzXG4gICAqL1xuICBwcml2YXRlIF9jYWNoZVdpdGhDb29raWVzKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQuY29va2llID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLnNldHRpbmdzLmNhY2hlTmFtZSk7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgY29uc3QgZDogRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIENPT0tJRV9FWFBJUlkgKiA4NjQwMDAwMCk7IC8vICogZGF5c1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke2VuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9O2V4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86XicgKyBuYW1lICsgJ3w7XFxcXHMqJyArIG5hbWUgKyAnKT0oLio/KSg/Ojt8JCknLCAnZycpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVnZXhwLmV4ZWMoZG9jdW1lbnQuY29va2llKTtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzFdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm47IC8vIHNob3VsZCBub3QgaGFwcGVuIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHZhbHVlIGV4aXN0cyBpbiBsb2NhbGVzIGxpc3RcbiAgICovXG4gIHByaXZhdGUgX3JldHVybklmSW5Mb2NhbGVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmxvY2FsZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0cmFuc2xhdGVkIHZhbHVlXG4gICAqL1xuICBwcml2YXRlIHRyYW5zbGF0ZVRleHQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5fdHJhbnNsYXRpb25PYmplY3QpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLnByZWZpeCArIGtleTtcbiAgICBjb25zdCByZXMgPSB0aGlzLnRyYW5zbGF0ZS5nZXRQYXJzZWRSZXN1bHQodGhpcy5fdHJhbnNsYXRpb25PYmplY3QsIGZ1bGxLZXkpO1xuICAgIHJldHVybiByZXMgIT09IGZ1bGxLZXkgPyByZXMgOiBrZXk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYW51YWxseSBzZXQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY2xhc3MgTWFudWFsUGFyc2VyTG9hZGVyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsIGxvY2F0aW9uOiBMb2NhdGlvbiwgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgbG9jYWxlczogc3RyaW5nW10gPSBbJ2VuJ10sIHByZWZpeDogc3RyaW5nID0gJ1JPVVRFUy4nKSB7XG4gICAgc3VwZXIodHJhbnNsYXRlLCBsb2NhdGlvbiwgc2V0dGluZ3MpO1xuICAgIHRoaXMubG9jYWxlcyA9IGxvY2FsZXM7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXggfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBvciBhcHBlbmQgcm91dGVzXG4gICAqL1xuICBsb2FkKHJvdXRlczogUm91dGVzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5pbml0KHJvdXRlcykudGhlbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRHVtbXlMb2NhbGl6ZVBhcnNlciBleHRlbmRzIExvY2FsaXplUGFyc2VyIHtcbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdChyb3V0ZXMpLnRoZW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIFVybFNlZ21lbnQsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBzZXJ2aWNlXG4gKiBtb2RpZnlSb3V0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2VydmljZSB7XG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoTG9jYWxpemVQYXJzZXIpIHB1YmxpYyBwYXJzZXI6IExvY2FsaXplUGFyc2VyLFxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICBASW5qZWN0KFJvdXRlcikgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIEBJbmplY3QoQWN0aXZhdGVkUm91dGUpIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXG4gICAgKSB7XG4gICAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxuICAgKi9cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcbiAgICAgICAgcGFpcndpc2UoKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIGxhbmd1YWdlIGFuZCBuYXZpZ2F0ZSB0byB0cmFuc2xhdGVkIHJvdXRlXG4gICAqL1xuICBjaGFuZ2VMYW5ndWFnZShsYW5nOiBzdHJpbmcsIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXMsIHVzZU5hdmlnYXRlTWV0aG9kPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlKTtcbiAgICB9XG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICBjb25zdCByb290U25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC5yb290O1xuXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcblxuICAgICAgICBsZXQgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KTtcbiAgICAgICAgdXJsID0gdGhpcy50cmFuc2xhdGVSb3V0ZSh1cmwpIGFzIHN0cmluZztcblxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgbGV0IHVybFNlZ21lbnRzID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgbGFuZ3VhZ2VTZWdtZW50SW5kZXggPSB1cmxTZWdtZW50cy5pbmRleE9mKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVmYXVsdCBsYW5ndWFnZSBoYXMgbm8gcHJlZml4IG1ha2Ugc3VyZSB0byByZW1vdmUgYW5kIGFkZCBpdCB3aGVuIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5jdXJyZW50TGFuZyA9PT0gdGhpcy5wYXJzZXIuZGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdXJsIHdoZW4gY3VycmVudCBsYW5ndWFnZSBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZVxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAwIHx8IChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMSAmJiB1cmxTZWdtZW50c1swXSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBha2EgZGVmYXVsdCBsYW5ndWFnZSBwcmVmaXggZnJvbSB0aGUgdXJsXG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgbGFuZ3VhZ2VTZWdtZW50SW5kZXgpLmNvbmNhdCh1cmxTZWdtZW50cy5zbGljZShsYW5ndWFnZVNlZ21lbnRJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2hlbiBjb21pbmcgZnJvbSBhIGRlZmF1bHQgbGFuZ3VhZ2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSB1cmwgZG9lc24ndCBjb250YWluIHRoZSBsYW5ndWFnZSwgbWFrZSBzdXJlIGl0IGRvZXMuXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgc3RhcnRzIHdpdGggYSBzbGFzaCBtYWtlIHN1cmUgdG8ga2VlcCBpdC5cbiAgICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9uSW5kZXggPSB1cmxTZWdtZW50c1swXSA9PT0gJycgPyAxIDogMDtcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBpbmplY3Rpb25JbmRleCkuY29uY2F0KHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nLCB1cmxTZWdtZW50cy5zbGljZShpbmplY3Rpb25JbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cmwgPSB1cmxTZWdtZW50cy5qb2luKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICBpZiAodXNlTmF2aWdhdGVNZXRob2QpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSwgZXh0cmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCwgZXh0cmFzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aHJvdWdoIHRoZSB0cmVlIHRvIGFzc2VtYmxlIG5ldyB0cmFuc2xhdGVkIHVybFxuICAgKi9cbiAgcHJpdmF0ZSB0cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuXG4gICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KX0vJHt0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKX1gO1xuICAgIH0gZWxzZSBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgLyogaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGgpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpICsgJy8nICsgdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIG5ldyBzZWdtZW50IHZhbHVlIGJhc2VkIG9uIHJvdXRlQ29uZmlnIGFuZCB1cmxcbiAgICovXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIGlmIChzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICBjb25zdCBwYXRoID0gc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlci5wYXRoO1xuICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8qIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGggPT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHNuYXBzaG90LnVybC5maWx0ZXIoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkubWFwKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLmpvaW4oJy8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7ICovXG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIHRvIGN1cnJlbnQgbGFuZ3VhZ2VcbiAgICogSWYgbmV3IGxhbmd1YWdlIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQgdGhlbiByZXBsYWNlIGxhbmd1YWdlIHBhcnQgaW4gdXJsIHdpdGggbmV3IGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShwYXRoKTtcbiAgICAgIHJldHVybiAhcGF0aC5pbmRleE9mKCcvJykgPyBgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7dXJsfWAgOiB1cmw7XG4gICAgfVxuICAgIC8vIGl0J3MgYW4gYXJyYXlcbiAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gICAgKHBhdGggYXMgQXJyYXk8YW55PikuZm9yRWFjaCgoc2VnbWVudDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHNlZ21lbnQpO1xuICAgICAgICBpZiAoIWluZGV4ICYmICFzZWdtZW50LmluZGV4T2YoJy8nKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHtyZXN9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IG9uIHJvdXRlIGNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBfcm91dGVDaGFuZ2VkKCk6IChldmVudFBhaXI6IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHZvaWQge1xuICAgIHJldHVybiAoW3ByZXZpb3VzRXZlbnQsIGN1cnJlbnRFdmVudF06IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhwcmV2aW91c0V2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG4gICAgICBjb25zdCBjdXJyZW50TGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhjdXJyZW50RXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcblxuICAgICAgaWYgKGN1cnJlbnRMYW5nICE9PSBwcmV2aW91c0xhbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGN1cnJlbnRMYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgICAgLy8gRmlyZSByb3V0ZSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICB0aGlzLnJvdXRlckV2ZW50cy5uZXh0KGN1cnJlbnRMYW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwiLyoqXG4gKiBDb21wYXJlIGlmIHR3byBvYmplY3RzIGFyZSBzYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbHMobzE6IGFueSwgbzI6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAobzEgPT09IG8yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG8xID09PSBudWxsIHx8IG8yID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChvMSAhPT0gbzEgJiYgbzIgIT09IG8yKSB7XG4gICAgcmV0dXJuIHRydWU7IC8vIE5hTiA9PT0gTmFOXG4gIH1cbiAgY29uc3QgdDEgPSB0eXBlb2YgbzEsXG4gICAgdDIgPSB0eXBlb2YgbzI7XG4gIGxldCBsZW5ndGg6IG51bWJlcixcbiAgICBrZXk6IGFueSxcbiAgICBrZXlTZXQ6IGFueTtcblxuICBpZiAodDEgPT09IHQyICYmIHQxID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG8xKSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG8yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKGxlbmd0aCA9IG8xLmxlbmd0aCkgPT09IG8yLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGtleSA9IDA7IGtleSA8IGxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICBpZiAoIWVxdWFscyhvMVtrZXldLCBvMltrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobzIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGtleVNldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBmb3IgKGtleSBpbiBvMSkge1xuICAgICAgICBpZiAobzEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmICghZXF1YWxzKG8xW2tleV0sIG8yW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGtleVNldFtrZXldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gbzIpIHtcbiAgICAgICAgaWYgKG8yLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoIShrZXkgaW4ga2V5U2V0KSAmJiB0eXBlb2YgbzJba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJpbXBvcnQgeyBQaXBlVHJhbnNmb3JtLCBQaXBlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZXF1YWxzIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgVklFV19ERVNUUk9ZRURfU1RBVEUgPSAxMjg7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2xvY2FsaXplJyxcbiAgcHVyZTogZmFsc2UgLy8gcmVxdWlyZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0sIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdmFsdWU6IHN0cmluZyB8IGFueVtdID0gJyc7XG4gIHByaXZhdGUgbGFzdEtleTogc3RyaW5nIHwgYW55W107XG4gIHByaXZhdGUgbGFzdExhbmd1YWdlOiBzdHJpbmc7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2NhbGl6ZS5yb3V0ZXJFdmVudHMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMubGFzdEtleSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBjdXJyZW50IHVybCB0byBsb2NhbGl6ZWQgb25lXG4gICAqL1xuICB0cmFuc2Zvcm0ocXVlcnk6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICghcXVlcnkgfHwgcXVlcnkubGVuZ3RoID09PSAwIHx8ICF0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykge1xuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgICBpZiAoZXF1YWxzKHF1ZXJ5LCB0aGlzLmxhc3RLZXkpICYmIGVxdWFscyh0aGlzLmxhc3RMYW5ndWFnZSwgdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgdGhpcy5sYXN0TGFuZ3VhZ2UgPSB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZztcblxuICAgIC8qKiB0cmFuc2xhdGUga2V5IGFuZCB1cGRhdGUgdmFsdWVzICovXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubG9jYWxpemUudHJhbnNsYXRlUm91dGUocXVlcnkpO1xuICAgIHRoaXMubGFzdEtleSA9IHF1ZXJ5O1xuICAgIC8vIGlmIHZpZXcgaXMgYWxyZWFkeSBkZXN0cm95ZWQsIGlnbm9yZSBmaXJpbmcgY2hhbmdlIGRldGVjdGlvblxuICAgIGlmICgoPGFueT4gdGhpcy5fcmVmKS5fdmlldy5zdGF0ZSAmIFZJRVdfREVTVFJPWUVEX1NUQVRFKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUk9VVEVTIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIsIE5nTW9kdWxlRmFjdG9yeSwgSW5qZWN0b3IsXG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcsIE9wdGlvbmFsLCBDb21waWxlciwgSW5qZWN0YWJsZSwgSW5qZWN0LCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuXG4vKipcbiAqIEV4dGVuc2lvbiBvZiBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIHRvIGVuYWJsZSBsb2NhbGl6YXRpb24gb2Ygcm91dGUgb24gbGF6eSBsb2FkXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciBleHRlbmRzIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIge1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBMb2NhbGl6ZVBhcnNlcikpIHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUGFyc2VyLFxuICAgIF9jb21waWxlcjogQ29tcGlsZXIsIEBPcHRpb25hbCgpIGNvbmZpZz86IFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcpIHtcbiAgICAgIHN1cGVyKF9jb21waWxlciwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlbmQgbG9hZCB3aXRoIGN1c3RvbSBmdW5jdGlvbmFsaXR5XG4gICAqL1xuICBsb2FkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PGFueT4+IHtcbiAgICByZXR1cm4gc3VwZXIubG9hZChwYXRoKS50aGVuKChmYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8YW55PikgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbW9kdWxlVHlwZTogZmFjdG9yeS5tb2R1bGVUeXBlLFxuICAgICAgICBjcmVhdGU6IChwYXJlbnRJbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICAgICAgICBjb25zdCBtb2R1bGUgPSBmYWN0b3J5LmNyZWF0ZShwYXJlbnRJbmplY3Rvcik7XG4gICAgICAgICAgY29uc3QgZ2V0TWV0aG9kID0gbW9kdWxlLmluamVjdG9yLmdldC5iaW5kKG1vZHVsZS5pbmplY3Rvcik7XG5cbiAgICAgICAgICBtb2R1bGUuaW5qZWN0b3JbJ2dldCddID0gKHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2V0UmVzdWx0ID0gZ2V0TWV0aG9kKHRva2VuLCBub3RGb3VuZFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRva2VuID09PSBST1VURVMpIHtcbiAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlIGxhenkgcm91dGVzXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsaXplLmluaXRDaGlsZFJvdXRlcyhbXS5jb25jYXQoLi4uZ2V0UmVzdWx0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIEFQUF9JTklUSUFMSVpFUiwgT3B0aW9uYWwsIFNraXBTZWxmLFxuICBJbmplY3RhYmxlLCBJbmplY3RvciwgTmdNb2R1bGVGYWN0b3J5TG9hZGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBEdW1teUxvY2FsaXplUGFyc2VyLCBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclBpcGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5waXBlJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFMV0FZU19TRVRfUFJFRklYLFxuICBDQUNIRV9NRUNIQU5JU00sIENBQ0hFX05BTUUsIERFRkFVTFRfTEFOR19GVU5DVElPTiwgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQsIExvY2FsaXplUm91dGVyQ29uZmlnLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICBSQVdfUk9VVEVTLFxuICBVU0VfQ0FDSEVEX0xBTkdcbn0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQYXJzZXJJbml0aWFsaXplciB7XG4gIHBhcnNlcjogTG9jYWxpemVQYXJzZXI7XG4gIHJvdXRlczogUm91dGVzO1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3Rvcikge1xuICB9XG5cbiAgYXBwSW5pdGlhbGl6ZXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci5sb2FkKHRoaXMucm91dGVzKTtcbiAgICByZXMudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxpemVSb3V0ZXJTZXJ2aWNlKTtcbiAgICAgIGxvY2FsaXplLmluaXQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZW5lcmF0ZUluaXRpYWxpemVyKHBhcnNlcjogTG9jYWxpemVQYXJzZXIsIHJvdXRlczogUm91dGVzW10pOiAoKSA9PiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpO1xuICAgIHJldHVybiB0aGlzLmFwcEluaXRpYWxpemVyO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBJbml0aWFsaXplcihwOiBQYXJzZXJJbml0aWFsaXplciwgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlciwgcm91dGVzOiBSb3V0ZXNbXSk6IGFueSB7XG4gIHJldHVybiBwLmdlbmVyYXRlSW5pdGlhbGl6ZXIocGFyc2VyLCByb3V0ZXMpLmJpbmQocCk7XG59XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFJvdXRlck1vZHVsZSwgVHJhbnNsYXRlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTG9jYWxpemVSb3V0ZXJQaXBlXSxcbiAgZXhwb3J0czogW0xvY2FsaXplUm91dGVyUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJNb2R1bGUge1xuXG4gIHN0YXRpYyBmb3JSb290KHJvdXRlczogUm91dGVzLCBjb25maWc6IExvY2FsaXplUm91dGVyQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBwcm92aWRlRm9yUm9vdEd1YXJkLFxuICAgICAgICAgIGRlcHM6IFtbTG9jYWxpemVSb3V0ZXJNb2R1bGUsIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVVNFX0NBQ0hFRF9MQU5HLCB1c2VWYWx1ZTogY29uZmlnLnVzZUNhY2hlZExhbmcgfSxcbiAgICAgICAgeyBwcm92aWRlOiBBTFdBWVNfU0VUX1BSRUZJWCwgdXNlVmFsdWU6IGNvbmZpZy5hbHdheXNTZXRQcmVmaXggfSxcbiAgICAgICAgeyBwcm92aWRlOiBDQUNIRV9OQU1FLCB1c2VWYWx1ZTogY29uZmlnLmNhY2hlTmFtZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENBQ0hFX01FQ0hBTklTTSwgdXNlVmFsdWU6IGNvbmZpZy5jYWNoZU1lY2hhbmlzbSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERFRkFVTFRfTEFOR19GVU5DVElPTiwgdXNlVmFsdWU6IGNvbmZpZy5kZWZhdWx0TGFuZ0Z1bmN0aW9uIH0sXG4gICAgICAgIExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICAgIGNvbmZpZy5wYXJzZXIgfHwgeyBwcm92aWRlOiBMb2NhbGl6ZVBhcnNlciwgdXNlQ2xhc3M6IER1bW15TG9jYWxpemVQYXJzZXIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJBV19ST1VURVMsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlVmFsdWU6IHJvdXRlc1xuICAgICAgICB9LFxuICAgICAgICBMb2NhbGl6ZVJvdXRlclNlcnZpY2UsXG4gICAgICAgIFBhcnNlckluaXRpYWxpemVyLFxuICAgICAgICB7IHByb3ZpZGU6IE5nTW9kdWxlRmFjdG9yeUxvYWRlciwgdXNlQ2xhc3M6IExvY2FsaXplUm91dGVyQ29uZmlnTG9hZGVyIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgdXNlRmFjdG9yeTogZ2V0QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW1BhcnNlckluaXRpYWxpemVyLCBMb2NhbGl6ZVBhcnNlciwgUkFXX1JPVVRFU11cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yQ2hpbGQocm91dGVzOiBSb3V0ZXMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSQVdfUk9VVEVTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIHVzZVZhbHVlOiByb3V0ZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVGb3JSb290R3VhcmQobG9jYWxpemVSb3V0ZXJNb2R1bGU6IExvY2FsaXplUm91dGVyTW9kdWxlKTogc3RyaW5nIHtcbiAgaWYgKGxvY2FsaXplUm91dGVyTW9kdWxlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYExvY2FsaXplUm91dGVyTW9kdWxlLmZvclJvb3QoKSBjYWxsZWQgdHdpY2UuIExhenkgbG9hZGVkIG1vZHVsZXMgc2hvdWxkIHVzZSBMb2NhbGl6ZVJvdXRlck1vZHVsZS5mb3JDaGlsZCgpIGluc3RlYWQuYCk7XG4gIH1cbiAgcmV0dXJuICdndWFyZGVkJztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7QUFPQSx1QkFBYSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FBdUIsK0JBQStCLENBQUMsQ0FBQzs7OztBQUt2SCx1QkFBYSxVQUFVLEdBQTZCLElBQUksY0FBYyxDQUFXLFlBQVksQ0FB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