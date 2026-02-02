"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  ExternalLink,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

export default function ConsultantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const id = params.id as string;

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getById.queryOptions({ id })
  );

  const deleteMutation = useMutation(
    trpc.consultants.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Consulente eliminato");
        queryClient.invalidateQueries();
        router.push("/consultants");
      },
      onError: (error) => {
        toast.error(error.message || "Errore nell'eliminazione");
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Consulente non trovato</p>
      </div>
    );
  }

  const lp = consultant.landingPage;
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
          <p className="text-muted-foreground">{consultant.role}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/consultants/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifica
            </Link>
          </Button>
          {lp && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/editor/${lp.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Editor Landing
                </Link>
              </Button>
              {lp.status === "PUBLISHED" && (
                <Button asChild variant="outline" size="sm">
                  <a href={`/${lp.slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Anteprima
                  </a>
                </Button>
              )}
            </>
          )}
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler eliminare {fullName}? Verranno eliminati
                    anche account, landing page e tutte le richieste di contatto.
                    Questa azione non puo essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteMutation.mutate({ id })}
                  >
                    {deleteMutation.isPending ? "Eliminazione..." : "Elimina"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profilo */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                {consultant.profileImage ? (
                  <Image
                    src={consultant.profileImage}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold">{fullName}</h2>
              <p className="text-sm text-muted-foreground">{consultant.role}</p>
              {consultant.network && (
                <Badge variant="secondary" className="mt-2">
                  {consultant.network}
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{consultant.email}</span>
              </div>
              {consultant.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.phone}</span>
                </div>
              )}
              {consultant.mobile && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.mobile}</span>
                </div>
              )}
              {consultant.city && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {[consultant.address, consultant.cap, consultant.city, consultant.province]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Certificazioni */}
            {(consultant.efpa || consultant.efpaEsg || consultant.sustainableAdvisor) && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Certificazioni
                </p>
                <div className="flex flex-wrap gap-2">
                  {consultant.efpa && <Badge>EFPA</Badge>}
                  {consultant.efpaEsg && <Badge>EFPA ESG</Badge>}
                  {consultant.sustainableAdvisor && (
                    <Badge>Sustainable Advisor</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dettagli e Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Bio */}
          {consultant.bio && (
            <Card>
              <CardHeader>
                <CardTitle>Biografia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {consultant.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Landing Page Stats */}
          {lp && (
            <Card>
              <CardHeader>
                <CardTitle>Landing Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Stato</p>
                    <Badge
                      variant={
                        lp.status === "PUBLISHED"
                          ? "default"
                          : lp.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {lp.status === "PUBLISHED"
                        ? "Pubblicata"
                        : lp.status === "DRAFT"
                          ? "Bozza"
                          : "Archiviata"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <p className="font-medium">/{lp.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visite</p>
                    <p className="text-2xl font-bold">{lp.views}</p>
                  </div>
                </div>
                {lp._count && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Richieste di contatto:{" "}
                      <span className="font-medium text-foreground">
                        {lp._count.contactSubmissions}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social */}
          {(consultant.linkedinUrl || consultant.facebookUrl || consultant.twitterUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Social</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consultant.linkedinUrl && (
                    <a
                      href={consultant.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      LinkedIn: {consultant.linkedinUrl}
                    </a>
                  )}
                  {consultant.facebookUrl && (
                    <a
                      href={consultant.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      Facebook: {consultant.facebookUrl}
                    </a>
                  )}
                  {consultant.twitterUrl && (
                    <a
                      href={consultant.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      Twitter/X: {consultant.twitterUrl}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
