import { useState } from "react";
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  PROPERTY_TYPE_LABELS,
  type DatabaseProperty,
  type PropertyType,
} from "@/lib/database-types";
import { PropertyIcon } from "./PropertyIcon";
import { toast } from "sonner";

const TYPE_ORDER: PropertyType[] = [
  "text",
  "number",
  "select",
  "multi_select",
  "date",
  "checkbox",
  "url",
  "email",
  "person",
  "created_time",
  "created_by",
];

export function PropertiesPanel({
  databaseId,
  properties,
  open,
  onOpenChange,
}: {
  databaseId: string;
  properties: DatabaseProperty[];
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const [editingProp, setEditingProp] = useState<DatabaseProperty | null>(null);

  const addProperty = async () => {
    const maxOrder = properties.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { error } = await supabase.from("database_properties").insert({
      database_id: databaseId,
      name: "New property",
      type: "text",
      sort_order: maxOrder + 1,
    });
    if (error) toast.error(error.message);
  };

  const deleteProp = async (p: DatabaseProperty) => {
    if (p.is_primary) return toast.error("Cannot delete the title property");
    if (!confirm(`Delete property "${p.name}"?`)) return;
    await supabase.from("database_properties").delete().eq("id", p.id);
  };

  const updateProp = async (id: string, patch: Partial<DatabaseProperty>) => {
    await supabase.from("database_properties").update(patch as never).eq("id", id);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Properties</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            {properties.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40" />
                <PropertyIcon type={p.type} className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{p.name}</span>
                <span className="text-xs text-muted-foreground">{PROPERTY_TYPE_LABELS[p.type]}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingProp(p)}>
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive disabled:opacity-30"
                  disabled={p.is_primary}
                  onClick={() => void deleteProp(p)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={addProperty}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add property
          </Button>
        </DialogContent>
      </Dialog>

      {editingProp && (
        <PropertyEditDialog
          property={editingProp}
          onClose={() => setEditingProp(null)}
          onSave={(patch) => {
            void updateProp(editingProp.id, patch);
            setEditingProp(null);
          }}
        />
      )}
    </>
  );
}

function PropertyEditDialog({
  property,
  onClose,
  onSave,
}: {
  property: DatabaseProperty;
  onClose: () => void;
  onSave: (patch: Partial<DatabaseProperty>) => void;
}) {
  const [name, setName] = useState(property.name);
  const [type, setType] = useState<PropertyType>(property.type);
  const [numberFormat, setNumberFormat] = useState(property.config.numberFormat ?? "number");

  return (
    <Dialog open onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit property</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          {!property.is_primary && (
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PropertyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_ORDER.map((t) => (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <PropertyIcon type={t} />
                        {PROPERTY_TYPE_LABELS[t]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {type === "number" && (
            <div className="space-y-1.5">
              <Label>Number format</Label>
              <Select value={numberFormat} onValueChange={(v) => setNumberFormat(v as never)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency_idr">Currency (IDR)</SelectItem>
                  <SelectItem value="currency_usd">Currency (USD)</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSave({
                  name,
                  type,
                  config: { ...property.config, numberFormat },
                })
              }
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
