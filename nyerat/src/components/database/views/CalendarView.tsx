import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DatabaseProperty, DatabaseView } from "@/lib/database-types";
import type { Page } from "@/lib/types";

interface Props {
  view: DatabaseView;
  properties: DatabaseProperty[];
  rows: Page[];
  values: Record<string, Record<string, unknown>>;
}

export function CalendarView({ view, properties, rows, values }: Props) {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const [cursor, setCursor] = useState(new Date());

  const dateProp =
    properties.find((p) => p.id === view.config.dateProp) ??
    properties.find((p) => p.type === "date");

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const arr: Date[] = [];
    let d = start;
    while (d <= end) {
      arr.push(d);
      d = new Date(d.getTime() + 86400000);
    }
    return arr;
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Page[]>();
    if (!dateProp) return map;
    for (const row of rows) {
      const v = values[row.id]?.[dateProp.id];
      if (!v) continue;
      const date = new Date(v as string);
      const key = format(date, "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    }
    return map;
  }, [rows, values, dateProp]);

  if (!dateProp) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        Add a date property to use Calendar view.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{format(cursor, "MMMM yyyy")}</div>
        <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCursor(new Date())} className="ml-2">
          Today
        </Button>
      </div>
      <div className="grid grid-cols-7 border-l border-t border-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="border-b border-r border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const events = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          return (
            <div
              key={key}
              className={cn(
                "min-h-[100px] border-b border-r border-border p-1",
                !inMonth && "bg-muted/10 text-muted-foreground/50",
                isSameDay(day, new Date()) && "bg-primary/5"
              )}
            >
              <div className="text-xs">{format(day, "d")}</div>
              <div className="mt-1 space-y-0.5">
                {events.slice(0, 3).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/app/${workspaceSlug}/${ev.id}`)}
                    className="block w-full truncate rounded bg-primary/10 px-1.5 py-0.5 text-left text-xs hover:bg-primary/20"
                  >
                    {ev.title || "Untitled"}
                  </button>
                ))}
                {events.length > 3 && (
                  <div className="px-1.5 text-xs text-muted-foreground">+{events.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
