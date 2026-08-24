# Docs: required updates before the Uppy 6.0 release

Uppy 6.0 / Companion 7.0 ship breaking changes the docs don’t reflect yet. This
issue tracks everything that must land before release, audited against
`transloadit/uppy` `main`. PRs for most groups are ready to open.

## Migration guide (land first — everything links into it)

- [ ] “Migrate from Uppy 5.x to 6.x”: packages merged into `@uppy/core` (import
      table, `isTouchDevice` deleted), the `@uppy/aws-s3` rewrite (before/after
      for all three old signing paths; `endpoint` maps to `companionEndpoint`,
      not `s3Endpoint`), `@uppy/instagram` removal, `@uppy/tus` error behaviour,
      `@uppy/golden-retriever` IndexedDB move.
- [ ] “Migrate from Companion 6.x to 7.x”: `companion.socket(server, options)`,
      Express 5, Node `^20.19.3 || >=22`, OAuth tokens over WebSocket (upgrade
      Companion before Uppy).

## Broken pages and samples

- [ ] `docs/companion.md`: `companion.socket(server)` sample is broken, Node
      requirement says `>= v10.20.1`, Express 5 and the WebSocket token flow are
      undocumented, and the “falls back to HTTP polling” claim is no longer
      true.
- [ ] `docs/uploader/aws-s3-multipart.mdx`: 11 of 15 documented options no
      longer exist — full rewrite around the three signing modes, renamed to
      `aws-s3.mdx` (same `/aws-s3` slug).
- [ ] `docs/guides/building-plugins.md` + `docs/guides/custom-stores.md`: dead
      `@uppy/utils` / `@uppy/store-default` imports; `@uppy/store-redux` still
      documented but removed.

## Instagram removal

- [ ] Delete `docs/sources/companion-plugins/instagram.mdx` + add a
      `/docs/instagram` redirect (Google Photos precedent).
- [ ] Sweep remaining references: dashboard, comparison, quick-start,
      remote-sources, uppy-core, and the type unions in both
      framework-integration partials.
- [ ] `src/pages/examples.tsx` and `src/pages/index.tsx` still `use(Instagram)`
      — the site won’t compile against Uppy 6.

## Behaviour updates

- [ ] `docs/uploader/transloadit.mdx`: document `assemblyStatus` /
      `lastAssemblyStatus` plugin state (the release blog links here).
- [ ] `docs/golden-retriever.mdx`: storage moved to IndexedDB; size cap is 10
      MiB, not 5 MiB.
- [ ] `docs/uploader/tus.mdx`: errors now carry the server’s status and body
      instead of status `0`.
- [ ] `docs/framework-integrations/angular.mdx`: note Angular 17–21 support.

## Blog posts

- [ ] The 6.0 announcement post — links to the Transloadit and migration-guide
      pages above, so it publishes after they land.
- [ ] The AWS S3 rewrite deep-dive — depends on the rewritten `/docs/aws-s3`
      page.
- [ ] Resolve the `allowedMetaFields` question (it currently only applies on the
      Companion path) and make the blog and docs say the same thing.

## Follow-ups (not blocking the release)

- [ ] `transloadit.mdx` still documents options removed in 4.0
      (`getAssemblyOptions`, `params`, `signature`, `fields`).
- [ ] `angular.mdx` examples use NgModules; the components are standalone now.
- [ ] `docs/locales.mdx` CDN links are pinned to old versions.
