import { useState, useEffect, useRef } from "react";
import { HyperFormula } from "hyperformula";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface SpreadsheetBlockProps {
  data: string[][];
  onChange: (data: string[][]) => void;
  onRemove: () => void;
}

const COLS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

function colLabel(i: number) { return COLS[i] ?? String.fromCharCode(65 + i); }

export function SpreadsheetBlock({ data, onChange, onRemove }: SpreadsheetBlockProps) {
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [editing, setEditing] = useState(false);
  const [formulaBarValue, setFormulaBarValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hf = useRef<HyperFormula | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    hf.current = HyperFormula.buildFromArray(
      data.map((row) => row.map((c) => c)),
      { licenseKey: "gpl-v3" }
    );
    forceTick((n) => n + 1);
    return () => {
      hf.current?.destroy();
      hf.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hf.current) {
      try {
        hf.current.setSheetContent(0, data.map((row) => row.map((c) => c)));
        forceTick((n) => n + 1);
      } catch {
        /* ignore */
      }
    }
  }, [data]);

  const getDisplayValue = (row: number, col: number): string => {
    const raw = data[row]?.[col] ?? "";
    if (!raw.startsWith("=") || !hf.current) return raw;
    try {
      const val = hf.current.getCellValue({ sheet: 0, row, col });
      if (val === null || val === undefined) return "";
      if (typeof val === "object") return "#ERR";
      return String(val);
    } catch {
      return "#ERR";
    }
  };

  const updateCell = (row: number, col: number, value: string) => {
    const next = data.map((r, ri) => r.map((c, ci) => (ri === row && ci === col ? value : c)));
    onChange(next);
  };

  const selectCell = (row: number, col: number) => {
    setSelected([row, col]);
    setEditing(false);
    setFormulaBarValue(data[row]?.[col] ?? "");
  };

  const addRow = () => onChange([...data, new Array(data[0]?.length ?? 5).fill("")]);
  const addCol = () => onChange(data.map((row) => [...row, ""]));
  const removeRow = (ri: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== ri));
  };

  const cols = data[0]?.length ?? 5;

  return (
    <div className="my-4 rounded-lg border overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-1">
        <span className="text-xs text-muted-foreground font-mono w-10">
          {selected ? `${colLabel(selected[1])}${selected[0] + 1}` : ""}
        </span>
        <div className="h-4 w-px bg-border" />
        <Input
          value={formulaBarValue}
          onChange={(e) => setFormulaBarValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && selected) {
              updateCell(selected[0], selected[1], formulaBarValue);
            }
          }}
          onBlur={() => {
            if (selected) updateCell(selected[0], selected[1], formulaBarValue);
          }}
          className="h-6 border-0 bg-transparent text-xs font-mono focus-visible:ring-0 px-1 flex-1"
          placeholder="Select a cell..."
          disabled={!selected}
        />
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive ml-auto" title="Remove table">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-auto">
        <table className="border-collapse text-xs w-full">
          <thead>
            <tr>
              <th className="w-8 border-r border-b bg-muted/50 p-1" />
              {Array.from({ length: cols }, (_, ci) => (
                <th key={ci} className="border-r border-b bg-muted/50 p-1 text-center font-medium text-muted-foreground min-w-[80px]">
                  {colLabel(ci)}
                </th>
              ))}
              <th className="border-b bg-muted/50 w-6 p-1">
                <button onClick={addCol} className="text-muted-foreground hover:text-foreground" title="Add column">
                  <Plus className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="group">
                <td className="border-r border-b bg-muted/30 p-1 text-center text-muted-foreground font-mono select-none">
                  <div className="flex items-center justify-center gap-0.5">
                    <span>{ri + 1}</span>
                    <button onClick={() => removeRow(ri)} className="hidden group-hover:inline-block opacity-50 hover:opacity-100" title="Delete row">
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </td>
                {row.map((cell, ci) => {
                  const isSelected = selected?.[0] === ri && selected?.[1] === ci;
                  const displayVal = getDisplayValue(ri, ci);
                  const isFormula = cell.startsWith("=");
                  return (
                    <td
                      key={ci}
                      className={`border-r border-b p-0 relative ${isSelected ? "outline outline-2 outline-primary outline-offset-[-1px]" : ""}`}
                      onClick={() => selectCell(ri, ci)}
                      onDoubleClick={() => {
                        setSelected([ri, ci]);
                        setFormulaBarValue(data[ri]?.[ci] ?? "");
                        setEditing(true);
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                    >
                      {isSelected && editing ? (
                        <input
                          ref={inputRef}
                          className="block w-full h-full border-0 bg-background px-1.5 py-0.5 text-xs font-mono focus:outline-none"
                          value={formulaBarValue}
                          onChange={(e) => setFormulaBarValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateCell(ri, ci, formulaBarValue);
                              setEditing(false);
                              const nr = Math.min(ri + 1, data.length - 1);
                              setSelected([nr, ci]);
                              setFormulaBarValue(data[nr]?.[ci] ?? "");
                            } else if (e.key === "Escape") {
                              setEditing(false);
                              setFormulaBarValue(data[ri]?.[ci] ?? "");
                            } else if (e.key === "Tab") {
                              e.preventDefault();
                              updateCell(ri, ci, formulaBarValue);
                              setEditing(false);
                              const nc = Math.min(ci + 1, cols - 1);
                              setSelected([ri, nc]);
                              setFormulaBarValue(data[ri]?.[nc] ?? "");
                            }
                          }}
                          onBlur={() => {
                            updateCell(ri, ci, formulaBarValue);
                            setEditing(false);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className={`block px-1.5 py-0.5 min-h-[24px] truncate ${isFormula ? "text-primary" : ""}`}>
                          {displayVal}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="border-b" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t">
        <button onClick={addRow} className="flex w-full items-center justify-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
          <Plus className="h-3 w-3" /> Add row
        </button>
      </div>
    </div>
  );
}
