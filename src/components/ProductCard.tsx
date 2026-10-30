import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./ui/button";
import { productCategories } from "@/lib/catalog";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const selectedVariant = product.node.variants.edges[0]?.node;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    if (!useCartStore.getState().items.some((item) => item.variantId === selectedVariant.id)) {
      toast.error("No se pudo añadir al carrito");
      return;
    }
    toast.success("Añadido al carrito", {
      description: product.node.title,
      position: "top-center",
    });
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-ember">
      <ProductGallery product={product.node} compact />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">{productCategories(product).join(" · ")}</p>
        <h3 className="font-display text-sm leading-tight">
          <Link to="/product/$handle" params={{ handle: product.node.handle }} className="hover:text-primary">{product.node.title}</Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.node.description}
        </p>
        <QuantitySelector value={quantity} onChange={setQuantity} disabled={isLoading} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="font-display text-lg text-primary">
            {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
            {product.node.priceRange.minVariantPrice.currencyCode}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-ember disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}
