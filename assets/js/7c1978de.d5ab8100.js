"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[6843],{25136:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var o=t(74848),s=t(28453);const i={title:"New Uppy 4.0 major: TypeScript rewrite, Google Photos, React hooks, and much more",date:new Date("2024-07-10T00:00:00.000Z"),authors:["aduh95","evgenia","mifi","murderlon"],image:"/img/blog/4.0/preview.jpg",slug:"uppy-4.0",published:!0,toc_max_heading_level:2},r=void 0,a={permalink:"/blog/uppy-4.0",editUrl:"https://github.com/transloadit/uppy.io/tree/main/blog/2024-07-10-uppy-4.0.md",source:"@site/blog/2024-07-10-uppy-4.0.md",title:"New Uppy 4.0 major: TypeScript rewrite, Google Photos, React hooks, and much more",description:"Hold on to your leashes, folks! Uppy 4.0 is here, and it\u2019s more exciting than a",date:"2024-07-10T00:00:00.000Z",tags:[],readingTime:10.84,hasTruncateMarker:!0,authors:[{email:"antoine@transloadit.com",name:"Antoine du Hamel",id:"aduh95",tagline:"Developer",imageURL:"https://github.com/aduh95.png",key:"aduh95"},{email:"lakesare@gmail.com",name:"Evgenia Karunus",id:"evgenia",tagline:"Developer",imageURL:"https://github.com/lakesare.png",key:"evgenia"},{email:"mikael@transloadit.com",name:"Mikael Finstad",id:"mikael",tagline:"Developer",imageURL:"https://github.com/mifi.png",key:"mifi"},{email:"merlijn@transloadit.com",name:"Merlijn Vos",id:"merlijn",tagline:"Developer",imageURL:"https://github.com/murderlon.png",key:"murderlon"}],frontMatter:{title:"New Uppy 4.0 major: TypeScript rewrite, Google Photos, React hooks, and much more",date:"2024-07-10T00:00:00.000Z",authors:["aduh95","evgenia","mifi","murderlon"],image:"/img/blog/4.0/preview.jpg",slug:"uppy-4.0",published:!0,toc_max_heading_level:2},unlisted:!1,nextItem:{title:"\ud83c\udf84 Uppy 3.13 to 3.21: Typescript Saga: the beginning, Image Editor improvements, Dashboard auto-install",permalink:"/blog/2023/07/3.13-3.21"}},l={authorsImageUrls:[void 0,void 0,void 0,void 0]},d=[{value:"Migration guide",id:"migration-guide",level:2},{value:"TypeScript rewrite",id:"typescript-rewrite",level:2},{value:"Merging the two AWS S3 plugins",id:"merging-the-two-aws-s3-plugins",level:2},{value:"React hooks",id:"react-hooks",level:2},{value:"<code>useUppyState(uppy, selector)</code>",id:"useuppystateuppy-selector",level:3},{value:"<code>useUppyEvent(uppy, event, callback)</code>",id:"useuppyeventuppy-event-callback",level:3},{value:"Google Photos",id:"google-photos",level:2},{value:"UX improvements for viewing remote files",id:"ux-improvements-for-viewing-remote-files",level:2},{value:"Revamped options for <code>@uppy/xhr-upload</code>",id:"revamped-options-for-uppyxhr-upload",level:2},{value:"Simpler configuration for <code>@uppy/transloadit</code>",id:"simpler-configuration-for-uppytransloadit",level:2},{value:"Companion",id:"companion",level:2},{value:"Streaming uploads by default",id:"streaming-uploads-by-default",level:3},{value:"<code>corsOrigins</code> option is now required",id:"corsorigins-option-is-now-required",level:3},{value:"And more",id:"and-more",level:2}];function p(e){const n={a:"a",admonition:"admonition",b:"b",code:"code",em:"em",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",tr:"tr",ul:"ul",video:"video",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.img,{src:"/img/blog/4.0/preview.jpg",alt:"Screenshot of Uppy Dashboard with text outlining the major new features in 4.0"}),"\n",(0,o.jsx)(n.p,{children:"Hold on to your leashes, folks! Uppy 4.0 is here, and it\u2019s more exciting than a\ntennis ball at the dog park! Our beloved Uppy mascot, the adorable coding\ncanine, has been hard at work fetching all the latest updates for you."}),"\n",(0,o.jsx)(n.p,{children:"From a full TypeScript makeover to shiny new React hooks, and even Google Photos\nintegration \u2013 this release is so packed with treats that we\u2019re almost wagging\nour tails in excitement. Without further a-dog, let\u2019s dig into what makes Uppy\n4.0 the goodest of good boys in file uploading!"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://www.producthunt.com/posts/uppy-4-0?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-uppy-4-0",target:"_blank",children:(0,o.jsx)(n.img,{src:"https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=473003&theme=light",alt:"Uppy 4.0 - TypeScript rewrite, Google Photos, and much more | Product Hunt",style:{width:"250px",height:"54px"},width:"250",height:"54"})})}),"\n",(0,o.jsx)(n.h2,{id:"migration-guide",children:"Migration guide"}),"\n",(0,o.jsxs)(n.p,{children:["This post covers the most exciting new features of Uppy 4.0. We have an\naccompanying ",(0,o.jsx)(n.a,{href:"/docs/guides/migration-guides/",children:"migration guide"})," to help you\ntransition to 4.0."]}),"\n",(0,o.jsx)(n.h2,{id:"typescript-rewrite",children:"TypeScript rewrite"}),"\n",(0,o.jsx)(n.p,{children:"In the year 2024, people expect excellent types from their libraries. We used to\nauthor types separately by hand, but they were often inconsistent or incomplete.\nAs of now, Uppy has been completely rewritten in TypeScript!"}),"\n",(0,o.jsx)(n.p,{children:"From now on you\u2019ll be in safe hands when working with Uppy, whether it\u2019s setting\nthe right options, building plugins, or listening to events."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import Uppy from '@uppy/core';\n\nconst uppy = new Uppy();\n\n// Event name autocompletion and inferred argument types\nuppy.on('file-added', (file) => {\n\tconsole.log(file);\n});\n"})}),"\n",(0,o.jsxs)(n.p,{children:["One important thing to note is the new generics on ",(0,o.jsx)(n.code,{children:"@uppy/core"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import Uppy from '@uppy/core';\n// xhr-upload is for uploading to your own back end.\nimport XHRUpload from '@uppy/xhr-upload';\n\n// Your own metadata on files\ntype Meta = { myCustomMetadata: string };\n// The response from your server\ntype Body = { someThingMyBackendReturns: string };\n\nconst uppy = new Uppy<Meta, Body>().use(XHRUpload, {\n\tendpoint: '/upload',\n});\n\nconst id = uppy.addFile({\n\tname: 'example.jpg',\n\tdata: new Blob(),\n\tmeta: { myCustomMetadata: 'foo' },\n});\n\n// This is now typed\nconst { myCustomMetadata } = uppy.getFile(id).meta;\n\nawait uppy.upload();\n\n// This is strictly typed too\nconst { someThingMyBackendReturns } = uppy.getFile(id).response.body!;\n"})}),"\n",(0,o.jsx)(n.p,{children:"Happy inferring!"}),"\n",(0,o.jsx)(n.h2,{id:"merging-the-two-aws-s3-plugins",children:"Merging the two AWS S3 plugins"}),"\n",(0,o.jsxs)(n.p,{children:["We used to have two separate plugins for uploading to S3 and S3-compatible\nservices: ",(0,o.jsx)(n.code,{children:"@uppy/aws-s3"})," and ",(0,o.jsx)(n.code,{children:"@uppy/aws-s3-multpart"}),". They have different use\ncases. The advantages of multipart uploads are:"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Improved throughput \u2013 You can upload parts in parallel to improve throughput."}),"\n",(0,o.jsx)(n.li,{children:"Quick recovery from any network issues \u2013 Smaller part size minimizes the\nimpact of restarting a failed upload due to a network error."}),"\n",(0,o.jsx)(n.li,{children:"Pause and resume object uploads \u2013 You can upload object parts over time. After\nyou initiate a multipart upload, there is no expiry; you must explicitly\ncomplete or stop the multipart upload."}),"\n",(0,o.jsx)(n.li,{children:"Begin an upload before you know the final object size \u2013 You can upload an\nobject as you are creating it."}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"However, the downside is request overhead, as it needs to do creation, signing,\nand completion requests besides the upload requests. For example, if you are\nuploading files that are only a couple kilobytes with a 100ms roundtrip latency,\nyou are spending 400ms on overhead and only a few milliseconds on uploading.\nThis really adds up if you upload a lot of small files."}),"\n",(0,o.jsxs)(n.p,{children:["AWS \u2013 and the internet in general, from what we found \u2013 tends to agree that\n",(0,o.jsx)(n.strong,{children:"you don\u2019t want to use multipart uploads for files under 100 MB"}),". This\nsometimes puts users of our libraries in an awkward position, though, as their\nend users may not exclusively upload very large files, or only small files. In\nthis case, a portion of their users get a subpar experience."]}),"\n",(0,o.jsx)(n.hr,{}),"\n",(0,o.jsxs)(n.p,{children:["We\u2019ve merged the two plugins into ",(0,o.jsx)(n.code,{children:"@uppy/aws-s3"})," with a new\n",(0,o.jsx)(n.a,{href:"/docs/aws-s3/#shouldusemultipartfile",children:(0,o.jsx)(n.code,{children:"shouldUseMultipart"})})," option! By default,\nit switches to multipart uploads if the file is larger than 100 MB. You can pass\na ",(0,o.jsx)(n.code,{children:"boolean"})," or a function to determine this per file."]}),"\n",(0,o.jsx)(n.h2,{id:"react-hooks",children:"React hooks"}),"\n",(0,o.jsx)(n.p,{children:"People working with React are more likely to create their own user interface on\ntop of Uppy than those working with \u201cvanilla\u201d setups. Working with our pre-built\nUI components is a plug-and-play experience, but building on top of Uppy\u2019s state\nwith React primitives has been tedious."}),"\n",(0,o.jsxs)(n.p,{children:["To address this, we\u2019re introducing two new hooks: ",(0,o.jsx)(n.code,{children:"useUppyState"})," and\n",(0,o.jsx)(n.code,{children:"useUppyEvent"}),". Thanks to the TypeScript rewrite, we can now do powerful\ninference in hooks as well."]}),"\n",(0,o.jsx)(n.h3,{id:"useuppystateuppy-selector",children:(0,o.jsx)(n.code,{children:"useUppyState(uppy, selector)"})}),"\n",(0,o.jsx)(n.p,{children:"Use this hook when you need to read Uppy\u2019s state."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { useState } from 'react';\nimport Uppy from '@uppy/core';\nimport { useUppyState } from '@uppy/react';\n\n// IMPORTANT: passing an initializer function\n// to prevent Uppy from being recreated on every render.\nconst [uppy] = useState(() => new Uppy());\n\nconst files = useUppyState(uppy, (state) => state.files);\nconst totalProgress = useUppyState(uppy, (state) => state.totalProgress);\n// We can also get a specific plugin state.\n// Note that the value on `plugins` depends on the `id` of the plugin.\nconst metaFields = useUppyState(\n\tuppy,\n\t(state) => state.plugins?.Dashboard?.metaFields,\n);\n"})}),"\n",(0,o.jsxs)(n.p,{children:["You can see all the values you can access on the\n",(0,o.jsx)(n.a,{href:"https://github.com/transloadit/uppy/blob/dab8082a4e67c3e7f109eacfbd6c3185f117dc60/packages/%40uppy/core/src/Uppy.ts#L156",children:(0,o.jsx)(n.code,{children:"State"})}),"\ntype."]}),"\n",(0,o.jsxs)(n.p,{children:["Using this hook, you can also access the state of any Uppy plugin. For example,\nin order to access the state of ",(0,o.jsx)(n.code,{children:"ImageEditor"}),", you would have to look at the\ntypes of the plugin."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import type { State } from '@uppy/core';\n"})}),"\n",(0,o.jsx)(n.h3,{id:"useuppyeventuppy-event-callback",children:(0,o.jsx)(n.code,{children:"useUppyEvent(uppy, event, callback)"})}),"\n",(0,o.jsxs)(n.p,{children:["Listen to Uppy ",(0,o.jsx)(n.a,{href:"/docs/uppy/#events",children:"events"})," in a React component."]}),"\n",(0,o.jsxs)(n.p,{children:["The hook returns ",(0,o.jsx)(n.code,{children:"[results, clear]"}),". ",(0,o.jsx)(n.code,{children:"results"})," is an array of values from the\nevent. Depending on the event, this can be empty or have up to three values.\n",(0,o.jsx)(n.code,{children:"clear"})," is a function to clear the ",(0,o.jsx)(n.code,{children:"results"})," array."]}),"\n",(0,o.jsx)(n.p,{children:"Values remain in state until the next event (if that ever comes)\xa0or the moment\nwhen the state is manually cleared. Depending on your use case, you may want to\nkeep the values in state or clear the state after something else happened."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import { useState } from 'react';\nimport Uppy from '@uppy/core';\nimport Transloadit from '@uppy/transloadit';\nimport { useUppyEvent } from '@uppy/react';\n\n// IMPORTANT: passing an initializer function\n// to prevent Uppy from being recreated on every render.\nconst [uppy] = useState(() => new Uppy());\n\nconst [results, clearResults] = useUppyEvent(uppy, 'transloadit:result');\nconst [stepName, result, assembly] = results; // strongly typed\n\nuseUppyEvent(uppy, 'cancel-all', () => {\n\t// Handle event here.\n});\n"})}),"\n",(0,o.jsx)(n.h2,{id:"google-photos",children:"Google Photos"}),"\n",(0,o.jsx)(n.p,{children:"An often requested feature is finally here: Google Photos support!"}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsxs)(n.p,{children:["Uppy can bring in files from the cloud with ",(0,o.jsx)(n.a,{href:"/docs/companion/",children:"Companion"}),"."]}),(0,o.jsx)(n.p,{children:"Companion is a hosted, standalone, or middleware server that takes away the\ncomplexity of authentication and the cost of downloading files from remote\nsources, such as Instagram, Google Drive, and others."}),(0,o.jsx)(n.p,{children:"This means a 5 GB video isn\u2019t eating into your users\u2019 data plans and you don\u2019t\nhave to worry about OAuth."})]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/google-photos.mp4",controls:!0})}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.a,{href:"/docs/google-drive/",children:(0,o.jsx)(n.code,{children:"@uppy/google-drive"})})," and\n",(0,o.jsx)(n.a,{href:"/docs/google-photos/",children:(0,o.jsx)(n.code,{children:"@uppy/google-photos"})})," are separate plugins. However, you\ncan use the same OAuth app for both these plugins. Be sure to enable \u201cPhotos\nLibrary API\u201d in your OAuth app, though!"]}),"\n",(0,o.jsx)(n.h2,{id:"ux-improvements-for-viewing-remote-files",children:"UX improvements for viewing remote files"}),"\n",(0,o.jsxs)(n.p,{children:["When using ",(0,o.jsx)(n.a,{href:"/docs/dashboard",children:"Dashboard"})," with any of our remote sources (Google\nDrive, Facebook, etc.) you use our internal ",(0,o.jsx)(n.code,{children:"@uppy/provider-views"})," plugin to\nnavigate the folders and select files. In Uppy 4.0, we are making a few quality\nof life improvements for users. The main changes are described in the table\nbelow."]}),"\n",(0,o.jsxs)(n.table,{style:{textAlign:"left",fontSize:"15px"},children:["\n  ",(0,o.jsxs)(n.tbody,{children:["\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsxs)(n.td,{colSpan:"2",children:["\n        ",(0,o.jsx)(n.b,{style:{fontSize:"17px"},children:"Folder states: checked, unchecked, partial"}),"\n        ",(0,o.jsx)(n.p,{style:{marginBottom:"0"},children:'In 4.0, we introduce a new folder state \u2013 a "partially checked" folder. A folder acquires this state when certain files within the folder are "checked", and other files are "unchecked".'}),"\n      "]}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"PREVIOUSLY"}),"\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"NOW"}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/partial-old.mp4",controls:!0})}),"\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/partial-new.mp4",controls:!0})}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsxs)(n.td,{colSpan:"2",children:["\n        ",(0,o.jsx)(n.b,{style:{fontSize:"17px"},children:"Cache"}),"\n        ",(0,o.jsx)(n.p,{style:{marginBottom:"0"},children:"When navigating in and out of folders, you no longer have to wait for the same API call \u2014 results are cached."}),"\n      "]}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"PREVIOUSLY"}),"\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"NOW"}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/cache-old.mp4",controls:!0})}),"\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/cache-new.mp4",controls:!0})}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsxs)(n.td,{colSpan:"2",children:["\n        ",(0,o.jsx)(n.b,{style:{fontSize:"17px"},children:"Restrictions"}),"\n        ",(0,o.jsxs)(n.p,{style:{marginBottom:"0"},children:["\n          Uppy supports file ",(0,o.jsx)(n.a,{href:"/docs/uppy/#restrictions",children:"restrictions"}),", such as maximum number of files and maximum file size. In 4.0, we reworked our restrictions UI \u2013 users will get immediate feedback upon exceeding the number of selected files, and get a chance to re-enter the correct number of files after their first upload attempt.\n        "]}),"\n      "]}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"PREVIOUSLY"}),"\n      ",(0,o.jsx)(n.th,{style:{paddingTop:"0",paddingBottom:"0"},children:"NOW"}),"\n    "]}),"\n    ",(0,o.jsxs)(n.tr,{children:["\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/restrictions-old.mp4",controls:!0})}),"\n      ",(0,o.jsx)(n.td,{style:{width:"50%"},children:(0,o.jsx)(n.video,{src:"/img/blog/4.0/restrictions-new.mp4",controls:!0})}),"\n    "]}),"\n  "]})]}),"\n",(0,o.jsx)(n.p,{children:"We\u2019re confident this turns our interface for remote sources into the most\nadvanced one out there. We\u2019ve seen some competing libraries not even aggregating\nresults beyond the first page returned by the provider API."}),"\n",(0,o.jsxs)(n.h2,{id:"revamped-options-for-uppyxhr-upload",children:["Revamped options for ",(0,o.jsx)(n.code,{children:"@uppy/xhr-upload"})]}),"\n",(0,o.jsxs)(n.p,{children:["In previous versions, the ",(0,o.jsx)(n.code,{children:"@uppy/xhr-upload"})," plugin had the options\n",(0,o.jsx)(n.code,{children:"getResponseData"}),", ",(0,o.jsx)(n.code,{children:"getResponseError"}),", ",(0,o.jsx)(n.code,{children:"validateStatus"})," and\n",(0,o.jsx)(n.code,{children:"responseUrlFieldName"}),". These were inflexible and too specific. Now we have\nhooks similar to ",(0,o.jsx)(n.code,{children:"@uppy/tus"}),":"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"onBeforeRequest"})," to manipulate the request before it is sent."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"shouldRetry"})," to determine if a request should be retried. By default, three\nretries with exponential backoff. After three attempts it will throw an error,\nregardless of whether you returned ",(0,o.jsx)(n.code,{children:"true"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"onAfterResponse"})," called after a successful response, but before Uppy resolves\nthe upload."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"You could, for instance, use them to refresh your auth token when it expires:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-js",children:"import Uppy from '@uppy/core';\nimport XHR from '@uppy/xhr-upload';\n\nlet token = null;\n\nasync function getAuthToken() {\n\tconst res = await fetch('/auth/token');\n\tconst json = await res.json();\n\treturn json.token;\n}\n\nnew Uppy().use(XHR, {\n\tendpoint: '<your-endpoint>',\n\t// Called again for every retry too.\n\tasync onBeforeRequest(xhr) {\n\t\tif (!token) {\n\t\t\ttoken = await getAuthToken();\n\t\t}\n\t\txhr.setRequestHeader('Authorization', `Bearer ${token}`);\n\t},\n\tasync onAfterResponse(xhr) {\n\t\tif (xhr.status === 401) {\n\t\t\ttoken = await getAuthToken();\n\t\t}\n\t},\n});\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Check out the ",(0,o.jsx)(n.code,{children:"@uppy/xhr-upload"})," ",(0,o.jsx)(n.a,{href:"/docs/xhr-upload/",children:"docs"})," for more info."]}),"\n",(0,o.jsxs)(n.h2,{id:"simpler-configuration-for-uppytransloadit",children:["Simpler configuration for ",(0,o.jsx)(n.code,{children:"@uppy/transloadit"})]}),"\n",(0,o.jsxs)(n.p,{children:["To get started with ",(0,o.jsx)(n.code,{children:"@uppy/transloadit"}),", you would configure\n",(0,o.jsx)(n.a,{href:"/docs/transloadit/#assemblyoptions",children:(0,o.jsx)(n.code,{children:"assemblyOptions"})})," with your auth key,\ntemplate ID, and other optional values. ",(0,o.jsx)(n.code,{children:"assemblyOptions"})," can be an object or a\nfunction, which is called per file, which returns an object:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'{\n\t"params": {\n\t\t"auth": { "key": "key-from-transloadit" },\n\t\t"template_id": "id-from-transloadit",\n\t\t"steps": {\n\t\t\t// Overruling Template at runtime\n\t\t},\n\t\t"notify_url": "https://your-domain.com/assembly-status"\n\t},\n\t"signature": "generated-signature",\n\t"fields": {\n\t\t// Dynamic or static fields to send along\n\t}\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["When you go to production, you always want to make sure to set the ",(0,o.jsx)(n.code,{children:"signature"}),".\n",(0,o.jsxs)(n.strong,{children:["Not using\n",(0,o.jsx)(n.a,{href:"https://transloadit.com/docs/topics/signature-authentication/",children:"Signature Authentication"}),"\ncan be a security risk"]}),". Signature Authentication is a security measure that\ncan prevent outsiders from tampering with your Assembly Instructions."]}),"\n",(0,o.jsx)(n.p,{children:"This means the majority of implementers will write something like this, as\nrecommended:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"import Uppy from '@uppy/core';\nimport Transloadit, { type AssemblyOptions } from '@uppy/transloadit';\n\nnew Uppy().use(Transloadit, {\n\tasync assemblyOptions(file) {\n\t\tconst response = await fetch('/transloadit-params');\n\t\treturn response.json() as AssemblyOptions;\n\t},\n});\n"})}),"\n",(0,o.jsxs)(n.p,{children:["However, now you are making a request to your back end for ",(0,o.jsx)(n.em,{children:"every file"}),", while\nthe response likely remains the same, unless you are setting dynamic ",(0,o.jsx)(n.code,{children:"fields"}),"\nper file."]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"This has now been improved to"}),":"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Only call ",(0,o.jsx)(n.code,{children:"assemblyOptions()"})," once."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"fields"})," is for global variables in your\n",(0,o.jsx)(n.a,{href:"https://transloadit.com/docs/topics/templates/",children:"template"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:["All metadata on your files is automatically sent along to Transloadit. This\nwill end up in ",(0,o.jsx)(n.code,{children:"file.user_meta"})," for you to dynamically access in your Template\n",(0,o.jsx)(n.em,{children:"per file"}),"."]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["You can read more about Assembly Variables in the\n",(0,o.jsx)(n.a,{href:"https://transloadit.com/docs/topics/assembly-variables/",children:"docs"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"companion",children:"Companion"}),"\n",(0,o.jsx)(n.h3,{id:"streaming-uploads-by-default",children:"Streaming uploads by default"}),"\n",(0,o.jsxs)(n.p,{children:["Streaming uploads are now the default in Companion. This comes with greatly\nimproved upload speeds and allows uploading up to hundreds of gigabytes without\nneeding a large server storage. We found that this improves speeds by about 37%\nfor a Google Drive upload of a 1 GB file\n(",(0,o.jsx)(n.a,{href:"https://github.com/transloadit/uppy/pull/4046#issuecomment-1235697937",children:"source"}),").\nThis feature was also available before, but we wanted to have more real-world\nusage before setting it as the default."]}),"\n",(0,o.jsx)(n.p,{children:"With streaming upload disabled, the whole file will be downloaded first. The\nupload will then start when the download has completely finished."}),"\n",(0,o.jsx)(n.p,{children:"When streaming upload is enabled, Companion will start downloading the file from\nthe provider (such as Google Drive), while at the same time starting the upload\nto the destination (such as Tus), and sending every chunk of data consecutively."}),"\n",(0,o.jsxs)(n.p,{children:["For more information, see the ",(0,o.jsx)(n.a,{href:"/docs/companion/",children:"Companion docs"}),"."]}),"\n",(0,o.jsxs)(n.h3,{id:"corsorigins-option-is-now-required",children:[(0,o.jsx)(n.code,{children:"corsOrigins"})," option is now required"]}),"\n",(0,o.jsxs)(n.p,{children:["As a security measure, we now require the\n",(0,o.jsx)(n.a,{href:"/docs/companion/#corsorigins",children:(0,o.jsx)(n.code,{children:"corsOrigins"})})," option to be set."]}),"\n",(0,o.jsxs)(n.p,{children:["It serves two purposes: it sets the ",(0,o.jsx)(n.code,{children:"Access-Control-Allow-Origin"})," header as well\nas the target origin for ",(0,o.jsx)(n.code,{children:"window.postMessage()"}),", which is needed to communicate\nthe OAuth token from the new tab you used to log in to a provider back to\nCompanion."]}),"\n",(0,o.jsx)(n.h2,{id:"and-more",children:"And more"}),"\n",(0,o.jsx)(n.p,{children:"The 4.0 release contains over 170 contributions, many too small to mention, but\ntogether resulting in Uppy continuing to grow and improve. We closely listen to\nthe community and are always looking for ways to improve the experience, for\nusers and developers alike."}),"\n",(0,o.jsxs)(n.p,{children:["Ready to upgrade? Be sure to check out the\n",(0,o.jsx)(n.a,{href:"/docs/guides/migration-guides/",children:"migration guide"}),"."]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://www.producthunt.com/posts/uppy-4-0?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-uppy-4-0",target:"_blank",children:(0,o.jsx)(n.img,{src:"https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=473003&theme=light",alt:"Uppy 4.0 - TypeScript rewrite, Google Photos, and much more | Product Hunt",style:{width:"250px",height:"54px"},width:"250",height:"54"})})})]})}function c(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>a});var o=t(96540);const s={},i=o.createContext(s);function r(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);