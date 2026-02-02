import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getAdminStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalConsultants,
      publishedPages,
      viewsResult,
      submissionsTotal,
      submissionsThisMonth,
    ] = await Promise.all([
      ctx.db.consultant.count(),
      ctx.db.landingPage.count({ where: { status: "PUBLISHED" } }),
      ctx.db.landingPage.aggregate({ _sum: { views: true } }),
      ctx.db.contactSubmission.count(),
      ctx.db.contactSubmission.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
    ]);

    return {
      totalConsultants,
      publishedPages,
      totalViews: viewsResult._sum.views ?? 0,
      submissionsTotal,
      submissionsThisMonth,
    };
  }),

  getConsultantStats: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.consultant.findUnique({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        landingPage: {
          select: {
            id: true,
            views: true,
            _count: { select: { contactSubmissions: true } },
          },
        },
      },
    });

    if (!consultant?.landingPage) {
      return {
        views: 0,
        submissions: 0,
      };
    }

    return {
      views: consultant.landingPage.views,
      submissions: consultant.landingPage._count.contactSubmissions,
    };
  }),
});
