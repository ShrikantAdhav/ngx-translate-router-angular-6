/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
export class LocalizeRouterService {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBd0QsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEksT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFNbEUsTUFBTTs7Ozs7Ozs7SUFNSixZQUNtQyxNQUFzQixFQUNkLFFBQWdDLEVBQy9DLE1BQWMsRUFDTixLQUFxQjtRQUh0QixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUNkLGFBQVEsR0FBUixRQUFRLENBQXdCO1FBQy9DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDTixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUVyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7S0FDN0M7Ozs7O0lBS0QsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBRTVDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTthQUNmLElBQUksQ0FDSCxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksZUFBZSxDQUFDLEVBQ2pELFFBQVEsRUFBRSxDQUNYO2FBQ0EsU0FBUyxD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QUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQXFDLEVBQUUsRUFBRTtZQUMzRSx1QkFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQy9GLHVCQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFFN0YsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O29CQUU1QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDckMsQ0FBQyxDQUFDO2FBQ0o7U0FDRixDQUFDOzs7OztZQXhLRyxjQUFjLHVCQWNoQixNQUFNLFNBQUMsY0FBYztZQWJuQixzQkFBc0IsdUJBY3hCLE1BQU0sU0FBQyxzQkFBc0I7WUFuQjNCLE1BQU0sdUJBb0JSLE1BQU0sU0FBQyxNQUFNO1lBcEJvRSxjQUFjLHVCQXFCL0YsTUFBTSxTQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvblN0YXJ0LCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBOYXZpZ2F0aW9uRXh0cmFzLCBVcmxTZWdtZW50LCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHBhaXJ3aXNlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBMb2NhbGl6ZVBhcnNlciB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnBhcnNlcic7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIH0gZnJvbSAnLi9sb2NhbGl6ZS1yb3V0ZXIuY29uZmlnJztcblxuLyoqXG4gKiBMb2NhbGl6YXRpb24gc2VydmljZVxuICogbW9kaWZ5Um91dGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclNlcnZpY2Uge1xuICByb3V0ZXJFdmVudHM6IFN1YmplY3Q8c3RyaW5nPjtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBASW5qZWN0KExvY2FsaXplUGFyc2VyKSBwdWJsaWMgcGFyc2VyOiBMb2NhbGl6ZVBhcnNlcixcbiAgICAgIEBJbmplY3QoTG9jYWxpemVSb3V0ZXJTZXR0aW5ncykgcHVibGljIHNldHRpbmdzOiBMb2NhbGl6ZVJvdXRlclNldHRpbmdzLFxuICAgICAgQEluamVjdChSb3V0ZXIpIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICBASW5qZWN0KEFjdGl2YXRlZFJvdXRlKSBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxuICAgICkge1xuICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdXAgdGhlIHNlcnZpY2VcbiAgICovXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAvLyBzdWJzY3JpYmUgdG8gcm91dGVyIGV2ZW50c1xuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCksXG4gICAgICAgIHBhaXJ3aXNlKClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUodGhpcy5fcm91dGVDaGFuZ2VkKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSBsYW5ndWFnZSBhbmQgbmF2aWdhdGUgdG8gdHJhbnNsYXRlZCByb3V0ZVxuICAgKi9cbiAgY2hhbmdlTGFuZ3VhZ2UobGFuZzogc3RyaW5nLCBleHRyYXM/OiBOYXZpZ2F0aW9uRXh0cmFzLCB1c2VOYXZpZ2F0ZU1ldGhvZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3V0ZSkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5yb3V0ZSk7XG4gICAgfVxuICAgIGlmIChsYW5nICE9PSB0aGlzLnBhcnNlci5jdXJyZW50TGFuZykge1xuICAgICAgY29uc3Qgcm9vdFNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90ID0gdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3Qucm9vdDtcblxuICAgICAgdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGVzKGxhbmcpLnN1YnNjcmliZSgoKSA9PiB7XG5cbiAgICAgICAgbGV0IHVybCA9IHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHJvb3RTbmFwc2hvdCk7XG4gICAgICAgIHVybCA9IHRoaXMudHJhbnNsYXRlUm91dGUodXJsKSBhcyBzdHJpbmc7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmFsd2F5c1NldFByZWZpeCkge1xuICAgICAgICAgIGxldCB1cmxTZWdtZW50cyA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICAgIGNvbnN0IGxhbmd1YWdlU2VnbWVudEluZGV4ID0gdXJsU2VnbWVudHMuaW5kZXhPZih0aGlzLnBhcnNlci5jdXJyZW50TGFuZyk7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgaGFzIG5vIHByZWZpeCBtYWtlIHN1cmUgdG8gcmVtb3ZlIGFuZCBhZGQgaXQgd2hlbiBuZWNlc3NhcnlcbiAgICAgICAgICBpZiAodGhpcy5wYXJzZXIuY3VycmVudExhbmcgPT09IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxhbmd1YWdlIHByZWZpeCBmcm9tIHVybCB3aGVuIGN1cnJlbnQgbGFuZ3VhZ2UgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2VcbiAgICAgICAgICAgIGlmIChsYW5ndWFnZVNlZ21lbnRJbmRleCA9PT0gMCB8fCAobGFuZ3VhZ2VTZWdtZW50SW5kZXggPT09IDEgJiYgdXJsU2VnbWVudHNbMF0gPT09ICcnKSkge1xuICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGN1cnJlbnQgYWthIGRlZmF1bHQgbGFuZ3VhZ2UgcHJlZml4IGZyb20gdGhlIHVybFxuICAgICAgICAgICAgICB1cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzLnNsaWNlKDAsIGxhbmd1YWdlU2VnbWVudEluZGV4KS5jb25jYXQodXJsU2VnbWVudHMuc2xpY2UobGFuZ3VhZ2VTZWdtZW50SW5kZXggKyAxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdoZW4gY29taW5nIGZyb20gYSBkZWZhdWx0IGxhbmd1YWdlIGl0J3MgcG9zc2libGUgdGhhdCB0aGUgdXJsIGRvZXNuJ3QgY29udGFpbiB0aGUgbGFuZ3VhZ2UsIG1ha2Ugc3VyZSBpdCBkb2VzLlxuICAgICAgICAgICAgaWYgKGxhbmd1YWdlU2VnbWVudEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgdXJsIHN0YXJ0cyB3aXRoIGEgc2xhc2ggbWFrZSBzdXJlIHRvIGtlZXAgaXQuXG4gICAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbkluZGV4ID0gdXJsU2VnbWVudHNbMF0gPT09ICcnID8gMSA6IDA7XG4gICAgICAgICAgICAgIHVybFNlZ21lbnRzID0gdXJsU2VnbWVudHMuc2xpY2UoMCwgaW5qZWN0aW9uSW5kZXgpLmNvbmNhdCh0aGlzLnBhcnNlci5jdXJyZW50TGFuZywgdXJsU2VnbWVudHMuc2xpY2UoaW5qZWN0aW9uSW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdXJsID0gdXJsU2VnbWVudHMuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIucmVzZXRDb25maWcodGhpcy5wYXJzZXIucm91dGVzKTtcbiAgICAgICAgaWYgKHVzZU5hdmlnYXRlTWV0aG9kKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybF0sIGV4dHJhcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwsIGV4dHJhcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZXMgdGhyb3VnaCB0aGUgdHJlZSB0byBhc3NlbWJsZSBuZXcgdHJhbnNsYXRlZCB1cmxcbiAgICovXG4gIHByaXZhdGUgdHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nIHtcblxuICAgIGlmIChzbmFwc2hvdC5maXJzdENoaWxkICYmIHNuYXBzaG90LnJvdXRlQ29uZmlnKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5wYXJzZVNlZ21lbnRWYWx1ZShzbmFwc2hvdCl9LyR7dGhpcy50cmF2ZXJzZVJvdXRlU25hcHNob3Qoc25hcHNob3QuZmlyc3RDaGlsZCl9YDtcbiAgICB9IGVsc2UgaWYgKHNuYXBzaG90LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlUm91dGVTbmFwc2hvdChzbmFwc2hvdC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QpO1xuICAgIH1cblxuICAgIC8qIGlmIChzbmFwc2hvdC5maXJzdENoaWxkICYmIHNuYXBzaG90LmZpcnN0Q2hpbGQucm91dGVDb25maWcgJiYgc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZy5wYXRoKSB7XG4gICAgICBpZiAoc25hcHNob3QuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZy5wYXRoICE9PSAnKionKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KSArICcvJyArIHRoaXMudHJhdmVyc2VSb3V0ZVNuYXBzaG90KHNuYXBzaG90LmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTZWdtZW50VmFsdWUoc25hcHNob3QuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90KTsgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0cyBuZXcgc2VnbWVudCB2YWx1ZSBiYXNlZCBvbiByb3V0ZUNvbmZpZyBhbmQgdXJsXG4gICAqL1xuICBwcml2YXRlIHBhcnNlU2VnbWVudFZhbHVlKHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nIHtcbiAgICBpZiAoc25hcHNob3QuZGF0YS5sb2NhbGl6ZVJvdXRlcikge1xuICAgICAgY29uc3QgcGF0aCA9IHNuYXBzaG90LmRhdGEubG9jYWxpemVSb3V0ZXIucGF0aDtcbiAgICAgIGNvbnN0IHN1YlBhdGhTZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICAgIHJldHVybiBzdWJQYXRoU2VnbWVudHMubWFwKChzOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcy5pbmRleE9mKCc6JykgPT09IDAgPyBzbmFwc2hvdC51cmxbaV0ucGF0aCA6IHMpLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICAvKiBpZiAoc25hcHNob3Qucm91dGVDb25maWcpIHtcbiAgICAgIGlmIChzbmFwc2hvdC5yb3V0ZUNvbmZpZy5wYXRoID09PSAnKionKSB7XG4gICAgICAgIHJldHVybiBzbmFwc2hvdC51cmwuZmlsdGVyKChzZWdtZW50OiBVcmxTZWdtZW50KSA9PiBzZWdtZW50LnBhdGgpLm1hcCgoc2VnbWVudDogVXJsU2VnbWVudCkgPT4gc2VnbWVudC5wYXRoKS5qb2luKCcvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdWJQYXRoU2VnbWVudHMgPSBzbmFwc2hvdC5yb3V0ZUNvbmZpZy5wYXRoLnNwbGl0KCcvJyk7XG4gICAgICAgIHJldHVybiBzdWJQYXRoU2VnbWVudHMubWFwKChzOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcy5pbmRleE9mKCc6JykgPT09IDAgPyBzbmFwc2hvdC51cmxbaV0ucGF0aCA6IHMpLmpvaW4oJy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnOyAqL1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSByb3V0ZSB0byBjdXJyZW50IGxhbmd1YWdlXG4gICAqIElmIG5ldyBsYW5ndWFnZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkIHRoZW4gcmVwbGFjZSBsYW5ndWFnZSBwYXJ0IGluIHVybCB3aXRoIG5ldyBsYW5ndWFnZVxuICAgKi9cbiAgdHJhbnNsYXRlUm91dGUocGF0aDogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgdXJsID0gdGhpcy5wYXJzZXIudHJhbnNsYXRlUm91dGUocGF0aCk7XG4gICAgICByZXR1cm4gIXBhdGguaW5kZXhPZignLycpID8gYC8ke3RoaXMucGFyc2VyLnVybFByZWZpeH0ke3VybH1gIDogdXJsO1xuICAgIH1cbiAgICAvLyBpdCdzIGFuIGFycmF5XG4gICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xuICAgIChwYXRoIGFzIEFycmF5PGFueT4pLmZvckVhY2goKHNlZ21lbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBzZWdtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlci50cmFuc2xhdGVSb3V0ZShzZWdtZW50KTtcbiAgICAgICAgaWYgKCFpbmRleCAmJiAhc2VnbWVudC5pbmRleE9mKCcvJykpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChgLyR7dGhpcy5wYXJzZXIudXJsUHJlZml4fSR7cmVzfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciB0byByZWFjdCBvbiByb3V0ZSBjaGFuZ2VcbiAgICovXG4gIHByaXZhdGUgX3JvdXRlQ2hhbmdlZCgpOiAoZXZlbnRQYWlyOiBbTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uU3RhcnRdKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKFtwcmV2aW91c0V2ZW50LCBjdXJyZW50RXZlbnRdOiBbTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uU3RhcnRdKSA9PiB7XG4gICAgICBjb25zdCBwcmV2aW91c0xhbmcgPSB0aGlzLnBhcnNlci5nZXRMb2NhdGlvbkxhbmcocHJldmlvdXNFdmVudC51cmwpIHx8IHRoaXMucGFyc2VyLmRlZmF1bHRMYW5nO1xuICAgICAgY29uc3QgY3VycmVudExhbmcgPSB0aGlzLnBhcnNlci5nZXRMb2NhdGlvbkxhbmcoY3VycmVudEV2ZW50LnVybCkgfHwgdGhpcy5wYXJzZXIuZGVmYXVsdExhbmc7XG5cbiAgICAgIGlmIChjdXJyZW50TGFuZyAhPT0gcHJldmlvdXNMYW5nKSB7XG4gICAgICAgIHRoaXMucGFyc2VyLnRyYW5zbGF0ZVJvdXRlcyhjdXJyZW50TGFuZykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5yZXNldENvbmZpZyh0aGlzLnBhcnNlci5yb3V0ZXMpO1xuICAgICAgICAgIC8vIEZpcmUgcm91dGUgY2hhbmdlIGV2ZW50XG4gICAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChjdXJyZW50TGFuZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiJdfQ==