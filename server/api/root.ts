import { createTRPCRouter, createCallerFactory } from "./trpc";
import { consultantsRouter } from "./routers/consultants";
import { landingPagesRouter } from "./routers/landing-pages";
import { submissionsRouter } from "./routers/submissions";
import { domainsRouter } from "./routers/domains";
import { analyticsRouter } from "./routers/analytics";
import { mediaRouter } from "./routers/media";
import { usersRouter } from "./routers/users";
import { invitationsRouter } from "./routers/invitations";

export const appRouter = createTRPCRouter({
  consultants: consultantsRouter,
  landingPages: landingPagesRouter,
  submissions: submissionsRouter,
  domains: domainsRouter,
  analytics: analyticsRouter,
  media: mediaRouter,
  users: usersRouter,
  invitations: invitationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
