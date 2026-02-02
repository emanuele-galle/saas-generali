"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CONSULTANT_ROLES, CONSULTANT_NETWORKS, CONSULTANT_TITLES } from "@/lib/constants";

const consultantFormSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "Minimo 8 caratteri").optional(),
  firstName: z.string().min(1, "Nome obbligatorio"),
  lastName: z.string().min(1, "Cognome obbligatorio"),
  title: z.string().optional(),
  role: z.string().min(1, "Ruolo obbligatorio"),
  network: z.string().optional(),
  bio: z.string().optional(),
  consultantEmail: z.string().email("Email non valida"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  cap: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  efpa: z.boolean(),
  efpaEsg: z.boolean(),
  sustainableAdvisor: z.boolean(),
  linkedinUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
});

export type ConsultantFormData = z.infer<typeof consultantFormSchema>;

interface ConsultantFormProps {
  defaultValues?: Partial<ConsultantFormData>;
  onSubmit: (data: ConsultantFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function ConsultantForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit = false,
}: ConsultantFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantFormSchema),
    defaultValues: {
      efpa: false,
      efpaEsg: false,
      sustainableAdvisor: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dati Personali */}
      <Card>
        <CardHeader>
          <CardTitle>Dati personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Network</Label>
              <Select
                value={watch("network") || ""}
                onValueChange={(val) => setValue("network", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona network" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_NETWORKS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ruolo *</Label>
              <Select
                value={watch("role") || ""}
                onValueChange={(val) => setValue("role", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Titolo</Label>
              <Select
                value={watch("title") || ""}
                onValueChange={(val) => setValue("title", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona titolo" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_TITLES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input {...register("firstName")} placeholder="Giuseppe" />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Cognome *</Label>
              <Input {...register("lastName")} placeholder="Guglielmo" />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Indirizzo */}
          <div className="space-y-2">
            <Label>Indirizzo</Label>
            <Input {...register("address")} placeholder="Corso Italia 6" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CAP</Label>
              <Input {...register("cap")} placeholder="20122" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Citta</Label>
                <Input {...register("city")} placeholder="Milano" />
              </div>
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Input {...register("province")} placeholder="MI" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contatti */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email consulente *</Label>
              <Input
                {...register("consultantEmail")}
                type="email"
                placeholder="giuseppe.guglielmo@generali.it"
              />
              {errors.consultantEmail && (
                <p className="text-sm text-destructive">
                  {errors.consultantEmail.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Telefono fisso</Label>
              <Input {...register("phone")} placeholder="02/72436111" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cellulare</Label>
              <Input {...register("mobile")} placeholder="3482290990" />
            </div>
            <div></div>
          </div>

          <Separator />

          {/* Certificazioni */}
          <div className="space-y-3">
            <Label>Certificazioni</Label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("efpa")}
                  onCheckedChange={(val) => setValue("efpa", val === true)}
                />
                <span className="text-sm">EFPA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("efpaEsg")}
                  onCheckedChange={(val) => setValue("efpaEsg", val === true)}
                />
                <span className="text-sm">EFPA ESG</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch("sustainableAdvisor")}
                  onCheckedChange={(val) =>
                    setValue("sustainableAdvisor", val === true)
                  }
                />
                <span className="text-sm">Sustainable Advisor</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account di accesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email di login *</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="giuseppe.guglielmo@generali.it"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>
                Password {isEdit ? "(lascia vuoto per non cambiare)" : "*"}
              </Label>
              <Input
                {...register("password")}
                type="password"
                placeholder={isEdit ? "••••••••" : "Minimo 8 caratteri"}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio e Social */}
      <Card>
        <CardHeader>
          <CardTitle>Biografia e Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Biografia</Label>
            <Textarea
              {...register("bio")}
              placeholder="Descrizione professionale del consulente..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input
                {...register("facebookUrl")}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input
                {...register("twitterUrl")}
                placeholder="https://x.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Annulla
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Salvataggio..."
            : isEdit
              ? "Salva modifiche"
              : "Crea consulente"}
        </Button>
      </div>
    </form>
  );
}
