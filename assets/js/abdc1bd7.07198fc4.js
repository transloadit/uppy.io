"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[7892],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var o=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),l=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return o.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),c=l(n),m=r,h=c["".concat(s,".").concat(m)]||c[m]||d[m]||a;return n?o.createElement(h,i(i({ref:t},u),{},{components:n})):o.createElement(h,i({ref:t},u))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=m;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p[c]="string"==typeof e?e:r,i[1]=p;for(var l=2;l<a;l++)i[l]=n[l];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3453:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>p,toc:()=>l});var o=n(87462),r=(n(67294),n(3905));const a={title:"New Uppy.io and docs",date:new Date("2023-05-10T00:00:00.000Z"),authors:["murderlon","arturi","aduh95"],image:"/img/blog/new-website/homepage.png",published:!0},i=void 0,p={permalink:"/blog/2023-05-new-website",editUrl:"https://github.com/transloadit/uppy.io/tree/main/blog/2023-05-new-website.md",source:"@site/blog/2023-05-new-website.md",title:"New Uppy.io and docs",description:"We are excited to announce that our new website, documentation and blog are now",date:"2023-05-10T00:00:00.000Z",formattedDate:"May 10, 2023",tags:[],readingTime:1.08,hasTruncateMarker:!1,authors:[{email:"merlijn@transloadit.com",name:"Merlijn Vos",id:"merlijn",tagline:"Developer",imageURL:"https://github.com/murderlon.png",key:"murderlon"},{email:"artur@transloadit.com",name:"Artur Paikin",id:"artur",tagline:"Developer",imageURL:"https://github.com/arturi.png",key:"arturi"},{email:"antoine@transloadit.com",name:"Antoine du Hamel",id:"aduh95",tagline:"Developer",imageURL:"https://github.com/aduh95.png",key:"aduh95"}],frontMatter:{title:"New Uppy.io and docs",date:"2023-05-10T00:00:00.000Z",authors:["murderlon","arturi","aduh95"],image:"/img/blog/new-website/homepage.png",published:!0},prevItem:{title:"Uppy 3.3 to 3.13: conditional S3 multipart, signing on the client, speedy handling of 10k files and much much more",permalink:"/blog/2023/07/3.3-3.13"},nextItem:{title:"\ud83c\udf84 Uppy 3.1-3.3: Improved AWS S3 Multipart, Single File Mode",permalink:"/blog/2022/12/3.3"}},s={authorsImageUrls:[void 0,void 0,void 0]},l=[],u={toc:l},c="wrapper";function d(e){let{components:t,...a}=e;return(0,r.kt)(c,(0,o.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("img",{src:"/img/blog/new-website/homepage.png",className:"border",alt:"Screenshot of the new Uppy website homepage"}),(0,r.kt)("p",null,"We are excited to announce that our new website, documentation and blog are now\nlive out of beta, ready for you to enjoy on ",(0,r.kt)("a",{parentName:"p",href:"https://uppy.io"},"Uppy.io"),"! Let us\nknow what you think ",(0,r.kt)("a",{parentName:"p",href:"https://twitter.com/uppy_io"},"on twitter"),"."),(0,r.kt)("p",null,"The first iteration of the Uppy website was built by Artur and Kevin over 7\nyears ago, using ",(0,r.kt)("a",{parentName:"p",href:"https://hexo.io/"},"Hexo")," static site generator as a base. It\nserved us well, but over time Hexo got less maintained, our docs more messy, and\nquite a few places were collecting dust."),(0,r.kt)("p",null,"About a year ago Merlijn set on a task to refresh the Uppy documentation\nexperience, rewriting most of the docs from the ground up, with everyone on the\nteam contributing in their area of Uppy knowledge.\n",(0,r.kt)("a",{parentName:"p",href:"https://docusaurus.io/"},"Docusaurus")," \ud83e\udd95 was chosen as one of the top modern\ntools for documentation."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Screenshot of the Uppy website showing a documentation page with new design",src:n(72136).Z,width:"3410",height:"2002"})),(0,r.kt)("p",null,"Most of the plugin\u2019s docs now explain when you should use it (and sometimes when\nnot), followed by how to install, tips and details and links to CodeSandbox\nsamples."),(0,r.kt)("p",null,"And for desert, we now have a swift website-wide search in the top bar, powered\nby ",(0,r.kt)("a",{parentName:"p",href:"https://www.algolia.com"},"Algolia"),", give it a go!"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Screenshot of the Uppy website showing the search interface",src:n(96752).Z,width:"3450",height:"1832"})),(0,r.kt)("p",null,"Enjoy the new ",(0,r.kt)("a",{parentName:"p",href:"https://uppy.io"},"uppy.io"),"!"))}d.isMDXComponent=!0},72136:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/dashboard-docs-e2995a541161834109482c6667565081.png"},96752:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/search-9d346638aecf9ab33680181a8f7f821a.png"}}]);