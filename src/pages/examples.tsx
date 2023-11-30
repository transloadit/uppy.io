import React, { useCallback, useEffect, useReducer, useState } from 'react';

import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Dashboard from '@uppy/react/lib/Dashboard';
import UppyCore from '@uppy/core';
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
  width?: number | string;
  height: number | string;
  restrictions?: typeof restrictions;
  disabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  plugins: string[];
  enableGoldenRetriever: boolean;
};

const initialState: State = {
  height: 570,
  width: '100%',
  restrictions: null,
  disabled: false,
  theme: 'light',
  plugins: [
    'Webcam',
    'GoogleDrive',
    'Dropbox',
    'Instagram',
    'Url',
    'OneDrive',
    'Unsplash',
    'Box',
    'ImageEditor',
  ],
  enableGoldenRetriever: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'small':
      if (action.checked) {
        return { ...state, width: 400, height: 400 };
      }
      return { ...state, width: '100%', height: 570 };
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
    case 'enableGoldenRetriever': {
      return { ...state, enableGoldenRetriever: action.checked };
    }
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
        defaultChecked: true,
      },
      {
        label: 'Dropbox',
        value: 'Dropbox',
        type: 'plugins',
        defaultChecked: true,
      },
      {
        label: 'Instagram',
        value: 'Instagram',
        type: 'plugins',
        defaultChecked: true,
      },
      { label: 'Url', value: 'Url', type: 'plugins', defaultChecked: true },
      {
        label: 'OneDrive',
        value: 'OneDrive',
        type: 'plugins',
        defaultChecked: true,
      },
      {
        label: 'Unsplash',
        value: 'Unsplash',
        type: 'plugins',
        defaultChecked: true,
      },
      { label: 'Box', value: 'Box', type: 'plugins', defaultChecked: true },
    ],
  },
  {
    heading: 'Local sources',
    options: [
      {
        label: 'Webcam',
        value: 'Webcam',
        type: 'plugins',
        defaultChecked: true,
      },
      {
        label: 'Audio',
        value: 'Audio',
        type: 'plugins',
        defaultChecked: false,
      },
      {
        label: 'Screencast',
        value: 'ScreenCapture',
        type: 'plugins',
        defaultChecked: false,
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
      { label: 'Golden Retriever', type: 'enableGoldenRetriever' },
    ],
  },
];

const Uppy = ({ state, locale }) => {
  const createUppy = useCallback(() => {
    const ret = new UppyCore({
      restrictions: state.restrictions,
      locale,
      debug: true,
    })
      .use(Webcam)
      .use(ScreenCapture)
      .use(Audio)
      .use(ImageEditor, {})
      .use(Tus, { endpoint })
      .use(GoogleDrive, {
        companionUrl,
        companionKeysParams: {
          key: 'unused-key',
          credentialsName: 'unused-credentials',
        },
      })
      .use(Dropbox, { companionUrl })
      .use(Instagram, { companionUrl })
      .use(Url, { companionUrl })
      .use(OneDrive, { companionUrl })
      .use(Unsplash, { companionUrl })
      .use(Box, { companionUrl });

    if (state.enableGoldenRetriever) {
      ret.use(GoldenRetriever);
    }

    // Expose for easier debugging
    globalThis.uppy = ret;

    return ret;
  }, [state, locale]);

  const [uppy, setUppy] = useState(createUppy);

  useEffect(() => setUppy(createUppy()), [createUppy]);

  return (
    <div className={styles['uppy-wrapper']}>
      <Dashboard
        uppy={uppy}
        width={state.width}
        height={state.height}
        plugins={state.plugins}
        theme={state.theme}
        disabled={state.disabled}
        note={
          state.restrictions
            ? 'Images and video only, 2–3 files, up to 1 MB'
            : null
        }
      />
    </div>
  );
};

const companionUrl = 'https://companion.uppy.io';
// const companionUrl = 'http://localhost:3020';
const endpoint = 'https://tusd.tusdemo.net/files/';

export default function Examples() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [locale, setLocale] = useState(null);

  return (
    <Layout>
      <main className={styles.main}>
        <h1>Examples</h1>

        <div className={styles.header}>
          <h2>Dashboard</h2>
          <p>
            <Link to="/docs/dashboard">Docs</Link> •{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://codesandbox.io/s/uppy-dashboard-xpxuhd"
            >
              CodeSandbox
            </a>
          </p>
        </div>
        <p>
          Dashboard is the full-featured UI for Uppy that shows nice file
          previews and upload progress, lets you edit metadata, and unites
          acquire plugins, such as Google Drive and Webcam, under one roof.
        </p>
        <section>
          <div className={styles.options}>
            {options.map((section) => {
              return (
                <div key={section.heading}>
                  <h3>{section.heading}</h3>
                  <div
                    wrapper-for={section.heading}
                    className={styles['options-wrapper']}
                  >
                    {section.options.map(
                      ({ label, value, type, defaultChecked }) => (
                        <div key={label}>
                          <input
                            type="checkbox"
                            id={label}
                            className={styles['framework-input']}
                            name="framework"
                            value={type}
                            defaultChecked={defaultChecked}
                            onChange={(event) =>
                              dispatch({
                                type: type,
                                checked: event.target.checked,
                                value,
                              })
                            }
                          />
                          <label htmlFor={label}>{label}</label>
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
          <a
            href="https://github.com/transloadit/uppy/tree/main/examples"
            target="_blank"
            rel="noopener"
          >
            GitHub examples
          </a>{' '}
          folder for many more examples.
        </Admonition>
      </main>
    </Layout>
  );
}
