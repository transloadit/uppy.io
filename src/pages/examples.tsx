import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Dashboard from '@uppy/react/lib/Dashboard';
import UppyCore from '@uppy/core';
import Webcam from '@uppy/webcam';
import GoogleDrive from '@uppy/google-drive';
import GoogleDrivePicker from '@uppy/google-drive-picker';
import GooglePhotos from '@uppy/google-photos';
import GooglePhotosPicker from '@uppy/google-photos-picker';
import Instagram from '@uppy/instagram';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Facebook from '@uppy/facebook';
import Unsplash from '@uppy/unsplash';
import Url from '@uppy/url';
import Box from '@uppy/box';
import Audio from '@uppy/audio';
import ScreenCapture from '@uppy/screen-capture';
import ImageEditor from '@uppy/image-editor';
import Tus from '@uppy/tus';
import GoldenRetriever from '@uppy/golden-retriever';

import locales from '../locales.js';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/audio/dist/style.min.css';
import '@uppy/screen-capture/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/url/dist/style.min.css';

import styles from './examples.module.css';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

const restrictions = {
	maxFileSize: 1000000,
	maxNumberOfFiles: 3,
	minNumberOfFiles: 2,
	allowedFileTypes: ['image/*', 'video/*'],
	requiredMetaFields: ['caption'],
};

type Action = { type: string; checked?: boolean; value: string };
type State = {
	small: boolean;
	restrictions?: typeof restrictions;
	disabled: boolean;
	theme: string;
	// theme: 'light' | 'dark' | 'auto';
	plugins: string[];
};

const initialState: State = {
	small: false,
	restrictions: null,
	disabled: false,
	theme: 'light',
	plugins: [
		'Webcam',
		'GoogleDrivePicker',
		'GooglePhotosPicker',
		'Dropbox',
		'Url',
		'OneDrive',
		'Unsplash',
		'Box',
		'ImageEditor',
	],
};

function reducer(state: State, action: Action) {
	switch (action.type) {
		case 'small':
			return { ...state, small: action.checked };
		case 'theme':
			return { ...state, theme: action.checked ? 'dark' : 'light' };
		case 'disabled':
			return { ...state, disabled: action.checked };
		case 'restrictions':
			return {
				...state,
				restrictions: action.checked ? restrictions : undefined,
			};
		case 'plugins':
			if (action.checked) {
				return { ...state, plugins: [...state.plugins, action.value] };
			}
			return {
				...state,
				plugins: state.plugins.filter((p) => p !== action.value),
			};
		default:
			return state;
	}
}

const options = [
	{
		heading: 'Remote sources',
		options: [
			{
				label: 'Google Drive',
				value: 'GoogleDrive',
				type: 'plugins',
				title:
					'Temporarily disabled until our credentials are approved again. You can still use the plugin yourself.',
				disabled: true,
			},
			{
				label: 'Google Photos',
				value: 'GooglePhotos',
				type: 'plugins',
				title:
					'Temporarily disabled until our credentials are approved again. You can still use the plugin yourself.',
				disabled: true,
			},
			{
				label: 'Google Drive Picker',
				value: 'GoogleDrivePicker',
				type: 'plugins',
			},
			{
				label: 'Google Photos Picker',
				value: 'GooglePhotosPicker',
				type: 'plugins',
			},
			{
				label: 'Dropbox',
				value: 'Dropbox',
				type: 'plugins',
			},
			{
				label: 'Instagram',
				value: 'Instagram',
				type: 'plugins',
				title:
					'Temporarily disabled until our credentials are approved again. You can still use the plugin yourself.',
				disabled: true,
			},
			{
				label: 'Facebook',
				value: 'Facebook',
				type: 'plugins',
				title:
					'Temporarily disabled until our credentials are approved again. You can still use the plugin yourself.',
				disabled: true,
			},
			{ label: 'Url', value: 'Url', type: 'plugins' },
			{
				label: 'OneDrive',
				value: 'OneDrive',
				type: 'plugins',
			},
			{
				label: 'Unsplash',
				value: 'Unsplash',
				type: 'plugins',
			},
			{ label: 'Box', value: 'Box', type: 'plugins' },
		],
	},
	{
		heading: 'Local sources',
		options: [
			{
				label: 'Webcam',
				value: 'Webcam',
				type: 'plugins',
			},
			{
				label: 'Audio',
				value: 'Audio',
				type: 'plugins',
			},
			{
				label: 'Screencast',
				value: 'ScreenCapture',
				type: 'plugins',
			},
		],
	},
	{
		heading: 'Dashboard',
		options: [
			{ label: 'Small', type: 'small' },
			{ label: 'Disabled', type: 'disabled' },
			{ label: 'Dark mode', type: 'theme' },
		],
	},
	{
		heading: 'Uppy',
		options: [
			{ label: 'Restrictions', type: 'restrictions' },
			{ label: 'Golden Retriever', value: 'GoldenRetriever', type: 'plugins' },
		],
	},
];

