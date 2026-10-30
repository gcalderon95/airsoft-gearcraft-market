<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use shared ProductGallery and QuantitySelector on catalog cards and detail pages so product presentation and quantity behavior stay consistent.
- Derive catalog filters from Shopify collections and product types; paginate the catalog to avoid incomplete filter results.
- Render Shopify GLB media with a dynamically imported model-viewer after hydration; never simulate 360° views from ordinary photos or load browser-only viewer code during SSR.
