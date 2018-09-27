/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, InjectionToken } from '@angular/core';
/**
 * Guard to make sure we have single initialization of forRoot
 */
export const /** @type {?} */ LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 */
export const /** @type {?} */ RAW_ROUTES = new InjectionToken('RAW_ROUTES');
/**
 * Namespace for fail proof access of CacheMechanism
 */
export var CacheMechanism;
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
export const /** @type {?} */ USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
export const /** @type {?} */ CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 */
export const /** @type {?} */ CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 */
export const /** @type {?} */ DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export const /** @type {?} */ ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
/**
 * Config interface for LocalizeRouter
 * @record
 */
export function LocalizeRouterConfig() { }
function LocalizeRouterConfig_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.parser;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.useCachedLang;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.cacheMechanism;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.cacheName;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.defaultLangFunction;
    /** @type {?|undefined} */
    LocalizeRouterConfig.prototype.alwaysSetPrefix;
}
const /** @type {?} */ LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
export class LocalizeRouterSettings {
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
function LocalizeRouterSettings_tsickle_Closure_declarations() {
    /** @type {?} */
    LocalizeRouterSettings.prototype.useCachedLang;
    /** @type {?} */
    LocalizeRouterSettings.prototype.alwaysSetPrefix;
    /** @type {?} */
    LocalizeRouterSettings.prototype.cacheMechanism;
    /** @type {?} */
    LocalizeRouterSettings.prototype.cacheName;
    /** @type {?} */
    LocalizeRouterSettings.prototype.defaultLangFunction;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFZLE1BQU0sZUFBZSxDQUFDOzs7O0FBT2pFLE1BQU0sQ0FBQyx1QkFBTSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FBdUIsK0JBQStCLENBQUMsQ0FBQzs7OztBQUt2SCxNQUFNLENBQUMsdUJBQU0sVUFBVSxHQUE2QixJQUFJLGNBQWMsQ0FBVyxZQUFZLENBQUMsQ0FBQzs7OztBQVUvRixNQUFNLEtBQVcsY0FBYzs7OztBQUEvQixXQUFpQixjQUFjO0lBQ2hCLDJCQUFZLEdBQW1CLGNBQWM7SUFDN0MscUJBQU0sR0FBbUIsUUFBUTtHQUYvQixjQUFjLEtBQWQsY0FBYyxRQUc5Qjs7OztBQUtELE1BQU0sQ0FBQyx1QkFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQVUsaUJBQWlCLENBQUMsQ0FBQzs7OztBQUk5RSxNQUFNLENBQUMsdUJBQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFpQixpQkFBaUIsQ0FBQyxDQUFDOzs7O0FBSXJGLE1BQU0sQ0FBQyx1QkFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQVMsWUFBWSxDQUFDLENBQUM7Ozs7QUFXbkUsTUFBTSxDQUFDLHVCQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUEwQix1QkFBdUIsQ0FBQyxDQUFDOzs7O0FBSzFHLE1BQU0sQ0FBQyx1QkFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBVSxtQkFBbUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNsRix1QkFBTSxtQkFBbUIsR0FBRywyQkFBMkIsQ0FBQztBQUV4RCxNQUFNOzs7Ozs7Ozs7SUFJSixZQUNrQyxnQkFBeUIsSUFBSSxFQUMzQixrQkFBMkIsSUFBSSxFQUNqQyxpQkFBaUMsY0FBYyxDQUFDLFlBQVksRUFDakUsWUFBb0IsbUJBQW1CLEVBQzVCLHNCQUErQyxLQUFLLENBQUM7UUFKM0Qsa0JBQWEsR0FBYixhQUFhLENBQWdCO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUNqQyxtQkFBYyxHQUFkLGNBQWMsQ0FBOEM7UUFDakUsY0FBUyxHQUFULFNBQVMsQ0FBOEI7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFrQztLQUU1Rjs7OzswQ0FORSxNQUFNLFNBQUMsZUFBZTswQ0FDdEIsTUFBTSxTQUFDLGlCQUFpQjtZQUN1QixjQUFjLHVCQUE3RCxNQUFNLFNBQUMsZUFBZTt5Q0FDdEIsTUFBTSxTQUFDLFVBQVU7NENBQ2pCLE1BQU0sU0FBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGlvblRva2VuLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyTW9kdWxlIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIubW9kdWxlJztcblxuLyoqXG4gKiBHdWFyZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBzaW5nbGUgaW5pdGlhbGl6YXRpb24gb2YgZm9yUm9vdFxuICovXG5leHBvcnQgY29uc3QgTE9DQUxJWkVfUk9VVEVSX0ZPUlJPT1RfR1VBUkQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TG9jYWxpemVSb3V0ZXJNb2R1bGU+KCdMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCcpO1xuXG4vKipcbiAqIFN0YXRpYyBwcm92aWRlciBmb3Iga2VlcGluZyB0cmFjayBvZiByb3V0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IFJBV19ST1VURVM6IEluamVjdGlvblRva2VuPFJvdXRlc1tdPiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSb3V0ZXNbXT4oJ1JBV19ST1VURVMnKTtcblxuLyoqXG4gKiBUeXBlIGZvciBDYWNoaW5nIG9mIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqL1xuZXhwb3J0IHR5cGUgQ2FjaGVNZWNoYW5pc20gPSAnTG9jYWxTdG9yYWdlJyB8ICdDb29raWUnO1xuXG4vKipcbiAqIE5hbWVzcGFjZSBmb3IgZmFpbCBwcm9vZiBhY2Nlc3Mgb2YgQ2FjaGVNZWNoYW5pc21cbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBDYWNoZU1lY2hhbmlzbSB7XG4gIGV4cG9ydCBjb25zdCBMb2NhbFN0b3JhZ2U6IENhY2hlTWVjaGFuaXNtID0gJ0xvY2FsU3RvcmFnZSc7XG4gIGV4cG9ydCBjb25zdCBDb29raWU6IENhY2hlTWVjaGFuaXNtID0gJ0Nvb2tpZSc7XG59XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHRvIHVzZSBjYWNoZWQgbGFuZ3VhZ2UgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IFVTRV9DQUNIRURfTEFORyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignVVNFX0NBQ0hFRF9MQU5HJyk7XG4vKipcbiAqIENhY2hlIG1lY2hhbmlzbSB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBDQUNIRV9NRUNIQU5JU00gPSBuZXcgSW5qZWN0aW9uVG9rZW48Q2FjaGVNZWNoYW5pc20+KCdDQUNIRV9NRUNIQU5JU00nKTtcbi8qKlxuICogQ2FjaGUgbmFtZVxuICovXG5leHBvcnQgY29uc3QgQ0FDSEVfTkFNRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdDQUNIRV9OQU1FJyk7XG5cbi8qKlxuICogVHlwZSBmb3IgZGVmYXVsdCBsYW5ndWFnZSBmdW5jdGlvblxuICogVXNlZCB0byBvdmVycmlkZSBiYXNpYyBiZWhhdmlvdXJcbiAqL1xuZXhwb3J0IHR5cGUgRGVmYXVsdExhbmd1YWdlRnVuY3Rpb24gPSAobGFuZ3VhZ2VzOiBzdHJpbmdbXSwgY2FjaGVkTGFuZz86IHN0cmluZywgYnJvd3Nlckxhbmc/OiBzdHJpbmcpID0+IHN0cmluZztcblxuLyoqXG4gKiBGdW5jdGlvbiBmb3IgY2FsY3VsYXRpbmcgZGVmYXVsdCBsYW5ndWFnZVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9MQU5HX0ZVTkNUSU9OID0gbmV3IEluamVjdGlvblRva2VuPERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uPignREVGQVVMVF9MQU5HX0ZVTkNUSU9OJyk7XG5cbi8qKlxuICogQm9vbGVhbiB0byBpbmRpY2F0ZSB3aGV0aGVyIHByZWZpeCBzaG91bGQgYmUgc2V0IGZvciBzaW5nbGUgbGFuZ3VhZ2Ugc2NlbmFyaW9zXG4gKi9cbmV4cG9ydCBjb25zdCBBTFdBWVNfU0VUX1BSRUZJWCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQUxXQVlTX1NFVF9QUkVGSVgnKTtcblxuLyoqXG4gKiBDb25maWcgaW50ZXJmYWNlIGZvciBMb2NhbGl6ZVJvdXRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsaXplUm91dGVyQ29uZmlnIHtcbiAgcGFyc2VyPzogUHJvdmlkZXI7XG4gIHVzZUNhY2hlZExhbmc/OiBib29sZWFuO1xuICBjYWNoZU1lY2hhbmlzbT86IENhY2hlTWVjaGFuaXNtO1xuICBjYWNoZU5hbWU/OiBzdHJpbmc7XG4gIGRlZmF1bHRMYW5nRnVuY3Rpb24/OiBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbjtcbiAgYWx3YXlzU2V0UHJlZml4PzogYm9vbGVhbjtcbn1cblxuY29uc3QgTE9DQUxJWkVfQ0FDSEVfTkFNRSA9ICdMT0NBTElaRV9ERUZBVUxUX0xBTkdVQUdFJztcblxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2V0dGluZ3MgaW1wbGVtZW50cyBMb2NhbGl6ZVJvdXRlckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXR0aW5ncyBmb3IgbG9jYWxpemUgcm91dGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFVTRV9DQUNIRURfTEFORykgcHVibGljIHVzZUNhY2hlZExhbmc6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQUxXQVlTX1NFVF9QUkVGSVgpIHB1YmxpYyBhbHdheXNTZXRQcmVmaXg6IGJvb2xlYW4gPSB0cnVlLFxuICAgIEBJbmplY3QoQ0FDSEVfTUVDSEFOSVNNKSBwdWJsaWMgY2FjaGVNZWNoYW5pc206IENhY2hlTWVjaGFuaXNtID0gQ2FjaGVNZWNoYW5pc20uTG9jYWxTdG9yYWdlLFxuICAgIEBJbmplY3QoQ0FDSEVfTkFNRSkgcHVibGljIGNhY2hlTmFtZTogc3RyaW5nID0gTE9DQUxJWkVfQ0FDSEVfTkFNRSxcbiAgICBASW5qZWN0KERFRkFVTFRfTEFOR19GVU5DVElPTikgcHVibGljIGRlZmF1bHRMYW5nRnVuY3Rpb246IERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uID0gdm9pZCAwXG4gICkge1xuICB9XG59XG4iXX0=