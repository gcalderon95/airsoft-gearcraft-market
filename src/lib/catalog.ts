import type { ShopifyProduct } from "./shopify";

export function productCategories(product: ShopifyProduct): string[] {
  const categories = product.node.collections?.edges.map(({ node }) => node.title) ?? [];
  if (product.node.productType?.trim()) categories.push(product.node.productType.trim());
  return [...new Set(categories.length ? categories : ["Sin categoría"])];
}

export function filterProducts(products: ShopifyProduct[], category: string | null) {
  return category === null ? products : products.filter((product) => productCategories(product).includes(category));
}

export function normalizeQuantity(value: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}