import { useState } from "react";
import { Filter, ArrowUpDown, Group, Settings2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PropertyIcon } from "./PropertyIcon";
import type {
  DatabaseProperty,
  DatabaseView,
  FilterRule,
  SortRule,
  ViewConfig,
} from "@/lib/database-types";

const OPERATORS_BY_TYPE: Record<string, Array<{ value: string; label: string }>> = {
  text: [
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
  ],
  number: [
    { value: "eq", label: "=" },
    { value: "neq", label: "≠" },
    { value: "gt", label: ">" },
    { value: "lt", label: "<" },
    { value: "gte", label: "≥" },
    { value: "lte", label: "≤" },
    { value: "is_empty", label: "is empty" },
  ],
  select: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "is_empty", label: "is empty" },
  ],
  date: [
    { value: "date_is", label: "is" },
    { value: "date_before", label: "is before" },
    { value: "date_after", label: "is after" },
    { value: "is_empty", label: "is empty" },
  ],
  checkbox: [
    { value: "is_checked", label: "is checked" },
    { value: "is_unchecked", label: "is unchecked" },
  ],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function DatabaseToolbar({
  view,
  properties,
  onUpdateConfig,
  onOpenProperties,
}: {
  view: DatabaseView;
  properties: DatabaseProperty[];
  onUpdateConfig: (config: ViewConfig) => void;
  onOpenProperties: () => void;
}) {
  const filters = view.config.filters ?? [];
  const sorts = view.config.sorts ?? [];
  const groupable = properties.filter((p) =>
    ["select", "checkbox", "person", "date"].includes(p.type)
  );

  return (
    <div className="flex items-center gap-1 border-b border-border px-4 py-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <Filter className="h-3.5 w-3.5" /> Filter
            {filters.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-3" align="start">
          <div className="space-y-2">
            {filters.map((f, i) => {
              const prop = properties.find((p) => p.id === f.property_id);
              const operators = OPERATORS_BY_TYPE[prop?.type ?? "text"] ?? [];
              return (
                <div key={f.id} className="flex items-center gap-1.5">
                  <Select
                    value={f.property_id}
                    onValueChange={(v) =>
                      onUpdateConfig({
                        ...view.config,
                        filters: filters.map((x) => (x.id === f.id ? { ...x, property_id: v } : x)),
                      })
                    }
                  >
                    <SelectTrigger className="h-7 flex-1 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="flex items-center gap-1.5">
                            <PropertyIcon type={p.type} />
                            {p.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={f.operator}
                    onValueChange={(v) =>
                      onUpdateConfig({
                        ...view.config,
                        filters: filters.map((x) => (x.id === f.id ? { ...x, operator: v } : x)),
                      })
                    }
                  >
                    <SelectTrigger className="h-7 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!["is_empty", "is_not_empty", "is_checked", "is_unchecked"].includes(
                    f.operator
                  ) && (
                    <Input
                      className="h-7 w-28 text-xs"
                      value={(f.value as string) ?? ""}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...view.config,
                          filters: filters.map((x) =>
                            x.id === f.id ? { ...x, value: e.target.value } : x
                          ),
                        })
                      }
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      onUpdateConfig({
                        ...view.config,
                        filters: filters.filter((x) => x.id !== f.id),
                      })
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-start text-xs"
              onClick={() => {
                const first = properties[0];
                if (!first) return;
                const newFilter: FilterRule = {
                  id: uid(),
                  property_id: first.id,
                  operator: OPERATORS_BY_TYPE[first.type]?.[0]?.value ?? "contains",
                  value: "",
                };
                onUpdateConfig({ ...view.config, filters: [...filters, newFilter] });
              }}
            >
              <Plus className="mr-1 h-3 w-3" /> Add filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5" /> Sort
            {sorts.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {sorts.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-2">
            {sorts.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <Select
                  value={s.property_id}
                  onValueChange={(v) =>
                    onUpdateConfig({
                      ...view.config,
                      sorts: sorts.map((x) => (x.id === s.id ? { ...x, property_id: v } : x)),
                    })
                  }
                >
                  <SelectTrigger className="h-7 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={s.direction}
                  onValueChange={(v) =>
                    onUpdateConfig({
                      ...view.config,
                      sorts: sorts.map((x) =>
                        x.id === s.id ? { ...x, direction: v as "asc" | "desc" } : x
                      ),
                    })
                  }
                >
                  <SelectTrigger className="h-7 w-24 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    onUpdateConfig({
                      ...view.config,
                      sorts: sorts.filter((x) => x.id !== s.id),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-start text-xs"
              onClick={() => {
                const first = properties[0];
                if (!first) return;
                const newSort: SortRule = { id: uid(), property_id: first.id, direction: "asc" };
                onUpdateConfig({ ...view.config, sorts: [...sorts, newSort] });
              }}
            >
              <Plus className="mr-1 h-3 w-3" /> Add sort
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {(view.type === "kanban" || view.type === "table") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Group className="h-3.5 w-3.5" /> Group
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <Select
              value={view.config.groupBy ?? "__none"}
              onValueChange={(v) =>
                onUpdateConfig({ ...view.config, groupBy: v === "__none" ? null : v })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No grouping</SelectItem>
                {groupable.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      )}

      {view.type === "calendar" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Date prop
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <Select
              value={view.config.dateProp ?? ""}
              onValueChange={(v) => onUpdateConfig({ ...view.config, dateProp: v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Pick date property" />
              </SelectTrigger>
              <SelectContent>
                {properties
                  .filter((p) => p.type === "date")
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 text-xs"
        onClick={onOpenProperties}
      >
        <Settings2 className="h-3.5 w-3.5" /> Properties
      </Button>
    </div>
  );
}
