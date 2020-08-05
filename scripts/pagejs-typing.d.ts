declare module 'page' {
    interface Context<KEYS extends string> {
        params: { [K in KEYS] : string }
    }

    interface RouteHandler<C extends Context<any>> {
        (ctx: C): void
    }

    interface PageJs {
        start(): void
        <Params extends string = undefined>(route: string, handler?: RouteHandler<Context<Params>>): void
    }

    const page: PageJs;
    export default page;
}
