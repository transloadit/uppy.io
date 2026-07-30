import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

type Props = {
	command: string;
	className?: string;
};

export default function InstallCommand({
	command,
	className,
}: Props): JSX.Element {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
		} catch {
			return; // Insecure context or denied permission — leave the label alone.
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
			<code className={styles.command}>
				<span className={styles.prompt} aria-hidden>
					$
				</span>
				{command}
			</code>
			<button
				type="button"
				className={styles.copy}
				onClick={copy}
				aria-label={copied ? 'Copied' : `Copy "${command}" to clipboard`}
			>
				{copied ?
					<svg viewBox="0 0 16 16" aria-hidden>
						<path
							d="M13 4.5 6.5 11.5 3 8"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				:	<svg viewBox="0 0 16 16" aria-hidden>
						<rect
							x="5.75"
							y="5.75"
							width="8.5"
							height="8.5"
							rx="2"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M10.25 3.75a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				}
			</button>
		</div>
	);
}
