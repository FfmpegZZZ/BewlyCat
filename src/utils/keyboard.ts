const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta', 'Dead', 'Fn', 'AltGraph']

const modifierOrder = ['Ctrl', 'Alt', 'Shift', 'Meta']
const modifierAliases: Record<string, string> = {
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
  cmd: 'Meta',
  command: 'Meta',
  '⌃': 'Ctrl',
  '⌥': 'Alt',
  '⇧': 'Shift',
  '⌘': 'Meta',
}

const specialKeys: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
}

const optionPunctuation: Record<string, [string, string]> = {
  Minus: ['-', '_'],
  Equal: ['=', '+'],
  BracketLeft: ['[', '{'],
  BracketRight: [']', '}'],
  Backslash: ['\\', '|'],
  Semicolon: [';', ':'],
  Quote: ['\'', '"'],
  Comma: [',', '<'],
  Period: ['.', '>'],
  Slash: ['/', '?'],
  Backquote: ['`', '~'],
}

export function isMacPlatform(): boolean {
  return typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)
}

function getEventKey(event: KeyboardEvent): string {
  // macOS 的 Option 会产生特殊字符或死键，组合键按原键位录制和匹配。
  if (isMacPlatform() && event.altKey) {
    if (/^Key[A-Z]$/.test(event.code))
      return event.code.slice(3)
    if (/^Digit\d$/.test(event.code))
      return event.code.slice(5)
    const punctuation = optionPunctuation[event.code]
    if (punctuation)
      return punctuation[event.shiftKey ? 1 : 0]
  }
  return event.key
}

export function normalizeShortcutKey(configuredKey: string): string {
  let key = configuredKey.trim()
  const modifiers = new Set<string>()
  const modifierPrefix = /^(Ctrl|Control|Alt|Option|Shift|Meta|Cmd|Command|[⌃⌥⇧⌘])\s*\+\s*/i
  let match = key.match(modifierPrefix)
  while (match) {
    modifiers.add(modifierAliases[match[1].toLowerCase()])
    key = key.slice(match[0].length)
    match = key.match(modifierPrefix)
  }
  if (!key)
    return ''

  key = specialKeys[key] || key
  if (modifiers.has('Shift')) {
    // 兼容旧版按键名与浏览器产生的 Shift 字符。
    if (key === '_')
      key = '-'
    if (key === ')')
      key = '0'
  }
  // 原来的加速配置同时接受等号和小键盘加号，Shift++ 单独控制视频尺寸。
  if (key === '+' && !modifiers.has('Shift'))
    key = '='

  return [...modifierOrder.filter(modifier => modifiers.has(modifier)), key].join('+').toLowerCase()
}

export function formatShortcutKey(configuredKey: string, mac = isMacPlatform()): string {
  const modifierLabels: Record<string, string> = mac
    ? { Ctrl: '⌃', Alt: '⌥', Shift: '⇧', Meta: '⌘' }
    : { Ctrl: 'Ctrl', Alt: 'Alt', Shift: 'Shift', Meta: 'Meta' }
  const keyLabels: Record<string, string> = mac ? { Backspace: '⌫', Delete: '⌦', Enter: '↩' } : {}
  // 从规范化结果还原展示，避免旧版加号配置误导用户按 Shift。
  let key = normalizeShortcutKey(configuredKey)
  if (!key)
    return ''
  const labels: string[] = []
  for (const modifier of modifierOrder) {
    const prefix = `${modifier.toLowerCase()}+`
    if (key.startsWith(prefix)) {
      labels.push(modifierLabels[modifier])
      key = key.slice(prefix.length)
    }
  }
  const namedKey = Object.values(specialKeys).find(value => value.toLowerCase() === key)
    || Object.keys(keyLabels).find(value => value.toLowerCase() === key)
    || ({ backspace: 'Backspace', delete: 'Delete', enter: 'Enter', home: 'Home', end: 'End', tab: 'Tab', pageup: 'PageUp', pagedown: 'PageDown' } as Record<string, string>)[key]
    || key.toUpperCase()
  labels.push(keyLabels[namedKey] || namedKey)
  return labels.join(' + ')
}

export function getShortcutKeyParts(event: KeyboardEvent, key = getEventKey(event)): string[] {
  if (modifierKeys.includes(key))
    return []

  const parts: string[] = []
  if (event.ctrlKey)
    parts.push('Ctrl')
  if (event.altKey)
    parts.push('Alt')
  if (event.shiftKey)
    parts.push('Shift')
  if (event.metaKey)
    parts.push('Meta')

  parts.push(specialKeys[key] || (key.length === 1 ? key.toUpperCase() : key))
  return parts
}

export function matchesShortcut(event: KeyboardEvent, configuredKey: string): boolean {
  if (event.isComposing)
    return false
  const keyCombo = getShortcutKeyParts(event).join('+')
  if (!keyCombo)
    return false

  const normalizedKey = normalizeShortcutKey(configuredKey)
  if (!normalizedKey)
    return false
  return normalizedKey === normalizeShortcutKey(keyCombo)
    // 保留以前已录制的 Option 特殊字符配置。
    || (isMacPlatform() && event.altKey && normalizedKey === normalizeShortcutKey(getShortcutKeyParts(event, event.key).join('+')))
}

function isInputElement(element: EventTarget | null): boolean {
  return element instanceof HTMLElement
    && (['INPUT', 'TEXTAREA', 'SELECT', 'BILI-COMMENTS'].includes(element.tagName) || element.isContentEditable)
}

export function isKeyboardInput(event: KeyboardEvent): boolean {
  if (event.composedPath().some(isInputElement) || isInputElement(event.target))
    return true

  // 外部监听器看到的目标可能是 Shadow DOM 宿主，继续查找内部焦点元素。
  let activeElement = document.activeElement
  while (activeElement?.shadowRoot?.activeElement)
    activeElement = activeElement.shadowRoot.activeElement

  return isInputElement(activeElement)
}
