import React, { useEffect, useRef, useState } from 'react';

import { agentPrompt } from './prompt';
import styles from './styles.module.css';

type Props = {
	className?: string;
};

/**
 * The prompt is long by design — it is a brief, not a snippet — so the panel
 * shows the opening few lines, fades out, and scrolls. Nobody reads this on the
 * page; they copy it into an agent. The copy button always takes the whole
 * thing, whatever is scrolled into view.
 */
export default function AgentPrompt({ className }: Props): JSX.Element {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(agentPrompt);
		} catch {
			return; // Insecure context or denied permission — leave the label alone.
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
			{/* Focusable so the panel can be scrolled from the keyboard. */}
			<pre
				className={styles.prompt}
				tabIndex={0}
				role="group"
				aria-label="Prompt for adding Uppy with a coding agent"
			>
				{agentPrompt}
			</pre>

			{/* The label holds still and only the icon acknowledges the click, so the
			    button doesn't change width under the cursor. */}
			<button type="button" className={styles.copy} onClick={copy}>
				{copied ?
					<svg className={styles.icon} viewBox="0 0 16 16" aria-hidden>
						<path
							d="M13 4.5 6.5 11.5 3 8"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				:	<svg className={styles.icon} viewBox="0 0 16 16" aria-hidden>
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
				Copy prompt
			</button>

			{/* The visible label can't announce the result, so this does. */}
			<span className={styles.status} role="status">
				{copied ? 'Prompt copied to clipboard' : ''}
			</span>
		</div>
	);
}