const Uppy = ({ state, locale }) => {
	const disabled = (value: string) =>
		options.some((section) =>
			section.options.some(
				(option) => value === option.value && option.disabled,
			),
		);
	const createUppy = useCallback(() => {
		const uppy = new UppyCore({
			restrictions: state.restrictions,
			locale,
			debug: true,
		})
			.use(ImageEditor, {})
			.use(Tus, { endpoint });

		if (state.plugins.includes('Box') && !disabled('Box')) {
			uppy.use(Box, { companionUrl });
		}
		if (state.plugins.includes('Instagram') && !disabled('Instagram')) {
			uppy.use(Instagram, { companionUrl });
		}
		if (state.plugins.includes('Url') && !disabled('Url')) {
			uppy.use(Url, { companionUrl });
		}
		if (state.plugins.includes('Facebook') && !disabled('Facebook')) {
			uppy.use(Facebook, { companionUrl });
		}
		if (state.plugins.includes('OneDrive') && !disabled('OneDrive')) {
			uppy.use(OneDrive, { companionUrl });
		}
		if (state.plugins.includes('Unsplash') && !disabled('Unsplash')) {
			uppy.use(Unsplash, { companionUrl });
		}
		if (state.plugins.includes('Webcam') && !disabled('Webcam')) {
			uppy.use(Webcam);
		}
		if (state.plugins.includes('ScreenCapture') && !disabled('ScreenCapture')) {
			uppy.use(ScreenCapture);
		}
		if (state.plugins.includes('Audio') && !disabled('Audio')) {
			uppy.use(Audio);
		}
		if (state.plugins.includes('GoogleDrive') && !disabled('GoogleDrive')) {
			uppy.use(GoogleDrive, {
				companionUrl,
				companionKeysParams: {
					key: 'unused-key',
					credentialsName: 'unused-credentials',
				},
			});
		}
		if (
			state.plugins.includes('GoogleDrivePicker') &&
			!disabled('GoogleDrivePicker')
		) {
			uppy.use(GoogleDrivePicker, {
				companionUrl,
				clientId: googlePickerClientId,
				apiKey: googlePickerApiKey,
				appId: googlePickerAppId,
			});
		}
		if (state.plugins.includes('GooglePhotos') && !disabled('GooglePhotos')) {
			uppy.use(GooglePhotos, {
				companionUrl,
			});
		}
		if (
			state.plugins.includes('GooglePhotosPicker') &&
			!disabled('GooglePhotosPicker')
		) {
			uppy.use(GooglePhotosPicker, {
				companionUrl,
				clientId: googlePickerClientId,
			});
		}
		if (state.plugins.includes('Dropbox') && !disabled('Dropbox')) {
			uppy.use(Dropbox, { companionUrl });
		}
		if (
			state.plugins.includes('GoldenRetriever') &&
			!disabled('GoldenRetriever')
		) {
			uppy.use(GoldenRetriever);
		}

		// Expose for easier debugging
		globalThis.uppy = uppy;

		return uppy;
	}, [state, locale]);

	const [uppy, setUppy] = useState(() => createUppy());

	useEffect(() => setUppy(createUppy()), [createUppy]);

	return (
		<div className={styles['uppy-wrapper']}>
			<Dashboard
				uppy={uppy}
				width={state.small ? 400 : '100%'}
				height={state.small ? 400 : 570}
				theme={state.theme}
				disabled={state.disabled}
				note={
					state.restrictions ?
						'Images and video only, 2–3 files, up to 1 MB'
					:	null
				}
			/>
		</div>
	);
};

