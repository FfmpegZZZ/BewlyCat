const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta', 'Dead']

const specialKeys: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
}

export function getShortcutKeyParts(event: KeyboardEvent, key = event.key): string[] {
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
  const keyCombo = getShortcutKeyParts(event).join('+')
  if (!keyCombo)
    return false

  if (configuredKey.toLowerCase() === keyCombo.toLowerCase()
    || (configuredKey === '+' && keyCombo === '=')) {
    return true
  }

  // 保留旧版 Shift+-、Shift+0 配置，实际按键会分别产生下划线和右括号。
  const legacyKey = event.shiftKey && ((event.code === 'Minus' && event.key === '_')
    ? '-'
    : (event.code === 'Digit0' && event.key === ')') ? '0' : '')
  return !!legacyKey && configuredKey.toLowerCase() === getShortcutKeyParts(event, legacyKey).join('+').toLowerCase()
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
