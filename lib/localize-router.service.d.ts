import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
/**
 * Localization service
 * modifyRoutes
 */
export declare class LocalizeRouterService {
    parser: LocalizeParser;
    settings: LocalizeRouterSettings;
    private router;
    private route;
    routerEvents: Subject<string>;
    /**
     * CTOR
     */
    constructor(parser: LocalizeParser, settings: LocalizeRouterSettings, router: Router, route: ActivatedRoute);
    /**
     * Start up the service
     */
    init(): void;
    /**
     * Change language and navigate to translated route
     */
    changeLanguage(lang: string, extras?: NavigationExtras, useNavigateMethod?: boolean): void;
    /**
     * Traverses through the tree to assemble new translated url
     */
    private traverseRouteSnapshot(snapshot);
    /**
     * Extracts new segment value based on routeConfig and url
     */
    private parseSegmentValue(snapshot);
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     */
    translateRoute(path: string | any[]): string | any[];
    /**
     * Event handler to react on route change
     */
    private _routeChanged();
}
