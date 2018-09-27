/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Pipe, ChangeDetectorRef } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { equals } from './util';
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
export { LocalizeRouterPipe };
function LocalizeRouterPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    LocalizeRouterPipe.prototype.value;
    /** @type {?} */
    LocalizeRouterPipe.prototype.lastKey;
    /** @type {?} */
    LocalizeRouterPipe.prototype.lastLanguage;
    /** @type {?} */
    LocalizeRouterPipe.prototype.subscription;
    /** @type {?} */
    LocalizeRouterPipe.prototype.localize;
    /** @type {?} */
    LocalizeRouterPipe.prototype._ref;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixJQUFJLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVoQyxxQkFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7O0lBWS9COztPQUVHO0lBQ0gsNEJBQW9CLFFBQStCLEVBQVUsSUFBdUI7UUFBcEYsaUJBSUM7UUFKbUIsYUFBUSxHQUFSLFFBQVEsQ0FBdUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtxQkFScEQsRUFBRTtRQVNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztZQUN2RCxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QixDQUFDLENBQUM7S0FDSjs7OztJQUVELHdDQUFXOzs7SUFBWDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7S0FDRjtJQUVEOztPQUVHOzs7Ozs7SUFDSCxzQ0FBUzs7Ozs7SUFBVCxVQUFVLEtBQXFCO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0RSxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2Q7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzs7UUFHckQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7UUFFckIsRUFBRSxDQUFDLENBQUMsbUJBQU8sSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7Z0JBL0NGLElBQUksU0FBQztvQkFDSixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsSUFBSSxFQUFFLEtBQUs7aUJBQ1o7Ozs7Z0JBVFEscUJBQXFCO2dCQURBLGlCQUFpQjs7NkJBQS9DOztTQVdhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGVUcmFuc2Zvcm0sIFBpcGUsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBlcXVhbHMgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBWSUVXX0RFU1RST1lFRF9TVEFURSA9IDEyODtcblxuQFBpcGUoe1xuICBuYW1lOiAnbG9jYWxpemUnLFxuICBwdXJlOiBmYWxzZSAvLyByZXF1aXJlZCB0byB1cGRhdGUgdGhlIHZhbHVlIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWRcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nIHwgYW55W10gPSAnJztcbiAgcHJpdmF0ZSBsYXN0S2V5OiBzdHJpbmcgfCBhbnlbXTtcbiAgcHJpdmF0ZSBsYXN0TGFuZ3VhZ2U6IHN0cmluZztcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogQ1RPUlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2NhbGl6ZTogTG9jYWxpemVSb3V0ZXJTZXJ2aWNlLCBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmxvY2FsaXplLnJvdXRlckV2ZW50cy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0odGhpcy5sYXN0S2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIGN1cnJlbnQgdXJsIHRvIGxvY2FsaXplZCBvbmVcbiAgICovXG4gIHRyYW5zZm9ybShxdWVyeTogc3RyaW5nIHwgYW55W10pOiBzdHJpbmcgfCBhbnlbXSB7XG4gICAgaWYgKCFxdWVyeSB8fCBxdWVyeS5sZW5ndGggPT09IDAgfHwgIXRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nKSB7XG4gICAgICByZXR1cm4gcXVlcnk7XG4gICAgfVxuICAgIGlmIChlcXVhbHMocXVlcnksIHRoaXMubGFzdEtleSkgJiYgZXF1YWxzKHRoaXMubGFzdExhbmd1YWdlLCB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLmxhc3RLZXkgPSBxdWVyeTtcbiAgICB0aGlzLmxhc3RMYW5ndWFnZSA9IHRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nO1xuXG4gICAgLyoqIHRyYW5zbGF0ZSBrZXkgYW5kIHVwZGF0ZSB2YWx1ZXMgKi9cbiAgICB0aGlzLnZhbHVlID0gdGhpcy5sb2NhbGl6ZS50cmFuc2xhdGVSb3V0ZShxdWVyeSk7XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgLy8gaWYgdmlldyBpcyBhbHJlYWR5IGRlc3Ryb3llZCwgaWdub3JlIGZpcmluZyBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgaWYgKCg8YW55PiB0aGlzLl9yZWYpLl92aWV3LnN0YXRlICYgVklFV19ERVNUUk9ZRURfU1RBVEUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG59XG4iXX0=