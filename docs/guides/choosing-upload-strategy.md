---
sidebar_position: 1
---

# Choosing the upload strategy you need

Versatile, reliable uploading is at the heart of Uppy. It has many configurable plugins to suit your needs.
In this guide we will explain the different plugins, their strategies, and when to use them based on use cases.

## Use cases

Below are some of the common use cases. They are not necessarily at odds with each other.
The uploading plugins are flexible enough to create new use cases, or have similar benefits.

### I want worry-free, plug-and-play uploads with Transloadit services

Transloadit’s strength is versatility.
By doing video, audio, images, documents, and more,
you only need one vendor for [all your file processing needs][transloadit-services].
The [`@uppy/transloadit`][] plugin directly uploads to Transloadit
so you only have to worry about creating a [template][transloadit-concepts].
It uses [Tus](#i-want-reliable-resumable-uploads) under the hood so you don’t have to
sacrifice reliable, resumable uploads for convenience.

You should use [`@uppy/transloadit`][] if you don’t want to host your own server,
(optionally) need file processing, and store it in the service (such as S3 or GCS) of your liking.
All with minimal effort.

### I want reliable, resumable uploads

[Tus][tus] is a new open protocol for resumable uploads built on HTTP.
This means accidentally closing your tab or losing connection let’s you continue, for instance, your 10GB upload
instead of starting all over.

Tus supports any language, any platform, and any network.
It requires a client and server integration to work.
You can checkout the client and server [implementations][tus-implementations] to find the server in your preferred language.
You can store files on the Tus server itself, but you can also use service integrations (such as S3) to store files externally.

If you want reliable, resumable uploads: use [`@uppy/tus`][] to connect to your Tus server in a few lines of code.

:::tip
If you plan to let people upload _a lot_ of files, [`@uppy/tus`][] has exponential backoff built-in.
Meaning if your server (or proxy) returns HTTP 429 because it’s being overloaded, [`@uppy/tus`][] will
find the ideal sweet spot to keep uploading without overloading.
:::

### I want to upload to AWS S3 directly

If you don’t want to host your own server or use Transloadit services you can also upload to AWS S3 directly.
Uppy has two plugins to make this happen [`@uppy/aws-s3`][] and [`@uppy/aws-s3-multipart`][].

#### Which one should I pick?

If your users are planning to mostly upload small files or a lot of files, it’s better to use [`@uppy/aws-s3`][].

[`@uppy/aws-s3-multipart`][] starts to become valuable for bigger files (10MB+) as it uses chunking.
This means if one part fails, only a single part needs to be retried, which can save a lot on a 20GB upload for instance.
The downside is request overhead, as it needs to do setup, signing, and completion besides the upload requests.
For example, if you are uploading files that are only a couple KB with a 100ms roundtrip latency,
you are spending 400ms on overhead and only a couple milliseconds on uploading. 

If you are uploading big files, we recommend [`@uppy/aws-s3-multipart`][], otherwise [`@uppy/aws-s3`][].

:::info
You can also save files in S3 with the [`/s3/store`][s3-robot] robot while still
using the powers of Transloadit services.
:::

### I want to send HTML multipart uploads to my own server

If you want to send regular file uploads to your own server you can use [`@uppy/xhr`][].

[s3-robot]: https://transloadit.com/services/file-exporting/s3-store/

[transloadit-services]: https://transloadit.com/services/

[transloadit-concepts]: https://transloadit.com/docs/getting-started/concepts/

[`@uppy/transloadit`]: /docs/uploaders/transloadit

[`@uppy/tus`]: /docs/uploaders/tus

[`@uppy/aws-s3-multipart`]: /docs/uploaders/aws-s3-multipart

[`@uppy/aws-s3`]: /docs/uploaders/aws-s3

[`@uppy/xhr`]: /docs/uploaders/xhr

[tus]: https://tus.io/

[tus-implementations]: https://tus.io/implementations.html
