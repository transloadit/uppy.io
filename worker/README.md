# uppy.io agent-readiness Worker

uppy.io is a Docusaurus site served by **GitHub Pages**, which cannot set
response headers or run server-side code. Two agent-readiness behaviours
therefore cannot be fixed in this repo alone and need this Worker in the
Cloudflare zone that already proxies the domain:

| Behaviour                                                                       | Why it needs a server                                                                                 |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Markdown content negotiation ([acceptmarkdown.com](https://acceptmarkdown.com)) | Requires reading `Accept:` and setting `Vary: Accept`. GitHub Pages does neither.                     |
| JSON error responses                                                            | Requires returning a JSON body with a 4xx/5xx status. GitHub Pages only serves the static `404.html`. |

Everything else (the `.md` twins this Worker serves, `llms.txt`,
`llms-full.txt`, `robots.txt`, the recovery links on the 404 page) is generated
at build time by `src/plugins/agent-readiness.js` and needs no server.

## Deploying

**This Worker is committed but not deployed.** It needs Cloudflare credentials
for the uppy.io zone.

```sh
cd worker
npx wrangler login       # or set CLOUDFLARE_API_TOKEN
npx wrangler deploy
```

## Verifying after deploy

```sh
# 1. Markdown negotiation returns markdown, and varies on Accept.
curl -sI -H 'Accept: text/markdown' https://uppy.io/docs/quick-start/ \
  | grep -Ei '^(content-type|vary)'
# expect: content-type: text/markdown; charset=utf-8
#         vary: Accept, Accept-Encoding

# 2. Browsers still get HTML.
curl -sI -H 'Accept: text/html,application/xhtml+xml,*/*' https://uppy.io/docs/quick-start/ \
  | grep -i '^content-type'
# expect: content-type: text/html; charset=utf-8

# 3. Errors are JSON for agents, with a real 404 status.
curl -s -H 'Accept: application/json' -w '\n%{http_code}\n' https://uppy.io/does-not-exist
# expect: a JSON body with error.code, error.message, error.resolution, then 404
```

## Tests

The pure negotiation logic is unit-tested without a network or a Cloudflare
runtime:

```sh
node --test test/
```
