import React, { useEffect, useState } from 'react';
import { UppyContextProvider, FilesList } from '@uppy/react';
import Uppy, { MinimalRequiredUppyFile, UppyFile } from '@uppy/core';

import { BrowserWindow } from './BrowserWindow';

import '@uppy/react/dist/styles.css';

import styles from './files-list.module.css';

const fakeFiles = [
	{
		id: '1',
		name: 'sexy-dogs.jpg',
		type: 'image/jpg',
		size: 1024 * 1024,
		data: new Blob([new ArrayBuffer(1024 * 1024)], { type: 'image/jpg' }),
		source: 'Local',
		isRemote: false,
	},
	{
		id: '2',
		name: 'how-to-talk-to-cats.pdf',
		type: 'application/pdf',
		size: 1024 * 1024 * 0.5,
		data: new Blob([new ArrayBuffer(1024 * 1024 * 0.5)], {
			type: 'application/pdf',
		}),
		source: 'Local',
		isRemote: false,
	},
	{
		id: '3',
		name: 'tutorial-running-arch-linux-as-a-dog.mp4',
		type: 'video/mp4',
		size: 1024 * 1024 * 23,
		data: new Blob([new ArrayBuffer(1024 * 1024 * 23)], {
			type: 'video/mp4',
		}),
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
