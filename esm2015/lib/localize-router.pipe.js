/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Pipe, ChangeDetectorRef } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { equals } from './util';
const /** @type {?} */ VIEW_DESTROYED_STATE = 128;
export class LocalizeRouterPipe {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2lsc2Rhdi9uZ3gtdHJhbnNsYXRlLXJvdXRlci8iLCJzb3VyY2VzIjpbImxpYi9sb2NhbGl6ZS1yb3V0ZXIucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixJQUFJLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVoQyx1QkFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7QUFNakMsTUFBTTs7Ozs7O0lBU0osWUFBb0IsUUFBK0IsRUFBVSxJQUF1QjtRQUFoRSxhQUFRLEdBQVIsUUFBUSxDQUF1QjtRQUFVLFNBQUksR0FBSixJQUFJLENBQW1CO3FCQVJwRCxFQUFFO1FBU2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QixDQUFDLENBQUM7S0FDSjs7OztJQUVELFdBQVc7UUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDO0tBQ0Y7Ozs7OztJQUtELFNBQVMsQ0FBQyxLQUFxQjtRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNkO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9GLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7O1FBR3JELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7O1FBRXJCLEVBQUUsQ0FBQyxDQUFDLG1CQUFPLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7OztZQS9DRixJQUFJLFNBQUM7Z0JBQ0osSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxLQUFLO2FBQ1o7Ozs7WUFUUSxxQkFBcUI7WUFEQSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlVHJhbnNmb3JtLCBQaXBlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbGl6ZVJvdXRlclNlcnZpY2UgfSBmcm9tICcuL2xvY2FsaXplLXJvdXRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZXF1YWxzIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgVklFV19ERVNUUk9ZRURfU1RBVEUgPSAxMjg7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2xvY2FsaXplJyxcbiAgcHVyZTogZmFsc2UgLy8gcmVxdWlyZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkXG59KVxuZXhwb3J0IGNsYXNzIExvY2FsaXplUm91dGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0sIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdmFsdWU6IHN0cmluZyB8IGFueVtdID0gJyc7XG4gIHByaXZhdGUgbGFzdEtleTogc3RyaW5nIHwgYW55W107XG4gIHByaXZhdGUgbGFzdExhbmd1YWdlOiBzdHJpbmc7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIENUT1JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYWxpemU6IExvY2FsaXplUm91dGVyU2VydmljZSwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2NhbGl6ZS5yb3V0ZXJFdmVudHMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMubGFzdEtleSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBjdXJyZW50IHVybCB0byBsb2NhbGl6ZWQgb25lXG4gICAqL1xuICB0cmFuc2Zvcm0ocXVlcnk6IHN0cmluZyB8IGFueVtdKTogc3RyaW5nIHwgYW55W10ge1xuICAgIGlmICghcXVlcnkgfHwgcXVlcnkubGVuZ3RoID09PSAwIHx8ICF0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykge1xuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgICBpZiAoZXF1YWxzKHF1ZXJ5LCB0aGlzLmxhc3RLZXkpICYmIGVxdWFscyh0aGlzLmxhc3RMYW5ndWFnZSwgdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XG4gICAgdGhpcy5sYXN0TGFuZ3VhZ2UgPSB0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZztcblxuICAgIC8qKiB0cmFuc2xhdGUga2V5IGFuZCB1cGRhdGUgdmFsdWVzICovXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubG9jYWxpemUudHJhbnNsYXRlUm91dGUocXVlcnkpO1xuICAgIHRoaXMubGFzdEtleSA9IHF1ZXJ5O1xuICAgIC8vIGlmIHZpZXcgaXMgYWxyZWFkeSBkZXN0cm95ZWQsIGlnbm9yZSBmaXJpbmcgY2hhbmdlIGRldGVjdGlvblxuICAgIGlmICgoPGFueT4gdGhpcy5fcmVmKS5fdmlldy5zdGF0ZSAmIFZJRVdfREVTVFJPWUVEX1NUQVRFKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuIl19