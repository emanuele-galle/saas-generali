"use client";

import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ConsultantForm,
  type ConsultantFormData,
} from "@/components/dashboard/consultant-form";

export default function EditConsultantPage() {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getById.queryOptions({ id })
  );

  const updateMutation = useMutation(
    trpc.consultants.update.mutationOptions({
      onSuccess: () => {
        toast.success("Consulente aggiornato con successo");
        queryClient.invalidateQueries();
        router.push("/consultants");
      },
      onError: (error) => {
        toast.error(error.message || "Errore nell'aggiornamento");
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

  function handleSubmit(data: ConsultantFormData) {
    updateMutation.mutate({
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      role: data.role,
      network: data.network,
      bio: data.bio,
      email: data.consultantEmail,
      phone: data.phone,
      mobile: data.mobile,
      address: data.address,
      cap: data.cap,
      city: data.city,
      province: data.province,
      efpa: data.efpa,
      efpaEsg: data.efpaEsg,
      sustainableAdvisor: data.sustainableAdvisor,
      linkedinUrl: data.linkedinUrl,
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifica Consulente
        </h1>
        <p className="text-muted-foreground">
          {consultant.title ? `${consultant.title} ` : ""}
          {consultant.firstName} {consultant.lastName}
        </p>
      </div>
      <ConsultantForm
        defaultValues={{
          email: consultant.user.email,
          firstName: consultant.firstName,
          lastName: consultant.lastName,
          title: consultant.title ?? undefined,
          role: consultant.role,
          network: consultant.network ?? undefined,
          bio: consultant.bio ?? undefined,
          consultantEmail: consultant.email,
          phone: consultant.phone ?? undefined,
          mobile: consultant.mobile ?? undefined,
          address: consultant.address ?? undefined,
          cap: consultant.cap ?? undefined,
          city: consultant.city ?? undefined,
          province: consultant.province ?? undefined,
          efpa: consultant.efpa,
          efpaEsg: consultant.efpaEsg,
          sustainableAdvisor: consultant.sustainableAdvisor,
          linkedinUrl: consultant.linkedinUrl ?? undefined,
          facebookUrl: consultant.facebookUrl ?? undefined,
          twitterUrl: consultant.twitterUrl ?? undefined,
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEdit
      />
    </div>
  );
}
