import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const mediaRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(30),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 30;

      const isAdmin =
        ctx.user.role === "ADMIN" || ctx.user.role === "SUPERADMIN";

      const where = isAdmin ? {} : { uploadedBy: ctx.user.id };

      const [items, total] = await Promise.all([
        ctx.db.media.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.db.media.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const media = await ctx.db.media.findUnique({
        where: { id: input.id },
      });

      if (!media) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const isAdmin =
        ctx.user.role === "ADMIN" || ctx.user.role === "SUPERADMIN";
      if (!isAdmin && media.uploadedBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return media;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.db.media.findUnique({
        where: { id: input.id },
      });

      if (!media) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const isAdmin =
        ctx.user.role === "ADMIN" || ctx.user.role === "SUPERADMIN";
      if (!isAdmin && media.uploadedBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Delete file from disk
      try {
        const filepath = path.join(
          process.cwd(),
          "public",
          media.url
        );
        await unlink(filepath);
      } catch {
        // File may already be deleted
      }

      await ctx.db.media.delete({ where: { id: input.id } });

      return { success: true };
    }),
});
