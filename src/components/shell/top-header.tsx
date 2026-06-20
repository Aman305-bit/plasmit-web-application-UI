"use client";

import { Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CommandSearch } from "@/components/shell/command-search";
import { MobileNavigation } from "@/components/shell/mobile-navigation";
import { NotificationPopover } from "@/components/shell/notification-popover";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { Button } from "@/components/ui/button";
import { hospitalContext } from "@/data/mock";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 px-2 py-1 backdrop-blur-xl md:px-3">
      <div className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/85 px-2 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
        <MobileNavigation />
        <div className="min-w-0 flex-1 border-l border-slate-200 pl-2 lg:border-l-0 lg:pl-0">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <Building2 className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">{hospitalContext.name}</span>
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-500 sm:inline">{hospitalContext.branch}</span>
          </div>
        </div>
        <CommandSearch />
        <RoleSwitcher className="hidden sm:flex" />
        <NotificationPopover />
        <Button asChild size="icon" variant="outline" aria-label="Open UI settings">
          <Link href="/settings/ui">
            <ShieldCheck className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
