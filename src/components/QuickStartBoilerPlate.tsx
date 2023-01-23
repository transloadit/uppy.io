import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';

const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>dashboard example</title>
    <script defer type="module" src="index.js"></script>
  </head>
  <body>
    <div id="uppy"></div>
  </body>
</html>
</code>
`;

const js = `
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Tus from '@uppy/tus'

const uppy = new Uppy()
  .use(Dashboard, { target: '#uppy', inline: true })
  .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
  .on('complete', (result) => {
    console.log('Upload result:', result)
  })
`;
export default function BoilerPlate() {
	return (
		<>
			<CodeBlock language="js" title="index.js">
				{js}
			</CodeBlock>
			<CodeBlock language="html" title="index.html">
				{html}
			</CodeBlock>
		</>
	);
}
