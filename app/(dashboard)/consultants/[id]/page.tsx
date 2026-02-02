import { redirect } from "next/navigation";

export default function ConsultantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/consultants/${params.id}/edit`);
}
