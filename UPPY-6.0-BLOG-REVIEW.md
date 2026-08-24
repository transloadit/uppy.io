# Uppy 6.0 blog post — adversarial review notes

Working document. Not part of the site build (root-level markdown is not picked
up by Docusaurus). Delete once the findings are resolved.

- **Date:** 2026-07-26
- **Artifacts reviewed:**
  - `blog/2026-08-01-uppy-6.0.md` (release post, `draft: true`)
  - `blog/2026-03-18-aws-s3-rewrite.md` (deep dive, PR
    [uppy.io#429](https://github.com/transloadit/uppy.io/pull/429))
- **Code audited against:** `transloadit/uppy` `origin/main` at
  `a341d1ea10ad11cb73d1ac0ed31d365fa74f9675`, compared with tag
  `@uppy/aws-s3@5.1.0`, last release commit `dabd878b8`, and the two open
  changeset branches ([#6419](https://github.com/transloadit/uppy/pull/6419),
  [#6420](https://github.com/transloadit/uppy/pull/6420))
- **Reviewers:** Claude (review A), Codex `gpt-5.6-sol` at high reasoning effort
  (review B, independent), then cross-verification of B’s claims against source

---

## TL;DR

One finding is a code regression that should block the release, not just the
post: `allowedMetaFields` silently does nothing in two of the three signing
modes.

Everything else is text. The recurring pattern is that the deep dive states
things carefully and the release post’s compressed paraphrase of it is wrong.
The S3 section of the release post should be rewritten as a strict subset of the
deep dive’s wording rather than a summary of it.

---

## Blockers — release post

### 1. `allowedMetaFields` is silently ineffective in direct-signing modes

Source: review B, verified.

The plugin computes filtered metadata and hands it to `S3Uploader`, but
`S3mini.putObject()` never destructures `metadata`, and
`createMultipartUpload()` carries a literal
`// todo support metadata here too?`.

So `allowedMetaFields` works for Companion and remote uploads, and silently does
nothing in `getCredentials` and `signRequest` mode.

Evidence:

- `packages/@uppy/aws-s3/src/index.ts:263-275` and `352-359` (metadata computed)
- `packages/@uppy/aws-s3/src/S3Uploader.ts:262-288` (metadata passed through)
- `packages/@uppy/aws-s3/src/s3-client/S3mini.ts:179-200` (dropped in
  `putObject`)
- `packages/@uppy/aws-s3/src/s3-client/S3mini.ts:203-219` (explicit TODO)

**Action: fix the implementation before release rather than documenting the
regression.**

### 2. The offline and credential-expiry reliability claims are false

Source: review B, verified.

Release post:

> retries with backoff, credential expiry, offline detection, and pause/resume
> races

Deep dive:

> The upload pauses and resumes when connectivity returns.

- `waitForOnline` is a pre-flight gate only. The code comment says “Wait for
  online before starting” (`s3-client/S3mini.ts:301`).
- A mid-request drop produces `status === 0`, which is converted to
  `S3NetworkError` and thrown. There is no resume on that path.
- `shouldRetry` disables retries while offline with the comment “our handler
  will resume” (`s3-client/S3Client.ts:102`), but no such handler exists for a
  mid-flight drop.
- The old implementation genuinely did better: `requests.pause()` plus an
  `online` listener at
  `@uppy/aws-s3@5.1.0:src/HTTPCommunicationQueue.ts:158-162`.
- `expiration` appears exactly once in the package, as a type field
  (`s3-client/types.ts:62`). It is never read. Credentials are only refreshed
  after S3 returns `ExpiredToken` or `InvalidAccessKeyId`. The old code had
  `getExpiry()` and cleared the cache proactively.

Exponential backoff itself is real (`@uppy/core/src/utils/fetcher.ts:79-121`).

Suggested replacement:

> S3 requests now retry eligible failures with exponential backoff, and in
> `getCredentials` mode an `ExpiredToken` response clears the credential cache
> and retries once. Requests wait if the browser is already offline before they
> start. Multipart pause and resume were reworked around `AbortController`.

Do not claim recovery from a mid-request connectivity loss until the code does
it.

### 3. The `getCredentials` code sample is a copy-paste hazard

Source: new — missed by both reviews. Review B filed it under “confirmed
correct”, with the conditional that it works only if the endpoint already
returns lower-camel-case credentials. That conditional is doing too much work.

Draft sample:

```js
getCredentials: async () => fetch('/s3-credentials').then((r) => r.json()),
```

`CredentialsResponse` requires camelCase (`accessKeyId`, `secretAccessKey`,
`sessionToken`) plus a top-level `region` (`s3-client/types.ts:55-72`). But this
repo’s own backend example returns raw STS output, which is PascalCase, so the
shipped client example maps it by hand
(`examples/aws-nodejs/public/index.html:59-74`):

```js
credentials: {
  accessKeyId: data.credentials.AccessKeyId,
  secretAccessKey: data.credentials.SecretAccessKey,
  sessionToken: data.credentials.SessionToken,
  expiration: data.credentials.Expiration,
},
region: data.region,
```

A reader whose endpoint returns STS credentials as AWS emits them gets silent
signing failures. The blog sample must show the mapping.

### 4. Fabricated origin story for `lastAssemblyStatus`

Source: review A.

> That second field exists because the first one on its own made for a UI that
> kept blanking out, which we only noticed once we tried building something with
> it.

Invented during a “humanizer” editing pass, on the theory that process detail
reads as human. Nothing in
[#6267](https://github.com/transloadit/uppy/pull/6267), the changeset, or the
source supports it. The source comment documents the field’s purpose, not its
history.

**Action: cut everything after “flickering to empty.”**

### 5. “Companion is no longer required in the data path, and neither is AWS”

Source: review A. Wrong three times over:

- Companion was never in the data path for local uploads. It signed; bytes went
  browser to S3 directly. It _is_ in the data path for remote provider files,
  and still is.
- Companion was already optional, via `getUploadParameters` / `signPart`.
- S3-compatible services already worked. The 5.x docs advertise DigitalOcean
  Spaces and Google Cloud Storage, and `examples/companion-digitalocean-spaces/`
  predates the rewrite.

What was actually AWS-only is the **client-side** signing path:
`@uppy/aws-s3@5.1.0:src/createSignedURL.ts:117` hardcodes
`` const host = `${Service}.${Region}.amazonaws.com` `` with no endpoint
parameter.

### 6. The meta-package and CDN claim

Source: review A. `bundle.ts` exported `Instagram` (removed in
[#6257](https://github.com/transloadit/uppy/pull/6257)) and `AwsS3` (API fully
rewritten), and `uppy` itself takes a major bump. For the two headline changes
of the release, bundle users are affected as much as anyone.

The true, narrower claim is the one in the core changeset: the _consolidation_
is invisible to meta-package users.

### 7. The MinIO claim

Source: review B, verified. This overturns an item review A had marked as
verified.

> The plugin is now tested against a real MinIO instance in CI instead of mocks,
> which is how several of those got caught in the first place.

`tests/s3-client/minio.test.ts:14-26` constructs `new S3mini({...})` — the
internal client, not the `AwsS3` plugin. Plugin-level tests still use fake
signers (`tests/index.test.ts`). “Instead of mocks” is false, and the causal
claim is unverifiable.

Review A had confirmed only that `VITE_MINIO_CONFIG` exists in `ci.yml:62`,
without checking what the suite actually exercises.

Suggested replacement:

> CI now runs browser-based integration tests that exercise the internal S3
> client against a real MinIO container.

### 8. Golden Retriever fallback and “large assemblies now restore”

Source: review B, verified.

`IndexedDBStore.isSupported` is `!!indexedDB`, a presence check on
`window.indexedDB`
(`packages/@uppy/golden-retriever/src/IndexedDBStore.ts:3-15`), and the backend
is chosen once (`src/index.ts:73-93`). If the API exists but `open()`/read/write
fails — private mode, permissions, corruption, quota — the failure is swallowed
and there is no fallback to localStorage. Those are exactly the cases a reader
reads “not available” to mean.

“Large assemblies now restore” is also an unearned absolute; persistence is
best-effort and failures are deliberately swallowed.

---

## Blockers — deep dive (`2026-03-18-aws-s3-rewrite.md`)

All from review B. Not individually re-verified except where noted.

1. **Region auto-derivation does not exist.** No endpoint-to-region parser
   anywhere. The constructor defaults `region = 'auto'`
   (`s3-client/S3mini.ts:50`) and the signer uses `creds.region || this.region`
   (line 104). Signing AWS with `auto` is invalid. `CredentialsResponse.region`
   is also declared required, contradicting the prose. _(Verified.)_
2. **“Existing Companion deployments still work unchanged” is false** for
   deployments that used `headers` or `cookiesRule` to authenticate Companion.
   Both options were removed and `CompanionS3` uses plain `fetch` with no custom
   headers or credentials mode.
3. **`bucket` is listed as removed** but was never a 5.1.0 plugin option.
4. **“S3mini: standalone, zero Uppy dependencies”** — it extends `S3Client`,
   which imports `fetcher` from `@uppy/core/utils`, and there is no public
   subpath export for it.
5. **“progress, retries, pause/resume … behave identically across signing
   modes”** — transport behaviour differs by mode; remote files bypass
   `S3Uploader` entirely.
6. **“one server route instead of six”** — callbacks were arbitrary functions
   and could always have called a single route. The rewrite guarantees one
   _client hook_.
7. **`signRequest` sample omits `Content-Type: application/json`**, so a
   conventional `express.json()` route will not parse the body.
8. **“13 open issues” and “most-used uploader plugin”** are unsubstantiated. The
   linked URL is the tracking issue, not a list.
9. **Still says “11 callbacks”** and still says the old plugin effectively
   required Companion.

---

## Medium

- **“Implementing up to eight callbacks … you read all eight and guessed.”**
  Eight callback options existed, but the realistic maximum for one
  configuration was six; `uploadPartBytes` had a default and
  `getTemporarySecurityCredentials` was an alternative mode. The TypeScript
  union also did tell callers which were mandatory per mode, so “nothing told
  you” is false for TS consumers.
- **“Those four packages sat behind every plugin”** is a false universal.
  `@uppy/aws-s3` depended on `@uppy/utils` and `@uppy/companion-client`;
  Dashboard on `@uppy/utils` and `@uppy/provider-views`; `@uppy/store-default`
  was mostly a Core dependency.
- **“We got a lot of issues from people who had wired up a plausible-looking
  combination”** is not what
  [#6055](https://github.com/transloadit/uppy/issues/6055) says. It describes
  the implementation as unmaintainable and the most-reported uploader. Use that.
- **“Removed from npm”** (twice) — existing versions stay on npm; only new
  versions stop. Already corrected in
  [#6420](https://github.com/transloadit/uppy/pull/6420), so the post and the
  changeset currently disagree.
- **“build your own progress UI instead of styling ours”** implies a
  Transloadit-specific UI that never existed.
- **Supply chain: “so fixes still land immediately.”** The Dependabot half is
  right (cooldown does not apply to security updates), but Yarn’s one-week age
  gate has no configured security exception. Weakest finding in the set;
  arguably fine as written.

## Low

- **“58 pull requests”** drifts as main moves. Recount at publish time:
  ```sh
  git log dabd878b8..origin/main --format='%s' | grep -oE '\(#[0-9]+\)' | sort -u | wc -l
  ```

---

## Cleared by both reviews

Six packages take a major bump · three signing modes and their names · the eight
old callback option names against the 5.1.0 tag · Core’s four subpath exports
and both import replacements · provider CSS path and Dashboard bundling ·
`assemblyStatus` / `lastAssemblyStatus` shapes and lifecycle · the
`state.plugins.Transloadit` selector (matches
`transloadit/src/index.test.js:198`) · WebSocket OAuth tokens and
`companion.socket()` requiring `companionOptions` · Express 5 · TypeScript port
· seven-day Yarn age gate and matching Dependabot cooldown · SHA-pinned
third-party Actions · Instagram removed from the bundle · tus error-response
behaviour · Angular 21 · `fileManagerSelectionType` · Norwegian Bokmål.

---

## Where review B was imprecise

Worth recording so these are not quoted verbatim:

- **“There is no subsequent online listener.”** There is one, inside
  `waitForOnline` at `s3-client/S3Client.ts:62`. The operative conclusion (no
  recovery from a mid-request drop) is correct, but that sentence is not.
- **The supply-chain finding** is technically right but does not rise to a
  publication blocker.

No other review B claim failed verification, and its assessment that no review A
finding was wrong also holds.

---

## Action list

- [ ] Decide on `allowedMetaFields`: fix the code, or document the regression
      and ship
- [ ] Rewrite the reliability paragraph (release post and deep dive)
- [ ] Add the PascalCase-to-camelCase mapping to the `getCredentials` sample
- [ ] Cut the fabricated `lastAssemblyStatus` sentence
- [ ] Replace the “data path” sentence
- [ ] Scope the meta-package/CDN claim to the consolidation
- [ ] Fix the MinIO sentence
- [ ] Soften the Golden Retriever fallback and “large assemblies now restore”
- [ ] Deep dive: region, Companion “unchanged”, `bucket`, S3mini framing,
      “identically”, “one route”, `Content-Type`, “13 issues”, “11 callbacks”
- [ ] Align “removed from npm” with the
      [#6420](https://github.com/transloadit/uppy/pull/6420) wording
- [ ] Recount the PR total at publish time
- [ ] Rewrite the release post’s S3 section as a subset of the deep dive, not a
      paraphrase
