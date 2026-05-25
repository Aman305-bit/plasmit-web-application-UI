"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Cross } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/components/providers/role-provider";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

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

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-all lg:sticky lg:top-0 lg:z-50 lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[264px]",
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cross className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Plasmit Hospital</div>
            <div className="text-xs text-sidebar-foreground/65">Enterprise HMS</div>
          </div>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {groups.map((group) => (
          <div className="mb-3" key={group}>
            {!collapsed ? <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/55">{group}</div> : null}
            <div className="space-y-1">
              {visibleItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const hasChildren = Boolean(item.children?.length);
                  const childActive = item.children?.some((child) => pathname === child.route) ?? false;
                  const active = pathname === item.route || childActive || (item.route !== "/dashboard" && pathname.startsWith(`${item.route}/`));
                  const expanded = openItems[item.id] ?? active;

                  if (hasChildren && !collapsed) {
                    return (
                      <div key={item.id}>
                        <button
                          className={cn(
                            "group flex h-9 w-full items-center gap-3 rounded-md px-2 text-sm font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
                            active && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active",
                          )}
                          onClick={() => setOpenItems((current) => ({ ...current, [item.id]: !expanded }))}
                          type="button"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                          <ChevronDown className={cn("h-4 w-4 shrink-0 transition", expanded && "rotate-180")} />
                        </button>
                        {expanded ? (
                          <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-foreground/15 pl-2">
                            {item.children?.map((child) => {
                              const childIsActive = pathname === child.route;
                              return (
                                <Link
                                  className={cn(
                                    "flex min-h-8 items-center rounded-md px-2 py-1.5 text-xs font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
                                    childIsActive && "bg-sidebar-active/85 text-sidebar-active-foreground",
                                  )}
                                  href={child.route}
                                  key={child.id}
                                >
                                  <span className="min-w-0 flex-1 truncate">{child.label}</span>
                                  {child.status === "planned" ? <Badge tone="muted">Plan</Badge> : null}
                                </Link>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <Link
                      aria-label={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
                        active && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active",
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

      <div className="border-t border-border p-2">
        <Button
          className={cn("w-full", collapsed && "px-0")}
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
