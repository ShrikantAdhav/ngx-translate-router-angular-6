/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Inject } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
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
            var _b = tslib_1.__read(_a, 2), previousEvent = _b[0], currentEvent = _b[1];
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
export { LocalizeRouterService };
function LocalizeRouterService_tsickle_Closure_declarations() {
    /** @type {?} */
    LocalizeRouterService.prototype.routerEvents;
    /** @type {?} */
    LocalizeRouterService.prototype.parser;
    /** @type {?} */
    LocalizeRouterService.prototype.settings;
    /** @type {?} */
    LocalizeRouterService.prototype.router;
    /** @type {?} */
    LocalizeRouterService.prototype.route;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQXdELGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7OztJQVNoRTs7T0FFRztJQUNILCtCQUNtQyxNQUFzQixFQUNkLFFBQWdDLEVBQy9DLE1BQWMsRUFDTixLQUFxQjtRQUh0QixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUNkLGFBQVEsR0FBUixRQUFRLENBQXdCO1FBQy9DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDTixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUVyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7S0FDN0M7SUFFRDs7T0FFRzs7Ozs7SUFDSCxvQ0FBSTs7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFFNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ2YsSUFBSSxDQUNILE1BQU0sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssWUFBWSxlQUFlLEVBQWhDLENBQWdDLENBQUMsRUFD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dEI7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ2Y7Ozs7O0lBS08sNkNBQWE7Ozs7OztRQUNuQixNQUFNLENBQUMsVUFBQyxFQUFpRTtnQkFBakUsMEJBQWlFLEVBQWhFLHFCQUFhLEVBQUUsb0JBQVk7WUFDbEMscUJBQU0sWUFBWSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUMvRixxQkFBTSxXQUFXLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBRTdGLEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxLQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ2pELEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O29CQUU1QyxBQURBLDBCQUEwQjtvQkFDMUIsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3JDLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQzs7OztnQkF4S0csY0FBYyx1QkFjaEIsTUFBTSxTQUFDLGNBQWM7Z0JBYm5CLHNCQUFzQix1QkFjeEIsTUFBTSxTQUFDLHNCQUFzQjtnQkFuQjNCLE1BQU0sdUJBb0JSLE1BQU0sU0FBQyxNQUFNO2dCQXBCb0UsY0FBYyx1QkFxQi9GLE1BQU0sU0FBQyxjQUFjOztnQ0F0QjVCOztTQVlhLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uU3RhcnQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIE5hdmlnYXRpb25FeHRyYXMsIFVybFNlZ21lbnQsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgcGFpcndpc2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsaXplUGFyc2VyIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIucGFyc2VyJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2V0dGluZ3MgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5jb25maWcnO1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBzZXJ2aWNlXG4gKiBtb2RpZnlSb3V0ZXNcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyU2VydmljZSB7XG4gIHJvdXRlckV2ZW50czogU3ViamVjdDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDVE9SXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoTG9jYWxpemVQYXJzZXIpIHB1YmxpYyBwYXJzZXI6IExvY2FsaXplUGFyc2VyLFxuICAgICAgQEluamVjdChMb2NhbGl6ZVJvdXRlclNldHRpbmdzKSBwdWJsaWMgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXG4gICAgICBASW5qZWN0KFJvdXRlcikgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIEBJbmplY3QoQWN0aXZhdGVkUm91dGUpIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXG4gICAgKSB7XG4gICAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cCB0aGUgc2VydmljZVxuICAgKi9cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgIC8vIHN1YnNjcmliZSB0byByb3V0ZXIgZXZlbnRzXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSxcbiAgICAgICAgcGFpcndpc2UoKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLl9yb3V0ZUNoYW5nZWQoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIGxhbmd1YWdlIGFuZCBuYXZpZ2F0ZSB0byB0cmFuc2xhdGVkIHJvdXRlXG4gICAqL1xuICBjaGFuZ2VMYW5ndWFnZShsYW5nOiBzdHJpbmcsIGV4dHJhcz86IE5hdmlnYXRpb25FeHRyYXMsIHVzZU5hdmlnYXRlTWV0aG9kPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlKTtcbiAgICB9XG4gICAgaWYgKGxhbmcgIT09IHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICBjb25zdCByb290U25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC5yb290O1xuXG4gICAgICB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZXMobGFuZykuc3Vic2NyaWJlKCgpID0+IHtcblxuICAgICAgICBsZXQgdXJsID0gdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qocm9vdFNuYXBzaG90KTtcbiAgICAgICAgdXJsID0gdGhpcy50cmFuc2xhdGVSb3V0ZSh1cmwpIGFzIHN0cmluZztcblxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYWx3YXlzU2V0UHJlZml4KSB7XG4gICAgICAgICAgbGV0IHVybFNlZ21lbnRzID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgbGFuZ3VhZ2VTZWdtZW50SW5kZXggPSB1cmxTZWdtZW50cy5pbmRleE9mKHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVmYXVsdCBsYW5ndWFnZSBoYXMgbm8gcHJlZml4IG1ha2Ugc3VyZSB0byByZW1vdmUgYW5kIGFkZCBpdCB3aGVuIG5lY2Vzc2FyeVxuICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5jdXJyZW50TGFuZyA9PT0gdGhpcy5wYXJzZXIuZGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdXJsIHdoZW4gY3VycmVudCBsYW5ndWFnZSBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZVxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAwIHx8IChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMSAmJiB1cmxTZWdtZW50c1swXSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBha2EgZGVmYXVsdCBsYW5ndWFnZSBwcmVmaXggZnJvbSB0aGUgdXJsXG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgbGFuZ3VhZ2VTZWdtZW50SW5kZXgpLmNvbmNhdCh1cmxTZWdtZW50cy5zbGljZShsYW5ndWFnZVNlZ21lbnRJbmRleCArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2hlbiBjb21pbmcgZnJvbSBhIGRlZmF1bHQgbGFuZ3VhZ2UgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSB1cmwgZG9lc24ndCBjb250YWluIHRoZSBsYW5ndWFnZSwgbWFrZSBzdXJlIGl0IGRvZXMuXG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgc3RhcnRzIHdpdGggYSBzbGFzaCBtYWtlIHN1cmUgdG8ga2VlcCBpdC5cbiAgICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9uSW5kZXggPSB1cmxTZWdtZW50c1swXSA9PT0gJycgPyAxIDogMDtcbiAgICAgICAgICAgICAgdXJsU2VnbWVudHMgPSB1cmxTZWdtZW50cy5zbGljZSgwLCBpbmplY3Rpb25JbmRleCkuY29uY2F0KHRoaXMucGFyc2VyLmN1cnJlbnRMYW5nLCB1cmxTZWdtZW50cy5zbGljZShpbmplY3Rpb25JbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cmwgPSB1cmxTZWdtZW50cy5qb2luKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICBpZiAodXNlTmF2aWdhdGVNZXRob2QpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsXSwgZXh0cmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCwgZXh0cmFzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aHJvdWdoIHRoZSB0cmVlIHRvIGFzc2VtYmxlIG5ldyB0cmFuc2xhdGVkIHVybFxuICAgKi9cbiAgcHJpdmF0ZSB0cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuXG4gICAgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KX0vJHt0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKX1gO1xuICAgIH0gZWxzZSBpZiAoc25hcHNob3QuZmlyc3RDaGlsZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgLyogaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiBzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGgpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGggIT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpICsgJy8nICsgdGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIG5ldyBzZWdtZW50IHZhbHVlIGJhc2VkIG9uIHJvdXRlQ29uZmlnIGFuZCB1cmxcbiAgICovXG4gIHByaXZhdGUgcGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIGlmIChzbmFwc2hvdC5kYXRhLmxvY2FsaXplUm91dGVyKSB7XG4gICAgICBjb25zdCBwYXRoID0gc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlci5wYXRoO1xuICAgICAgY29uc3Qgc3ViUGF0aFNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8qIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZykge1xuICAgICAgaWYgKHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGggPT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuIHNuYXBzaG90LnVybC5maWx0ZXIoKHNlZ21lbnQ6IFVybFNlZ21lbnQpID0+IHNlZ21lbnQucGF0aCkubWFwKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLmpvaW4oJy8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHNuYXBzaG90LnJvdXRlQ29uZmlnLnBhdGguc3BsaXQoJy8nKTtcbiAgICAgICAgcmV0dXJuIHN1YlBhdGhTZWdtZW50cy5tYXAoKHM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBzLmluZGV4T2YoJzonKSA9PT0gMCA/IHNuYXBzaG90LnVybFtpXS5wYXRoIDogcykuam9pbignLycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7ICovXG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlIHJvdXRlIHRvIGN1cnJlbnQgbGFuZ3VhZ2VcbiAgICogSWYgbmV3IGxhbmd1YWdlIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQgdGhlbiByZXBsYWNlIGxhbmd1YWdlIHBhcnQgaW4gdXJsIHdpdGggbmV3IGxhbmd1YWdlXG4gICAqL1xuICB0cmFuc2xhdGVSb3V0ZShwYXRoOiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShwYXRoKTtcbiAgICAgIHJldHVybiAhcGF0aC5pbmRleE9mKCcvJykgPyBgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7dXJsfWAgOiB1cmw7XG4gICAgfVxuICAgIC8vIGl0J3MgYW4gYXJyYXlcbiAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gICAgKHBhdGggYXMgQXJyYXk8YW55PikuZm9yRWFjaCgoc2VnbWVudDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlKHNlZ21lbnQpO1xuICAgICAgICBpZiAoIWluZGV4ICYmICFzZWdtZW50LmluZGV4T2YoJy8nKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGAvJHt0aGlzLnBhcnNlci51cmxQcmVmaXh9JHtyZXN9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIHRvIHJlYWN0IG9uIHJvdXRlIGNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBfcm91dGVDaGFuZ2VkKCk6IChldmVudFBhaXI6IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHZvaWQge1xuICAgIHJldHVybiAoW3ByZXZpb3VzRXZlbnQsIGN1cnJlbnRFdmVudF06IFtOYXZpZ2F0aW9uU3RhcnQsIE5hdmlnYXRpb25TdGFydF0pID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhwcmV2aW91c0V2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG4gICAgICBjb25zdCBjdXJyZW50TGFuZyA9IHRoaXMucGFyc2VyLmdldExvY2F0aW9uTGFuZyhjdXJyZW50RXZlbnQudXJsKSB8fCB0aGlzLnBhcnNlci5kZWZhdWx0TGFuZztcblxuICAgICAgaWYgKGN1cnJlbnRMYW5nICE9PSBwcmV2aW91c0xhbmcpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGN1cnJlbnRMYW5nKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm91dGVyLnJlc2V0Q29uZmlnKHRoaXMucGFyc2VyLnJvdXRlcyk7XG4gICAgICAgICAgLy8gRmlyZSByb3V0ZSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICB0aGlzLnJvdXRlckV2ZW50cy5uZXh0KGN1cnJlbnRMYW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIl19