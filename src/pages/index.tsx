import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Dashboard from '@uppy/react/lib/Dashboard';
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import GoogleDrive from '@uppy/google-drive';
import Instagram from '@uppy/instagram';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Unsplash from '@uppy/unsplash';
import Url from '@uppy/url';
import Box from '@uppy/box';
import Audio from '@uppy/audio';
import ScreenCapture from '@uppy/screen-capture';
import ImageEditor from '@uppy/image-editor';
import Tus from '@uppy/tus';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';

import IconReact from '../../static/img/react.svg';
import IconVue from '../../static/img/vue.svg';
import IconSvelte from '../../static/img/svelte.svg';
import IconAngular from '../../static/img/angular.svg';
import IconUpload from '../../static/img/upload.svg';
import IconChat from '../../static/img/chat.svg';
import IconLanguage from '../../static/img/language.svg';
import IconSparkles from '../../static/img/sparkles.svg';
import IconFolder from '../../static/img/folder.svg';
import IconWrench from '../../static/img/wrench.svg';
import IconUppy from '../../static/img/uppy.svg';

import styles from './index.module.css';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const dashboardCode = `import Uppy  from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import RemoteSources from '@uppy/google-drive'
import ImageEditor from '@uppy/image-editor'
import Webcam from '@uppy/webcam'
import Tus from '@uppy/tus'

const uppy = new Uppy()
  .use(Dashboard, { target: '.DashboardContainer', inline: true })
  .use(RemoteSources, { companionUrl: "http://companion.uppy.io" })
  .use(Webcam, { target: Dashboard })
  .use(ImageEditor, { target: Dashboard })
  .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
`;

const reactCode = `import React, { useEffect } from 'react'
import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import { Dashboard } from '@uppy/react'

const uppy = new Uppy().use(Webcam)

function Component () {
  return <Dashboard uppy={uppy} plugins={['Webcam']} />
}
`;

const vueCode = `<template>
  <div id="app">
    <dashboard :uppy="uppy" :plugins="['Webcam']" :props="{theme: 'light'}" />
  </div>
</template>

<script>
import { Dashboard } from '@uppy/vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'

export default {
  name: 'App',
  components: {
    Dashboard
  },
  computed: {
    uppy: () => new Uppy().use(Webcam)
  },
  beforeDestroy () {
    this.uppy.close({ reason: 'unmount' })
  }
}
</script>
`;

const angularCode = `import { NgModule } from '@angular/core'
import { UppyAngularDashboardModule } from '@uppy/angular'

import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    UppyAngularDashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
class {}
`;

const svelteCode = `<main>
  <Dashboard
      uppy={uppy}
      plugins={["Webcam"]}
  />
</main>

<script>
import { Dashboard } from '@uppy/svelte'

import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'

const uppy = new Uppy().use(Webcam);
</script>
`;

const providersIcons = [
	'box.svg',
	'unsplash.svg',
	'googledrive.svg',
	'dropbox.svg',
	'instagram.svg',
	'facebook.svg',
	'onedrive.svg',
];

const frameworks = [
	{ name: 'React', Icon: IconReact, code: reactCode },
	{ name: 'Vue', Icon: IconVue, code: vueCode },
	{ name: 'Svelte', Icon: IconSvelte, code: svelteCode },
	{ name: 'Angular', Icon: IconAngular, code: angularCode },
];

