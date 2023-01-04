import { unified } from 'unified';
import unifiedMessageControl from 'unified-message-control';

import { commentMarker } from 'mdast-comment-marker';

import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';

// remark-preset-lint-recommended:
import remarkLint from 'remark-lint';
import remarkLintFinalNewline from 'remark-lint-final-newline';
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent';
// import remarkLintListItemIndent from 'remark-lint-list-item-indent' // Incompatible with MDX
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker';
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls';
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style';
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces';
import remarkLintNoDuplicateDefinitions from 'remark-lint-no-duplicate-definitions';
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent';
import remarkLintNoInlinePadding from 'remark-lint-no-inline-padding';
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image';
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link';
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references';
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions';

import remarkPresetLintConsistent from 'remark-preset-lint-consistent';

import remarkRetext from 'remark-retext';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextProfanities from 'retext-profanities';
import retextQuotes from 'retext-quotes';
import retextSimplify from 'retext-simplify';
import retextSyntaxMentions from 'retext-syntax-mentions';

const retextPreset = [
	remarkRetext,
	unified()
		.use(retextEnglish)
		.use(retextEquality, {
			ignore: ['disabled', 'host', 'hosts', 'invalid', 'whitespace'],
		})
		.use(retextProfanities, { sureness: 1 })
		.use(retextQuotes)
		.use(retextSimplify, {
			ignore: [
				'accurate',
				'address',
				'alternatively',
				'component',
				'equivalent',
				'frequently',
				'function',
				'identify',
				'implement',
				'initial',
				'interface',
				'maintain',
				'maximum',
				'minimum',
				'option',
				'parameters',
				'provide',
				'render',
				'request',
				'selection',
				'submit',
				'type',
				'validate',
			],
		})
		.use(retextSyntaxMentions),
];

const messageControlPreset = [
	unifiedMessageControl,
	{
		name: 'retext-simplify',
		marker: commentMarker,
		test: 'html',
	},
];

export default {
	settings: {
		emphasis: '_',
		strong: '*',
		'tab-size': 1,
	},
	plugins: [
		remarkFrontmatter, // YAML in MD
		remarkGfm, // GitHub Flavored Markdown
		remarkDirective, // Admonitions
		remarkPresetLintConsistent,

		// remark-preset-lint-recommended:
		remarkLint,
		// Unix compatibility.
		remarkLintFinalNewline,
		// Rendering across vendors differs greatly if using other styles.
		remarkLintListItemBulletIndent,
		// [remarkLintListItemIndent, 'tab-size'], // Incompatible with MDX
		remarkLintNoBlockquoteWithoutMarker,
		remarkLintNoLiteralUrls,
		[remarkLintOrderedListMarkerStyle, '.'],

		// Mistakes.
		remarkLintHardBreakSpaces,
		remarkLintNoDuplicateDefinitions,
		remarkLintNoHeadingContentIndent,
		remarkLintNoInlinePadding,
		remarkLintNoShortcutReferenceImage,
		remarkLintNoShortcutReferenceLink,
		remarkLintNoUndefinedReferences,
		remarkLintNoUnusedDefinitions,
		retextPreset,
		messageControlPreset,
	],
};
