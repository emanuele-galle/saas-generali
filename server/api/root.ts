import { createTRPCRouter, createCallerFactory } from "./trpc";
import { consultantsRouter } from "./routers/consultants";
import { landingPagesRouter } from "./routers/landing-pages";
import { submissionsRouter } from "./routers/submissions";
import { domainsRouter } from "./routers/domains";

export const appRouter = createTRPCRouter({
  consultants: consultantsRouter,
  landingPages: landingPagesRouter,
  submissions: submissionsRouter,
  domains: domainsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
