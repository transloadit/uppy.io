# uppy.io docs — release to-do list for Uppy 6.0

Final consolidated checklist, distilled from `DOCS-AUDIT-6.0.md` (all claims
verified against `transloadit/uppy` `origin/main` @ `85b7aecf1`). Ordered by
blast radius. Convention per past majors (4.0 S3 merge, Robodog, Google Photos):
docs are single-version — rewrite in place, old API lives in the migration
guide, deleted pages get client redirects.

## 1. P0 — broken code samples

- [ ] **`docs/companion.md:239`** — change sample to
      `companion.socket(server, companionOptions)` and mark it breaking.
      Smallest fix, largest blast radius; do this first.
- [ ] **`docs/guides/building-plugins.md:288`** — replace
      `import Translator from '@uppy/utils/lib/Translator'` with
      `import { Translator } from '@uppy/core/utils'` (named export). Sweep the
      surrounding prose for other mentions of `@uppy/utils` as a standalone
      package.
- [ ] **`docs/uploader/aws-s3-multipart.mdx`** — full rewrite around the three
      mutually exclusive signing modes (`getCredentials` / `signRequest` /
      `companionEndpoint`):
  - [ ] Document the new options: `s3Endpoint`, `region`, `getCredentials`,
        `signRequest`, `companionEndpoint`, `generateObjectKey`.
  - [ ] Keep only the survivors: `shouldUseMultipart`, `limit`, `getChunkSize`,
        `allowedMetaFields` — and note `allowedMetaFields` currently only
        applies on the Companion/remote path (or wait for blog-review blocker 1
        to be resolved and document the outcome).
  - [ ] Rework sections 82–201 (bucket setup, both “Use with” walkthroughs,
        TypeScript section) around the new modes.
  - [ ] Rename the file to `aws-s3.mdx`; keep `slug: /aws-s3` (the slug is the
        URL, so no redirect is needed).
- [ ] **`docs/guides/custom-stores.md`** — change the import path to
      `import DefaultStore from '@uppy/core/store-default'` (default export —
      keep the existing default-import shape), drop the `@uppy/store-redux`
      bullet, repoint the line-135 source link to
      `packages/@uppy/core/src/store/`.

## 2. Migration guide (`docs/guides/migration-guides.md`)

