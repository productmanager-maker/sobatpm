import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Plus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  SELECT_COLOR_CLASSES,
  SELECT_COLORS,
  type DatabaseProperty,
  type SelectColor,
  type SelectOption,
} from "@/lib/database-types";

interface Props {
  property: DatabaseProperty;
  value: unknown;
  onChange: (next: unknown) => void;
  compact?: boolean;
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatNumber(n: number, fmt?: string) {
  if (fmt === "currency_idr")
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
  if (fmt === "currency_usd")
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  if (fmt === "percent") return `${n}%`;
  return n.toLocaleString();
}

export function PropertyCell({ property, value, onChange, compact }: Props) {
  switch (property.type) {
    case "text":
      return <TextCell value={value as string | null} onChange={onChange} compact={compact} />;
    case "number":
      return (
        <NumberCell
          value={value as number | null}
          onChange={onChange}
          fmt={property.config.numberFormat}
          compact={compact}
        />
      );
    case "checkbox":
      return (
        <Checkbox
          checked={!!value}
          onCheckedChange={(v) => onChange(!!v)}
          aria-label={property.name}
        />
      );
    case "url":
      return <UrlCell value={value as string | null} onChange={onChange} compact={compact} />;
    case "email":
      return (
        <TextCell
          value={value as string | null}
          onChange={onChange}
          compact={compact}
          type="email"
        />
      );
    case "date":
      return (
        <DateCell value={value as string | null} onChange={onChange} compact={compact} />
      );
    case "select":
      return (
        <SelectCell
          property={property}
          value={value as string | null}
          onChange={onChange}
          multi={false}
        />
      );
    case "multi_select":
      return (
        <SelectCell
          property={property}
          value={(value as string[]) ?? []}
          onChange={onChange}
          multi
        />
      );
    case "person":
      return <PersonCell value={value as string | null} onChange={onChange} />;
    case "created_time":
    case "created_by":
      return (
        <span className="truncate text-xs text-muted-foreground">
          {value ? String(value) : "—"}
        </span>
      );
    default:
      return null;
  }
}

function TextCell({
  value,
  onChange,
  compact,
  type = "text",
}: {
  value: string | null;
  onChange: (v: string) => void;
  compact?: boolean;
  type?: "text" | "email";
}) {
  const [draft, setDraft] = useState(value ?? "");
  useEffect(() => setDraft(value ?? ""), [value]);
  return (
    <input
      type={type}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft !== (value ?? "") && onChange(draft)}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      className={cn(
        "w-full bg-transparent outline-none",
        compact ? "text-xs" : "text-sm"
      )}
      placeholder="Empty"
    />
  );
}

function NumberCell({
  value,
  onChange,
  fmt,
  compact,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  fmt?: string;
  compact?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? "");
  useEffect(() => setDraft(value?.toString() ?? ""), [value]);
  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          const n = draft === "" ? null : Number(draft);
          if (n !== value) onChange(n);
        }}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className={cn("w-full bg-transparent text-right outline-none", compact ? "text-xs" : "text-sm")}
      />
    );
  }
  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        "w-full text-right tabular-nums",
        compact ? "text-xs" : "text-sm",
        value == null && "text-muted-foreground/50"
      )}
    >
      {value == null ? "Empty" : formatNumber(value, fmt)}
    </button>
  );
}

