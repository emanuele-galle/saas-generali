"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutDashboard,
  FileEdit,
  Globe,
  Mail,
  Image,
  Settings,
  User,
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
  { href: "/submissions", label: "Le mie Richieste", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  const navItems = isAdmin ? adminNavItems : consultantNavItems;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground">
            Saas Generali
          </span>
        </Link>
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
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN"
                ? "Amministratore"
                : "Consulente"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
