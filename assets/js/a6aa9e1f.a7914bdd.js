"use strict";(self.webpackChunkuppy_io=self.webpackChunkuppy_io||[]).push([[3089],{93269:(e,t,a)=>{a.r(t),a.d(t,{default:()=>h});var l=a(67294),n=a(86010),r=a(52263),o=a(10833),i=a(35281),s=a(39058),c=a(95999),m=a(32244);function g(e){const{metadata:t}=e,{previousPage:a,nextPage:n}=t;return l.createElement("nav",{className:"pagination-nav","aria-label":(0,c.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"})},a&&l.createElement(m.Z,{permalink:a,title:l.createElement(c.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)"},"Newer Entries")}),n&&l.createElement(m.Z,{permalink:n,title:l.createElement(c.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)"},"Older Entries"),isNext:!0}))}var p=a(90197),u=a(9460),E=a(51324);function b(e){let{items:t,component:a=E.Z}=e;return l.createElement(l.Fragment,null,t.map((e=>{let{content:t}=e;return l.createElement(u.n,{key:t.metadata.permalink,content:t},l.createElement(a,null,l.createElement(t,null)))})))}function d(e){const{metadata:t}=e,{siteConfig:{title:a}}=(0,r.Z)(),{blogDescription:n,blogTitle:i,permalink:s}=t,c="/"===s?a:i;return l.createElement(l.Fragment,null,l.createElement(o.d,{title:c,description:n}),l.createElement(p.Z,{tag:"blog_posts_list"}))}function f(e){const{metadata:t,items:a,sidebar:n}=e;return l.createElement(s.Z,{sidebar:n},l.createElement(b,{items:a}),l.createElement(g,{metadata:t}))}function h(e){return l.createElement(o.FG,{className:(0,n.Z)(i.k.wrapper.blogPages,i.k.page.blogListPage)},l.createElement(d,e),l.createElement(f,e))}},4508:(e,t,a)=>{a.d(t,{Z:()=>c});var l=a(67294),n=a(86010),r=a(9460),o=(a(84881),a(86233)),i=a(22584);const s={footer:"footer_ZfVL",blogPostFooterDetailsFull:"blogPostFooterDetailsFull_Wr5y"};function c(){const{metadata:e,isBlogPostPage:t}=(0,r.C)(),{tags:a,title:c,editUrl:m,hasTruncateMarker:g}=e,p=!t&&g,u=a.length>0;return u||p||m?l.createElement("footer",{className:(0,n.Z)("row docusaurus-mt-lg",t&&s.blogPostFooterDetailsFull)},u&&l.createElement("div",{className:(0,n.Z)("col",{"col--9":p})},l.createElement(o.Z,{tags:a})),t&&l.createElement("ul",{className:s.footer},l.createElement("li",null,l.createElement("a",{target:"_blank",rel:"noopener",href:"https://twitter.com/uppy_io"},"Twitter")),l.createElement("li",null,l.createElement("a",{target:"_blank",rel:"noopener",href:"https://uppy.io/blog/atom.xml"},"RSS feed")),l.createElement("li",null,l.createElement("a",{target:"_blank",rel:"noopener",href:"https://github.com/transloadit/uppy"},"GitHub"))),p&&l.createElement("div",{className:(0,n.Z)("col text--left",{"col--3":u})},l.createElement(i.Z,{blogPostTitle:c,to:e.permalink}))):null}}}]);