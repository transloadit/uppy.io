"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[8958],{36404:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>o,metadata:()=>a,toc:()=>p});var t=s(74848),i=s(28453);const o={title:"Uppy 0.26: Lerna",date:new Date("2018-07-12T00:00:00.000Z"),author:"renee",image:"https://uppy.io/img/blog/0.26/uppy-multiple-packages.png",published:!0,slug:"2018/07/0.26"},r=void 0,a={permalink:"/blog/2018/07/0.26",editUrl:"https://github.com/transloadit/uppy.io/tree/main/blog/2018-07-0.26.md",source:"@site/blog/2018-07-0.26.md",title:"Uppy 0.26: Lerna",description:"Uppy 0.26 replaces the monolithic Uppy package with a separate npm package for",date:"2018-07-12T00:00:00.000Z",tags:[],readingTime:2.56,hasTruncateMarker:!0,authors:[{name:"renee"}],frontMatter:{title:"Uppy 0.26: Lerna",date:"2018-07-12T00:00:00.000Z",author:"renee",image:"https://uppy.io/img/blog/0.26/uppy-multiple-packages.png",published:!0,slug:"2018/07/0.26"},unlisted:!1,prevItem:{title:"Uppy 0.27: First Swing at React Native Support",permalink:"/blog/2018/08/0.27"},nextItem:{title:"Uppy 0.25: Drag & Drop Links Urls & Images, Improved File Selecting in Providers, Interactive Components In i18n",permalink:"/blog/2018/06/0.25"}},l={authorsImageUrls:[void 0]},p=[{value:"Lerna",id:"lerna",level:2},{value:"Typings",id:"typings",level:2},{value:"Documentation Updates",id:"documentation-updates",level:2},{value:"Renaming the <code>host</code> Option in Remote Providers",id:"renaming-the-host-option-in-remote-providers",level:2},{value:"Other Cool Changes",id:"other-cool-changes",level:2}];function d(e){const n={a:"a",code:"code",em:"em",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Uppy 0.26 replaces the monolithic Uppy package with a separate npm package for\nevery plugin."}),"\n",(0,t.jsx)(n.img,{width:"448",src:"/img/blog/0.26/uppy-multiple-packages.png"}),"\n",(0,t.jsx)(n.h2,{id:"lerna",children:"Lerna"}),"\n",(0,t.jsxs)(n.p,{children:["\u26a0\ufe0f ",(0,t.jsx)(n.strong,{children:"breaking"})]}),"\n",(0,t.jsxs)(n.p,{children:["All Uppy plugins have moved into their own npm packages. This means you need to\ninstall the plugins you use separately in the future, and you have to update all\nyour Uppy ",(0,t.jsx)(n.code,{children:"require()"})," calls or ",(0,t.jsx)(n.code,{children:"import"})," paths."]}),"\n",(0,t.jsxs)(n.p,{children:["The packages are published under the ",(0,t.jsx)(n.code,{children:"@uppy"})," scope on npm:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm install @uppy/core @uppy/dashboard @uppy/tus\n"})}),"\n",(0,t.jsx)(n.p,{children:"This has some benefits, like:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["No need to know the file path of a plugin\u2014use ",(0,t.jsx)(n.code,{children:"@uppy/dashboard"})," instead of\n",(0,t.jsx)(n.code,{children:"uppy/lib/plugins/Dashboard"}),". This also allows us to move our file structure\naround internally without breaking everyone."]}),"\n",(0,t.jsxs)(n.li,{children:["Only have the code you actually use in ",(0,t.jsx)(n.code,{children:"node_modules"}),"\u2014large plugin\ndependencies are not installed if you don't use the plugin."]}),"\n",(0,t.jsx)(n.li,{children:"Separate versioning allows making breaking changes in plugins, without\nrequiring users of other unrelated plugins to upgrade."}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["You can still use the ",(0,t.jsx)(n.code,{children:"uppy"})," package for now to simplify upgrading, although it\nmay be deprecated in the future. It installs all the ",(0,t.jsx)(n.code,{children:"@uppy/"})," packages and\nre-exports them:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const { Core, Dashboard, Tus } = require('uppy');\n"})}),"\n",(0,t.jsxs)(n.p,{children:["It's very important to set up tree shaking when using Uppy in this way;\notherwise you may include dozens of KBs of unused plugins. Using the ",(0,t.jsx)(n.code,{children:"@uppy/"}),"\npackages instead is strongly recommended, as those do not include unused code in\nthe first place."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Uppy = require('@uppy/core');\nconst Dashboard = require('@uppy/dashboard');\nconst Tus = require('@uppy/tus');\n"})}),"\n",(0,t.jsxs)(n.p,{children:["The CSS required for plugins is included in each package at ",(0,t.jsx)(n.code,{children:"dist/style.css"}),".\nEach plugin contains ",(0,t.jsx)(n.em,{children:"all"})," the CSS it needs, eg. the Dashboard includes Status\nBar CSS. If you use both plugins, only include the Dashboard CSS file. Even\nbetter is to use a CSS minifier so any duplicate styles are removed for you :)\nCaveats like this are documented on the plugin pages, and hopefully we can\nsmooth it out over time!"]}),"\n",(0,t.jsx)(n.h2,{id:"typings",children:"Typings"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/taoqf",children:"@taoqf"})," contributed TypeScript typings to 0.25\u20140.26\nmoves those into each package and adds a few missing ones."]}),"\n",(0,t.jsx)(n.p,{children:"We're not TypeScript experts ourselves, so feedback, bug reports & PRs are very\nmuch appreciated \u2728"}),"\n",(0,t.jsx)(n.h2,{id:"documentation-updates",children:"Documentation Updates"}),"\n",(0,t.jsxs)(n.p,{children:["The documentation sidebar now lists plugins in several sections. This should\nmake it easier to navigate. Of course, each plugin page now lists the\n",(0,t.jsx)(n.code,{children:"npm install"})," instruction needed to install it, too!"]}),"\n",(0,t.jsxs)(n.h2,{id:"renaming-the-host-option-in-remote-providers",children:["Renaming the ",(0,t.jsx)(n.code,{children:"host"})," Option in Remote Providers"]}),"\n",(0,t.jsxs)(n.p,{children:["\u26a0\ufe0f ",(0,t.jsx)(n.strong,{children:"breaking"})]}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"host"})," name in remote provider plugins was not great\u2014for one, it could be a\nURL to an Uppy Server running in a subdirectory, not a hostname. As of 0.26,\n",(0,t.jsx)(n.code,{children:"serverUrl"})," should be used instead."]}),"\n",(0,t.jsx)(n.h2,{id:"other-cool-changes",children:"Other Cool Changes"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["providers: Add ",(0,t.jsx)(n.code,{children:"serverPattern"})," option for third party authentication\nvalidation on dynamic Uppy Server hostnames (@ifedapoolarewaju)"]}),"\n",(0,t.jsx)(n.li,{children:"thumbnailgenerator: Polyfill Math.log2 since IE11 doesn't support this method\n(#892 / @DJWassink)"}),"\n",(0,t.jsx)(n.li,{children:"dashboard: added browser back button listening (#575 / @zcallan)"}),"\n",(0,t.jsx)(n.li,{children:"providers: Better provider errors (#895 / @arturi)"}),"\n",(0,t.jsx)(n.li,{children:"xhr-upload: Add withCredentials option (#874 / @tuoxiansp)"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["See\n",(0,t.jsx)(n.a,{href:"https://github.com/transloadit/uppy/blob/master/CHANGELOG.md#0260",children:"full changelog (0.26 and 0.25.x patches) for more"})]}),"\n",(0,t.jsx)(n.p,{children:"See you in the next release!"}),"\n",(0,t.jsx)(n.p,{children:"The Uppy Team"})]})}function c(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>a});var t=s(96540);const i={},o=t.createContext(i);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);