// Improved bot session tracker for Walmart E-Commerce App
// Now uses enhanced clickPatternScore module

import { nanoid } from 'nanoid'
import { calculateClickPatternScore, trackClickEvents } from './clickPatternScore'
import type { ClickEvent } from './clickPatternScore'

// Final data payload structure for backend
export interface BotSessionPayload {
  mouse_movement_units: number
  typing_speed_cpm: number
  click_pattern_score: number
  time_spent_on_page_sec: number
  scroll_behavior_encoded: number
  captcha_success: number
  form_fill_time_sec: number
}

const STORAGE_KEY = 'botDetectionData'

// Internal state
let sessionId = nanoid()
let startTimestamp = Date.now()

let mouseUnits = 0
let lastX: number | null = null
let lastY: number | null = null

let keyCount = 0
let firstKeyTime: number | null = null
let lastKeyTime: number | null = null

let clickEvents: ClickEvent[] = []

let scrollEvents = 0

let formStartTime: number | null = null
let lastFormInteractionTime: number | null = null

let captchaSuccess = 0

let saveTimeout: ReturnType<typeof setTimeout> | null = null

// ------------------- Helpers -------------------

function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => saveData(), 500)
}

function getScrollBehavior(): number {
  if (scrollEvents > 10) return 3 // long
  if (scrollEvents > 3) return 2  // medium
  if (scrollEvents > 0) return 1  // short
  return 0                        // none
}

// ------------------- Core Save -------------------

function saveData() {
  const now = Date.now()

  const typingDurationMin = firstKeyTime && lastKeyTime ? (lastKeyTime - firstKeyTime) / 60000 : 0
  const typingSpeed = typingDurationMin > 0 ? keyCount / typingDurationMin : 0

  const clickPatternScore = calculateClickPatternScore(clickEvents)

  const formFillTime = formStartTime && lastFormInteractionTime
    ? (lastFormInteractionTime - formStartTime) / 1000
    : 0

  const data: BotSessionPayload = {
    mouse_movement_units: parseFloat((mouseUnits/100).toFixed(1)),
    typing_speed_cpm: parseFloat(typingSpeed.toFixed(1)),
    click_pattern_score: parseFloat(clickPatternScore.toFixed(2)),
    time_spent_on_page_sec: parseFloat(((now - startTimestamp) / 1000).toFixed(1)),
    scroll_behavior_encoded: getScrollBehavior(),
    captcha_success: captchaSuccess,
    form_fill_time_sec: parseFloat(formFillTime.toFixed(1)),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ------------------- Tracking Setup -------------------

export function initBotSessionTracking() {
  window.addEventListener('mousemove', (e) => {
    if (lastX !== null && lastY !== null) {
      mouseUnits += Math.hypot(e.clientX - lastX, e.clientY - lastY)
    }
    lastX = e.clientX
    lastY = e.clientY
    scheduleSave()
  })

  window.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {  // Ignore non-character keys
      if (!firstKeyTime) firstKeyTime = Date.now()
      lastKeyTime = Date.now()
      keyCount++
      scheduleSave()
    }
  })

  trackClickEvents(clickEvents)

  window.addEventListener('scroll', () => {
    scrollEvents++
    scheduleSave()
  })

  document.addEventListener('focusin', (e) => {
    const tagName = (e.target as HTMLElement).tagName
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) {
      const now = Date.now()
      if (!formStartTime) formStartTime = now
      lastFormInteractionTime = now
      scheduleSave()
    }
  })

  document.addEventListener('input', (e) => {
    const tagName = (e.target as HTMLElement).tagName
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) {
      lastFormInteractionTime = Date.now()
      scheduleSave()
    }
  })

  window.addEventListener('beforeunload', saveData)

  saveData() // Initial save
}

// ------------------- Public API -------------------

export function setCaptchaSuccess(success: boolean) {
  captchaSuccess = success ? 1 : 0
  scheduleSave()
}

export function getBotSessionData(): BotSessionPayload {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    return JSON.parse(raw)
  }

  // Return zeroed defaults if no data
  return {
    mouse_movement_units: 0,
    typing_speed_cpm: 0,
    click_pattern_score: 0,
    time_spent_on_page_sec: 0,
    scroll_behavior_encoded: 0,
    captcha_success: 0,
    form_fill_time_sec: 0,
  }
}

export function resetBotSessionData() {
  localStorage.removeItem(STORAGE_KEY)

  sessionId = nanoid()
  startTimestamp = Date.now()

  mouseUnits = 0
  lastX = null
  lastY = null

  keyCount = 0
  firstKeyTime = null
  lastKeyTime = null

  clickEvents = []
  scrollEvents = 0

  formStartTime = null
  lastFormInteractionTime = null

  captchaSuccess = 0

  saveData()
}