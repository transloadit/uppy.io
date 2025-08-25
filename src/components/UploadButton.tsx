import React, { useEffect, useState } from 'react';
import {
	UppyContextProvider,
	UploadButton as UppyUploadButton,
} from '@uppy/react';
import Uppy from '@uppy/core';

import { BrowserWindow } from './BrowserWindow';

import '@uppy/react/css/style.css';

import styles from './button.module.css';

export default function UploadButton() {
	const [uppy] = useState(() => new Uppy());

	useEffect(() => {
		uppy.setState({
			capabilities: {
				resumableUploads: true,
				individualCancellation: true,
				uploadProgress: true,
			},
		});
		uppy.emit('progress', 44);
		uppy.emit('pause-all');
	}, [uppy]);

	return (
		<BrowserWindow>
			<UppyContextProvider uppy={uppy}>
				<div className={styles.wrapper}>
					<UppyUploadButton />
				</div>
			</UppyContextProvider>
		</BrowserWindow>
	);
}
