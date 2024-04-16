import React from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

type Props = {
	items: Array<{
		name: string;
		description: string;
		link: string;
		icon?: React.ReactNode;
	}>;
};

export const QuickStartLinks = (props: Props) => {
	return (
		<section className={styles.section}>
			{props.items.map((item) => (
				<Link to={item.link}>
					<div className={styles.item}>
						<Heading as="h2">{item.name}</Heading>
						<p>{item.description}</p>
					</div>
				</Link>
			))}
		</section>
	);
};
