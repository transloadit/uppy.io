"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[2387],{25103:(e,t,n)=>{n.d(t,{Z:()=>d});var o=n(67294),i=n(90814),a=n(23612),r=n(56482);const{version:s}=r;function d(e){let{children:t,uppyCssName:n="uppy.min.css",uppyJsName:r="uppy.min.mjs"}=e,d=[];o.Children.toArray(t).forEach((e=>{d=[...d,...String(e).trim().split("\n").map((e=>e.trim()))]}));const l=d.map((e=>`  ${e}`)).join("\n"),p=`https://releases.transloadit.com/uppy/v${s}/${r}`,u=`\x3c!-- 1. Add CSS to \`<head>\` --\x3e\n<link href="https://releases.transloadit.com/uppy/v${s}/${n}" rel="stylesheet">\n\n\x3c!-- 2. Initialize --\x3e\n<div id="uppy"></div>\n\n<script type="module">\n${l.replace(/{{UPPY_JS_URL}}/g,p)}\n<\/script>\n`;return o.createElement(o.Fragment,null,o.createElement(a.Z,{type:"caution"},o.createElement("p",null,"The bundle consists of most Uppy plugins, so this method is not recommended for production, as your users will have to download all plugins when you are likely using only a few."),o.createElement("p",null,"It can be useful to speed up your development environment, so don't hesitate to use it to get you started.")),o.createElement(i.Z,{language:"html"},u))}},63671:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>b,frontMatter:()=>d,metadata:()=>p,toc:()=>c});var o=n(87462),i=(n(67294),n(3905)),a=n(74866),r=n(85162),s=n(25103);const d={sidebar_position:3,slug:"/audio"},l="Audio",p={unversionedId:"sources/audio",id:"sources/audio",title:"Audio",description:"The @uppy/audio plugin lets you record audio using a built-in or external",source:"@site/docs/sources/audio.mdx",sourceDirName:"sources",slug:"/audio",permalink:"/docs/audio",draft:!1,editUrl:"https://github.com/transloadit/uppy.io/tree/main/docs/sources/audio.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,slug:"/audio"},sidebar:"tutorialSidebar",previous:{title:"Screen capture",permalink:"/docs/screen-capture"},next:{title:"Box",permalink:"/docs/box"}},u={},c=[{value:"When should I use this?",id:"when-should-i-use-this",level:2},{value:"Install",id:"install",level:2},{value:"Use",id:"use",level:2},{value:"API",id:"api",level:3},{value:"Options",id:"options",level:3},{value:"<code>id</code>",id:"id",level:4},{value:"<code>title</code>",id:"title",level:4},{value:"<code>target</code>",id:"target",level:4},{value:"<code>showAudioSourceDropdown</code>",id:"showaudiosourcedropdown",level:3},{value:"<code>locale</code>",id:"locale",level:4}],h={toc:c},m="wrapper";function b(e){let{components:t,...n}=e;return(0,i.kt)(m,(0,o.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"audio"},"Audio"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"@uppy/audio")," plugin lets you record audio using a built-in or external\nmicrophone, or any other audio device, on desktop and mobile. The UI shows real\ntime sound wavelength when recording."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("a",{parentName:"p",href:"/examples"},"Try out the live example")," or take it for a spin in\n",(0,i.kt)("a",{parentName:"p",href:"https://codesandbox.io/s/uppy-dashboard-xpxuhd"},"CodeSandbox"),".")),(0,i.kt)("h2",{id:"when-should-i-use-this"},"When should I use this?"),(0,i.kt)("p",null,"When you want users to record audio on their computer."),(0,i.kt)("h2",{id:"install"},"Install"),(0,i.kt)(a.Z,{mdxType:"Tabs"},(0,i.kt)(r.Z,{value:"npm",label:"NPM",default:!0,mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"npm install @uppy/audio\n"))),(0,i.kt)(r.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"yarn add @uppy/audio\n"))),(0,i.kt)(r.Z,{value:"cdn",label:"CDN",mdxType:"TabItem"},(0,i.kt)(s.Z,{mdxType:"UppyCdnExample"},"\n        import { Uppy, Dashboard, Audio } from \"{{UPPY_JS_URL}}\"\n        const uppy = new Uppy()\n        uppy.use(Dashboard, { inline: true, target: 'body' })\n        uppy.use(Audio, { target: Uppy.Dashboard })\n      "))),(0,i.kt)("h2",{id:"use"},"Use"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:"{3,7,11} showLineNumbers","{3,7,11}":!0,showLineNumbers:!0},"import Uppy from '@uppy/core';\nimport Dashboard from '@uppy/dashboard';\nimport Audio from '@uppy/audio';\n\nimport '@uppy/core/dist/style.min.css';\nimport '@uppy/dashboard/dist/style.min.css';\nimport '@uppy/audio/dist/style.min.css';\n\nnew Uppy()\n    .use(Dashboard, { inline: true, target: 'body' })\n    .use(Audio, { target: Dashboard });\n")),(0,i.kt)("h3",{id:"api"},"API"),(0,i.kt)("h3",{id:"options"},"Options"),(0,i.kt)("h4",{id:"id"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")),(0,i.kt)("p",null,"A unique identifier for this plugin (",(0,i.kt)("inlineCode",{parentName:"p"},"string"),", default: ",(0,i.kt)("inlineCode",{parentName:"p"},"'audio'"),")."),(0,i.kt)("h4",{id:"title"},(0,i.kt)("inlineCode",{parentName:"h4"},"title")),(0,i.kt)("p",null,"Configures the title / name shown in the UI, for instance, on Dashboard tabs\n(",(0,i.kt)("inlineCode",{parentName:"p"},"string"),", default: ",(0,i.kt)("inlineCode",{parentName:"p"},"'Audio'"),")."),(0,i.kt)("h4",{id:"target"},(0,i.kt)("inlineCode",{parentName:"h4"},"target")),(0,i.kt)("p",null,"DOM element, CSS selector, or plugin to place the drag and drop area into\n(",(0,i.kt)("inlineCode",{parentName:"p"},"string")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"Element"),", default: ",(0,i.kt)("inlineCode",{parentName:"p"},"null"),")."),(0,i.kt)("h3",{id:"showaudiosourcedropdown"},(0,i.kt)("inlineCode",{parentName:"h3"},"showAudioSourceDropdown")),(0,i.kt)("p",null,"Configures whether to show a dropdown to select audio device (",(0,i.kt)("inlineCode",{parentName:"p"},"boolean"),",\ndefault: ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),")."),(0,i.kt)("h4",{id:"locale"},(0,i.kt)("inlineCode",{parentName:"h4"},"locale")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"export default {\n    strings: {\n        pluginNameAudio: 'Audio',\n        // Used as the label for the button that starts an audio recording.\n        // This is not visibly rendered but is picked up by screen readers.\n        startAudioRecording: 'Begin audio recording',\n        // Used as the label for the button that stops an audio recording.\n        // This is not visibly rendered but is picked up by screen readers.\n        stopAudioRecording: 'Stop audio recording',\n        // Title on the \u201callow access\u201d screen\n        allowAudioAccessTitle: 'Please allow access to your microphone',\n        // Description on the \u201callow access\u201d screen\n        allowAudioAccessDescription:\n            'In order to record audio, please allow microphone access for this site.',\n        // Title on the \u201cdevice not available\u201d screen\n        noAudioTitle: 'Microphone Not Available',\n        // Description on the \u201cdevice not available\u201d screen\n        noAudioDescription:\n            'In order to record audio, please connect a microphone or another audio input device',\n        // Message about file size will be shown in an Informer bubble\n        recordingStoppedMaxSize:\n            'Recording stopped because the file size is about to exceed the limit',\n        // Used as the label for the counter that shows recording length (`1:25`).\n        // This is not visibly rendered but is picked up by screen readers.\n        recordingLength: 'Recording length %{recording_length}',\n        // Used as the label for the submit checkmark button.\n        // This is not visibly rendered but is picked up by screen readers.\n        submitRecordedFile: 'Submit recorded file',\n        // Used as the label for the discard cross button.\n        // This is not visibly rendered but is picked up by screen readers.\n        discardRecordedFile: 'Discard recorded file',\n    },\n};\n")))}b.isMDXComponent=!0}}]);