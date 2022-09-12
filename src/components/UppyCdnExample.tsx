import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

import {
  useLatestVersion,
} from '@docusaurus/plugin-content-docs/client';


const uppyVersion = '2.9.0' // todo

export default function UppyCdnExample ({
  children,
  uppyCssName = 'uppy.min.css',
  uppyJsName = 'uppy.min.js',
}) {
  const latestVersion = useLatestVersion();
  console.log(latestVersion)

  let lines = [];

  React.Children.toArray(children).forEach((child) => {
    lines = [...lines, ...String(child).trim().split('\n').map((line) => line.trim())];
  })

  const linesProcessed = lines.map((line) => `  ${line}`).join('\n');

  const html = `\
<!-- 1. Add CSS to \`<head>\` -->
<link href="https://releases.transloadit.com/uppy/v${uppyVersion}/${uppyCssName}" rel="stylesheet">

<!-- 2. Add JS before the closing \`</body>\` -->
<script src="https://releases.transloadit.com/uppy/v${uppyVersion}/${uppyJsName}"></script>

<!-- 3. Initialize -->
<div id="uppy"></div>

<script>
  var uppy = new Uppy.Core()${linesProcessed.length > 0 ? `\n\n${linesProcessed}` : ''}
</script>
`;

  return (
    <>
      <Admonition type="caution">
        <p>
          The bundle consists of most Uppy plugins, so this method is not recommended for production,
          as your users will have to download all plugins when you are likely using only a few.
        </p>
      </Admonition>
      <CodeBlock language="html">
        {html}
      </CodeBlock>
    </>
  );
}
