import { describe, expect, it } from "vitest";
import { filterProducts, normalizeQuantity, productCategories } from "@/lib/catalog";
import type { ShopifyProduct } from "@/lib/shopify";

function product(id: string, type: string, collection?: string): ShopifyProduct {
  return { node: { id, title: id, description: "", handle: id, productType: type, collections: { edges: collection ? [{ node: { id: collection, title: collection } }] : [] }, priceRange: { minVariantPrice: { amount: "25", currencyCode: "EUR" } }, images: { edges: [] }, variants: { edges: [] }, options: [] } };
}

describe("Catalog rules", () => {
  it("filters products by category while preserving the all-products view", () => {
    const products = [product("grip", "Grips", "A medida"), product("rail", "Raíles")];
    expect(filterProducts(products, "Grips").map(({ node }) => node.id)).toEqual(["grip"]);
    expect(filterProducts(products, "A medida").map(({ node }) => node.id)).toEqual(["grip"]);
    expect(filterProducts(products, null)).toHaveLength(2);
    expect(filterProducts(products, "Inexistente")).toEqual([]);
  });
  it("keeps uncategorized products accessible", () => {
    expect(productCategories(product("pieza", ""))).toEqual(["Sin categoría"]);
  });
  it("keeps purchase quantities as positive whole units", () => {
    expect(normalizeQuantity(3)).toBe(3);
    expect(normalizeQuantity(0)).toBe(1);
    expect(normalizeQuantity(-2)).toBe(1);
    expect(normalizeQuantity(2.7)).toBe(2);
    expect(normalizeQuantity(NaN)).toBe(1);
  });
});