"use client";

import { useRef } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ConsultantForm,
  type ConsultantFormData,
} from "@/components/dashboard/consultant-form";

export default function MyProfilePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const profileImageRef = useRef<string | undefined>(undefined);

  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getByUserId.queryOptions()
  );

  // Initialize the ref when consultant data loads
  if (consultant && profileImageRef.current === undefined) {
    profileImageRef.current = consultant.profileImage ?? undefined;
  }

  const updateMutation = useMutation(
    trpc.consultants.update.mutationOptions({
      onSuccess: () => {
        toast.success("Profilo aggiornato con successo");
        queryClient.invalidateQueries();
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
        <p className="text-muted-foreground">
          Nessun profilo consulente associato al tuo account.
        </p>
      </div>
    );
  }

  function handleSubmit(data: ConsultantFormData) {
    if (!consultant) return;
    updateMutation.mutate({
      id: consultant.id,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      role: data.role,
      network: data.network,
      bio: data.bio,
      profileImage: profileImageRef.current,
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
        <h1 className="text-3xl font-bold tracking-tight">Il mio Profilo</h1>
        <p className="text-muted-foreground">
          Modifica le tue informazioni personali e professionali
        </p>
      </div>
      <ConsultantForm
        defaultValues={{
          email: consultant.email,
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
        profileImageUrl={consultant.profileImage}
        onProfileImageChange={(url) => {
          profileImageRef.current = url;
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEdit
      />
    </div>
  );
}
