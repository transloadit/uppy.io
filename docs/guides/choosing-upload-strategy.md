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
The **[@uppy/transloadit][]** plugin directly uploads to Transloadit
so you only have to worry about creating a [template][transloadit-concepts].
It uses [Tus](#i-want-reliable-resumable-uploads) under the hood so you don’t have to
sacrifice reliable, resumable uploads for convenience.

You should use **[@uppy/transloadit][]** if you don’t want to host your own server,
(optionally) need file processing, and store it in the service (such as S3 or GCS) of your liking.
All with minimal effort.

### I want reliable, resumable uploads

[Tus][tus] is a new open protocol for resumable uploads built on HTTP.
This means accidentally closing your tab or losing connection let’s you continue, for instance, your 10GB upload
instead of starting all over.

It supports any language, any platform, and any network. You can checkout the [GitHub organisation][tus-gh] to
find the implementation in your favorite language. You can store files on your self-hosted Tus server, but also use service integrations (such as S3) to store files
externally.

If you want reliable, resumable uploads: use **[@uppy/tus][]** to connect to your Tus server in a few lines of code.

:::tip
If you plan to let people upload _a lot_ of files, **[@uppy/tus][]** has exponential backoff built-in.
Meaning if your server (or proxy) returns HTTP 429 because it’s being overloaded, **[@uppy/tus][]** will
find the ideal sweet spot to keep uploading without overloading.
:::

### I want to upload to AWS S3 directly

<!--- TODO: describe the differences here and refer and link to this in the S3 plugin docs? -->

If you don’t want to host your own server or use Transloadit services you can also upload to AWS S3 directly.
Uploading to S3 from a browser can be done in two ways.
A server can generate a pre-signed URL for a PUT upload, or a server can generate form data for a POST upload.
You can read more about that in the **[@uppy/aws-s3][]** docs.

<!--- TODO: describe "regular uploads" better -->

Uppy provides two strategies to upload to S3. **[@uppy/aws-s3][]** uses regular uploads and
**[@uppy/aws-s3-multipart][]** uses S3’s multipart upload strategy. If you are dealing with bigger files (20MB+)
then the multipart uploads are better.

:::info
You can also save files in S3 with the **[/s3/store][s3-robot]** robot while still
using the powers of Transloadit services.
:::

### I want to send HTML multipart uploads to my own server

If you want to send regular file uploads to your own server you can use **[@uppy/xhr][]**.

[s3-robot]: https://transloadit.com/services/file-exporting/s3-store/

[transloadit-services]: https://transloadit.com/services/

[transloadit-concepts]: https://transloadit.com/docs/getting-started/concepts/

[@uppy/transloadit]: /docs/uploaders/transloadit

[@uppy/tus]: /docs/uploaders/tus

[@uppy/aws-s3-multipart]: /docs/uploaders/aws-s3-multipart

[@uppy/aws-s3]: /docs/uploaders/aws-s3

[@uppy/xhr]: /docs/uploaders/xhr

[tus]: https://tus.io/

[tus-gh]: https://github.com/tus
