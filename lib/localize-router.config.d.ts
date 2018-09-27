import { InjectionToken, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';
/**
 * Guard to make sure we have single initialization of forRoot
 */
export declare const LOCALIZE_ROUTER_FORROOT_GUARD: InjectionToken<LocalizeRouterModule>;
/**
 * Static provider for keeping track of routes
 */
export declare const RAW_ROUTES: InjectionToken<Routes[]>;
/**
 * Type for Caching of default language
 */
export declare type CacheMechanism = 'LocalStorage' | 'Cookie';
/**
 * Namespace for fail proof access of CacheMechanism
 */
export declare namespace CacheMechanism {
    const LocalStorage: CacheMechanism;
    const Cookie: CacheMechanism;
}
/**
 * Boolean to indicate whether to use cached language value
 */
export declare const USE_CACHED_LANG: InjectionToken<boolean>;
/**
 * Cache mechanism type
 */
export declare const CACHE_MECHANISM: InjectionToken<CacheMechanism>;
/**
 * Cache name
 */
export declare const CACHE_NAME: InjectionToken<string>;
/**
 * Type for default language function
 * Used to override basic behaviour
 */
export declare type DefaultLanguageFunction = (languages: string[], cachedLang?: string, browserLang?: string) => string;
/**
 * Function for calculating default language
 */
export declare const DEFAULT_LANG_FUNCTION: InjectionToken<DefaultLanguageFunction>;
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export declare const ALWAYS_SET_PREFIX: InjectionToken<boolean>;
/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
    parser?: Provider;
    useCachedLang?: boolean;
    cacheMechanism?: CacheMechanism;
    cacheName?: string;
    defaultLangFunction?: DefaultLanguageFunction;
    alwaysSetPrefix?: boolean;
}
export declare class LocalizeRouterSettings implements LocalizeRouterConfig {
    useCachedLang: boolean;
    alwaysSetPrefix: boolean;
    cacheMechanism: CacheMechanism;
    cacheName: string;
    defaultLangFunction: DefaultLanguageFunction;
    /**
     * Settings for localize router
     */
    constructor(useCachedLang?: boolean, alwaysSetPrefix?: boolean, cacheMechanism?: CacheMechanism, cacheName?: string, defaultLangFunction?: DefaultLanguageFunction);
}
