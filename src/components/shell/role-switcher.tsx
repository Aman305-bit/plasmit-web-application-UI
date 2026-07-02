"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { useRole } from "@/components/providers/role-provider";
import { icuCommandSwitcherRoles } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function RoleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const { role, setRole, roles } = useRole();
  const selectableRoles = pathname.startsWith("/icu-command-center") ? icuCommandSwitcherRoles : roles;

  return (
    <Select.Root value={role} onValueChange={(value) => setRole(value as typeof role)}>
      <Select.Trigger
        className={cn(
          "flex h-9 w-36 min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none hover:bg-surface-muted focus:ring-2 focus:ring-ring md:w-44",
          className,
        )}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-[80] max-h-80 overflow-hidden rounded-md border border-border bg-surface shadow-soft">
          <Select.Viewport className="p-1">
            {selectableRoles.map((item) => (
              <Select.Item
                className="cursor-pointer rounded px-2 py-2 text-sm text-foreground outline-none hover:bg-surface-muted focus:bg-surface-muted data-[state=checked]:bg-primary/10"
                key={item}
                value={item}
              >
                <Select.ItemText>{item}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
