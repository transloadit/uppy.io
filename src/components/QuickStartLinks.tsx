import React from 'react';
import Link from '@docusaurus/Link';

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
		<div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
			{props.items.map((item) => (
				<div className="group relative rounded-xl border border-solid border-[color:var(--ifm-color-emphasis-300)] hover:border-uppy transition-colors">
					<div className="absolute -inset-px rounded-xl"></div>
					<div className="relative overflow-hidden rounded-xl p-6">
						<h2 className="mt-4 font-display text-lg text-slate-900 ">
							<Link to={item.link} className="hover:no-underline">
								<span className="absolute -inset-px rounded-xl"></span>
								{item.name}
							</Link>
						</h2>
						<p>
							{item.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};
