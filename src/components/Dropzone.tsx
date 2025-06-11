import React, { useState } from 'react';
import { UppyContextProvider, Dropzone } from '@uppy/react';
import Uppy from '@uppy/core';

import { BrowserWindow } from './BrowserWindow';

import '@uppy/react/dist/styles.css';

import styles from './dropzone.module.css';

export default function DropzoneDemo() {
	const [uppy] = useState(() => new Uppy());

	return (
		<BrowserWindow>
			<UppyContextProvider uppy={uppy}>
				<div className={styles.wrapper}>
					<Dropzone />
				</div>
			</UppyContextProvider>
		</BrowserWindow>
	);
}
