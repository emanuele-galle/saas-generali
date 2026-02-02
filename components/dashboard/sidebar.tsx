"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/dashboard/sidebar-context";
import {
  Users,
  LayoutDashboard,
  Globe,
  Mail,
  Image,
  Settings,
  User,
  UserCircle,
  ExternalLink,
  X,
} from "lucide-react";

const adminNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/consultants", label: "Consulenti", icon: Users },
  { href: "/domains", label: "Domini", icon: Globe },
  { href: "/submissions", label: "Richieste", icon: Mail },
  { href: "/media", label: "Media", icon: Image },
  { href: "/settings", label: "Impostazioni", icon: Settings },
];

const consultantNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-profile", label: "Il mio Profilo", icon: UserCircle },
  { href: "/my-landing", label: "La mia Landing", icon: ExternalLink },
  { href: "/submissions", label: "Le mie Richieste", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open, close } = useSidebar();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  const navItems = isAdmin ? adminNavItems : consultantNavItems;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <NextImage
            src="/images/generali-logo.svg"
            alt="Generali"
            width={120}
            height={40}
            priority
          />
        </Link>
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
          onClick={close}
          aria-label="Chiudi menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {isAdmin ? "Amministratore" : "Consulente"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
