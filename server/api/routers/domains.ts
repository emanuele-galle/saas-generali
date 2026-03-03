import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { verifyDNS } from "@/lib/dns";
import {
  createZone,
  addDNSRecord,
  deleteZone,
  getZoneStatus,
} from "@/lib/cloudflare";

const VPS_IP = process.env.NEXT_PUBLIC_VPS_IP || "193.203.190.63";

export const domainsRouter = createTRPCRouter({
  // List all domains (admin) or own domain (consultant)
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "CONSULTANT") {
      // Get consultant's landing page domain
      const consultant = await ctx.db.consultant.findUnique({
        where: { userId: ctx.user.id },
        include: {
          landingPage: {
            include: { customDomains: true },
          },
        },
      });
      if (!consultant?.landingPage?.customDomains?.length) return [];
      return consultant.landingPage.customDomains;
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

      // Check landing page exists
      const landingPage = await ctx.db.landingPage.findUnique({
        where: { id: input.landingPageId },
      });
      if (!landingPage) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Generate TXT verification record
      const verificationTxt = `saas-consulenti-verify=${randomBytes(16).toString("hex")}`;

      const domainName = input.domain.toLowerCase();

      // Create Cloudflare zone + DNS records
      let cloudflareZoneId: string | null = null;
      let cloudflareNameservers: string | null = null;

      try {
        const zone = await createZone(domainName);
        cloudflareZoneId = zone.zoneId;
        cloudflareNameservers = JSON.stringify(zone.nameservers);

        // Add A record for @ (root domain) — proxied: false (SSL gestito da Traefik)
        await addDNSRecord(zone.zoneId, "A", domainName, VPS_IP, false);

        // Add A record for www
        await addDNSRecord(zone.zoneId, "A", `www.${domainName}`, VPS_IP, false);

        // Add TXT verification record
        await addDNSRecord(zone.zoneId, "TXT", domainName, verificationTxt, false);
      } catch (error) {
        console.error("Errore Cloudflare durante creazione zona:", error);
        // Non blocchiamo la creazione del dominio nel DB se Cloudflare fallisce
      }

      return ctx.db.customDomain.create({
        data: {
          landingPageId: input.landingPageId,
          domain: domainName,
          verificationTxt,
          status: "PENDING",
          sslStatus: "pending",
          cloudflareZoneId,
          cloudflareNameservers,
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

      const result = await verifyDNS(
        domain.domain,
        domain.verificationTxt,
        VPS_IP,
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

  // Check Cloudflare zone status
  checkStatus: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const domain = await ctx.db.customDomain.findUnique({
        where: { id: input.id },
      });
      if (!domain) throw new TRPCError({ code: "NOT_FOUND" });

      if (!domain.cloudflareZoneId) {
        return { zoneStatus: null, nameservers: [] };
      }

      try {
        const result = await getZoneStatus(domain.cloudflareZoneId);
        return {
          zoneStatus: result.status,
          nameservers: result.nameservers,
        };
      } catch (error) {
        console.error("Errore Cloudflare checkStatus:", error);
        return { zoneStatus: "error", nameservers: [] };
      }
    }),

  // Delete domain
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const domain = await ctx.db.customDomain.findUnique({
        where: { id: input.id },
      });
      if (!domain) throw new TRPCError({ code: "NOT_FOUND" });

      // Delete Cloudflare zone if exists
      if (domain.cloudflareZoneId) {
        try {
          await deleteZone(domain.cloudflareZoneId);
        } catch (error) {
          console.error("Errore Cloudflare durante eliminazione zona:", error);
          // Procediamo con la cancellazione dal DB anche se Cloudflare fallisce
        }
      }

      return ctx.db.customDomain.delete({
        where: { id: input.id },
      });
    }),
});
