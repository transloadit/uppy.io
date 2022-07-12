---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Dashboard

The all you need Dashboard — powerful, responsive, and pluggable.
Kickstart your uploading experience and gradually add more functionality.
Add files from [remote sources](/docs/companion), [edit images](/docs/user-interface/elements/image-editor), [generate thumbnails](/docs/user-interface/elements/thumbnail-generator), and more.

Checkout [integrations](#integrations) for the full list of plugins you can integrate.

:::tip
[Try out the live example with all plugins](/examples) or take it for a spin in [CodeSandbox](https://codesandbox.io/s/uppy-dashboard-xpxuhd).
:::

## When should I use this?

There are many reasons why you may want to use the Dashboard, but some could be:
- when you need a battle tested plug-and-play uploading UI to save time.
- when your users need to add files from [remote sources](/docs/companion), such [Google Drive](/docs/sources/companion-plugins/google-drive), [Dropbox](/docs/sources/companion-plugins/dropbox), and others.
- when you need to collect [meta data](#metafields) from your users per file.
- when your users want to take a picture with their [webcam](/docs/sources/webcam) or [capture their screen](/docs/sources/screen-capture).

## Install

<Tabs>
  <TabItem value="npm" label="NPM" default>

  ```shell
  npm install @uppy/core @uppy/dashboard
  ```

  </TabItem>

  <TabItem value="yarn" label="Yarn">

  ```shell
  yarn add @uppy/core @uppy/dashboard
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
    </script>
  ```

  </TabItem>
</Tabs>

The `@uppy/dashboard` plugin requires the following CSS for styling:

```js
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
```

Import general Core styles from `@uppy/core/dist/style.css` first, then add the Dashboard styles from `@uppy/dashboard/dist/style.css`.
A minified version is also available as `style.min.css` at the same path.
The way to do import depends on your build system.

:::note
The `@uppy/dashboard` plugin includes CSS for the Dashboard itself, and the various plugins used by the Dashboard,
such as ([`@uppy/status-bar`](/docs/user-interfaces/elements/status-bar) and [`@uppy/informer`](/docs/user-interfaces/elements/informer)).
If you also use the `@uppy/status-bar` or `@uppy/informer` plugin directly,
you should not include their CSS files, but instead only use the one from the `@uppy/dashboard` plugin.
:::

:::note
Styles for Provider plugins, like Google Drive and Instagram, are also bundled with Dashboard styles.
Styles for other plugins, such as `@uppy/url` and `@uppy/webcam`, are not included.
If you are using those, please see their docs and make sure to include styles for them as well.
:::

## API

### Options

```js
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'

// Example of setting all the options to their defaults.
// Not passing anything to `Dashboard` is therefor the same as the example below.
new Uppy.use(Dashboard, {
  id: 'Dashboard',
  target: 'body',
  metaFields: [],
  trigger: null,
  inline: false,
  width: 750,
  height: 550,
  thumbnailWidth: 280,
  defaultTabIcon,
  showLinkToFileUploadResult: false,
  showProgressDetails: false,
  hideUploadButton: false,
  hideRetryButton: false,
  hidePauseResumeButton: false,
  hideCancelButton: false,
  hideProgressAfterFinish: false,
  doneButtonHandler: () => {
    this.uppy.reset()
    this.requestCloseModal()
  },
  note: null,
  closeModalOnClickOutside: false,
  closeAfterFinish: false,
  disableStatusBar: false,
  disableInformer: false,
  disableThumbnailGenerator: false,
  disablePageScrollWhenModalOpen: true,
  animateOpenClose: true,
  fileManagerSelectionType: 'files',
  proudlyDisplayPoweredByUppy: true,
  onRequestCloseModal: () => this.closeModal(),
  showSelectedFiles: true,
  showRemoveButtonAfterComplete: false,
  locale: defaultLocale,
  browserBackButtonClose: false,
  theme: 'light',
  autoOpenFileEditor: false,
  disableLocalFiles: false,
})
```

#### `id`

A unique identifier for this plugin (`String`, default: `'Dashboard'`).

Plugins that are added by the Dashboard get unique IDs based on this ID, like `'Dashboard:StatusBar'` and `'Dashboard:Informer'`.

#### `target`

Where to render the Dashboard (`String` or `Element`, default: `'body'`). 

You can pass an element, class, or id as a string. 
Dashboard is rendered into `body`, because it’s hidden by default and only opened as a modal when `trigger` is clicked.

#### `inline`

Render the Dashboard as a modal or inline (`Boolean`, default: `false`).

When `false`, Dashboard is opened by clicking on [`trigger`](#trigger).
If `inline: true`, Dashboard will be rendered into [`target`](#target) and fit right in.

#### `trigger`

A CSS selector for a button that will trigger opening the Dashboard modal (`String`, default: `null`).

Several buttons or links can be used, as long as they are selected using the same selector (`.select-file-button`, for example).

#### `width`

Width of the Dashboard in pixels (`Number`, default: `750`). Used when `inline: true`.

#### `height`

Height of the Dashboard in pixels (`Number`, default: `550`). Used when `inline: true`.

#### `waitForThumbnailsBeforeUpload`

Whether to wait for all thumbnails from `@uppy/thumbnail-generator` to be ready before starting the upload (`Boolean`, default `false`).

If set to `true`, Thumbnail Generator will envoke Uppy’s internal processing stage, displaying “Generating thumbnails...” message, and wait for `thumbnail:all-generated` event, before proceeding to the uploading stage.

This is useful because Thumbnail Generator also adds EXIF data to images, and if we wait until it’s done processing, this data will be avilable on the server after the upload.

#### `showLinkToFileUploadResult`

Turn the file icon and thumbnail in the Dashboard into a link to the uploaded file (`Boolean`, default: `false`).

Please make sure to return the `url` key (or the one set via `responseUrlFieldName`) from your server.

#### `showProgressDetails`

Show or hise progress details in the status bar (`Boolean`, default: `false`).

By default, progress in Status Bar is shown as a percentage. If you would like to also display remaining upload size and time, set this to `true`.

`showProgressDetails: false`: Uploading: 45%

`showProgressDetails: true`: Uploading: 45%・43 MB of 101 MB・8s left

#### `hideUploadButton`

Show or hide the upload button (`Boolean`, default: `false`).

Use this if you are providing a custom upload button somewhere, and are using the `uppy.upload()` API.

#### `hideRetryButton`

Hide the retry button in the status bar and on each individual file (`Boolean`, default: `false`).

Use this if you are providing a custom retry button somewhere and if you are using the `uppy.retryAll()` or `uppy.retryUpload(fileID)` API.

#### `hidePauseResumeButton`

Hide the pause/resume button (for resumable uploads, via [tus](http://tus.io), for example) in the status bar and on each individual file
(`Boolean`, default: `false`).

Use this if you are providing custom cancel or pause/resume buttons somewhere, and using the `uppy.pauseResume(fileID)` or `uppy.removeFile(fileID)` API.

#### `hideCancelButton`

Hide the cancel button in status bar and on each individual file (`Boolean`, default: `false`).

Use this if you are providing a custom retry button somewhere, and using the `uppy.cancelAll()` API.

#### `hideProgressAfterFinish`

Hide the status bar after the upload has finished (`Boolean`, default: `false`).

#### `doneButtonHandler()`

This option is passed to the status bar and will render a “Done” button in place of pause/resume/cancel buttons, once the upload/encoding is done.
The behaviour of this “Done” button is defined by this handler function, for instance to close the file picker modals or clear the upload state. 

This is what the Dashboard sets by default:

```js
const doneButtonHandler = () => {
  this.uppy.reset()
  this.requestCloseModal()
}
```

Set to `null` to disable the “Done” button.

#### `showSelectedFiles`

Show the list of added files with a preview and file information (`Boolean`, default: `true`).

In case you are showing selected files in your own app’s UI and want the Uppy Dashboard to only be a picker, the list can be hidden with this option.

See also [`disableStatusBar`](#disablestatusbar) option, which can hide the progress and upload button.

#### `showRemoveButtonAfterComplete`

Show the remove button on every file after a successful upload (`Boolean`, default: `false`).

Enabling this option only shows the remove `X` button in the Dashboard UI,
but to actually send a request you should listen to [`file-removed`](https://uppy.io/docs/uppy/#file-removed) event and add your logic there.

Example:
```js
uppy.on('file-removed', (file, reason) => {
  if (reason === 'removed-by-user') {
    sendDeleteRequestForFile(file)
  }
})
```

For an implementation example, please see [#2301](https://github.com/transloadit/uppy/issues/2301#issue-628931176).

#### `note`

A string of text to be placed in the Dashboard UI (`String`, default: `null`). 

This could for instance be used to explain any [`restrictions`](#restrictions) that are put in place.
For example: `'Images and video only, 2–3 files, up to 1 MB'`.

#### `metaFields`

Create text or custom input fields for the user to fill in (`Array<Object>` or `Function`, default: `null`).

This will be shown when a user clicks the “edit” button on that file. 

:::note
The meta data will only be set on a file object if it’s entered by the user.
If the user doesn’t edit a file’s metadata, it will not have default values; instead everything will be `undefined`.
If you want to set a certain meta field to each file regardless of user actions, set [`meta` in the Uppy constructor options](/docs/uppy-core/#meta).
:::

Each object can contain:

* `id`. The name of the meta field. This will also be used in CSS/HTML as part of the `id` attribute, so it’s better to [avoid using characters like periods, semicolons, etc](https://stackoverflow.com/a/79022).
* `name`. The label shown in the interface.
* `placeholder`. The text shown when no value is set in the field. (Not needed when a custom render function is provided)
* `render: ({value, onChange, required, form}, h) => void` (optional). A function for rendering a custom form element.
  * `value` is the current value of the meta field
  * `onChange: (newVal) => void` is a function saving the new value and `h` is the `createElement` function from [Preact](https://preactjs.com/guide/v10/api-reference#h--createelement).
  * `required` is a boolean that’s true if the field `id` is in the `restrictedMetaFields` restriction
  * `form` is the `id` of the associated `<form>` element.
  * `h` can be useful when using Uppy from plain JavaScript, where you cannot write JSX.

<details>
<summary>Example: meta fields configured as an `Array`</summary>

```js
uppy.use(Dashboard, {
  trigger: '#pick-files',
  metaFields: [
    { id: 'name', name: 'Name', placeholder: 'file name' },
    { id: 'license', name: 'License', placeholder: 'specify license' },
    { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
    {
      id: 'public',
      name: 'Public',
      render ({ value, onChange, required, form }, h) {
        return h('input', { type: 'checkbox', required, form, onChange: (ev) => onChange(ev.target.checked ? 'on' : ''), defaultChecked: value === 'on' })
      },
    },
  ],
})
```

</details>

<details>
<summary>Example: dynamic meta fields based on file type with a `Function`</summary>

```js
uppy.use(Dashboard, {
  trigger: '#pick-files',
  metaFields: (file) => {
    const fields = [{ id: 'name', name: 'File name' }]
    if (file.type.startsWith('image/')) {
      fields.push({ id: 'location', name: 'Photo Location' })
      fields.push({ id: 'alt', name: 'Alt text' })
      fields.push({
        id: 'public',
        name: 'Public',
        render: ({ value, onChange, required, form }, h) => {
          return h('input', {
            type: 'checkbox',
            onChange: (ev) => onChange(ev.target.checked ? 'on' : ''),
            defaultChecked: value === 'on',
            required,
            form,
          })
        },
      })
    }
    return fields
  },
})
```

</details>

#### `closeModalOnClickOutside`

Set to true to automatically close the modal when the user clicks outside of it (`Boolean`, default: `false`).

#### `closeAfterFinish`

Set to true to automatically close the modal when all current uploads are complete (`Boolean`, default: `false`).

With this option, the modal is only automatically closed when uploads are complete _and successful_.
If some uploads failed, the modal stays open so the user can retry failed uploads or cancel the current batch and upload an entirely different set of files instead.

:::info
You can use this together with the [`allowMultipleUploads: false`](/docs/uppy-core/#allowmultipleuploads) option in Uppy Core
to create a smooth experience when uploading a single (batch of) file(s).

This is recommended. With several upload batches, the auto-closing behavior can be quite confusing for users.
:::

#### `disablePageScrollWhenModalOpen`

Disable page scroll when the modal is open (`Boolean`, default: `true`).

Page scrolling is disabled by default when the Dashboard modal is open, so when you scroll a list of files in Uppy,
the website in the background stays still.
Set to false to override this behaviour and leave page scrolling intact.

#### `animateOpenClose`

Add animations when the modal dialog is opened or closed, for a more satisfying user experience (`Boolean`, default: `true`).

#### `fileManagerSelectionType`

Configure the type of selections allowed when browsing your file system via the file manager selection window (`String`, default: `'files'`).

May be either `'files'`, `'folders'`, or `'both'`.
Selecting entire folders for upload may not be supported on all [browsers](https://caniuse.com/#feat=input-file-directory).

#### `proudlyDisplayPoweredByUppy`

Show the Uppy logo with a link (`Boolean`, default: `true`).

Uppy is provided to the world for free by the team behind [Transloadit](https://transloadit.com). 
In return, we ask that you consider keeping a tiny Uppy logo at the bottom of the Dashboard, so that more people can discover and use Uppy.

#### `disableStatusBar`

Disable the status bar completely (`Boolean`, default: `false`).

Dashboard ships with the `StatusBar` plugin that shows upload progress and pause/resume/cancel buttons.
If you want, you can disable the StatusBar to provide your own custom solution.

#### `disableInformer: false`

Disable informer (shows notifications in the form of 'toasts') completely (`Boolean`, default: `false`).

Dashboard ships with the `Informer` plugin that notifies when the browser is offline, or when it’s time to say cheese if `Webcam` is taking a picture.
If you want, you can disable the Informer and/or provide your own custom solution.

#### `disableThumbnailGenerator`

Disable the thumbnail generator completely (`Boolean`, default: `false`).

Dashboard ships with the `ThumbnailGenerator` plugin that adds small resized image thumbnails to images, for preview purposes only.
If you want, you can disable the `ThumbnailGenerator` and/or provide your own custom solution.

#### `locale`

<!-- eslint-disable no-restricted-globals, no-multiple-empty-lines -->

```js
module.exports = {
  strings: {
    // When `inline: false`, used as the screen reader label for the button that closes the modal.
    closeModal: 'Close Modal',
    // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
    addMoreFiles: 'Add more files',
    addingMoreFiles: 'Adding more files',
    // Used as the header for import panels, e.g., “Import from Google Drive”.
    importFrom: 'Import from %{name}',
    // When `inline: false`, used as the screen reader label for the dashboard modal.
    dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
    // When `inline: true`, used as the screen reader label for the dashboard area.
    dashboardTitle: 'Uppy Dashboard',
    // Shown in the Informer when a link to a file was copied to the clipboard.
    copyLinkToClipboardSuccess: 'Link copied to clipboard.',
    // Used when a link cannot be copied automatically — the user has to select the text from the
    // input element below this string.
    copyLinkToClipboardFallback: 'Copy the URL below',
    // Used as the hover title and screen reader label for buttons that copy a file link.
    copyLink: 'Copy link',
    back: 'Back',
    // Used as the screen reader label for buttons that remove a file.
    removeFile: 'Remove file',
    // Used as the screen reader label for buttons that open the metadata editor panel for a file.
    editFile: 'Edit file',
    // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
    editing: 'Editing %{file}',
    // Used as the screen reader label for the button that saves metadata edits and returns to the
    // file list view.
    finishEditingFile: 'Finish editing file',
    saveChanges: 'Save changes',
    // Used as the label for the tab button that opens the system file selection dialog.
    myDevice: 'My Device',
    dropHint: 'Drop your files here',
    // Used as the hover text and screen reader label for file progress indicators when
    // they have been fully uploaded.
    uploadComplete: 'Upload complete',
    uploadPaused: 'Upload paused',
    // Used as the hover text and screen reader label for the buttons to resume paused uploads.
    resumeUpload: 'Resume upload',
    // Used as the hover text and screen reader label for the buttons to pause uploads.
    pauseUpload: 'Pause upload',
    // Used as the hover text and screen reader label for the buttons to retry failed uploads.
    retryUpload: 'Retry upload',
    // Used as the hover text and screen reader label for the buttons to cancel uploads.
    cancelUpload: 'Cancel upload',
    // Used in a title, how many files are currently selected
    xFilesSelected: {
      0: '%{smart_count} file selected',
      1: '%{smart_count} files selected',
    },
    uploadingXFiles: {
      0: 'Uploading %{smart_count} file',
      1: 'Uploading %{smart_count} files',
    },
    processingXFiles: {
      0: 'Processing %{smart_count} file',
      1: 'Processing %{smart_count} files',
    },
    // The "powered by Uppy" link at the bottom of the Dashboard.
    poweredBy: 'Powered by %{uppy}',
    addMore: 'Add more',
    editFileWithFilename: 'Edit file %{file}',
    save: 'Save',
    cancel: 'Cancel',
    dropPasteFiles: 'Drop files here or %{browseFiles}',
    dropPasteFolders: 'Drop files here or %{browseFolders}',
    dropPasteBoth: 'Drop files here, %{browseFiles} or %{browseFolders}',
    dropPasteImportFiles: 'Drop files here, %{browseFiles} or import from:',
    dropPasteImportFolders: 'Drop files here, %{browseFolders} or import from:',
    dropPasteImportBoth:
      'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
    importFiles: 'Import files from:',
    browseFiles: 'browse files',
    browseFolders: 'browse folders',
    recoveredXFiles: {
      0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
      1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.',
    },
    recoveredAllFiles: 'We restored all files. You can now resume the upload.',
    sessionRestored: 'Session restored',
    reSelect: 'Re-select',
    missingRequiredMetaFields: {
      0: 'Missing required meta field: %{fields}.',
      1: 'Missing required meta fields: %{fields}.',
    },
  },
}

```

#### `theme`

Light or dark theme for the Dashboard (`String`, default: `'light'`).

Uppy Dashboard supports “Dark Mode”. You can try it live on [the Dashboard example page](https://uppy.io/examples/dashboard/).

It supports the following values:

* `light` — the default
* `dark`
* `auto` — will respect the user’s system settings and switch automatically

#### `autoOpenFileEditor`

Automatically open file editor (see [`@uppy/image-editor`](/docs/user-interfaces/elements/image-editor/)) for the first file in a batch (`Boolean`, default: `false`).

If one file is added, editor opens for that file, if 10 files are added — editor opens for the first file.
Use case: user adds an image — Uppy opens Image Editor right away — user crops / adjusts the image — upload.

#### `disabled`

Enabling this option makes the Dashboard grayed-out and non-interactive (`Boolean`, default: `false`).

Users won’t be able to click on buttons or drop files.
Useful when you need to conditionally enable/disable file uploading or manipulation, based on a condition in your app. Can be set on init or via API:

```js
const dashboard = uppy.getPlugin('Dashboard')
dashboard.setOptions({ disabled: true })

userNameInput.addEventListener('change', () => {
  dashboard.setOptions({ disabled: false })
})
```

#### `disableLocalFiles`

Disable local files (`Boolean`, default: `false`).

Enabling this option will disable drag & drop, hide the “browse” and “My Device” button,
allowing only uploads from plugins, such as Webcam, Screen Capture, Google Drive, Instagram.

#### `onDragOver(event)`

Callback for the [`ondragover`][ondragover] event handler.

#### `onDrop(event)`

Callback for the [`ondrop`][ondrop] event handler.

#### `onDragLeave(event)`

Callback for the [`ondragleave`][ondragleave] event handler.

### Methods

:::info
Dashboard also contains the methods described in [`UIPlugin`](/docs/uppy-core#new-uipluginuppy-options) and [`BasePlugin`](/docs/uppy-core#new-basepluginuppy-options).
:::

#### `openModal()`

Shows the Dashboard modal. Use it like this:

`uppy.getPlugin('Dashboard').openModal()`

#### `closeModal()`

Hides the Dashboard modal. Use it like this:

`uppy.getPlugin('Dashboard').closeModal()`

#### `isModalOpen()`

Returns `true` if the Dashboard modal is open, `false` otherwise.

```js
const dashboard = uppy.getPlugin('Dashboard')
if (dashboard.isModalOpen()) {
  dashboard.closeModal()
}
```

### Events

#### `dashboard:modal-open`

Fired when the Dashboard modal is open.

```js
uppy.on('dashboard:modal-open', () => {
  console.log('Modal is open')
})
```

#### `dashboard:modal-closed`

Fired when the Dashboard modal is closed.

#### `dashboard:file-edit-start`

**Parameters:**

* `file` — The [File Object](https://uppy.io/docs/uppy/#File-Objects) representing the file that was opened for editing.

Fired when the user clicks “edit” icon next to a file in the Dashboard. The FileCard panel is then open with file metadata available for editing.

#### `dashboard:file-edit-complete`

**Parameters:**

* `file` — The [File Object](https://uppy.io/docs/uppy/#File-Objects) representing the file that was edited.

Fired when the user finished editing the file metadata.

## Integrations

These are the plugins specifically made for the Dashboard.
This is not a list of all Uppy plugins.

### Sources

- [`@uppy/audio`](/docs/sources/audio) — record audio.
- [`@uppy/box`](/docs/sources/companion-plugins/box) — import files from [Box](https://www.box.com/en-nl/home).
- [`@uppy/dropbox`](/docs/sources/companion-plugins/dropbox) — import from [Dropbox](https://dropbox.com).
- [`@uppy/facebook`](/docs/sources/companion-plugins/dropbox) — import from [Facebook](https://facebook.com).
- [`@uppy/google-drive`](/docs/sources/companion-plugins/google-drive) — import from [Google Drive](https://drive.google.com).
- [`@uppy/instagram`](/docs/sources/companion-plugins/instagram) — import from [Instagram](https://instagram.com).
- [`@uppy/onedrive`](/docs/sources/companion-plugins/onedrive) — import from [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage).
- [`@uppy/screen-capture`](/docs/sources/screen-capture) — Record your screen, including (optionally) your microphone.
- [`@uppy/unsplash`](/docs/sources/companion-plugins/unsplash) — import files from [Unsplash](https://unsplash.com/)
- [`@uppy/url`](/docs/sources/companion-plugins/url) — import files from any URL.
- [`@uppy/webcam`](/docs/sources/webcam) — Record or make a picture with your webcam.
- [`@uppy/zoom`](/docs/sources/companion-plugins/url) — import files from [Zoom](https://zoom.us).

### UI

- [`@uppy/image-editor`](/docs/user-interfaces/elements/image-editor) — allows users to crop, rotate, zoom and flip images that are added to Uppy.
- [`@uppy/informer`](/docs/user-interfaces/elements/informer) — show notifications.
- [`@uppy/status-bar`](/docs/user-interfaces/elements/status-bar) — advanced upload progress status bar.
- [`@uppy/thumbnail-generator`](/docs/user-interfaces/elements/thumbnail-generator) — generate preview thumbnails for images to be uploaded.

### Frameworks

- [`@uppy/angular`](/docs/framework-integrations/angular) — Dashboard component for [Angular](https://angular.io/).
- [`@uppy/react`](/docs/framework-integrations/react) — Dashboard component for [React](https://reactjs.org/).
- [`@uppy/svelte`](/docs/framework-integrations/svelte) — Dashboard component for [Svelte](https://svelte.dev/).
- [`@uppy/vue`](/docs/framework-integrations/vue) — Dashboard component for [Vue](https://vuejs.org/).

<!-- definitions -->

[ondragover]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondragover

[ondragleave]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondragleave

[ondrop]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondrop
 
