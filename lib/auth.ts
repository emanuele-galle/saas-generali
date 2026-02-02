import { auth } from "@/auth";
import type { UserRole } from "@prisma/client";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export function isAdmin(role: UserRole): boolean {
  return role === "SUPERADMIN" || role === "ADMIN";
}

export function isConsultant(role: UserRole): boolean {
  return role === "CONSULTANT";
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
