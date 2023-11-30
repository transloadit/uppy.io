import React from 'react';

import styles from './index.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        <img
          className="IndexFooter-logo"
          title="Uppy"
          alt="Uppy"
          src="/img/logo.svg"
        />
      </p>
      <p>
        Released under the{' '}
        <a
          href="http://opensource.org/licenses/MIT"
          rel="noreferrer noopener"
          target="_blank"
        >
          MIT License
        </a>{' '}
        ⋅ <a href="/privacy-policy/">Privacy Policy</a> ⋅{' '}
        <a href="https://github.com/transloadit/uppy/blob/main/.github/CONTRIBUTING.md">
          Contributing
        </a>
      </p>
      <p>
        © 2023{' '}
        <a href="https://transloadit.com" target="_blank">
          Transloadit
        </a>
      </p>
    </footer>
  );
}

export default React.memo(Footer);
