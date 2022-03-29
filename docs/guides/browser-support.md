---
sidebar_position: 2
---

# Browser support

We aim to support recent versions of Chrome, Firefox, Safari and Edge.

<details>
  <summary>Polyfills for IE11</summary>

  You can install polyfills or use the legacy CND bundle for IE11, but we are not running tests against IE11
  so there is a risk involved.

  ```js
  import 'core-js'
  import 'whatwg-fetch'
  import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
  // Order matters: AbortController needs fetch which needs Promise (provided by core-js).

  import 'md-gum-polyfill'
  import ResizeObserver from 'resize-observer-polyfill'

  window.ResizeObserver ??= ResizeObserver

  export { default } from '@uppy/core'
  export * from '@uppy/core'
  ```

</details>
