import React, { useEffect, useState } from 'react';
import { UppyContextProvider, FilesGrid } from '@uppy/react';
import Uppy, { MinimalRequiredUppyFile, UppyFile } from '@uppy/core';

import { BrowserWindow } from './BrowserWindow';

import '@uppy/react/css/style.css';

import styles from './files-grid.module.css';

const fakeFiles = [
	{
		id: 'fake-pdf-1',
		name: 'business-plan.pdf',
		type: 'application/pdf',
		size: 1234567,
		data: new Blob(['fake pdf data'], { type: 'application/pdf' }),
		source: 'Local',
		isRemote: false,
	},
	{
		id: 'fake-video-1',
		name: 'tutorial.mp4',
		type: 'video/mp4',
		size: 8765432,
		data: new Blob(['fake video data'], { type: 'video/mp4' }),
		source: 'Local',
		isRemote: false,
	},
];

export default function FilesGridDemo() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [files, setFiles] = useState<MinimalRequiredUppyFile<any, any>[]>([]);
	const [uppy] = useState(() => {
		const uppy = new Uppy();
		return uppy;
	});

	useEffect(() => {
		setFiles(fakeFiles);
	}, [uppy]);

	useEffect(() => {
		files.forEach((file) => uppy.addFile(file));
	}, [files]);

	return (
		<BrowserWindow>
			<UppyContextProvider uppy={uppy}>
				<div className={styles.wrapper}>
					<FilesGrid columns={4} />
				</div>
			</UppyContextProvider>
		</BrowserWindow>
	);
}
