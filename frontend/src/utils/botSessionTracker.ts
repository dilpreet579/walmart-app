// Full-session behavioral bot tracking for Walmart E-Commerce App
// Tracks mouse, typing, click, scroll, timing, captcha, and form fill time

import { nanoid } from 'nanoid'

export interface BotSessionData {
  session_id: string
  start_timestamp: string // ISO string for readability
  mouse_movement_units: number
  typing_speed_cpm: number
  click_pattern_score: number
  time_spent_on_page_sec: number
  scroll_behavior_encoded: 'none' | 'short' | 'medium' | 'long'
  captcha_success: number
  form_fill_time_sec: number
  // Add more fields as needed
}

const STORAGE_KEY = 'botDetectionData'

// Internal state
let mouseUnits = 0
let lastX: number | null = null
let lastY: number | null = null
let keyCount = 0
let firstKeyTime: number | null = null
let lastKeyTime: number | null = null
let clickTimes: number[] = []
let scrollEvents = 0
let scrollToBottom = false
let formStartTime: number | null = null
let formEndTime: number | null = null
let captchaSuccess = 0
// sessionId is generated using nanoid for high-entropy unique string
let sessionId = ''
let startTimestamp = Date.now()

function save() {
  const now = Date.now()
  const typingDuration = firstKeyTime && lastKeyTime ? (lastKeyTime - firstKeyTime) / 60000 : 0 // min
  const typingSpeed = typingDuration > 0 ? keyCount / typingDuration : 0
  const clickIntervals = clickTimes.length > 1 ? clickTimes.slice(1).map((t,i)=>t-clickTimes[i]) : []
  const clickPatternScore = clickIntervals.length ? (clickIntervals.every(iv=>iv<300) ? 1 : 0) : 0
  // Scroll behavior: none = 0, short = 1-3, medium = 4-10, long = >10 events
  let scrollBehavior: 'none' | 'short' | 'medium' | 'long' = 'none'
  if (scrollEvents > 10) scrollBehavior = 'long'
  else if (scrollEvents > 3) scrollBehavior = 'medium'
  else if (scrollEvents > 0) scrollBehavior = 'short'
  const formFillTime = formStartTime && formEndTime ? (formEndTime - formStartTime) / 1000 : 0
  const data: BotSessionData = {
    session_id: sessionId,
    start_timestamp: new Date(startTimestamp).toISOString(),
    mouse_movement_units: mouseUnits,
    typing_speed_cpm: typingSpeed,
    click_pattern_score: clickPatternScore,
    time_spent_on_page_sec: (now - startTimestamp) / 1000,
    scroll_behavior_encoded: scrollBehavior,
    captcha_success: captchaSuccess,
    form_fill_time_sec: formFillTime,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function initBotSessionTracking() {
  // Only init once per session
  if (sessionId) return
  sessionId = nanoid()
  startTimestamp = Date.now()
  // Mouse
  window.addEventListener('mousemove', (e) => {
    if (lastX !== null && lastY !== null) {
      mouseUnits += Math.hypot(e.clientX - lastX, e.clientY - lastY)
    }
    lastX = e.clientX
    lastY = e.clientY
    save()
  })
  // Typing
  window.addEventListener('keydown', (e) => {
    if (!firstKeyTime) firstKeyTime = Date.now()
    lastKeyTime = Date.now()
    keyCount++
    save()
  })
  // Clicks
  window.addEventListener('click', (e) => {
    clickTimes.push(Date.now())
    save()
  })
  // Scroll
  window.addEventListener('scroll', () => {
    scrollEvents++
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
      scrollToBottom = true
    }
    save()
  })
  // Form fill time (start)
  document.addEventListener('focusin', (e) => {
    if (!formStartTime && (e.target as HTMLElement).tagName === 'INPUT') {
      formStartTime = Date.now()
    }
  })
  // Form fill time (end)
  document.addEventListener('submit', (e) => {
    formEndTime = Date.now()
    save()
  })
  // Save on unload
  window.addEventListener('beforeunload', save)
  save()
}

export function setCaptchaSuccess(success: boolean) {
  // Set to 1 if recaptcha passes, 0 if fails
  captchaSuccess = success ? 1 : 0
  save()
}

export function getBotSessionData(): BotSessionData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = JSON.parse(raw)
    // Ensure types are correct after parsing
    return {
      ...parsed,
      start_timestamp: typeof parsed.start_timestamp === 'string'
        ? parsed.start_timestamp
        : new Date(parsed.start_timestamp).toISOString(),
      scroll_behavior_encoded: typeof parsed.scroll_behavior_encoded === 'string'
        ? parsed.scroll_behavior_encoded
        : 'none',
    }
  }
  // If no data, return a default object
  return {
    session_id: sessionId || 'unknown',
    start_timestamp: new Date(startTimestamp).toISOString(),
    mouse_movement_units: 0,
    typing_speed_cpm: 0,
    click_pattern_score: 0,
    time_spent_on_page_sec: 0,
    scroll_behavior_encoded: 'none',
    captcha_success: 0,
    form_fill_time_sec: 0,
  }
}

export function resetBotSessionData() {
  localStorage.removeItem(STORAGE_KEY)
  sessionId = ''
  mouseUnits = 0
  keyCount = 0
  firstKeyTime = null
  lastKeyTime = null
  clickTimes = []
  scrollEvents = 0
  scrollToBottom = false
  formStartTime = null
  formEndTime = null
  captchaSuccess = 0
  startTimestamp = Date.now()
}