- [ ] **New top section: “Migrate from Uppy 5.x to 6.x”**
  - [ ] Core consolidation — port `MIGRATION-6.0-merge-into-core.md` from PR
        #6370 (commit `4c145da99`, PR branch only) with three fixes:
    - [ ] “removed from npm” → the changeset’s “stay on npm but deprecated”.
    - [ ] `import type Provider from …` → `import type { Provider } from …`
          (named export).
    - [ ] Add: `isTouchDevice` was deleted (#6455), not moved to
          `@uppy/core/utils`.
    - [ ] Keep the `Pick`-based structural-typing note for
          `UnknownProviderPlugin['provider']` and the meta-package “no change”
          note (`server`, `views.ProviderView`, `DefaultStore`).
  - [ ] AWS S3 rewrite — before/after for each of the three old paths:
    - [ ] `endpoint` (Companion) → `companionEndpoint`, with an explicit warning
          that `endpoint` maps to `companionEndpoint`, **not** `s3Endpoint`, and
          that `headers`/`cookiesRule` are gone (authenticated Companion
          deployments need a new arrangement).
    - [ ] `getTemporarySecurityCredentials` → `getCredentials`, including the
          PascalCase → camelCase credential mapping and explicit `region`.
    - [ ] The six operation callbacks → `signRequest`.
    - [ ] Full removed-options list — must include `uploadPartBytes` (in the
          changeset, never on the docs page).
  - [ ] `@uppy/instagram` removed — what to do instead.
  - [ ] `@uppy/tus` no longer aborts on error — server status/body now reach
        `upload-error` and `file.response` instead of status `0`.
  - [ ] `@uppy/golden-retriever` moved to IndexedDB — one line, no user action.
- [ ] **New section: “Migrate from Companion 6.x to 7.x”**
  - [ ] `companion.socket(server, companionOptions)` — second argument now
        required.
  - [ ] Express 5 — mounting in an Express 4 app no longer works.
  - [ ] Node `^20.19.3 || >=22`.
  - [ ] WebSocket OAuth tokens — upgrade order stated bluntly: upgrade Companion
        first (it keeps the legacy `postMessage` fallback for old clients); Uppy
        6 clients do not work against Companion ≤ 6.
  - [ ] One line on the TypeScript port (“no intended breakage, but…”).
- [ ] Check heading consistency — the existing “Migrate from Companion 5.x to
      6.x” at the top must not read ambiguously next to the new 6.x → 7.x
      section.

## 3. Companion page (`docs/companion.md`)

- [ ] `:119` — replace the `node.js >= v10.20.1` note with
      `^20.19.3 || >=22.0.0`.
- [ ] `:178` (“Express middleware mode”) — add the Express 5 requirement.
- [ ] Document the WebSocket token flow; add a note (not a rewrite) to the
      `corsOrigins` section (`:388`) — the `postMessage` explanation still holds
      for the legacy fallback, and `isOriginAllowed` gates both paths.
- [ ] Remove Instagram from `:26`, the `:487` provider env-var table, and
      `:1007`.

## 4. Instagram sweep

- [ ] Decide: delete `docs/sources/companion-plugins/instagram.mdx` + add a
      `/docs/instagram` client redirect (Google Photos precedent —
      `docusaurus.config.js`), or keep the page with a removal notice.
      Recommendation: delete + redirect to the migration guide section.
- [ ] Fix the type unions — now factually wrong either way:
  - [ ] `docs/framework-integrations/_headless-components-shared.mdx:37`
        (`'instagram'`).
  - [ ] `docs/framework-integrations/_hooks-shared.mdx:39` (`'Instagram'`).
- [ ] Remaining references: `docs/user-interfaces/dashboard.mdx:744`,
      `docs/comparison.md:55` and `:64` (add “removed in 6.0”),
      `docs/quick-start.mdx:47` (prose).

## 5. Feature and behaviour updates

- [ ] `docs/uploader/transloadit.mdx` — document `assemblyStatus` and
      `lastAssemblyStatus` plugin state (#6267). Headline feature; the blog post
      links here.
- [ ] `docs/golden-retriever.mdx:20-28` — metadata/state now in IndexedDB with a
      one-time localStorage fallback; same fix for the `expires` option at
      `:162`. Don’t over-promise: the fallback is a capability check, not
      dynamic recovery.
- [ ] `docs/uploader/tus.mdx` — document the new error behaviour (status/body
      forwarded instead of collapsing to `0`).

## 6. Smaller / opportunistic

- [ ] `docs/uppy-core.mdx:604` — `DefaultStore` link is fine once custom-stores
      is fixed; verify after.
- [ ] Angular page — confirm it mentions Angular 21 support (additive, peer
      range `^17`–`^21`; **not** a migration item).
- [ ] `docs/locales.mdx` CDN links pinned to `/v3.3.1/` (and `/v3.17.0/` in the
      migration guide) — pre-existing staleness, sweep if time allows.

## Verified non-issues (do not add)

- `isTouchDevice` — no uppy.io page references it; migration-guide caveat only.
- `RequestClient` option removals (`name`, `pluginId`, `provider`) — no doc
  impact.
- Angular 21 — additive support, not breaking.
- xhr-upload queue rewrite — already shipped in 5.x.

## Suggested order

1. §1 item 1 (`companion.socket`) — one line, ships today.
2. §2 in full — everything else links into it.
3. §1 item 3 (AWS S3 rewrite) — the S3 blog post depends on it.
4. §4 Instagram sweep.
5. §3, §5, then §6.
