"use client";

import { useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

type DomainRow = {
  id: string;
  domain: string;
  status: string;
  sslStatus: string | null;
  verificationTxt: string | null;
  cloudflareZoneId: string | null;
  cloudflareNameservers: string | null;
  landingPage?: {
    slug: string;
    consultant?: {
      firstName: string;
      lastName: string;
    };
  };
};

export default function DomainsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [selectedLandingPage, setSelectedLandingPage] = useState("");
  const [checkingStatusId, setCheckingStatusId] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: domains, isLoading } = useQuery(
    trpc.domains.list.queryOptions()
  );

  // Get consultants to map landing pages for the create dialog
  const { data: consultantsData } = useQuery(
    trpc.consultants.list.queryOptions({ page: 1, limit: 100 })
  );

  const createMutation = useMutation(
    trpc.domains.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.domains.list.queryKey() });
        setIsOpen(false);
        setNewDomain("");
        setSelectedLandingPage("");
        toast.success("Dominio aggiunto e zona Cloudflare creata");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const verifyMutation = useMutation(
    trpc.domains.verify.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.domains.list.queryKey() });
        toast.success("Dominio verificato");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.domains.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.domains.list.queryKey() });
        toast.success("Dominio e zona Cloudflare rimossi");
      },
    })
  );

  // Check Cloudflare zone propagation status
  const checkStatusQuery = useQuery(
    trpc.domains.checkStatus.queryOptions(
      { id: checkingStatusId! },
      { enabled: !!checkingStatusId },
    )
  );

  const handleCheckStatus = (domainId: string) => {
    setCheckingStatusId(domainId);
    // Refetch when clicking again
    if (checkingStatusId === domainId) {
      queryClient.invalidateQueries({
        queryKey: trpc.domains.checkStatus.queryKey({ id: domainId }),
      });
    }
  };

  const consultantsWithLandingPages = consultantsData?.consultants.filter(
    (c) => c.landingPage
  );

  const statusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Attivo</Badge>;
      case "ERROR":
        return <Badge variant="destructive">Errore</Badge>;
      default:
        return <Badge variant="secondary">In attesa</Badge>;
    }
  };

  const cfZoneBadge = (d: DomainRow) => {
    if (!d.cloudflareZoneId) return <Badge variant="secondary">N/A</Badge>;
    if (checkingStatusId === d.id && checkStatusQuery.data) {
      const zs = checkStatusQuery.data.zoneStatus;
      if (zs === "active") return <Badge variant="success">CF Attiva</Badge>;
      if (zs === "error") return <Badge variant="destructive">CF Errore</Badge>;
      return <Badge variant="secondary">CF Pending</Badge>;
    }
    return <Badge variant="secondary">CF Configurata</Badge>;
  };

  const parseNameservers = (ns: string | null): string[] => {
    if (!ns) return [];
    try {
      return JSON.parse(ns);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domini</h1>
          <p className="text-muted-foreground">
            Gestisci i domini personalizzati delle landing page
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nuovo Dominio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi Dominio</DialogTitle>
              <DialogDescription>
                Associa un dominio personalizzato a una landing page. La zona DNS
                e i record verranno creati automaticamente su Cloudflare.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Dominio</Label>
                <Input
                  placeholder="esempio.it"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Landing Page</Label>
                <Select
                  value={selectedLandingPage}
                  onValueChange={setSelectedLandingPage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona consulente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {consultantsWithLandingPages?.map((c) => (
                      <SelectItem
                        key={c.landingPage!.id}
                        value={c.landingPage!.id}
                      >
                        {c.firstName} {c.lastName} (/{c.landingPage!.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annulla
              </Button>
              <Button
                onClick={() =>
                  createMutation.mutate({
                    domain: newDomain,
                    landingPageId: selectedLandingPage,
                  })
                }
                disabled={
                  !newDomain || !selectedLandingPage || createMutation.isPending
                }
              >
                {createMutation.isPending ? "Creazione zona..." : "Aggiungi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domini Configurati
          </CardTitle>
          <CardDescription>
            I record DNS vengono creati automaticamente su Cloudflare. Dopo
            l&apos;aggiunta, imposta i nameserver sul registrar del dominio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : !domains || domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nessun dominio configurato
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dominio</TableHead>
                  <TableHead>Consulente</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Zona CF</TableHead>
                  <TableHead>Nameservers</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain: Record<string, unknown>) => {
                  const d = domain as DomainRow;
                  const nameservers = parseNameservers(d.cloudflareNameservers);
                  return (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {statusIcon(d.status)}
                          <span className="font-mono text-sm">{d.domain}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {d.landingPage?.consultant
                          ? `${d.landingPage.consultant.firstName} ${d.landingPage.consultant.lastName}`
                          : "-"}
                      </TableCell>
                      <TableCell>{statusBadge(d.status)}</TableCell>
                      <TableCell>{cfZoneBadge(d)}</TableCell>
                      <TableCell>
                        {nameservers.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <div className="space-y-0.5">
                              {nameservers.map((ns) => (
                                <code
                                  key={ns}
                                  className="block text-xs bg-muted px-2 py-0.5 rounded"
                                >
                                  {ns}
                                </code>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  nameservers.join("\n")
                                );
                                toast.success("Nameservers copiati");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {d.cloudflareZoneId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckStatus(d.id)}
                              disabled={
                                checkingStatusId === d.id &&
                                checkStatusQuery.isLoading
                              }
                            >
                              <RefreshCw
                                className={`h-3 w-3 mr-1 ${
                                  checkingStatusId === d.id &&
                                  checkStatusQuery.isLoading
                                    ? "animate-spin"
                                    : ""
                                }`}
                              />
                              Propagazione
                            </Button>
                          )}
                          {d.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                verifyMutation.mutate({ id: d.id })
                              }
                              disabled={verifyMutation.isPending}
                            >
                              Verifica
                            </Button>
                          )}
                          {d.status === "ACTIVE" && (
                            <a
                              href={`https://${d.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              deleteMutation.mutate({ id: d.id })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DNS Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Istruzioni DNS</CardTitle>
          <CardDescription>
            Come funziona la configurazione automatica dei domini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Creazione automatica</h4>
            <p className="text-sm text-muted-foreground">
              Quando aggiungi un dominio, il sistema crea automaticamente la zona
              su Cloudflare con i record DNS necessari (A per @ e www che puntano
              al server).
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Configura i Nameservers</h4>
            <p className="text-sm text-muted-foreground">
              Vai sul registrar del dominio (es. GoDaddy, Aruba, Register.it) e
              imposta i nameservers Cloudflare assegnati mostrati nella tabella
              sopra. Questo e l&apos;unico passaggio manuale richiesto.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Attendi la propagazione</h4>
            <p className="text-sm text-muted-foreground">
              La propagazione dei nameservers puo richiedere fino a 48 ore. Usa
              il bottone &quot;Propagazione&quot; per controllare se la zona
              Cloudflare e attiva. Quando lo stato diventa &quot;CF Attiva&quot;,
              clicca &quot;Verifica&quot; per attivare il dominio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
