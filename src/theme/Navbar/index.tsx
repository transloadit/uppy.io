import React from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type { WrapperProps } from '@docusaurus/types';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props): JSX.Element {
	return (
		<>
			<div className={styles.banner}>
				<Link to="/blog/uppy-5.0" className={styles.link}>
					<span className={styles.tag}>5.0</span>
					<span className={styles.text}>
						Headless components and hooks are here
					</span>
					<span className={styles.arrow} aria-hidden>
						→
					</span>
				</Link>
			</div>
			<Navbar {...props} />
		</>
	);
}