export default function Home(): JSX.Element {
	const [framework, setFramework] = useState(frameworks[0].name);

	return (
		<Layout description="Description will go into a meta tag in <head />">
			<header className={styles.header}>
				<h1>Sleek, modular open source JavaScript file uploader</h1>

				<p>
					Uppy fetches files locally and from remote places like Dropbox or
					Instagram. With its seamless integration, reliability and ease of use,
					Uppy is truly your best friend in file uploading.
				</p>

				<Link className={styles.button} to="/docs/quick-start">
					Get started
				</Link>

				<figure className={styles.quote}>
					<blockquote cite="https://stackshare.io/posts/top-developer-tools-2017">
						<p>“Top 10 tools of the year”</p>
					</blockquote>
					<figcaption>
						<a
							href="https://stackshare.io/posts/top-developer-tools-2017"
							rel="noopener"
							target="_blank"
						>
							Stackshare
						</a>
					</figcaption>
				</figure>

				<figure className={styles.quote}>
					<blockquote cite="https://books.producthunt.com/bestof2017">
						<p>“The best product launches”</p>
					</blockquote>
					<figcaption>
						<a
							href="https://books.producthunt.com/bestof2017"
							rel="noopener"
							target="_blank"
						>
							Product Hunt
						</a>
					</figcaption>
				</figure>

				<figure className={styles.quote}>
					<blockquote cite="https://twitter.com/smashingmag/status/1097870169043546112">
						<p>“Soooo useful”</p>
					</blockquote>
					<figcaption>
						<a
							href="https://twitter.com/smashingmag/status/1097870169043546112"
							rel="noopener"
							target="_blank"
						>
							Smashing Magazine
						</a>
					</figcaption>
				</figure>
			</header>

			<main className={styles.main}>
				<section className={styles['section-dashboard']}>
					<h2>
						The all you need Dashboard — powerful, responsive, and pluggable.
					</h2>
					<p>
						Add files from remote sources, edit images, generate thumbnails, and
						more.
					</p>
					<div className={styles.dashboard}>
						<BrowserOnly>
							{() => {
								const uppy = new Uppy()
									.use(Webcam)
									.use(ScreenCapture)
									.use(Audio)
									.use(ImageEditor, {})
									.use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
									.use(GoogleDrive, {
										companionUrl: 'http://companion.uppy.io',
									})
									.use(Dropbox, { companionUrl: 'http://companion.uppy.io' })
									.use(Instagram, { companionUrl: 'http://companion.uppy.io' })
									.use(Url, { companionUrl: 'http://companion.uppy.io' })
									.use(OneDrive, { companionUrl: 'http://companion.uppy.io' })
									.use(Unsplash, { companionUrl: 'http://companion.uppy.io' })
									.use(Box, { companionUrl: 'http://companion.uppy.io' });

								return (
									<Dashboard
										uppy={uppy}
										height={400}
										plugins={[
											'Webcam',
											'GoogleDrive',
											'Dropbox',
											'Instagram',
											'Url',
											'OneDrive',
											'Unsplash',
											'Box',
											'ImageEditor',
										]}
									/>
								);
							}}
						</BrowserOnly>
						<CodeBlock language="js">{dashboardCode}</CodeBlock>
					</div>
					<div
						aria-hidden
						className={`${styles.upload} ${styles['upload-one']}`}
					>
						<IconUppy />
						<div></div>
					</div>
					<div
						aria-hidden
						className={`${styles.upload} ${styles['upload-two']}`}
					>
						<div></div>
					</div>
				</section>

				<section className={styles['section-companion']}>
					<div className={styles.companion}>
						{providersIcons.map((file) => (
							<div className={styles.provider} key={file}>
								<img src={`img/${file}`} />
							</div>
						))}
					</div>
					<h2>Bring in the files from the cloud with Companion.</h2>
					<p>
						Companion is a hosted, standalone, or middleware server to{' '}
						<strong>
							take away the complexity of authentication and the cost of
							downloading files
						</strong>{' '}
						from remote sources, such as Instagram, Google Drive, and others.
					</p>
					<p>
						This means a 5GB video isn’t eating into your users’ data plans and
						you don’t have to worry about OAuth.
					</p>
					<Link className={styles.button} to="/docs/companion">
						Learn more
					</Link>
				</section>

				<section className={styles['section-stack']}>
					<div>
						<h2>Integrate Uppy into your existing stack.</h2>
						<p>
							Uppy can seamlessly integrate in your existing stack. Plug the pup
							in the framework of your choosing.
						</p>
						<Link
							className={styles.button}
							to={`/docs/${framework.toLowerCase()}`}
						>
							{framework} docs
						</Link>
					</div>
					<div className={styles['frameworks-wrapper']}>
						<div className={styles.frameworks}>
							{frameworks.map(({ name, Icon }) => (
								<>
									<input
										key={name}
										type="radio"
										id={name}
										className={styles['framework-input']}
										name="framework"
										value={name}
										checked={name === framework}
										onChange={(event) => setFramework(event.target.value)}
									/>
									<label htmlFor={name}>
										<Icon />
										<span>{name}</span>
									</label>
								</>
							))}
						</div>
						<CodeBlock language="js">
							{frameworks.find((f) => f.name === framework).code}
						</CodeBlock>
					</div>
				</section>

				<section className={styles['section-much-more']}>
					<h2>And much more</h2>
					<ul>
						<li>
							<span>
								<IconUpload />
							</span>
							<span>
								Large uploads survive network hiccups thanks to resumable file
								uploads via the open <a href="https://tus.io/">Tus</a> standard
							</span>
						</li>
						<li>
							<span>
								<IconSparkles />
							</span>
							<span>
								Works great with the file encoding and processing backend from{' '}
								<a href="https://transloadit.com/">Transloadit</a>.
							</span>
						</li>
						<li>
							<span>
								<IconChat />
							</span>
							<span>
								Open source and driven by the community. We listen closely and
								adjust the project based on your feedback
							</span>
						</li>
						<li>
							<span>
								<IconFolder />
							</span>
							<span>
								File recovery, such as after a browser crash or accidental
								navigation, via{' '}
								<Link to="/docs/golden-retriever">Golden Retriever</Link>
							</span>
						</li>
						<li>
							<span>
								<IconLanguage />
							</span>
							<span>Speaks multiple languages (i18n)</span>
						</li>
						<li>
							<span>
								<IconWrench />
							</span>
							<span>Built with accessibility in mind</span>
						</li>
					</ul>
					<div>
						<Link className={styles.button} to="/docs/quick-start">
							Get started
						</Link>
					</div>
				</section>
			</main>
		</Layout>
	);
}
