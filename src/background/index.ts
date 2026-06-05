import browser from 'webextension-polyfill'

import dnrRules from '../../assets/rules.json'
import { setupAppAuthScheduler } from './appAuthScheduler'
import { setupApiMsgListeners } from './messageListeners/api'
import { setupTabMsgListeners } from './messageListeners/tabs'
import { initWbiKeys } from './wbiSign'

// Initialize extension and set up message handlers
browser.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed')

  // Safari (WebKit) segfaults when loading static declarative_net_request rules,
  // so the static ruleset is omitted from the manifest for Safari (see manifest.ts).
  // Inject the exact same rules dynamically here instead — dynamic rules persist
  // across restarts, so applying them once on install/update is sufficient.
  // eslint-disable-next-line node/prefer-global/process
  if (process.env.SAFARI) {
    try {
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dnrRules.map(rule => rule.id),
        addRules: dnrRules as browser.DeclarativeNetRequest.Rule[],
      })
      console.log('[BewlyCat] Safari dynamic DNR rules injected')
    }
    catch (error) {
      console.error('[BewlyCat] Failed to inject Safari DNR rules:', error)
    }
  }
})

// 扩展启动时初始化 WBI 密钥
initWbiKeys().catch((error) => {
  console.error('[BewlyCat] WBI keys initialization error:', error)
})

function isExtensionUri(url: string) {
  return new URL(url).origin === new URL(browser.runtime.getURL('')).origin
}

// Firefox specific header handling
// eslint-disable-next-line node/prefer-global/process
if (process.env.FIREFOX) {
  browser.webRequest.onBeforeSendHeaders.addListener(
    async (details: any) => {
      const requestHeaders: browser.WebRequest.HttpHeaders = []
      if (details.documentUrl) {
        const url = new URL(details.documentUrl)
        const extensionUri = isExtensionUri(details.documentUrl)
        details.requestHeaders = details.requestHeaders || []
        for (let i = 0; i < details.requestHeaders.length; i++) {
          if (details.requestHeaders[i].name.toLowerCase() === 'origin' || details.requestHeaders[i].name.toLowerCase() === 'referer')
            requestHeaders.push({ name: details.requestHeaders[i].name, value: extensionUri ? 'https://www.bilibili.com' : url.origin })
          else
            requestHeaders.push(details.requestHeaders[i])

          if (details.requestHeaders[i].name === 'firefox-multi-account-cookie') {
            requestHeaders.push({ name: 'cookie', value: details.requestHeaders[i].value })
          }
        }

        return { ...details, requestHeaders }
      }
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders'],
  )
}

// Setup all message listeners
setupApiMsgListeners()
setupTabMsgListeners()
setupAppAuthScheduler()