const companionUrl = 'https://companion.uppy.io';
// const companionUrl = 'http://localhost:3020';
const endpoint = 'https://tusd.tusdemo.net/files/';
const googlePickerClientId =
	'1020900325465-7naospne1v7veupmu8rg3a6ipfogr9f0.apps.googleusercontent.com';
const googlePickerApiKey = 'AIzaSyCItfp_WaGGgbNFoU08LMs21ks-MxIqudo';
const googlePickerAppId = 'uppy-server-dev';

export default function Examples() {
	// Silly trick to please Docusaurus with client-side hooks such as useLocalStorage
	return <BrowserOnly>{() => <Page />}</BrowserOnly>;
}

function Page() {
	const [state, setPersistentState] = useLocalStorage(
		'uppy-examples-state',
		initialState,
	);
	const [locale, setLocale] = useState(null);
	const dispatch = useCallback(
		(action: Action) => setPersistentState(reducer(state, action)),
		[state],
	);

	return (
		<Layout>
			<main className={styles['main']}>
				<Heading className={styles['h1']} as="h1">
					Examples
				</Heading>

				<div className={styles['dashboard-docs-stackblitz']}>
					<Heading as="h2">Dashboard</Heading>
					<p>
						<Link to="/docs/dashboard">Docs</Link> •{' '}
						<Link
							target="_blank"
							rel="noopener"
							href="https://stackblitz.com/edit/vitejs-vite-zaqyaf?file=main.js"
						>
							StackBlitz
						</Link>
					</p>
				</div>
				<p>
					Dashboard is the full-featured UI for Uppy that shows nice file
					previews and upload progress, lets you edit metadata, and unites
					acquire plugins, such as Google Drive and Webcam, under one roof.
				</p>
				<section className={styles['options-and-uppy']}>
					<div className={styles['options']}>
						{options.map((section) => {
							return (
								<div key={section.heading}>
									<Heading className={styles['h3']} as="h3">
										{section.heading}
									</Heading>
									<div
										wrapper-for={section.heading}
										className={styles['options-inner']}
									>
										{section.options.map(
											({ label, value, type, disabled, title }) => (
												<div key={label}>
													<input
														type="checkbox"
														id={label}
														value={type}
														title={title}
														checked={
															// Forgive me for this logic
															disabled ? false
															: Array.isArray(state[type]) ?
																state[type].includes(value)
															: type === 'theme' ?
																state.theme === 'dark'
															:	state[type]
														}
														disabled={disabled}
														onChange={(event) =>
															dispatch({
																type: type,
																checked: event.target.checked,
																value,
															})
														}
													/>
													<label title={title} htmlFor={label}>
														{label}
													</label>
												</div>
											),
										)}
									</div>
								</div>
							);
						})}

						<select
							name="locale"
							onChange={(e) => {
								setLocale(
									locales.find((locale) => locale.name === e.target.value)
										.locale,
								);
							}}
						>
							{locales.map(({ name }) => {
								return (
									<option key={name} value={name}>
										{name}
									</option>
								);
							})}
						</select>
					</div>
					<div className={styles['dashboard-inner']}>
						<BrowserOnly>
							{() => <Uppy state={state} locale={locale} />}
						</BrowserOnly>
					</div>
				</section>
				<Admonition type="note">
					Checkout our{' '}
					<Link
						href="https://github.com/transloadit/uppy/tree/main/examples"
						target="_blank"
						rel="noopener"
					>
						GitHub examples
					</Link>{' '}
					folder for many more examples.
				</Admonition>
			</main>
		</Layout>
	);
}
