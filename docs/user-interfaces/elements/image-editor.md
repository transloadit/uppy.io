---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Image editor

Image editor. Designed to be used with the Dashboard UI.

<div style={{ maxWidth: 500 }}>

![Screenshot of the Image Editor plugin UI in Dashboard](https://user-images.githubusercontent.com/1199054/87208710-654db400-c307-11ea-9471-6e3c6582d2a5.png)

</div>

## When should I use this?

When you want to allow users to crop, rotate, zoom and flip images that are added to Uppy.

## Install

<Tabs>
  <TabItem value="npm" label="NPM" default>

  ```shell
  npm install @uppy/core @uppy/dashboard @uppy/image-editor
  ```

  </TabItem>

  <TabItem value="yarn" label="Yarn">

  ```shell
  yarn add @uppy/core @uppy/dashboard @uppy/image-editor
  ```

  </TabItem>

  <TabItem value="cdn" label="CDN">
  <Admonition type="caution">
    <p>
      The bundle consists of most Uppy plugins, so this method is not recommended for production,
      as your users will have to download all plugins when you are likely using only a few.
    </p>
  </Admonition>

  ```html
    <!-- 1. Add CSS to `<head>` -->
    <link href="https://releases.transloadit.com/uppy/v2.9.0/uppy.min.css" rel="stylesheet">

    <!-- 2. Add JS before the closing `</body>` -->
    <script src="https://releases.transloadit.com/uppy/v2.9.0/uppy.min.js"></script>

    <!-- 3. Initialize -->
    <div id="uppy"></div>
    <script>
      var uppy = new Uppy.Core()
      uppy.use(Uppy.Dashboard, { target: '#uppy', inline: true })
      uppy.use(Uppy.ImageEditor, { target: Uppy.Dashboard })
    </script>
  ```

  </TabItem>
</Tabs>

## API

### Options

:::info
If you automatically want to open the image editor when an image is added,
see the [`autoOpenFileEditor`](/docs/user-interfaces/dashboard#autoOpenFileEditor) Dashboard option.
:::

```js
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import ImageEditor from '@uppy/image-editor'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/image-editor/dist/style.css'

new Uppy()
  .use(Dashboard, { inline: true })
  // Example of setting all the options to their defaults.
  // Not passing anything to `ImageEditor` is therefor the same as the example below.
  .use(ImageEditor, {
    id: 'ImageEditor',
    target: null,
    quality: 0.8,
    cropperOptions: {
      viewMode: 1,
      background: false,
      autoCropArea: 1,
      responsive: true,
      croppedCanvasOptions: {},
    },
    actions: {
      revert: true,
      rotate: true,
      granularRotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: true,
      cropWidescreen: true,
      cropWidescreenVertical: true,
    },
  })
```

#### `id`

A unique identifier for this plugin (`String`, default: `'ImageEditor'`).

#### `quality`

Quality Of the resulting blob that will be saved in Uppy after editing/cropping (`Number`, default: `0.8`).

#### `cropperOptions`

Image Editor is using the excellent [Cropper.js](https://fengyuanchen.github.io/cropperjs/).
`cropperOptions` will be directly passed to `Cropper` and therefor can expect the same values as documented
in their [README](https://github.com/fengyuanchen/cropperjs/blob/HEAD/README.md#options),
with the addition of `croppedCanvasOptions`, which will be passed to [`getCroppedCanvas`](https://github.com/fengyuanchen/cropperjs/blob/HEAD/README.md#getcroppedcanvasoptions).

#### `actions`

Shown action buttons (`Object` or `Boolean`).

If you you’d like to hide all actions, pass `false` to it. By default all the actions are visible.
Or enable/disable them individually:

```js
{
  revert: true,
  rotate: true,
  granularRotate: true,
  flip: true,
  zoomIn: true,
  zoomOut: true,
  cropSquare: true,
  cropWidescreen: true,
  cropWidescreenVertical: true,
}
```

#### `locale: {}`

```js
export default {
  strings: {
    revert: 'Revert',
    rotate: 'Rotate',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    flipHorizontal: 'Flip horizontal',
    aspectRatioSquare: 'Crop square',
    aspectRatioLandscape: 'Crop landscape (16:9)',
    aspectRatioPortrait: 'Crop portrait (9:16)',
  },
}
```

### Events

:::info
You can use [`on`](/docs/uppy-core#onevent-action) and [`once`](/docs/uppy-core#onceevent-action) to listen to these events.
:::

#### `file-editor:start`

Emitted when `selectFile(file)` is called.

```js
uppy.on('file-editor:start', (file) => {
  console.log(file)
})
```

#### `file-editor:complete`

Emitted after `save(blob)` is called.

```js
uppy.on('file-editor:complete', (updatedFile) => {
  console.log(updatedFile)
})
```

#### `file-editor:cancel`

Emitted when `uninstall` is called or when the current image editing changes are discarded.

```js
uppy.on('file-editor:cancel', (file) => {
  console.log(file)
})
```

