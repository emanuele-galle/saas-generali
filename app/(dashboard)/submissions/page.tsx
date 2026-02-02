"use client";

import { useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.submissions.list.queryOptions({ page, limit: 20 })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Richieste di Contatto
        </h1>
        <p className="text-muted-foreground">
          Form compilati dai visitatori delle landing page
        </p>
      </div>

      <Card>
        <CardHeader>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.total} richieste totali
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : data?.submissions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Nessuna richiesta ricevuta
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Consulente</TableHead>
                    <TableHead>Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="text-sm">
                        {formatDateTime(sub.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {sub.firstName} {sub.lastName}
                      </TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{sub.phone || "-"}</TableCell>
                      <TableCell>
                        {sub.landingPage.consultant.firstName}{" "}
                        {sub.landingPage.consultant.lastName}
                      </TableCell>
                      <TableCell>
                        {sub.isExistingClient ? "Si" : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.pages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Pagina {page} di {data.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Precedente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Successiva
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
