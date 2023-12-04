"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[2889],{15001:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>t,toc:()=>r});var i=s(85893),a=s(11151);const d={title:"Uppy 1.26: Dashboard \u201cdisabled\u201d, per-file headers",date:new Date("2021-02-26T00:00:00.000Z"),authors:["arturi"],image:"https://uppy.io/img/blog/1.26/dashboard-disabled.jpg",published:!0,slug:"2021/02/1.26"},o=void 0,t={permalink:"/blog/2021/02/1.26",editUrl:"https://github.com/transloadit/uppy.io/tree/main/blog/2021-02-1.26.md",source:"@site/blog/2021-02-1.26.md",title:"Uppy 1.26: Dashboard \u201cdisabled\u201d, per-file headers",description:"Uppy 1.26 brings a new disabled option for the Dashboad, ability to set",date:"2021-02-26T00:00:00.000Z",formattedDate:"February 26, 2021",tags:[],readingTime:1.775,hasTruncateMarker:!0,authors:[{email:"artur@transloadit.com",name:"Artur Paikin",id:"artur",tagline:"Developer",imageURL:"https://github.com/arturi.png",key:"arturi"}],frontMatter:{title:"Uppy 1.26: Dashboard \u201cdisabled\u201d, per-file headers",date:"2021-02-26T00:00:00.000Z",authors:["arturi"],image:"https://uppy.io/img/blog/1.26/dashboard-disabled.jpg",published:!0,slug:"2021/02/1.26"},unlisted:!1,prevItem:{title:"Uppy 1.27: Drop Target plugin, Vue 3 support, Dashboard dynamic meta fields, \u201cShared with me\u201d in Google Drive",permalink:"/blog/2021/04/1.27"},nextItem:{title:"Uppy 1.25: right-to-left scripts, Ukrainian translation, Companion improvements",permalink:"/blog/2021/01/1.25"}},l={authorsImageUrls:[void 0]},r=[{value:"Dashboard \u201cDisabled\u201d",id:"dashboard-disabled",level:2},{value:"XHR Upload Per File headers",id:"xhr-upload-per-file-headers",level:2},{value:"Build System Improvements",id:"build-system-improvements",level:2},{value:"Transloadit Plugin",id:"transloadit-plugin",level:2},{value:"Misc",id:"misc",level:2}];function p(e){const n={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",source:"source",ul:"ul",video:"video",...(0,a.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["Uppy 1.26 brings a new ",(0,i.jsx)(n.code,{children:"disabled"})," option for the Dashboad, ability to set\nheaders per file with XHR Upload, and fixes for the Transloadit plugin."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Uppy Dashboard UI with disabled state",src:s(65151).Z+"",width:"1219",height:"959"})}),"\n",(0,i.jsx)(n.h2,{id:"dashboard-disabled",children:"Dashboard \u201cDisabled\u201d"}),"\n",(0,i.jsxs)(n.p,{children:["You can now specify a ",(0,i.jsx)(n.code,{children:"disabled"})," option for the Dashboard, in order to make it\nnon-interactive and grayed out. Users won\u2019t be able to click on buttons or drop\nfiles."]}),"\n",(0,i.jsx)(n.p,{children:"This is useful when you need to confitionally enable/disable file uploading or\nmanipulation, based on a condition in your app."}),"\n",(0,i.jsxs)(n.video,{alt:"Demo video showing Uppy with Dashboard disabled vs enabled state",poster:"/img/blog/1.26/dashboard-disabled.jpg",muted:!0,autoPlay:!0,loop:!0,children:["\n  ",(0,i.jsx)(n.source,{src:"/img/blog/1.26/dashboard-disabled-vs-enabled.mp4",type:"video/mp4"}),"\n  Your browser does not support the video tag: https://uppy.io/img/blog/img/blog/1.26/dashboard-disabled-vs-enabled.mp4\n"]}),"\n",(0,i.jsx)(n.p,{children:"This option can be set on init:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"uppy.use(Dashboard, {\n\tdisabled: true,\n});\n"})}),"\n",(0,i.jsx)(n.p,{children:"and via API:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"const dashboard = uppy.getPlugin('Dashboard');\ndashboard.setOptions({ disabled: true });\n\nuserNameInput.addEventListener('change', () => {\n\tdashboard.setOptions({ disabled: false });\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://uppy.io/docs/dashboard/#disabled-false",children:"See the docs"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"xhr-upload-per-file-headers",children:"XHR Upload Per File headers"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"@uppy/xhr-upload"})," now accept a ",(0,i.jsx)(n.code,{children:"headers: (file) => {}"})," function, so you can do:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"uppy.use(XHRUpload, {\n\theaders: (file) => ({\n\t\tauthorization: `bearer ${global.userToken}`,\n\t\t'header-name': file.meta.someMetaValue,\n\t}),\n});\n"})}),"\n",(0,i.jsx)(n.p,{children:"to determine file-specific headers."}),"\n",(0,i.jsxs)(n.p,{children:["The function syntax for ",(0,i.jsx)(n.code,{children:"headers"})," is only available if the ",(0,i.jsx)(n.code,{children:"bundle"})," option is\n",(0,i.jsx)(n.code,{children:"false"})," (the default). ",(0,i.jsx)(n.code,{children:"bundle"})," uploads share only one set of headers."]}),"\n",(0,i.jsx)(n.h2,{id:"build-system-improvements",children:"Build System Improvements"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"build: set legacy-peer-deps for npm 7. We have some peerDependency mismatches\nin our install tree. In npm 6 this was OK (maybe reason for a warning) but in\nnpm 7 they hard fail the install"}),"\n",(0,i.jsx)(n.li,{children:"build: added npm version check (33e656cad32b865f960dbd88abf4d3839c8377f0 /\n@goto-bus-stop)"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"transloadit-plugin",children:"Transloadit Plugin"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Fixed a case where the plugin used stale file data."}),"\n",(0,i.jsx)(n.li,{children:"Fixed polling fallback bugs."}),"\n",(0,i.jsx)(n.li,{children:"Url concatenation is now more robust."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"misc",children:"Misc"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"@uppy/companion: Docker tag release (#2771 / @kiloreux)"}),"\n",(0,i.jsx)(n.li,{children:"@uppy/companion: Companion should respect previously set value for\nAccesss-Control-Allow-Methods (#2726 / @tim-kos, @mifi, @so-steve)"}),"\n",(0,i.jsx)(n.li,{children:"@uppy/transloadit: fix polling fallback bugs (#2759 / @goto-bus-stop)"}),"\n",(0,i.jsx)(n.li,{children:"@uppy/utils: added mp4 file type support \u2014 Safari 14.0 on Mac records audio\nusing audio/mp4 MIME type which isn't currently recognised by Uppy (#2753 /\n@dominiceden)"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["See\n",(0,i.jsx)(n.a,{href:"https://github.com/transloadit/uppy/blob/master/CHANGELOG.md#1260",children:"changelog"}),"\nfor details."]})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},65151:(e,n,s)=>{s.d(n,{Z:()=>i});const i=s.p+"assets/images/dashboard-disabled-6df98c5e4209d6d4290c96d100fe9617.jpg"},11151:(e,n,s)=>{s.d(n,{Z:()=>t,a:()=>o});var i=s(67294);const a={},d=i.createContext(a);function o(e){const n=i.useContext(d);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),i.createElement(d.Provider,{value:n},e.children)}}}]);