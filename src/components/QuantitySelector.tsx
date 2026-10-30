import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeQuantity } from "@/lib/catalog";

export function QuantitySelector({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return <div className="flex flex-col gap-2">
    <span className="text-sm font-medium">Cantidad</span>
    <div className="flex w-fit items-center rounded-md border border-border">
      <Button variant="ghost" size="icon" aria-label="Reducir cantidad" onClick={() => onChange(normalizeQuantity(value - 1))} disabled={disabled || value <= 1}><Minus /></Button>
      <input aria-label="Cantidad" type="number" min={1} step={1} value={value} disabled={disabled} onChange={(event) => onChange(normalizeQuantity(event.currentTarget.valueAsNumber))} className="h-9 w-14 bg-transparent text-center text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      <Button variant="ghost" size="icon" aria-label="Aumentar cantidad" onClick={() => onChange(normalizeQuantity(value + 1))} disabled={disabled}><Plus /></Button>
    </div>
  </div>;
}