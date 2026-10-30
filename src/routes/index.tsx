import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Cog, Layers, Ruler } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import heroImage from "@/assets/hero.jpg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { filterProducts, productCategories } from "@/lib/catalog";

const productsQueryOptions = queryOptions({
  queryKey: ["shopify-products"],
  queryFn: () => fetchProducts(20),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(productsQueryOptions),
  head: () => ({
    meta: [
      { title: "Ember3D Tactical — Impresión 3D para Airsoft" },
      {
        name: "description",
        content:
          "Accesorios de airsoft impresos en 3D y hechos a medida: grips, raíles, piezas hop-up y más. Diseñados por jugadores, para jugadores.",
      },
      {
        property: "og:title",
        content: "Ember3D Tactical — Impresión 3D para Airsoft",
      },
      {
        property: "og:description",
        content:
          "Accesorios de airsoft impresos en 3D y hechos a medida: grips, raíles, piezas hop-up y más.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(products.flatMap(productCategories))].sort((a, b) => a.localeCompare(b, "es"));
  const visibleProducts = filterProducts(products, category);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Accesorios de airsoft impresos en 3D"
            className="h-full w-full object-cover"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-24 md:py-36">
          <span className="w-fit rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Impresión 3D a medida
          </span>
          <h1 className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">
            Equipamiento de airsoft <span className="text-gradient-ember">hecho a medida</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Grips, cubrerraíles, piezas hop-up y accesorios únicos impresos en
            3D. Diseñados y fabricados bajo pedido para tu réplica exacta.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-ember"
            >
              Ver catálogo
            </a>
            <a
              href="#a-medida"
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Pedidos personalizados
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="a-medida" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Ruler className="h-8 w-8 text-primary" />
            <h3 className="font-display text-lg">A medida de tu réplica</h3>
            <p className="text-sm text-muted-foreground">
              Cada pieza se adapta al modelo exacto de tu réplica. Dinos qué
              necesitas y lo diseñamos contigo.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Layers className="h-8 w-8 text-primary" />
            <h3 className="font-display text-lg">Materiales resistentes</h3>
            <p className="text-sm text-muted-foreground">
              Impresión en PETG y ABS de alta resistencia, probados en campo de
              juego real.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Cog className="h-8 w-8 text-primary" />
            <h3 className="font-display text-lg">Hecho por jugadores</h3>
            <p className="text-sm text-muted-foreground">
              Diseños pensados por y para la comunidad airsofter: funcionales,
              duraderos y con estilo.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="catalogo" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl">Catálogo</h2>
        <p className="mt-2 text-muted-foreground">
          Piezas listas para imprimir y enviar. ¿No encuentras lo que buscas?
          Pídelo a medida.
        </p>
        <div className="mt-8 border-y border-border py-4">
          <h3 className="mb-3 text-sm font-semibold">Categorías</h3>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
            <Button variant={category === null ? "default" : "outline"} aria-pressed={category === null} onClick={() => setCategory(null)}>Todos ({products.length})</Button>
            {categories.map((name) => <Button key={name} variant={category === name ? "default" : "outline"} aria-pressed={category === name} onClick={() => setCategory(name)} className="h-auto whitespace-normal py-2 text-left">{name} ({filterProducts(products, name).length})</Button>)}
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{visibleProducts.length} productos{category ? ` · ${category}` : ""}</p>
        {visibleProducts.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-16 text-center">
            <p className="font-display text-xl">No se encontraron productos</p>
            <p className="mt-2 text-muted-foreground">
              Estamos preparando el catálogo. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          Ember3D Tactical — Impresión 3D para airsoft. Hecho a medida, hecho
          para durar.
        </div>
      </footer>
    </main>
  );
}
