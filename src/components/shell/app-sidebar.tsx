"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Hospital } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/components/providers/role-provider";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { NavigationChildItem } from "@/types";

function childIsActive(child: NavigationChildItem, pathname: string): boolean {
  if (child.children?.length) {
    return pathname === child.route || child.children.some((nested) => childIsActive(nested, pathname));
  }

  return pathname === child.route
    || (child.route !== "/" && pathname.startsWith(`${child.route}/`));
}

export function AppSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const { role } = useRole();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const visibleItems = navigationItems.filter((item) => item.allowedRoles.includes(role));
  const groups = Array.from(new Set(visibleItems.map((item) => item.group)));

  function renderChild(child: NavigationChildItem, depth = 0) {
    const hasNestedChildren = Boolean(child.children?.length);
    const active = childIsActive(child, pathname);
    const expanded = openItems[child.id] ?? active;

    if (hasNestedChildren) {
      return (
        <div key={child.id}>
          <button
            className={cn(
              "flex min-h-8 w-full items-center rounded-lg px-2 py-1.5 text-xs font-semibold outline-none transition hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-ring",
              depth > 0 && "text-[11px]",
              active && "bg-sky-100 text-sky-800",
            )}
            onClick={() => setOpenItems((current) => ({ ...current, [child.id]: !expanded }))}
            type="button"
          >
            <span className="min-w-0 flex-1 truncate text-left">{child.label}</span>
            <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition", expanded && "rotate-180")} />
          </button>
          {expanded ? (
            <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-2">
              {child.children?.map((nested) => renderChild(nested, depth + 1))}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <Link
        className={cn(
          "flex min-h-8 items-center rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none transition hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-ring",
          active && "bg-sky-600 text-white shadow-[0_8px_16px_rgba(37,99,235,0.18)] hover:bg-sky-600 hover:text-white",
        )}
        href={child.route}
        key={child.id}
      >
        <span className="min-w-0 flex-1 truncate">{child.label}</span>
        {child.status === "planned" ? <Badge tone="muted">Plan</Badge> : null}
      </Link>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 border-r border-slate-200/80 bg-white/95 text-slate-900 shadow-[12px_0_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all lg:sticky lg:top-0 lg:z-50 lg:flex lg:flex-col",
        collapsed ? "w-[76px]" : "w-[286px]",
      )}
    >
      <div className="border-b border-slate-200/80 p-3">
        <div className={cn("flex items-center gap-3 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-2 shadow-sm", collapsed && "justify-center")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-[0_10px_18px_rgba(37,99,235,0.24)]">
          <Hospital className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-black tracking-tight">Plasmit Hospital</div>
            <div className="text-xs font-semibold text-slate-500">Enterprise HMS</div>
          </div>
        ) : null}
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div className="mb-4" key={group}>
            {!collapsed ? <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{group}</div> : null}
            <div className="space-y-1">
              {visibleItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const hasChildren = Boolean(item.children?.length);
                  const childActive = item.children?.some((child) => childIsActive(child, pathname)) ?? false;
                  const active = pathname === item.route || childActive || (item.route !== "/dashboard" && pathname.startsWith(`${item.route}/`));
                  const expanded = openItems[item.id] ?? active;

                  if (hasChildren && !collapsed) {
                    return (
                      <div key={item.id}>
                        <button
                          className={cn(
                            "group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-700 outline-none transition hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-ring",
                            active && "bg-sky-600 text-white shadow-[0_10px_18px_rgba(37,99,235,0.18)] hover:bg-sky-600 hover:text-white",
                          )}
                          onClick={() => setOpenItems((current) => ({ ...current, [item.id]: !expanded }))}
                          type="button"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                          <ChevronDown className={cn("h-4 w-4 shrink-0 transition", expanded && "rotate-180")} />
                        </button>
                        {expanded ? (
                          <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-2">
                            {item.children?.map((child) => renderChild(child))}
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <Link
                      aria-label={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-700 outline-none transition hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-ring",
                        active && "bg-sky-600 text-white shadow-[0_10px_18px_rgba(37,99,235,0.18)] hover:bg-sky-600 hover:text-white",
                        collapsed && "justify-center",
                      )}
                      href={item.route}
                      key={item.id}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                      {!collapsed && item.status === "planned" ? <Badge tone="muted">Plan</Badge> : null}
                      {!collapsed && hasChildren ? <ChevronDown className="h-4 w-4 shrink-0" /> : null}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/80 p-3">
        <Button
          className={cn("w-full border-slate-200 bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700", collapsed && "px-0")}
          onClick={() => onCollapsedChange(!collapsed)}
          variant="ghost"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed ? "Collapse" : null}
        </Button>
      </div>
    </aside>
  );
}
