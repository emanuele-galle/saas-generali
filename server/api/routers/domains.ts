import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { verifyDNS } from "@/lib/dns";

export const domainsRouter = createTRPCRouter({
  // List all domains (admin) or own domain (consultant)
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "CONSULTANT") {
      // Get consultant's landing page domain
      const consultant = await ctx.db.consultant.findUnique({
        where: { userId: ctx.user.id },
        include: {
          landingPage: {
            include: { customDomain: true },
          },
        },
      });
      if (!consultant?.landingPage?.customDomain) return [];
      return [consultant.landingPage.customDomain];
    }

    return ctx.db.customDomain.findMany({
      include: {
        landingPage: {
          include: { consultant: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get domain by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const domain = await ctx.db.customDomain.findUnique({
        where: { id: input.id },
        include: {
          landingPage: {
            include: { consultant: true },
          },
        },
      });
      if (!domain) throw new TRPCError({ code: "NOT_FOUND" });

      // Check permissions: consultants can only view their own domain
      if (
        ctx.user.role === "CONSULTANT" &&
        domain.landingPage?.consultant?.userId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return domain;
    }),

  // Create custom domain
  create: adminProcedure
    .input(
      z.object({
        landingPageId: z.string(),
        domain: z.string().min(3).regex(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/i, {
          message: "Dominio non valido",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check domain uniqueness
      const existing = await ctx.db.customDomain.findUnique({
        where: { domain: input.domain },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Dominio già in uso",
        });
      }

      // Check landing page exists and doesn't already have a domain
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.landingPageId },
        include: { customDomain: true },
      });
      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (landingPage.customDomain) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Questa landing page ha già un dominio associato",
        });
      }

      // Generate TXT verification record
      const verificationTxt = `saas-generali-verify=${randomBytes(16).toString("hex")}`;

      return ctx.db.customDomain.create({
        data: {
          landingPageId: input.landingPageId,
          domain: input.domain.toLowerCase(),
          verificationTxt,
          status: "PENDING",
          sslStatus: "pending",
        },
      });
    }),

  // Verify domain DNS
  verify: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const domain = await ctx.db.customDomain.findUnique({
        where: { id: input.id },
      });
      if (!domain) throw new TRPCError({ code: "NOT_FOUND" });
      if (!domain.verificationTxt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record TXT di verifica non configurato per questo dominio",
        });
      }

      const expectedIP = process.env.NEXT_PUBLIC_VPS_IP || "193.203.190.63";
      const result = await verifyDNS(
        domain.domain,
        domain.verificationTxt,
        expectedIP,
      );

      if (!result.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Verifica DNS fallita: ${result.errors.join("; ")}`,
        });
      }

      return ctx.db.customDomain.update({
        where: { id: input.id },
        data: {
          status: "ACTIVE",
          sslStatus: "active",
        },
      });
    }),

  // Delete domain
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const domain = await ctx.db.customDomain.findUnique({
        where: { id: input.id },
      });
      if (!domain) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.customDomain.delete({
        where: { id: input.id },
      });
    }),
});
