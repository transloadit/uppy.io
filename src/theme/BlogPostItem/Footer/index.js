import React from 'react';
import clsx from 'clsx';
import { useBlogPost } from '@docusaurus/theme-common/internal';
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';
import ReadMoreLink from '@theme/BlogPostItem/Footer/ReadMoreLink';
import styles from './styles.module.css';
export default function BlogPostItemFooter() {
	const { metadata, isBlogPostPage } = useBlogPost();
	const { tags, title, editUrl, hasTruncateMarker } = metadata;
	// A post is truncated if it's in the "list view" and it has a truncate marker
	const truncatedPost = !isBlogPostPage && hasTruncateMarker;
	const tagsExists = tags.length > 0;
	const renderFooter = tagsExists || truncatedPost || editUrl;
	if (!renderFooter) {
		return null;
	}
	return (
		<footer
			className={clsx(
				'row docusaurus-mt-lg',
				isBlogPostPage && styles.blogPostFooterDetailsFull,
			)}
		>
			{tagsExists && (
				<div className={clsx('col', { 'col--9': truncatedPost })}>
					<TagsListInline tags={tags} />
				</div>
			)}

			{isBlogPostPage && editUrl && (
				<div className="col margin-top--sm">
					<ul className="blog__post-footer__follow">
						<li>
							<a href="https://twitter.com/uppy_io">Follow us on Twitter</a> or grab the <a href="https://uppy.io/blog/atom.xml">RSS feed</a>
						</li>
						<li>
							<a
								className="github-button"
								href="https://github.com/transloadit/uppy"
								data-icon="octicon-star"
								data-size="large"
								data-show-count="true"
								aria-label="Star transloadit/uppy on GitHub"
							>
								Star
							</a>
						</li>
					</ul>
				</div>
			)}

			{/* {isBlogPostPage && editUrl && (
				<div className="col margin-top--sm">
					<EditThisPage editUrl={editUrl} />
				</div>
			)} */}

			{truncatedPost && (
				<div
					className={clsx('col text--left', {
						'col--3': tagsExists,
					})}
				>
					<ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
				</div>
			)}
		</footer>
	);
}
