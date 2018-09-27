import { Routes, Route } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocalizeRouterSettings } from './localize-router.config';
/**
 * Abstract class for parsing localization
 */
export declare abstract class LocalizeParser {
    private translate;
    private location;
    private settings;
    locales: Array<string>;
    currentLang: string;
    routes: Routes;
    defaultLang: string;
    protected prefix: string;
    private _translationObject;
    private _wildcardRoute;
    private _languageRoute;
    /**
     * Loader constructor
     */
    constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings);
    /**
     * Load routes and fetch necessary data
     */
    abstract load(routes: Routes): Promise<any>;
    /**
   * Prepare routes to be fully usable by ngx-translate-router
   * @param routes
   */
    /**
     * Initialize language and routes
     */
    protected init(routes: Routes): Promise<any>;
    initChildRoutes(routes: Routes): Route[];
    /**
     * Translate routes to selected language
     */
    translateRoutes(language: string): Observable<any>;
    /**
     * Translate the route node and recursively call for all it's children
     */
    private _translateRouteTree(routes);
    /**
     * Translate property
     * If first time translation then add original to route data object
     */
    private _translateProperty(route, property, prefixLang?);
    readonly urlPrefix: string;
    /**
     * Translate route and return observable
     */
    translateRoute(path: string): string;
    /**
     * Get language from url
     */
    getLocationLang(url?: string): string;
    /**
     * Get user's language set in the browser
     */
    private _getBrowserLang();
    /**
     * Get language from local storage or cookie
     */
    /**
     * Save language to local storage or cookie
     */
    private _cachedLang;
    /**
     * Cache value to local storage
     */
    private _cacheWithLocalStorage(value?);
    /**
     * Cache value via cookies
     */
    private _cacheWithCookies(value?);
    /**
     * Check if value exists in locales list
     */
    private _returnIfInLocales(value);
    /**
     * Get translated value
     */
    private translateText(key);
}
/**
 * Manually set configuration
 */
export declare class ManualParserLoader extends LocalizeParser {
    /**
     * CTOR
     */
    constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, locales?: string[], prefix?: string);
    /**
     * Initialize or append routes
     */
    load(routes: Routes): Promise<any>;
}
export declare class DummyLocalizeParser extends LocalizeParser {
    load(routes: Routes): Promise<any>;
}
