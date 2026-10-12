import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

const productQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(
      productQueryOptions(params.handle),
    );
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Producto"} — Ember3D Tactical` },
      {
        name: "description",
        content: loaderData?.description ?? "Accesorio de airsoft impreso en 3D a medida.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Producto"} — Ember3D Tactical` },
      {
        property: "og:description",
        content: loaderData?.description ?? "Accesorio de airsoft impreso en 3D a medida.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants.edges[0]?.node.id ?? "",
  );

  if (!product) return null;

  const productNode: ShopifyProduct = { node: product };
  const selectedVariant =
    product.variants.edges.find((v) => v.node.id === selectedVariantId)?.node ??
    product.variants.edges[0]?.node;
  const image = product.images.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: productNode,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Añadido al carrito", {
      description: product.title,
      position: "top-center",
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-secondary">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl leading-tight">
              {product.title}
            </h1>
            <p className="mt-3 font-display text-2xl text-primary">
              {selectedVariant
                ? `${parseFloat(selectedVariant.price.amount).toFixed(2)} ${selectedVariant.price.currencyCode}`
                : `${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} ${product.priceRange.minVariantPrice.currencyCode}`}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.options.length > 0 &&
            product.options[0]?.name !== "Title" && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">
                  {product.options[0]?.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: variant }) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={!variant.availableForSale}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                        variant.id === selectedVariant?.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:bg-secondary"
                      } disabled:opacity-40`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-ember disabled:opacity-50 md:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {selectedVariant?.availableForSale
              ? "Añadir al carrito"
              : "Agotado"}
          </button>
        </div>
      </div>
    </main>
  );
}
