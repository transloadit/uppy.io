import React, { useEffect, useState } from 'react';
import { UppyContextProvider, FilesList } from '@uppy/react';
import Uppy, { MinimalRequiredUppyFile, UppyFile } from '@uppy/core';

import { BrowserWindow } from './BrowserWindow';

import '@uppy/react/dist/styles.css';

import styles from './files-list.module.css';

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
] satisfies MinimalRequiredUppyFile<any, any>[];

export default function FilesListDemo() {
	const [uppy] = useState(() => new Uppy());
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [files, setFiles] = useState<MinimalRequiredUppyFile<any, any>[]>([]);

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
					<FilesList />
				</div>
			</UppyContextProvider>
		</BrowserWindow>
	);
}
