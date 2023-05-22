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

			{isBlogPostPage && (
				<ul className={styles.footer}>
					<li>
						<a
							target="_blank"
							rel="noopener"
							href="https://twitter.com/uppy_io"
						>
							Twitter
						</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noopener"
							href="https://uppy.io/blog/atom.xml"
						>
							RSS feed
						</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noopener"
							href="https://github.com/transloadit/uppy"
						>
							GitHub
						</a>
					</li>
				</ul>
			)}

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
