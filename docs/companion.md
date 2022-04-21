---
sidebar_position: 4
---

# Companion

Companion is a hosted, standalone, or middleware server to **take away the complexity of authentication
and the cost of downloading files from remote sources**, such as Instagram, Google Drive, and others.
Clients request remote files from Companion, which it will download and simultaneously upload to your Tus server,
AWS bucket, or any server that supports multipart.
Companion is a server-to-server orchestrator, the files are not stored in Companion.

This means a 5GB video isn’t eating into your users’ data plans and you don’t have to worry about OAuth.

## When should I use it?

If you want to let users download files from [Box][], [Dropbox][], [Facebook][], [Google Drive][GoogleDrive], [Instagram][],
[OneDrive][], [Unsplash][], [Import from URL][Url], or [Zoom][] — you need Companion.

Companion supports the same [uploaders](/docs/guides/choosing-upload-strategy) as Uppy:
Tus, AWS S3, and regular multipart. But instead of a plugin you configure which one to use with [`protocol`](#options).
This means if you are using [Tus](/docs/uploaders/tus) for your local uploads, you can send your remote uploads
to the same Tus server (and likewise for AWS S3).

:::note
Companion only deals with _remote_ files, _local_ files are still uploaded from the client
with your upload plugin.
:::

## Hosted

Using [Transloadit][] services comes with a hosted version of Companion so you don’t have to worry about hosting your own server.
Whether you are on a free or paid Transloadit [plan](https://transloadit.com/pricing/), you can use Companion.
It’s not possible to rent a Companion server without a Transloadit plan.

:::tip
Choosing Transloadit for your file services also comes with credentials for all remote providers.
This means you don’t have to waste time going through the approval process of every app.
However you can still add your own credentials in the Transloadit admin page if you want. 
:::

:::info
Downloading and uploading files through Companion doesn’t count towards
your [monthly quota](https://transloadit.com/docs/faq/1gb-worth/),
it’s a way for files to arrive at Transloadit servers, much like Uppy.
:::

[**Sign-up for a (free) plan**](https://transloadit.com/pricing/).

## Installation

If you want to host your own Companion server start by installing it:

```bash
npm install @uppy/companion
```

:::note
Since v2, you need to be running `node.js >= v10.20.1` to use Companion.
More information in the [migrating to 2.0](/docs/guides/migrate-2.0) guide.

Windows is not a supported platform right now.
It may work, and we’re happy to accept improvements in this area, but we can’t provide support.
:::

## Use

Companion can be integrated as middleware into your [Express](https://expressjs.com/) app or as a standalone server.

### Express middleware

To plug Companion into an existing server, call its `.app` method,
passing in an [options](#Options) object as a parameter.
This returns a server instance that you can mount on a route in your Express app.

```js
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import companion from '@uppy/companion'

const app = express()

// Companion requires body-parser and express-session middleware.
// You can add it like this if you use those throughout your app.
//
// If you are using something else in your app, you can add these
// middlewares in the same subpath as Companion instead.
app.use(bodyParser.json())
app.use(session({ secret: 'some secrety secret' }))

const options = {
  providerOptions: {
    drive: {
      key: 'GOOGLE_DRIVE_KEY',
      secret: 'GOOGLE_DRIVE_SECRET',
    },
  },
  server: {
    host: 'localhost:3020',
    protocol: 'http',
    // This MUST match the path you specify in `app.use()` below:
    path: '/companion',
  },
  filePath: '/path/to/folder/',
}

app.use('/companion', companion.app(options))
```

Companion uses WebSockets to communicate progress, errors, and successes to the client.
This is what Uppy listens to to update it’s internal state and UI, if there is one.

Add the Companion WebSocket server using the `companion.socket` function:

```js
const server = app.listen(PORT)

companion.socket(server)
```

If WebSockets fail for some reason Uppy and Companion will fallback to HTTP polling.

### Standalone

You can use the standalone version if you want to run Companion as it’s own Node process.
The standalone version is a configured Express server with sessions, logging, and security best practices.

Companion ships with an excecutable file (`bin/companion`) which is the standalone server.
Unlike the middleware version, options are set via environment variables.

:::info
Checkout [options](#options) for the available options in JS and environment variable formats.
:::

You need at least these three to get started:

```bash
export COMPANION_SECRET="shh!Issa Secret!"
export COMPANION_DOMAIN="YOUR SERVER DOMAIN"
export COMPANION_DATADIR="PATH/TO/DOWNLOAD/DIRECTORY"
```

Then run:

```bash
companion
```

You can also pass in the path to your JSON config file, like so:

```bash
companion --config /path/to/companion.json
```

## API

### Options

<details>
  <summary>Example configuration</summary>

```javascript
const options = {
  providerOptions: {
    drive: {
      key: '***',
      secret: '***',
    },
    dropbox: {
      key: '***',
      secret: '***',
    },
    instagram: {
      key: '***',
      secret: '***',
    },
    facebook: {
      key: '***',
      secret: '***',
    },
    onedrive: {
      key: '***',
      secret: '***',
    },
    s3: {
      getKey: (req, filename, metadata) => filename,
      key: '***',
      secret: '***',
      bucket: 'bucket-name',
      region: 'us-east-1',
      useAccelerateEndpoint: false, // default: false,
      expires: 3600, // default: 300 (5 minutes)
      acl: 'private', // default: public-read
    },
  },
  server: {
    host: 'localhost:3020', // or yourdomain.com
    protocol: 'http',
  },
  filePath: 'path/to/download/folder',
  sendSelfEndpoint: 'localhost:3020',
  secret: 'mysecret',
  uploadUrls: ['https://myuploadurl.com', /^http:\/\/myuploadurl2.com\//],
  debug: true,
  metrics: false,
  streamingUpload: true,
  allowLocalUrls: false,
  maxFileSize: 100000000,
  periodicPingUrls: [],
  periodicPingInterval: 60000,
  periodicPingStaticPayload: { static: 'payload' },
  corsOrigins: true,
}
```

</details>

:::tip
The headings display the JS and environment variable options (`option` `ENV_OPTION`).
When integrating Companion into your own server, you pass the options to `companion.app()`.
If you are using the standalone version, you configure Companion using environment variables.
:::

#### `filePath` `COMPANION_DATADIR`

Full path to the directory to which provider files will be downloaded temporarily.

#### `secret` `COMPANION_SECRET`

A secret string which Companion uses to generate authorization tokens.
You should generate a long random string for this. For example:

```js
const crypto = require('crypto')

const secret = crypto.randomBytes(64).toString('hex')
```

:::caution
Omitting the `secret` in the standalone version will generate a secret for you,
using the above `crypto` string. But when integrating with Express you must provide it yourself.
This is an essential security measure.
:::

#### `uploadUrls` `COMPANION_UPLOAD_URLS`

An allowlist (array) of strings (exact URLs) or regular expressions.
If specified, Companion will only accept uploads to these URLs.
This is needed to make sure a Companion instance is only allowed to upload to your servers.

:::caution
Omitting this leaves your system open to potential [SSRF](https://en.wikipedia.org/wiki/Server-side_request_forgery) attacks,
and may throw an error in future `@uppy/companion` releases.
:::

#### `COMPANION_PORT`

The port on which to start the standalone server, defaults to 3020.

#### `redisUrl` `COMPANION_REDIS_URL`

TODO: needs a great explanation if it actually works, so let's figure out if it works

URL to running Redis server.
If this is set, the state of uploads would be stored temporarily.
This helps for resumed uploads after a browser crash from the client.
The stored upload would be sent back to the client on reconnection.

#### `redisOptions`

An object of [options supported by redis client](https://www.npmjs.com/package/redis#options-object-properties).
This option can be used in place of `redisUrl`.

#### `redisPubSubScope`

Use a scope for the companion events at the Redis server.
Setting this option will prefix all events with the name provided and a colon.

#### `server`

Configuation options for the underlying server.

| Key / Env var                            | Value             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `protocol` `COMPANION_PROTOCOL`          | `http` or `https` | Used to build a URL to reference the Companion instance itself, which is used for headers and cookies. Companion does not serve SSL certificates, so by default you should use `http`. You want to set this to `https` if you’ve enabled SSL/HTTPS for your domain by running a reverse https-proxy in front of Companion, or with a built-in HTTPS feature of your hosting service, such as Heroku.                                     |
| `host` `COMPANION_DOMAIN`                | `String`          | Your server’s publically facing hostname (for example `example.com`).                                                                                                                                                                                                                                                                                                                                                                        |
| `oauthDomain` `COMPANION_OAUTH_DOMAIN`   | `String`          | If you have several instances of Companion with different (and perhaps dynamic) subdomains, you can set a single fixed subdomain and server (such as `sub1.example.com`) to handle your OAuth authentication for you. This would then redirect back to the correct instance with the required credentials on completion. This way you only need to configure a single callback URL for OAuth providers.                                        |
| `path` `COMPANION_PATH`                  | `String`          | The server path to where the Companion app is sitting. For instance, if Companion is at `example.com/companion`, then the path would be `/companion`).                                                                                                                                                                                                                                                                                         |
| `implicitPath` `COMPANION_IMPLICIT_PATH` | `String`          | If the URL’s path in your reverse proxy is different from your Companion path in your express app, then you need to set this path as `implicitPath`. For instance, if your Companion URL is `example.com/mypath/companion`. Where the path `/mypath` is defined in your NGINX server, while `/companion` is set in your express app. Then you need to set the option `implicitPath` to `/mypath`, and set the `path` option to `/companion`. |
| `validHosts` `COMPANION_DOMAINS`         | `Array`           | If you are setting an `oauthDomain`, you need to set a list of valid hosts, so the oauth handler can validate the host of the Uppy instance requesting the authentication. This is essentially a list of valid domains running your Companion instances. The list may also contain regex patterns. e.g `['sub2.example.com', 'sub3.example.com', '(\\w+).example.com']`                                                                        |

#### `sendSelfEndpoint` `COMPANION_SELF_ENDPOINT`

This is essentially the same as the `server.host + server.path` attributes.
The major reason for this attribute is that, when set, it adds the value as the `i-am` header of every request response.

#### `providerOptions`

Object to enable providers with their keys and secrets. For example:

```js
providerOptions: {
  drive: {
    key: '***',
    secret: '***',
  },
}
```

When using the standalone version you use the corresponding environment variables
or point to a secret file (such as `COMPANION_GOOGLE_SECRET_FILE`).

| Service | Key | Environment variables |
| ------- | --- | -------------------- |
| Box | `box` | `COMPANION_BOX_KEY`, `COMPANION_BOX_SECRET`, `COMPANION_BOX_SECRET_FILE`
| Dropbox | `dropbox` | `COMPANION_DROPBOX_KEY`, `COMPANION_DROPBOX_SECRET`, `COMPANION_DROPBOX_SECRET_FILE`
| Facebook | `facebook` | `COMPANION_FACEBOOK_KEY`, `COMPANION_FACEBOOK_SECRET`, `COMPANION_FACEBOOK_SECRET_FILE`
| Google Drive | `drive` | `COMPANION_GOOGLE_KEY`, `COMPANION_GOOGLE_SECRET`, `COMPANION_GOOGLE_SECRET_FILE`
| Instagram | `instagram` | `COMPANION_INSTAGRAM_KEY`, `COMPANION_INSTAGRAM_SECRET`, `COMPANION_INSTAGRAM_SECRET_FILE`
| OneDrive | `onedrive` | `COMPANION_ONEDRIVE_KEY`, `COMPANION_ONEDRIVE_SECRET`, `COMPANION_ONEDRIVE_SECRET_FILE`
| Zoom | `zoom` | `COMPANION_ZOOM_KEY`, `COMPANION_ZOOM_SECRET`, `COMPANION_ZOOM_SECRET_FILE`

#### `providerOptions.s3`

Companion comes with signature endpoints for AWS S3.
These can be used by the Uppy client to sign requests to upload files directly to S3, without exposing secret S3 keys in the browser.
Companion also supports uploading files from providers like Dropbox and Instagram directly into S3.

##### `s3.key` `COMPANION_AWS_KEY`

The S3 access key ID.

##### `s3.secret` `COMPANION_AWS_SECRET`

The S3 secret access key.

##### `s3.bucket` `COMPANION_AWS_BUCKET`

The name of the bucket to store uploaded files in.

##### `s3.region` `COMPANION_AWS_REGION`

The datacenter region where the target bucket is located.

##### `s3.awsClientOptions`

You can supply any [S3 option supported by the AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property)
in the `providerOptions.s3.awsClientOptions` object, _except for_ the below:

* `accessKeyId`. Instead, use the `providerOptions.s3.key` property.
  This is to make configuration names consistent between different Companion features.
* `secretAccessKey`. Instead, use the `providerOptions.s3.secret` property.
  This is to make configuration names consistent between different Companion features.

Be aware that some options may cause wrong behaviour if they conflict with Companion’s assumptions.
If you find that a particular option does not work as expected, please [open an issue on the Uppy repository](https://github.com/transloadit/uppy/issues/new) so we can document it here.

##### `s3.getKey(req, filename, metadata)`

Get the key name for a file. The key is the file path to which the file will be uploaded in your bucket.
This option should be a function receiving three arguments:

* `req`, the HTTP request, for _regular_ S3 uploads using the `@uppy/aws-s3` plugin.
  This parameter is _not_ available for multipart uploads using the `@uppy/aws-s3-multipart` plugin;
* `filename`, the original name of the uploaded file;
* `metadata`, user-provided metadata for the file.
  See the [`@uppy/aws-s3`](https://uppy.io/docs/aws-s3/#metaFields) docs. The `@uppy/aws-s3-multipart` plugin unconditionally sends all metadata fields, so they all are available here.

This function should return a string `key`.
The `req` parameter can be used to upload to a user-specific folder in your bucket, for example:

```js
app.use(authenticationMiddleware)
app.use(uppy.app({
  providerOptions: {
    s3: {
      getKey: (req, filename, metadata) => `${req.user.id}/${filename}`,
      /* auth options */
    },
  },
}))
```

The default implementation returns the `filename`,
so all files will be uploaded to the root of the bucket as their original file name.

```js
app.use(uppy.app({
  providerOptions: {
    s3: {
      getKey: (req, filename, metadata) => filename,
    },
  },
}))
```

#### `COMPANION_AWS_SECRET_FILE`

Using a secret file instead of [`s3.secret`](#s3secret-companion_aws_secret).
A secret file is a file that only contains the secret.
 
#### `COMPANION_AWS_USE_ACCELERATE_ENDPOINT`

Enable S3 [Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html).

#### `COMPANION_AWS_EXPIRES`

Set `X-Amz-Expires` query parameter in the presigned urls (in seconds, default: 300).

#### `COMPANION_AWS_ACL`

Set a [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) for uploaded objects.

#### `customProviders`

This option enables you to add custom providers along with the already supported providers.
See [adding custom providers](#how-to-add-custom-providers) for more information.

#### `debug` `COMPANION_DEBUG`

A boolean flag to tell Companion whether to log useful debug information while running.

#### `logClientVersion`

A boolean flag to tell Companion whether to log its version upon startup.

#### `metrics` `COMPANION_HIDE_METRICS`
 
A boolean flag to tell Companion whether to provide an endpoint `/metrics` with Prometheus metrics.

#### `streamingUpload` `COMPANION_STREAMING_UPLOAD`

A boolean flag to tell Companion whether to enable streaming uploads.
If enabled, it will lead to _faster uploads_ because companion will start uploading at the same time as downloading using `stream.pipe`.
If `false`, files will be fully downloaded first, then uploaded.
Defaults to `false`. 

:::caution
Do not set it to `true` if you have a [custom Companion provider](#how-to-add-custom-providers) that does not use the new async/stream API.
:::

#### `maxFileSize` `COMPANION_MAX_FILE_SIZE`

If this value is set, companion will limit the maximum file size to process. If unset, it will process files without any size limit (this is the default).

#### `periodicPingUrls` `COMPANION_PERIODIC_PING_URLS`

If this value is set, companion will periodically send POST requests to the specified URLs.
Useful for keeping track of companion instances as a keep-alive.

#### `periodicPingInterval` `COMPANION_PERIODIC_PING_INTERVAL`

Interval for periodic ping requests (in ms).

#### `periodicPingStaticPayload` `COMPANION_PERIODIC_PING_STATIC_JSON_PAYLOAD`

A `JSON.stringify`-able JavaScript Object that will be sent as part of the JSON body in the period ping requests.

#### `allowLocalUrls` `COMPANION_ALLOW_LOCAL_URLS`

A boolean flag to tell Companion whether to allow requesting local URLs.

:::caution
Only enable this in development. **Enabling it in production is a security risk.**
:::

#### `corsOrigins` `COMPANION_CLIENT_ORIGINS`

Allowed CORS Origins (default `true`). 
Passed as the `origin` option in [cors](https://github.com/expressjs/cors#configuration-options))

#### `COMPANION_SECRET_FILE`

Specifying a secret file will override a directly set [secret](#secret).

#### `COMPANION_HIDE_WELCOME`

Disables the welcome page.

#### `COMPANION_CLIENT_ORIGINS_REGEX`
Like COMPANION_CLIENT_ORIGINS, but allows a single regex instead.
`COMPANION_CLIENT_ORIGINS` will be ignored if this is used.

#### `COMPANION_CHUNK_SIZE`

Chunk size?

### Events

The object returned by `companion.app()` also has a property `companionEmitter` which is an `EventEmitter` 
that emits the following events:

* `upload-start` - When an upload starts, this event is emitted with an object containing the property `token`, which is a unique ID for the upload.
* **token** - The event name is the token from `upload-start`. The event has an object with the following properties:
  * `action` - One of the following strings:
    * `success` - When the upload succeeds.
    * `error` - When the upload fails with an error.
  * `payload` - the error or success payload.

Example code for using the `EventEmitter` to handle a finished file upload:

```js
const companionApp = companion.app(options)
const { companionEmitter: emitter } = companionApp

emitter.on('upload-start', ({ token }) => {
  console.log('Upload started', token)

  function onUploadEvent ({ action, payload }) {
    if (action === 'success') {
      emitter.off(token, onUploadEvent) // avoid listener leak
      console.log('Upload finished', token, payload.url)
    } else if (action === 'error') {
      emitter.off(token, onUploadEvent) // avoid listener leak
      console.error('Upload failed', payload)
    }
  }
  emitter.on(token, onUploadEvent)
})
```

## Frequently asked questions

### Do you have a live example?

An example server is running at <https://companion.uppy.io>, which is deployed with [Kubernetes](https://github.com/transloadit/uppy/blob/main/packages/%40uppy/companion/KUBERNETES.md)

### How does the Authentication and Token mechanism work?

This section describes how Authentication works between Companion and Providers. While this behaviour is the same for all Providers (Dropbox, Instagram, Google Drive, etc.), we are going to be referring to Dropbox in place of any Provider throughout this section.

The following steps describe the actions that take place when a user Authenticates and Uploads from Dropbox through Companion:

* The visitor to a website with Uppy clicks `Connect to Dropbox`.
* Uppy sends a request to Companion, which in turn sends an OAuth request to Dropbox (Requires that OAuth credentials from Dropbox have been added to Companion).
* Dropbox asks the visitor to log in, and whether the Website should be allowed to access your files
* If the visitor agrees, Companion will receive a token from Dropbox, with which we can temporarily download files.
* Companion encrypts the token with a secret key and sends the encrypted token to Uppy (client)
* Every time the visitor clicks on a folder in Uppy, it asks Companion for the new list of files, with this question, the token (still encrypted by Companion) is sent along.
* Companion decrypts the token, requests the list of files from Dropbox and sends it to Uppy.
* When a file is selected for upload, Companion receives the token again according to this procedure, decrypts it again, and thereby downloads the file from Dropbox.
* As the bytes arrive, Companion uploads the bytes to the final destination (depending on the configuration: Apache, a Tus server, S3 bucket, etc).
* Companion reports progress to Uppy, as if it were a local upload.
* Completed!

### How to use provider redirect URIs?

When generating your provider API keys on their corresponding developer platforms (e.g [Google Developer Console](https://console.developers.google.com/)), you’d need to provide a `redirect URI` for the OAuth authorization process. In general the redirect URI for each provider takes the format:

`http(s)://$YOUR_COMPANION_HOST_NAME/$PROVIDER_NAME/redirect`

For example, if your Companion server is hosted on `https://my.companion.server.com`, then the redirect URI you would supply for your OneDrive provider would be:

`https://my.companion.server.com/onedrive/redirect`

Please see [Supported Providers](https://uppy.io/docs/companion/#Supported-providers) for a list of all Providers and their corresponding names.

### How to scale Companion?

...

### How to use Companion with Kubernetes?

We have [a detailed guide on running Companion in Kubernetes](https://github.com/transloadit/uppy/blob/main/packages/%40uppy/companion/KUBERNETES.md) for you, that’s how we run our example server at <https://companion.uppy.io>.

### How to add custom providers?

As of now, Companion supports the [providers listed here](https://uppy.io/docs/companion/#Supported-providers) out of the box, but you may also choose to add your own custom providers. You can do this by passing the `customProviders` option when calling the Uppy `app` method. The custom provider is expected to support Oauth 1 or 2 for authentication/authorization.

```javascript
import providerModule from './path/to/provider/module'

const options = {
  customProviders: {
    myprovidername: {
      config: {
        authorize_url: 'https://mywebsite.com/authorize',
        access_url: 'https://mywebsite.com/token',
        oauth: 2,
        key: '***',
        secret: '***',
        scope: ['read', 'write'],
      },
      module: providerModule,
    },
  },
}

uppy.app(options)
```

The `customProviders` option should be an object containing each custom provider. Each custom provider would, in turn, be an object with two keys, `config` and `module`. The `config` option would contain Oauth API settings, while the `module` would point to the provider module.

To work well with Companion, the **module** must be a class with the following methods. Note that the methods must be `async`, return a `Promise` or reject with an `Error`):

1. `async list ({ token, directory, query })` - Returns a object containing a list of user files (such as a list of all the files in a particular directory). See [example returned list data structure](#list-data).
   `token` - authorization token (retrieved from oauth process) to send along with your request
   * `directory` - the id/name of the directory from which data is to be retrieved. This may be ignored if it doesn’t apply to your provider
   * `query` - expressjs query params object received by the server (in case some data you need in there).
2. `async download ({ token, id, query })` - Downloads a particular file from the provider. Returns an object with a single property `{ stream }` - a [`stream.Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable), which will be read from and uploaded to the destination. To prevent memory leaks, make sure you release your stream if you reject this method with an error.
   * `token` - authorization token (retrieved from oauth process) to send along with your request.
   * `id` - ID of the file being downloaded.
   * `query` - expressjs query params object received by the server (in case some data you need in there).
3. `async size ({ token, id, query })` - Returns the byte size of the file that needs to be downloaded as a `Number`. If the size of the object is not known, `null` may be returned.
   * `token` - authorization token (retrieved from oauth process) to send along with your request.
   * `id` - ID of the file being downloaded.
   * `query` - expressjs query params object received by the server (in case some data you need in there).

The class must also have:

* A unique `authProvider` string property - a lowercased value which typically indicates the name of the provider (e.g “dropbox”).
* A `static` property `static version = 2`, which is the current version of the Companion Provider API.

See also [example code with a custom provider](https://github.com/transloadit/uppy/blob/main/examples/custom-provider/server).

#### list data

```json
{
  // username or email of the user whose provider account is being accessed
  "username": "johndoe",
  // list of files and folders in the directory. An item is considered a folder
  //  if it mainly exists as a collection to contain sub-items
  "items": [
    {
      // boolean value of whether or NOT it's a folder
      "isFolder": false,
      // icon image URL
      "icon": "https://random-api.url.com/fileicon.jpg",
      // name of the item
      "name": "myfile.jpg",
      // the mime type of the item. Only relevant if the item is NOT a folder
      "mimeType": "image/jpg",
      // the id (in string) of the item
      "id": "uniqueitemid",
      // thumbnail image URL. Only relevant if the item is NOT a folder
      "thumbnail": "https://random-api.url.com/filethumbnail.jpg",
      // for folders this is typically the value that will be passed as "directory" in the list(...) method.
      // For files, this is the value that will be passed as id in the download(...) method.
      "requestPath": "file-or-folder-requestpath",
      // datetime string (in ISO 8601 format) of when this item was last modified
      "modifiedDate": "2020-06-29T19:59:58Z",
      // the size in bytes of the item. Only relevant if the item is NOT a folder
      "size": 278940,
      "custom": {
        // an object that may contain some more custom fields that you may need to send to the client. Only add this object if you have a need for it.
        "customData1": "the value",
        "customData2": "the value"
      }
      // more items here
    }
  ],
  // if the "items" list is paginated, this is the request path needed to fetch the next page.
  "nextPagePath": "directory-name?cursor=cursor-to-next-page"
}
```

### How to run Companion locally?

1\. To set up Companion for local development, please clone the Uppy repo and install, like so:

```bash
git clone https://github.com/transloadit/uppy
cd uppy
yarn install
```

2\. Configure your environment variables by copying the `env.example.sh` file to `env.sh` and edit it to its correct values.

```bash
cp env.example.sh env.sh
$EDITOR env.sh
```

3\. To start the server, run:

```bash
yarn run start:companion
```

This would get the Companion instance running on `http://localhost:3020`. It uses [nodemon](https://github.com/remy/nodemon) so it will automatically restart when files are changed.

[Box]: /docs/sources/companion-plugins/box
[Dropbox]: /docs/sources/companion-plugins/dropbox
[Facebook]: /docs/sources/companion-plugins/facebook
[GoogleDrive]: /docs/sources/companion-plugins/google-drive
[Instagram]: /docs/sources/companion-plugins/instagram
[OneDrive]: /docs/sources/companion-plugins/onedrive
[Unsplash]: /docs/sources/companion-plugins/unsplash
[Url]: /docs/sources/companion-plugins/url
[Zoom]: /docs/sources/companion-plugins/zoom

[Transloadit]: https://transloadit.com
