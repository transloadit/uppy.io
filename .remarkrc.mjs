import { unified } from "unified";
import unifiedMessageControl from "unified-message-control";

import { commentMarker } from "mdast-comment-marker";

import remarkFrontmatter from 'remark-frontmatter'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'

import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import retextEquality from "retext-equality";
import retextProfanities from "retext-profanities";
import retextQuotes from "retext-quotes";
import retextSimplify from "retext-simplify";
import retextSyntaxMentions from "retext-syntax-mentions";

const retextPreset = [
  remarkRetext,
  unified()
    .use(retextEnglish)
    .use(retextEquality, {
      ignore: ["disabled", "host", "hosts", "invalid", "whitespace"],
    })
    .use(retextProfanities, { sureness: 1 })
    .use(retextQuotes)
    .use(retextSimplify, {
      ignore: [
        "accurate",
        "address",
        "alternatively",
        "component",
        "equivalent",
        "function",
        "identify",
        "implement",
        "initial",
        "interface",
        "maintain",
        "maximum",
        "minimum",
        "option",
        "parameters",
        "provide",
        "render",
        "request",
        "selection",
        "submit",
        "type",
        "validate",
      ],
    })
    .use(retextSyntaxMentions),
];

const messageControlPreset = [
  unifiedMessageControl,
  {
    name: "retext-simplify",
    marker: commentMarker,
    test: "html",
  },
];

export default {
  settings: {
    emphasis: "_",
    strong: "*",
  },
  plugins: [
    remarkFrontmatter, // YAML in MD
    remarkGfm, // GitHub Flavored Markdown
    remarkDirective, // Admonitions
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    retextPreset,
    messageControlPreset,
  ],
};
