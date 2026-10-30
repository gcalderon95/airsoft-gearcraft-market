import { createElement, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Rotate3D, Images } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";

function ModelView({ src, title, poster }: { src: string; title: string; poster?: string }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(() => { if (active) setReady(true); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);
  if (failed) return <div className="flex aspect-square items-center justify-center p-4 text-center text-muted-foreground">No se pudo cargar la vista 360°.</div>;
  if (!ready) return <div className="flex aspect-square items-center justify-center text-muted-foreground">Cargando vista 360°…</div>;
  return createElement("model-viewer", { src, alt: title, poster, "camera-controls": true, "touch-action": "pan-y", "interaction-prompt": "none", className: "block aspect-square w-full bg-secondary", onError: () => setFailed(true) });
}

export function ProductGallery({ product, compact = false }: { product: ShopifyProduct["node"]; compact?: boolean }) {
  const images = product.images.edges.map(({ node }) => node);
  const model = product.media?.edges.find(({ node }) => node.__typename === "Model3d")?.node.sources?.find((source) => source.format.toUpperCase() === "GLB");
  const [view, setView] = useState<"photos" | "model">("photos");
  const [selected, setSelected] = useState(0);
  const [viewportRef, embla] = useEmblaCarousel({ loop: images.length > 1 });
  useEffect(() => {
    if (!embla) return;
    const update = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", update);
    embla.on("reInit", update);
    update();
    return () => { embla.off("select", update); embla.off("reInit", update); };
  }, [embla]);

  return <div className="min-w-0">
    <div className="relative overflow-hidden bg-secondary">
      {view === "model" && model ? <ModelView src={model.url} title={product.title} poster={images[0]?.url} /> : <>
        <div ref={viewportRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.length ? images.map((image, index) => <div key={`${image.url}-${index}`} className="aspect-square min-w-0 flex-[0_0_100%]">
              <img src={image.url} alt={image.altText || `${product.title} — foto ${index + 1}`} className="h-full w-full object-contain" loading={compact ? "lazy" : "eager"} />
            </div>) : <div className="flex aspect-square flex-[0_0_100%] items-center justify-center text-muted-foreground">Sin imagen</div>}
          </div>
        </div>
        {images.length > 1 && <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between">
          <Button className="pointer-events-auto" size="icon" variant="secondary" aria-label="Foto anterior" onClick={() => embla?.scrollPrev()}><ChevronLeft /></Button>
          <Button className="pointer-events-auto" size="icon" variant="secondary" aria-label="Foto siguiente" onClick={() => embla?.scrollNext()}><ChevronRight /></Button>
        </div>}
        {images.length > 1 && <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs text-foreground">{selected + 1} / {images.length}</span>}
      </>}
    </div>
    {!compact && images.length > 1 && view === "photos" && <div className="flex gap-2 overflow-x-auto p-2">
      {images.map((image, index) => <Button key={`${image.url}-${index}`} variant="outline" className={`h-14 w-14 shrink-0 overflow-hidden p-0 ${index === selected ? "border-primary" : ""}`} aria-label={`Ver foto ${index + 1}`} aria-pressed={index === selected} onClick={() => embla?.scrollTo(index)}><img src={image.url} alt="" className="h-full w-full object-contain" /></Button>)}
    </div>}
    {(model || !compact) && <div className="flex flex-wrap items-center gap-2 border-t border-border p-2">
      {model ? <>
        <Button variant={view === "photos" ? "secondary" : "ghost"} size="sm" aria-pressed={view === "photos"} onClick={() => setView("photos")}><Images />Fotos</Button>
        <Button variant={view === "model" ? "secondary" : "ghost"} size="sm" aria-pressed={view === "model"} onClick={() => setView("model")}><Rotate3D />360°</Button>
      </> : <span className="flex items-center gap-2 text-xs text-muted-foreground"><Rotate3D className="size-4" />Vista 360° no disponible</span>}
    </div>}
  </div>;
}