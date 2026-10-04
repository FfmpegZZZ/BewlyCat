import type { DeclarativeNetRequest } from 'webextension-polyfill'

import dnrRules from '../../assets/rules.json'

type SafariRulesApi = Pick<DeclarativeNetRequest.Static, 'getDynamicRules' | 'updateDynamicRules'>

function normalizeRule(value: unknown): unknown {
  if (Array.isArray(value))
    return value.map(normalizeRule)

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, normalizeRule(child)]))
  }

  return value
}

export async function syncSafariHeaderRules(api: SafariRulesApi, force = false): Promise<boolean> {
  const rules = dnrRules as DeclarativeNetRequest.Rule[]
  if (!force) {
    const installed = new Map((await api.getDynamicRules()).map(rule => [rule.id, rule]))
    const unchanged = rules.every(rule => JSON.stringify(normalizeRule(installed.get(rule.id))) === JSON.stringify(normalizeRule(rule)))
    if (unchanged)
      return false
  }

  // 只替换 API 请求头规则，保留上游移动版跳转规则及其他动态规则。
  await api.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules,
  })
  return true
}
