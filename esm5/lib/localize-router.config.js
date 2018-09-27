/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, InjectionToken } from '@angular/core';
/**
 * Guard to make sure we have single initialization of forRoot
 */
export var /** @type {?} */ LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken('LOCALIZE_ROUTER_FORROOT_GUARD');
/**
 * Static provider for keeping track of routes
 */
export var /** @type {?} */ RAW_ROUTES = new InjectionToken('RAW_ROUTES');
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
export var /** @type {?} */ USE_CACHED_LANG = new InjectionToken('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
export var /** @type {?} */ CACHE_MECHANISM = new InjectionToken('CACHE_MECHANISM');
/**
 * Cache name
 */
export var /** @type {?} */ CACHE_NAME = new InjectionToken('CACHE_NAME');
/**
 * Function for calculating default language
 */
export var /** @type {?} */ DEFAULT_LANG_FUNCTION = new InjectionToken('DEFAULT_LANG_FUNCTION');
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export var /** @type {?} */ ALWAYS_SET_PREFIX = new InjectionToken('ALWAYS_SET_PREFIX');
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
export { LocalizeRouterSettings };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnaWxzZGF2L25neC10cmFuc2xhdGUtcm91dGVyLyIsInNvdXJjZXMiOlsibGliL2xvY2FsaXplLXJvdXRlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFZLE1BQU0sZUFBZSxDQUFDOzs7O0FBT2pFLE1BQU0sQ0FBQyxxQkFBTSw2QkFBNkIsR0FBRyxJQUFJLGNBQWMsQ0FBdUIsK0JBQStCLENBQUMsQ0FBQzs7OztBQUt2SCxNQUFNLENBQUMscUJBQU0sVUFBVSxHQUE2QixJQUFJLGNBQWMsQ0FBVyxZQUFZLENBQUMsQ0FBQzs7OztBQVUvRixNQUFNLEtBQVcsY0FBYzs7OztBQUEvQixXQUFpQixjQUFjO0lBQ2hCLDJCQUFZLEdBQW1CLGNBQWM7SUFDN0MscUJBQU0sR0FBbUIsUUFBUTtHQUYvQixjQUFjLEtBQWQsY0FBYyxRQUc5Qjs7OztBQUtELE1BQU0sQ0FBQyxxQkFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQVUsaUJBQWlCLENBQUMsQ0FBQzs7OztBQUk5RSxNQUFNLENBQUMscUJBQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFpQixpQkFBaUIsQ0FBQyxDQUFDOzs7O0FBSXJGLE1BQU0sQ0FBQyxxQkFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQVMsWUFBWSxDQUFDLENBQUM7Ozs7QUFXbkUsTUFBTSxDQUFDLHFCQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUEwQix1QkFBdUIsQ0FBQyxDQUFDOzs7O0FBSzFHLE1BQU0sQ0FBQyxxQkFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBVSxtQkFBbUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNsRixxQkFBTSxtQkFBbUIsR0FBRywyQkFBMkIsQ0FBQzs7SUFHdEQ7O09BRUc7SUFDSCxnQ0FDa0MsYUFBNkIsRUFDM0IsZUFBK0IsRUFDakMsY0FBNEQsRUFDakUsU0FBdUMsRUFDNUIsbUJBQXFEOzREQUo5QjtnRUFDSTswREFDQSxjQUFjLENBQUMsWUFBWTttRUFDMUI7eUVBQ3dCLENBQUM7UUFKM0Qsa0JBQWEsR0FBYixhQUFhLENBQWdCO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUNqQyxtQkFBYyxHQUFkLGNBQWMsQ0FBOEM7UUFDakUsY0FBUyxHQUFULFNBQVMsQ0FBOEI7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFrQztLQUU1Rjs7OzhDQU5FLE1BQU0sU0FBQyxlQUFlOzhDQUN0QixNQUFNLFNBQUMsaUJBQWlCO2dCQUN1QixjQUFjLHVCQUE3RCxNQUFNLFNBQUMsZUFBZTs2Q0FDdEIsTUFBTSxTQUFDLFVBQVU7Z0RBQ2pCLE1BQU0sU0FBQyxxQkFBcUI7O2lDQS9FakM7O1NBc0VhLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYWxpemVSb3V0ZXJNb2R1bGUgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5tb2R1bGUnO1xuXG4vKipcbiAqIEd1YXJkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIHNpbmdsZSBpbml0aWFsaXphdGlvbiBvZiBmb3JSb290XG4gKi9cbmV4cG9ydCBjb25zdCBMT0NBTElaRV9ST1VURVJfRk9SUk9PVF9HVUFSRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxMb2NhbGl6ZVJvdXRlck1vZHVsZT4oJ0xPQ0FMSVpFX1JPVVRFUl9GT1JST09UX0dVQVJEJyk7XG5cbi8qKlxuICogU3RhdGljIHByb3ZpZGVyIGZvciBrZWVwaW5nIHRyYWNrIG9mIHJvdXRlc1xuICovXG5leHBvcnQgY29uc3QgUkFXX1JPVVRFUzogSW5qZWN0aW9uVG9rZW48Um91dGVzW10+ID0gbmV3IEluamVjdGlvblRva2VuPFJvdXRlc1tdPignUkFXX1JPVVRFUycpO1xuXG4vKipcbiAqIFR5cGUgZm9yIENhY2hpbmcgb2YgZGVmYXVsdCBsYW5ndWFnZVxuICovXG5leHBvcnQgdHlwZSBDYWNoZU1lY2hhbmlzbSA9ICdMb2NhbFN0b3JhZ2UnIHwgJ0Nvb2tpZSc7XG5cbi8qKlxuICogTmFtZXNwYWNlIGZvciBmYWlsIHByb29mIGFjY2VzcyBvZiBDYWNoZU1lY2hhbmlzbVxuICovXG5leHBvcnQgbmFtZXNwYWNlIENhY2hlTWVjaGFuaXNtIHtcbiAgZXhwb3J0IGNvbnN0IExvY2FsU3RvcmFnZTogQ2FjaGVNZWNoYW5pc20gPSAnTG9jYWxTdG9yYWdlJztcbiAgZXhwb3J0IGNvbnN0IENvb2tpZTogQ2FjaGVNZWNoYW5pc20gPSAnQ29va2llJztcbn1cblxuLyoqXG4gKiBCb29sZWFuIHRvIGluZGljYXRlIHdoZXRoZXIgdG8gdXNlIGNhY2hlZCBsYW5ndWFnZSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgVVNFX0NBQ0hFRF9MQU5HID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdVU0VfQ0FDSEVEX0xBTkcnKTtcbi8qKlxuICogQ2FjaGUgbWVjaGFuaXNtIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IENBQ0hFX01FQ0hBTklTTSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxDYWNoZU1lY2hhbmlzbT4oJ0NBQ0hFX01FQ0hBTklTTScpO1xuLyoqXG4gKiBDYWNoZSBuYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBDQUNIRV9OQU1FID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ0NBQ0hFX05BTUUnKTtcblxuLyoqXG4gKiBUeXBlIGZvciBkZWZhdWx0IGxhbmd1YWdlIGZ1bmN0aW9uXG4gKiBVc2VkIHRvIG92ZXJyaWRlIGJhc2ljIGJlaGF2aW91clxuICovXG5leHBvcnQgdHlwZSBEZWZhdWx0TGFuZ3VhZ2VGdW5jdGlvbiA9IChsYW5ndWFnZXM6IHN0cmluZ1tdLCBjYWNoZWRMYW5nPzogc3RyaW5nLCBicm93c2VyTGFuZz86IHN0cmluZykgPT4gc3RyaW5nO1xuXG4vKipcbiAqIEZ1bmN0aW9uIGZvciBjYWxjdWxhdGluZyBkZWZhdWx0IGxhbmd1YWdlXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0xBTkdfRlVOQ1RJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48RGVmYXVsdExhbmd1YWdlRnVuY3Rpb24+KCdERUZBVUxUX0xBTkdfRlVOQ1RJT04nKTtcblxuLyoqXG4gKiBCb29sZWFuIHRvIGluZGljYXRlIHdoZXRoZXIgcHJlZml4IHNob3VsZCBiZSBzZXQgZm9yIHNpbmdsZSBsYW5ndWFnZSBzY2VuYXJpb3NcbiAqL1xuZXhwb3J0IGNvbnN0IEFMV0FZU19TRVRfUFJFRklYID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdBTFdBWVNfU0VUX1BSRUZJWCcpO1xuXG4vKipcbiAqIENvbmZpZyBpbnRlcmZhY2UgZm9yIExvY2FsaXplUm91dGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9jYWxpemVSb3V0ZXJDb25maWcge1xuICBwYXJzZXI/OiBQcm92aWRlcjtcbiAgdXNlQ2FjaGVkTGFuZz86IGJvb2xlYW47XG4gIGNhY2hlTWVjaGFuaXNtPzogQ2FjaGVNZWNoYW5pc207XG4gIGNhY2hlTmFtZT86IHN0cmluZztcbiAgZGVmYXVsdExhbmdGdW5jdGlvbj86IERlZmF1bHRMYW5ndWFnZUZ1bmN0aW9uO1xuICBhbHdheXNTZXRQcmVmaXg/OiBib29sZWFuO1xufVxuXG5jb25zdCBMT0NBTElaRV9DQUNIRV9OQU1FID0gJ0xPQ0FMSVpFX0RFRkFVTFRfTEFOR1VBR0UnO1xuXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJTZXR0aW5ncyBpbXBsZW1lbnRzIExvY2FsaXplUm91dGVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNldHRpbmdzIGZvciBsb2NhbGl6ZSByb3V0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoVVNFX0NBQ0hFRF9MQU5HKSBwdWJsaWMgdXNlQ2FjaGVkTGFuZzogYm9vbGVhbiA9IHRydWUsXG4gICAgQEluamVjdChBTFdBWVNfU0VUX1BSRUZJWCkgcHVibGljIGFsd2F5c1NldFByZWZpeDogYm9vbGVhbiA9IHRydWUsXG4gICAgQEluamVjdChDQUNIRV9NRUNIQU5JU00pIHB1YmxpYyBjYWNoZU1lY2hhbmlzbTogQ2FjaGVNZWNoYW5pc20gPSBDYWNoZU1lY2hhbmlzbS5Mb2NhbFN0b3JhZ2UsXG4gICAgQEluamVjdChDQUNIRV9OQU1FKSBwdWJsaWMgY2FjaGVOYW1lOiBzdHJpbmcgPSBMT0NBTElaRV9DQUNIRV9OQU1FLFxuICAgIEBJbmplY3QoREVGQVVMVF9MQU5HX0ZVTkNUSU9OKSBwdWJsaWMgZGVmYXVsdExhbmdGdW5jdGlvbjogRGVmYXVsdExhbmd1YWdlRnVuY3Rpb24gPSB2b2lkIDBcbiAgKSB7XG4gIH1cbn1cbiJdfQ==