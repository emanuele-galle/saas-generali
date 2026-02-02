"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Globe, Eye, Mail } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: typeof Users;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const trpc = useTRPC();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  const { data: adminStats, isLoading: adminLoading } = useQuery({
    ...trpc.analytics.getAdminStats.queryOptions(),
    enabled: isAdmin,
  });

  const { data: consultantStats, isLoading: consultantLoading } = useQuery({
    ...trpc.analytics.getConsultantStats.queryOptions(),
    enabled: !isAdmin,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Panoramica della piattaforma Saas Generali"
            : "Le tue statistiche personali"}
        </p>
      </div>

      {isAdmin ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Consulenti Totali"
            value={adminStats?.totalConsultants ?? 0}
            subtitle="Consulenti registrati"
            icon={Users}
            loading={adminLoading}
          />
          <StatCard
            title="Pagine Pubblicate"
            value={adminStats?.publishedPages ?? 0}
            subtitle="Landing page attive"
            icon={Globe}
            loading={adminLoading}
          />
          <StatCard
            title="Visite Totali"
            value={adminStats?.totalViews ?? 0}
            subtitle="Visite alle landing page"
            icon={Eye}
            loading={adminLoading}
          />
          <StatCard
            title="Richieste Contatto"
            value={adminStats?.submissionsThisMonth ?? 0}
            subtitle={`${adminStats?.submissionsTotal ?? 0} totali`}
            icon={Mail}
            loading={adminLoading}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Visite Landing"
            value={consultantStats?.views ?? 0}
            subtitle="Visite alla tua landing page"
            icon={Eye}
            loading={consultantLoading}
          />
          <StatCard
            title="Richieste Contatto"
            value={consultantStats?.submissions ?? 0}
            subtitle="Form compilati"
            icon={Mail}
            loading={consultantLoading}
          />
        </div>
      )}
    </div>
  );
}
