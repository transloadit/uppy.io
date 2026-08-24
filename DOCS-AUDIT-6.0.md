# uppy.io docs audit for the 6.0 release

Working document. Root-level markdown is not part of the Docusaurus build.
Companion to `UPPY-6.0-BLOG-REVIEW.md`.

Audited against `transloadit/uppy` `origin/main` @ `a341d1ea1`, plus the two
open changeset PRs (#6419, #6420). Re-verified adversarially against
`origin/main` @ `85b7aecf1` (both changeset PRs now merged; `isTouchDevice`
removal #6455 landed after the original baseline).

---

## P0 — broken code samples that will break readers

### 1. `docs/companion.md:239` — `companion.socket()` signature changed

```js
companion.socket(server);
```

The new signature requires a second argument:

```ts
export default function setupSockets(
	server: HttpServer | HttpsServer,
	companionOptions: CompanionInitOptions,
);
```

Every self-hoster who copies this sample gets a broken WebSocket server. This is
the one docs bug most likely to generate release-day issues.

Fix: `companion.socket(server, companionOptions)` plus a note that this is
breaking.

### 2. `docs/guides/building-plugins.md:288` — dead import

```js
import Translator from '@uppy/utils/lib/Translator';
```

Two problems: the package no longer exists, and it is a deep `/lib/` import that
export maps would block anyway. `Translator` is now exported from
`@uppy/core/utils`.

Fix: `import { Translator } from '@uppy/core/utils';`

### 3. `docs/uploader/aws-s3-multipart.mdx` — every documented option is gone

The page documents 15 options. Eleven of them no longer exist: `endpoint`,
`headers`, `cookiesRule`, `retryDelays`, `getUploadParameters`,
`createMultipartUpload`, `listParts`, `signPart`, `abortMultipartUpload`,
`completeMultipartUpload`, `getTemporarySecurityCredentials`.

Only `shouldUseMultipart`, `limit`, `getChunkSize` and `allowedMetaFields`
survive, and `allowedMetaFields` currently does nothing in the two
direct-signing modes (see the blog review, blocker 1).

Nothing documents `s3Endpoint`, `region`, `getCredentials`, `signRequest`,
`companionEndpoint` or `generateObjectKey`.

Fix: rewrite the page. Sections 82-201 (bucket setup, the two “Use with”
walkthroughs, and the TypeScript section) all need reworking around the three
signing modes. The filename should probably also move from
`aws-s3-multipart.mdx` to `aws-s3.mdx`, keeping the `/aws-s3` slug and adding a
redirect.

### 4. `docs/guides/custom-stores.md` — whole guide is built on a removed package

Line 10 lists `@uppy/store-default` as a package, line 25 imports from it, line
135 links to its (now deleted) source directory. It also still advertises
`@uppy/store-redux`, which was deprecated back in 5.0.

Fix: `import DefaultStore from '@uppy/core/store-default';` (default export —
the guide’s existing default import shape is right, only the module path
changes), drop the store-redux bullet, repoint the source link.

---

## P1 — content that is now wrong

### 5. Instagram is removed but fully documented

`docs/sources/companion-plugins/instagram.mdx` is a complete install-and-use
page for a package that no longer ships. Also referenced from:

- `docs/user-interfaces/dashboard.mdx:744`
- `docs/companion.md:26`, `:487` (provider env-var table), `:1007`
- `docs/framework-integrations/_headless-components-shared.mdx:37`
  (`'instagram'` in a union type)
- `docs/framework-integrations/_hooks-shared.mdx:39` (`'Instagram'` in
  `sourceId`)
- `docs/comparison.md:55`, `:64`
- `docs/quick-start.mdx:47` (prose example)

Decide: delete the page and add a redirect, or keep it with a removal notice.
Either way the type unions in the two shared partials are now factually wrong.

### 6. `docs/companion.md:119` — Node version is badly stale

> Since v2, you need to be running `node.js >= v10.20.1`

Actual: `"engines": { "node": "^20.19.3 || >=22.0.0" }`. Express 5 makes this
matter more, not less.

### 7. Express 5 is undocumented

`docs/companion.md` has an “Express middleware mode” section (line 178) that
says nothing about the Express 4 to 5 requirement. Mounting Companion in an
Express 4 app no longer works.

### 8. WebSocket OAuth tokens are undocumented

New Uppy clients receive the token over the WebSocket instead of
`window.opener`. The docs never mention the change. Note the compatibility is
one-directional: Companion 7 keeps the legacy `postMessage` path for old clients
(`send-token.ts` falls back when no `authCallbackToken` is in the OAuth state),
but an Uppy 6 client requires Companion 7. The `corsOrigins` docs (line 388)
remain accurate for the legacy fallback — `isOriginAllowed` gates both paths —
so they need a note, not a rewrite.

### 9. `@uppy/golden-retriever` storage description is out of date

`docs/golden-retriever.mdx:20-28` says metadata and Uppy state live in
`LocalStorage`. As of #6362 the recovery snapshot goes to IndexedDB, with
localStorage used only when `window.indexedDB` is absent. The `expires` option
docs (line 162) say it is “used for LocalStorage” and needs the same treatment.

Do not over-promise here: the fallback is a one-time capability check, not
dynamic recovery from IndexedDB failures.

### 10. `@uppy/transloadit` assembly status is undocumented

`assemblyStatus` and `lastAssemblyStatus` in plugin state (#6267) appear nowhere
in `docs/uploader/transloadit.mdx`. This is a headline feature of the release
and the blog post links readers here.

### 11. `@uppy/tus` error behaviour changed

`docs/uploader/tus.mdx` documents `upload-success` typing but says nothing about
the new behaviour where a failed request now forwards the server status and body
to `upload-error` and `file.response` instead of collapsing to status `0`.

### 12. `@uppy/utils` referenced as a package

`docs/guides/building-plugins.md:288` (see P0-2). Check the surrounding prose
for other references to utils as a standalone package.

---

## P2 — smaller

- `docs/uppy-core.mdx:604` links `DefaultStore` to the custom-stores guide; fine
  once that guide is fixed.
- `docs/locales.mdx` CDN links are pinned to `/v3.3.1/` throughout, and the
  migration guide pins `/v3.17.0/`. Pre-existing staleness, worth a sweep.
- `docs/comparison.md` Instagram rows need a “removed in 6.0” note.
- Framework integration pages: confirm the Angular page reflects v21 support.

---

## What the migration guide is missing

`docs/guides/migration-guides.md` currently has a “Migrate from Companion 5.x to
6.x” section at the top and nothing for Uppy 5.x to 6.x. It needs a new top
section. Proposed contents, in order of how many people it affects:

### Migrate from Uppy 5.x to 6.x

1. **Packages merged into `@uppy/core`** — the four-row import table from #6420,
   the provider CSS path change, `RequestOptions` moving to
   `@uppy/core/companion-client`, and the removal of `CompanionClientProvider` /
   `CompanionClientSearchProvider`. Plus the meta-package note: `server`,
   `views.ProviderView` and `DefaultStore` keep their names (verified against
   `packages/uppy/src/bundle.ts`). Warn that the move was not wholesale:
   `isTouchDevice` was deleted outright (#6455), not moved to
   `@uppy/core/utils`. Source material: `MIGRATION-6.0-merge-into-core.md` from
   PR #6370 (commit `4c145da99` — PR branch only, not on main) has the fuller
   write-up including the `Pick`-based structural typing note for
   `UnknownProviderPlugin['provider']`, but port it with two fixes: it says the
   packages are “removed from npm” (the changeset’s “stay on npm but deprecated”
   is correct), and its example
   `import type Provider from '@uppy/core/companion-client'` is wrong —
   `Provider` is a named export, so `import type { Provider } from …`.
2. **`@uppy/aws-s3` rewritten** — the largest section. Needs a before/after for
   each of the three old paths:
   - from `endpoint` (Companion) to `companionEndpoint`, including the warning
     that `headers` and `cookiesRule` are gone, so authenticated Companion
     deployments need a new arrangement
   - from `getTemporarySecurityCredentials` to `getCredentials`, including the
     PascalCase to camelCase credential mapping and the fact that `region` must
     come from somewhere explicit
   - from the six operation callbacks to `signRequest`
   - the full removed/new/unchanged option lists (the changeset’s removed list
     also includes `uploadPartBytes`, which the docs page never documented but
     the migration guide must still name)
   - explicit warning that `endpoint` maps to `companionEndpoint`, **not** to
     `s3Endpoint`
3. **`@uppy/instagram` removed** — what to do instead.
4. **Companion: WebSocket OAuth tokens** — upgrade order stated bluntly: upgrade
   Companion first (it still serves old clients via the legacy `postMessage`
   fallback); Uppy 6 clients do not work against Companion ≤6.
5. **Companion: `companion.socket(server, companionOptions)`** — the new second
   argument.
6. **Companion: Express 5** — Express 4 middleware mounting no longer works.
7. **Companion: Node 20.19.3+ / 22+.**
8. **`@uppy/tus` no longer aborts on error** — what changes for existing
   error-handling code.
9. ~~`@uppy/angular` requires Angular 21~~ — dropped: the peer range is
   `^17 || ^18 || ^19 || ^20 || ^21`, so Angular 21 support is additive (minor),
   not a migration item.
10. **`@uppy/golden-retriever` storage moved to IndexedDB** — probably no action
    for users, but worth a line since recovery behaviour changes.

Note: the existing “Migrate from Companion 5.x to 6.x” heading at line 5 will
become confusing once Companion 7.x ships in this release. Consider renaming the
sections consistently.

---

## Suggested order of work

1. Fix P0-1 (`companion.socket`) — smallest fix, largest blast radius.
2. Write the migration guide’s 5.x to 6.x section. Everything else can link into
   it.
3. Rewrite the AWS S3 page. This is the big one and the S3 blog post depends on
   it being accurate.
4. Decide on Instagram (delete plus redirect, or removal notice) and sweep the
   references.
5. The rest of P1.
