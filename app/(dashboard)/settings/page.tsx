"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: session } = useSession();
  const trpc = useTRPC();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation(
    trpc.users.changePassword.mutationOptions({
      onSuccess: () => {
        toast.success("Password aggiornata con successo");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
      onError: (error) => {
        toast.error(error.message || "Errore nel cambio password");
      },
    })
  );

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La nuova password deve avere almeno 8 caratteri");
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-muted-foreground">
          Gestisci il tuo account e le preferenze
        </p>
      </div>

      {/* Cambio Password */}
      <Card>
        <CardHeader>
          <CardTitle>Cambio Password</CardTitle>
          <CardDescription>
            Aggiorna la password del tuo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password attuale</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nuova password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimo 8 caratteri"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Conferma nuova password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Aggiornamento..."
                : "Aggiorna password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Info Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Utente</p>
              <p className="font-medium">{session?.user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ruolo</p>
              <p className="font-medium">
                {session?.user?.role === "SUPERADMIN"
                  ? "Super Amministratore"
                  : session?.user?.role === "ADMIN"
                    ? "Amministratore"
                    : "Consulente"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Piattaforma</p>
              <p className="font-medium">Saas Generali v0.1.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
