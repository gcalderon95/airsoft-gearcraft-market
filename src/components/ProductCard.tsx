import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const selectedVariant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Añadido al carrito", {
      description: product.node.title,
      position: "top-center",
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-ember"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-sm leading-tight">
          {product.node.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.node.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-primary">
            {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
            {product.node.priceRange.minVariantPrice.currencyCode}
          </span>
          <button
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
          </button>
        </div>
      </div>
    </Link>
  );
}
