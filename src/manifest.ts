import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'

import type PkgType from '../package.json'
import { isDev, isFirefox, isSafari, port, r } from '../scripts/utils'
import { CONTENT_SCRIPT_EXCLUDE_MATCHES, CONTENT_SCRIPT_MATCHES } from './constants/contentScript'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: `${pkg.displayName || pkg.name}${isDev ? ' Dev' : ''}`,
    version: pkg.version,
    description: pkg.description,
    homepage_url: pkg.homepage,
    // action: {
    //   default_icon: './assets/icon-512.png',
    //   default_popup: './dist/popup/index.html',
    // },
    // options_ui: {
    //   page: './dist/options/index.html',
    //   open_in_tab: true,
    // },

    // Firefox 和 Safari 使用普通后台脚本，MV3 默认采用非持久化后台。
    background: (isFirefox || isSafari)
      ? { scripts: ['./dist/background/index.js'] }
      : { service_worker: './dist/background/index.js', type: 'module' },

    icons: {
      16: 'assets/icon-512.png',
      48: 'assets/icon-512.png',
      128: 'assets/icon-512.png',
    },
    permissions: [
      'storage',
      isSafari ? 'declarativeNetRequestWithHostAccess' : 'declarativeNetRequest',
      'cookies',
      'scripting',
      ...isFirefox
        ? ['webRequest', 'webRequestBlocking']
        : [],
    ],
    host_permissions: [
      '*://*.bilibili.com/*',
      '*://*.hdslb.com/*',
    ],
    // IframePage and IframeDrawer embed supported Bilibili pages and rely on the
    // content scripts for styling, layout synchronization, and interactions.
    // Blank frames are not supported pages, so match_about_blank is intentionally omitted.
    content_scripts: [
      {
        matches: [...CONTENT_SCRIPT_MATCHES],
        exclude_matches: [...CONTENT_SCRIPT_EXCLUDE_MATCHES],
        js: ['./dist/contentScripts/pageLoading.js', './dist/contentScripts/index.global.js'],
        css: ['./dist/contentScripts/style.css'],
        run_at: 'document_start',
        all_frames: true,
      },
      {
        matches: [...CONTENT_SCRIPT_MATCHES],
        exclude_matches: [...CONTENT_SCRIPT_EXCLUDE_MATCHES],
        js: ['./dist/contentScripts/inject.global.js'],
        run_at: 'document_start',
        all_frames: true,
        world: 'MAIN',
      },
    ],
    web_accessible_resources: [
      {
        resources: [
          'assets/*',
        ],
        matches: [...CONTENT_SCRIPT_MATCHES],
      },
    ],
    content_security_policy: isFirefox
      ? {
          extension_pages: 'script-src \'self\'; object-src \'self\'',
        }
      : {
          extension_pages: isDev
          // this is required on dev for Vite script to load
            ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
            : 'script-src \'self\'; object-src \'self\'',
        },
    // Safari 加载静态规则时可能崩溃，改由后台同步持久化动态规则。
    ...(isFirefox || isSafari)
      ? {}
      : {
          declarative_net_request: {
            rule_resources: [
              {
                id: 'ruleset_1',
                enabled: true,
                path: 'assets/rules.json',
              },
            ],
          },
        },
  }

  if (isDev)
    manifest.permissions?.push('webNavigation')

  if (isFirefox) {
    manifest.browser_specific_settings = {
      gecko: {
        id: 'addon@celeus.cn',
      },
    }
  }

  if (isSafari) {
    // requestMethods 条件从 Safari 26 起支持，避免旧版本扩大规则匹配范围。
    manifest.browser_specific_settings = {
      safari: { strict_min_version: '26.0' },
    } as Manifest.BrowserSpecificSettings & { safari: { strict_min_version: string } }
  }

  return manifest
}