function UrlCell({
  value,
  onChange,
  compact,
}: {
  value: string | null;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const [draft, setDraft] = useState(value ?? "");
  useEffect(() => setDraft(value ?? ""), [value]);
  return (
    <div className="flex w-full items-center gap-1">
      <input
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== (value ?? "") && onChange(draft)}
        className={cn(
          "flex-1 truncate bg-transparent underline decoration-dotted outline-none",
          compact ? "text-xs" : "text-sm"
        )}
        placeholder="https://"
      />
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function DateCell({
  value,
  onChange,
  compact,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  compact?: boolean;
}) {
  const date = value ? new Date(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-1.5 truncate text-left",
            compact ? "text-xs" : "text-sm",
            !date && "text-muted-foreground/50"
          )}
        >
          <CalendarIcon className="h-3 w-3 shrink-0" />
          {date ? format(date, "MMM d, yyyy") : "Empty"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? d.toISOString() : null)}
          className={cn("p-3 pointer-events-auto")}
        />
        {date && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange(null)}>
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function SelectCell({
  property,
  value,
  onChange,
  multi,
}: {
  property: DatabaseProperty;
  value: string | string[] | null;
  onChange: (v: string | string[] | null) => void;
  multi: boolean;
}) {
  const options = property.config.options ?? [];
  const selectedIds = multi ? ((value as string[]) ?? []) : value ? [value as string] : [];
  const selectedOptions = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter((o): o is SelectOption => !!o);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const toggle = async (opt: SelectOption) => {
    if (multi) {
      const arr = (value as string[]) ?? [];
      const next = arr.includes(opt.id) ? arr.filter((x) => x !== opt.id) : [...arr, opt.id];
      onChange(next);
    } else {
      onChange(value === opt.id ? null : opt.id);
      setOpen(false);
    }
  };

  const createOption = async () => {
    const label = search.trim();
    if (!label) return;
    const newOpt: SelectOption = {
      id: genId(),
      label,
      color: SELECT_COLORS[Math.floor(Math.random() * SELECT_COLORS.length)] as SelectColor,
    };
    const nextOptions = [...options, newOpt];
    await supabase
      .from("database_properties")
      .update({ config: { ...property.config, options: nextOptions } as never })
      .eq("id", property.id);
    if (multi) onChange([...((value as string[]) ?? []), newOpt.id]);
    else {
      onChange(newOpt.id);
      setOpen(false);
    }
    setSearch("");
  };

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex w-full flex-wrap items-center gap-1 text-left">
          {selectedOptions.length === 0 && (
            <span className="text-xs text-muted-foreground/50">Empty</span>
          )}
          {selectedOptions.map((o) => (
            <span
              key={o.id}
              className={cn(
                "inline-flex max-w-full items-center truncate rounded px-1.5 py-0.5 text-xs",
                SELECT_COLOR_CLASSES[o.color]
              )}
            >
              {o.label}
            </span>
          ))}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          autoFocus
          placeholder="Search or create..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length === 0 && search.trim()) {
              e.preventDefault();
              void createOption();
            }
          }}
          className="mb-2 h-8"
        />
        <div className="max-h-60 space-y-0.5 overflow-auto">
          {filtered.map((o) => (
            <button
              key={o.id}
              onClick={() => toggle(o)}
              className="flex w-full items-center justify-between rounded px-1.5 py-1 hover:bg-accent"
            >
              <span
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-xs",
                  SELECT_COLOR_CLASSES[o.color]
                )}
              >
                {o.label}
              </span>
              {selectedIds.includes(o.id) && <span className="text-xs">✓</span>}
            </button>
          ))}
          {search.trim() && !options.some((o) => o.label.toLowerCase() === search.toLowerCase()) && (
            <button
              onClick={createOption}
              className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-xs hover:bg-accent"
            >
              <Plus className="h-3 w-3" /> Create "{search}"
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PersonCell({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email");
      if (data) setMembers(data as never);
    })();
  }, []);
  const selected = members.find((m) => m.id === value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-1.5 text-left text-sm">
          {selected ? (
            <span className="truncate">{selected.full_name ?? selected.email}</span>
          ) : (
            <span className="text-xs text-muted-foreground/50">Empty</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(value === m.id ? null : m.id)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(m.full_name ?? m.email ?? "?")[0]?.toUpperCase()}
            </span>
            <span className="truncate">{m.full_name ?? m.email}</span>
            {value === m.id && <span className="ml-auto text-xs">✓</span>}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
