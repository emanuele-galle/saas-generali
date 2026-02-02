import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";

const contactSchema = z.object({
  landingPageId: z.string().min(1, "ID landing page obbligatorio"),
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  message: z.string().optional(),
  isExistingClient: z.boolean().default(false),
});

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: "Corpo della richiesta non valido" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dati non validi";
    return NextResponse.json(
      { message: firstError },
      { status: 400 }
    );
  }

  const { landingPageId, firstName, lastName, email, phone, message, isExistingClient } =
    parsed.data;

  // Verify the landing page exists and is published
  const landingPage = await db.landingPage.findUnique({
    where: { id: landingPageId },
    select: { id: true, status: true },
  });

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    return NextResponse.json(
      { message: "Pagina non trovata" },
      { status: 404 }
    );
  }

  const submission = await db.contactSubmission.create({
    data: {
      landingPageId,
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      message: message ?? null,
      isExistingClient,
    },
  });

  return NextResponse.json(
    { message: "Messaggio inviato con successo", id: submission.id },
    { status: 201 }
  );
}
