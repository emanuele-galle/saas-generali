import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const submissionsRouter = createTRPCRouter({
  // Submit contact form (public)
  create: publicProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().optional(),
        isExistingClient: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contactSubmission.create({
        data: input,
      });
    }),

  // List submissions (admin sees all, consultant sees own)
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        landingPageId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let where: Record<string, unknown> = {};

      if (input.landingPageId) {
        where.landingPageId = input.landingPageId;
      }

      // Consultants can only see their own submissions
      if (ctx.user.role === "CONSULTANT") {
        const consultant = await ctx.db.consultant.findUnique({
          where: { userId: ctx.user.id },
          include: { landingPage: { select: { id: true } } },
        });
        if (consultant?.landingPage) {
          where.landingPageId = consultant.landingPage.id;
        } else {
          return { submissions: [], total: 0, pages: 0 };
        }
      }

      const [submissions, total] = await Promise.all([
        ctx.db.contactSubmission.findMany({
          where,
          include: {
            landingPage: {
              include: {
                consultant: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.contactSubmission.count({ where }),
      ]);

      return {
        submissions,
        total,
        pages: Math.ceil(total / input.limit),
      };
    }),

  // Delete submission (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
