import { ModuleWithProviders, Injector } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
import { Routes } from '@angular/router';
import { LocalizeRouterConfig } from './localize-router.config';
export declare class ParserInitializer {
    private injector;
    parser: LocalizeParser;
    routes: Routes;
    /**
     * CTOR
     */
    constructor(injector: Injector);
    appInitializer(): Promise<any>;
    generateInitializer(parser: LocalizeParser, routes: Routes[]): () => Promise<any>;
}
export declare function getAppInitializer(p: ParserInitializer, parser: LocalizeParser, routes: Routes[]): any;
export declare class LocalizeRouterModule {
    static forRoot(routes: Routes, config?: LocalizeRouterConfig): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}
export declare function provideForRootGuard(localizeRouterModule: LocalizeRouterModule): string;
