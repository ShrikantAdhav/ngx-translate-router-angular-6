/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ROUTES } from '@angular/router';
import { SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, Inject, forwardRef } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
var LocalizeRouterConfigLoader = /** @class */ (function (_super) {
    tslib_1.__extends(LocalizeRouterConfigLoader, _super);
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
                            return _this.localize.initChildRoutes([].concat.apply([], tslib_1.__spread(getResult)));
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
export { LocalizeRouterConfigLoader };
function LocalizeRouterConfigLoader_tsickle_Closure_declarations() {
    /** @type {?} */
    LocalizeRouterConfigLoader.prototype.localize;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLWNvbmZpZy1sb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXItY29uZmlnLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQ2pGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7SUFNVixzREFBc0I7SUFFcEUsb0NBQThELFFBQXdCLEVBQ3BGLFNBQW1CLEVBQWMsTUFBcUM7UUFEeEUsWUFFSSxrQkFBTSxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQzNCO1FBSDZELGNBQVEsR0FBUixRQUFRLENBQWdCOztLQUdyRjtJQUVEOztPQUVHOzs7Ozs7SUFDSCx5Q0FBSTs7Ozs7SUFBSixVQUFLLElBQVk7UUFBakIsaUJBc0JDO1FBckJDLE1BQU0sQ0FBQyxpQkFBTSxJQUFJLFlBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBNkI7WUFDekQsTUFBTSxDQUFDO2dCQUNMLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtnQkFDOUIsTUFBTSxFQUFFLFVBQUMsY0FBd0I7b0JBQy9CLHFCQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM5QyxxQkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFDLEtBQVUsRUFBRSxhQUFrQjt3QkFDdEQscUJBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7d0JBRWxELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs0QkFFckIsTUFBTSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxNQUFNLE9BQVQsRUFBRSxtQkFBVyxTQUFTLEdBQUUsQ0FBQzt5QkFDL0Q7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQzt5QkFDbEI7cUJBQ0YsQ0FBQztvQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNmO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztLQUNKOztnQkFqQ0YsVUFBVTs7OztnQkFMRixjQUFjLHVCQVFSLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBVlosUUFBUTtnQkFBaEQsNEJBQTRCLHVCQVdKLFFBQVE7O3FDQWRsQztFQVdnRCxzQkFBc0I7U0FBekQsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUk9VVEVTIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIsIE5nTW9kdWxlRmFjdG9yeSwgSW5qZWN0b3IsXG4gIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcsIE9wdGlvbmFsLCBDb21waWxlciwgSW5qZWN0YWJsZSwgSW5qZWN0LCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxpemVQYXJzZXIgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5wYXJzZXInO1xuXG4vKipcbiAqIEV4dGVuc2lvbiBvZiBTeXN0ZW1Kc05nTW9kdWxlTG9hZGVyIHRvIGVuYWJsZSBsb2NhbGl6YXRpb24gb2Ygcm91dGUgb24gbGF6eSBsb2FkXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlckNvbmZpZ0xvYWRlciBleHRlbmRzIFN5c3RlbUpzTmdNb2R1bGVMb2FkZXIge1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBMb2NhbGl6ZVBhcnNlcikpIHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUGFyc2VyLFxuICAgIF9jb21waWxlcjogQ29tcGlsZXIsIEBPcHRpb25hbCgpIGNvbmZpZz86IFN5c3RlbUpzTmdNb2R1bGVMb2FkZXJDb25maWcpIHtcbiAgICAgIHN1cGVyKF9jb21waWxlciwgY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlbmQgbG9hZCB3aXRoIGN1c3RvbSBmdW5jdGlvbmFsaXR5XG4gICAqL1xuICBsb2FkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PGFueT4+IHtcbiAgICByZXR1cm4gc3VwZXIubG9hZChwYXRoKS50aGVuKChmYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8YW55PikgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbW9kdWxlVHlwZTogZmFjdG9yeS5tb2R1bGVUeXBlLFxuICAgICAgICBjcmVhdGU6IChwYXJlbnRJbmplY3RvcjogSW5qZWN0b3IpID0+IHtcbiAgICAgICAgICBjb25zdCBtb2R1bGUgPSBmYWN0b3J5LmNyZWF0ZShwYXJlbnRJbmplY3Rvcik7XG4gICAgICAgICAgY29uc3QgZ2V0TWV0aG9kID0gbW9kdWxlLmluamVjdG9yLmdldC5iaW5kKG1vZHVsZS5pbmplY3Rvcik7XG5cbiAgICAgICAgICBtb2R1bGUuaW5qZWN0b3JbJ2dldCddID0gKHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2V0UmVzdWx0ID0gZ2V0TWV0aG9kKHRva2VuLCBub3RGb3VuZFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRva2VuID09PSBST1VURVMpIHtcbiAgICAgICAgICAgICAgLy8gdHJhbnNsYXRlIGxhenkgcm91dGVzXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsaXplLmluaXRDaGlsZFJvdXRlcyhbXS5jb25jYXQoLi4uZ2V0UmVzdWx0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIl19