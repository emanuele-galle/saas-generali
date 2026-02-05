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
} from "lucide-react";
import { toast } from "sonner";

const VPS_IP = process.env.NEXT_PUBLIC_VPS_IP || "193.203.190.63";

export default function DomainsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [selectedLandingPage, setSelectedLandingPage] = useState("");
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
        toast.success("Dominio aggiunto");
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
        toast.success("Dominio rimosso");
      },
    })
  );

  const consultantsWithLandingPages = consultantsData?.consultants.filter(
    (c) => c.landingPage && !c.landingPage.customDomain
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
                Associa un dominio personalizzato a una landing page
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
                {createMutation.isPending ? "Aggiunta..." : "Aggiungi"}
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
            Dopo aver aggiunto un dominio, configura il record DNS TXT per la
            verifica e il record A che punta al server.
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
                  <TableHead>SSL</TableHead>
                  <TableHead>Verifica DNS</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain: Record<string, unknown>) => {
                  const d = domain as {
                    id: string;
                    domain: string;
                    status: string;
                    sslStatus: string | null;
                    verificationTxt: string | null;
                    landingPage?: {
                      slug: string;
                      consultant?: {
                        firstName: string;
                        lastName: string;
                      };
                    };
                  };
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
                      <TableCell>
                        {d.sslStatus === "active" ? (
                          <Badge variant="success">SSL Attivo</Badge>
                        ) : (
                          <Badge variant="secondary">
                            {d.sslStatus || "In attesa"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {d.verificationTxt && (
                          <div className="flex items-center gap-1">
                            <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                              {d.verificationTxt}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  d.verificationTxt!
                                );
                                toast.success("Copiato");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
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
            Come configurare un dominio personalizzato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Record A</h4>
            <p className="text-sm text-muted-foreground">
              Aggiungi un record A sul tuo registrar DNS che punta al nostro
              server:
            </p>
            <code className="block bg-muted p-3 rounded text-sm">
              Tipo: A | Nome: @ | Valore: {VPS_IP} | TTL: Auto
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Record TXT (Verifica)</h4>
            <p className="text-sm text-muted-foreground">
              Aggiungi un record TXT con il valore di verifica fornito sopra:
            </p>
            <code className="block bg-muted p-3 rounded text-sm">
              Tipo: TXT | Nome: @ | Valore: saas-generali-verify=...
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Verifica</h4>
            <p className="text-sm text-muted-foreground">
              Dopo aver configurato i record DNS, clicca &quot;Verifica&quot;
              per attivare il dominio. La propagazione DNS puo richiedere fino a
              48 ore.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
