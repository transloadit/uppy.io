"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[3249],{73858:(e,t,n)=>{n.r(t),n.d(t,{default:()=>j});n(96540);var s=n(18215),l=n(45500),o=n(17559),i=n(7131),a=n(26535),r=n(70354),c=n(21312),d=n(39022),u=n(74848);function m(e){const{nextItem:t,prevItem:n}=e;return(0,u.jsxs)("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,c.T)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"}),children:[n&&(0,u.jsx)(d.A,{...n,subLabel:(0,u.jsx)(c.A,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post",children:"Newer Post"})}),t&&(0,u.jsx)(d.A,{...t,subLabel:(0,u.jsx)(c.A,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post",children:"Older Post"}),isNext:!0})]})}function h(){const{assets:e,metadata:t}=(0,i.e)(),{title:n,description:s,date:o,tags:a,authors:r,frontMatter:c}=t,{keywords:d}=c,m=e.image??c.image;return(0,u.jsxs)(l.be,{title:n,description:s,keywords:d,image:m,children:[(0,u.jsx)("meta",{property:"og:type",content:"article"}),(0,u.jsx)("meta",{property:"article:published_time",content:o}),r.some((e=>e.url))&&(0,u.jsx)("meta",{property:"article:author",content:r.map((e=>e.url)).filter(Boolean).join(",")}),a.length>0&&(0,u.jsx)("meta",{property:"article:tag",content:a.map((e=>e.label)).join(",")})]})}var g=n(5260),f=n(6676);function p(){const e=(0,f.J)();return(0,u.jsx)(g.A,{children:(0,u.jsx)("script",{type:"application/ld+json",children:JSON.stringify(e)})})}var x=n(67763),v=n(50996);function b(e){let{sidebar:t,children:n}=e;const{metadata:s,toc:l}=(0,i.e)(),{nextItem:o,prevItem:c,frontMatter:d,unlisted:h}=s,{hide_table_of_contents:g,toc_min_heading_level:f,toc_max_heading_level:p}=d;return(0,u.jsxs)(a.A,{sidebar:t,toc:!g&&l.length>0?(0,u.jsx)(x.A,{toc:l,minHeadingLevel:f,maxHeadingLevel:p}):void 0,children:[h&&(0,u.jsx)(v.A,{}),(0,u.jsx)(r.A,{children:n}),(o||c)&&(0,u.jsx)(m,{nextItem:o,prevItem:c})]})}function j(e){const t=e.content;return(0,u.jsx)(i.i,{content:e.content,isBlogPostPage:!0,children:(0,u.jsxs)(l.e3,{className:(0,s.A)(o.G.wrapper.blogPages,o.G.page.blogPostPage),children:[(0,u.jsx)(h,{}),(0,u.jsx)(p,{}),(0,u.jsx)(b,{sidebar:e.sidebar,children:(0,u.jsx)(t,{})})]})})}},67763:(e,t,n)=>{n.d(t,{A:()=>c});n(96540);var s=n(18215),l=n(65195);const o={tableOfContents:"tableOfContents_bqdL",docItemContainer:"docItemContainer_F8PC"};var i=n(74848);const a="table-of-contents__link toc-highlight",r="table-of-contents__link--active";function c(e){let{className:t,...n}=e;return(0,i.jsx)("div",{className:(0,s.A)(o.tableOfContents,"thin-scrollbar",t),children:(0,i.jsx)(l.A,{...n,linkClassName:a,linkActiveClassName:r})})}},65195:(e,t,n)=>{n.d(t,{A:()=>f});var s=n(96540),l=n(6342);function o(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const s=n.slice(2,e.level);e.parentIndex=Math.max(...s),n[e.level]=t}));const s=[];return t.forEach((e=>{const{parentIndex:n,...l}=e;n>=0?t[n].children.push(l):s.push(l)})),s}function i(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:s}=e;return t.flatMap((e=>{const t=i({toc:e.children,minHeadingLevel:n,maxHeadingLevel:s});return function(e){return e.level>=n&&e.level<=s}(e)?[{...e,children:t}]:t}))}function a(e){const t=e.getBoundingClientRect();return t.top===t.bottom?a(e.parentNode):t}function r(e,t){let{anchorTopOffset:n}=t;const s=e.find((e=>a(e).top>=n));if(s){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(a(s))?s:e[e.indexOf(s)-1]??null}return e[e.length-1]??null}function c(){const e=(0,s.useRef)(0),{navbar:{hideOnScroll:t}}=(0,l.p)();return(0,s.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function d(e){const t=(0,s.useRef)(void 0),n=c();(0,s.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:s,linkActiveClassName:l,minHeadingLevel:o,maxHeadingLevel:i}=e;function a(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(s),a=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const s=[];for(let l=t;l<=n;l+=1)s.push(`h${l}.anchor`);return Array.from(document.querySelectorAll(s.join()))}({minHeadingLevel:o,maxHeadingLevel:i}),c=r(a,{anchorTopOffset:n.current}),d=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===d)}))}return document.addEventListener("scroll",a),document.addEventListener("resize",a),a(),()=>{document.removeEventListener("scroll",a),document.removeEventListener("resize",a)}}),[e,n])}var u=n(28774),m=n(74848);function h(e){let{toc:t,className:n,linkClassName:s,isChild:l}=e;return t.length?(0,m.jsx)("ul",{className:l?void 0:n,children:t.map((e=>(0,m.jsxs)("li",{children:[(0,m.jsx)(u.A,{to:`#${e.id}`,className:s??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,m.jsx)(h,{isChild:!0,toc:e.children,className:n,linkClassName:s})]},e.id)))}):null}const g=s.memo(h);function f(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:a="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:c,maxHeadingLevel:u,...h}=e;const f=(0,l.p)(),p=c??f.tableOfContents.minHeadingLevel,x=u??f.tableOfContents.maxHeadingLevel,v=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:l}=e;return(0,s.useMemo)((()=>i({toc:o(t),minHeadingLevel:n,maxHeadingLevel:l})),[t,n,l])}({toc:t,minHeadingLevel:p,maxHeadingLevel:x});return d((0,s.useMemo)((()=>{if(a&&r)return{linkClassName:a,linkActiveClassName:r,minHeadingLevel:p,maxHeadingLevel:x}}),[a,r,p,x])),(0,m.jsx)(g,{toc:v,className:n,linkClassName:a,...h})}},50996:(e,t,n)=>{n.d(t,{A:()=>h});n(96540);var s=n(18215),l=n(21312),o=n(5260),i=n(74848);function a(){return(0,i.jsx)(l.A,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function r(){return(0,i.jsx)(l.A,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,i.jsx)(o.A,{children:(0,i.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}var d=n(17559),u=n(27293);function m(e){let{className:t}=e;return(0,i.jsx)(u.A,{type:"caution",title:(0,i.jsx)(a,{}),className:(0,s.A)(t,d.G.common.unlistedBanner),children:(0,i.jsx)(r,{})})}function h(e){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(c,{}),(0,i.jsx)(m,{...e})]})}},50925:(e,t,n)=>{n.d(t,{A:()=>d});n(96540);var s=n(20053),l=n(7131),o=(n(61943),n(58046)),i=n(28774),a=n(90485);const r={footer:"footer_ZfVL",blogPostFooterDetailsFull:"blogPostFooterDetailsFull_Wr5y"};var c=n(74848);function d(){const{metadata:e,isBlogPostPage:t}=(0,l.e)(),{tags:n,title:d,editUrl:u,hasTruncateMarker:m}=e,h=!t&&m,g=n.length>0;return g||h||u?(0,c.jsxs)("footer",{className:(0,s.A)("row docusaurus-mt-lg",t&&r.blogPostFooterDetailsFull),children:[g&&(0,c.jsx)("div",{className:(0,s.A)("col",{"col--9":h}),children:(0,c.jsx)(o.A,{tags:n})}),t&&(0,c.jsxs)("ul",{className:r.footer,children:[(0,c.jsx)("li",{children:(0,c.jsx)(i.A,{target:"_blank",rel:"noopener",href:"https://twitter.com/uppy_io",children:"Twitter"})}),(0,c.jsx)("li",{children:(0,c.jsx)(i.A,{target:"_blank",rel:"noopener",href:"https://uppy.io/blog/atom.xml",children:"RSS feed"})}),(0,c.jsx)("li",{children:(0,c.jsx)(i.A,{target:"_blank",rel:"noopener",href:"https://github.com/transloadit/uppy",children:"GitHub"})})]}),h&&(0,c.jsx)("div",{className:(0,s.A)("col text--left",{"col--3":g}),children:(0,c.jsx)(a.A,{blogPostTitle:d,to:e.permalink})})]}):null}}}]);