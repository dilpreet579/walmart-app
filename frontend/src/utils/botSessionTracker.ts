// Enhanced bot session tracking for Walmart E-Commerce App
// More efficient, accurate, and maintainable

import { nanoid } from 'nanoid'

export interface BotSessionData {
  session_id: string
  start_timestamp: string
  mouse_movement_units: number
  typing_speed_cpm: number
  click_pattern_score: number
  time_spent_on_page_sec: number
  scroll_behavior_encoded: 'none' | 'short' | 'medium' | 'long'
  captcha_success: number
  form_fill_time_sec: number
}

const STORAGE_KEY = 'botDetectionData'

// ------------------- Internal State -------------------
let sessionId = nanoid()
let startTimestamp = Date.now()

let mouseUnits = 0
let lastX: number | null = null
let lastY: number | null = null

let keyCount = 0
let firstKeyTime: number | null = null
let lastKeyTime: number | null = null

let clickTimes: number[] = []

let scrollEvents = 0

let formStartTime: number | null = null
let formEndTime: number | null = null

let captchaSuccess = 0

let saveTimeout: ReturnType<typeof setTimeout> | null = null

// ------------------- Utility Functions -------------------

function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(saveData, 500) // Save every 500 ms
}

function calculateClickPatternScore(intervals: number[]): number {
  if (intervals.length === 0) return 1 // No clicks = no suspicious behavior

  const avg = intervals.reduce((sum, val) => sum + val, 0) / intervals.length
  const variance = intervals.reduce((sum, val) => sum + (val - avg) ** 2, 0) / intervals.length

  // Normalize average click interval: 
  // Fast clicks (<200ms) → bot (0), slow clicks (>1000ms) → human (1)
  const avgScore = avg < 200 ? 0 : avg > 1000 ? 1 : (avg - 200) / 800

  // Normalize variance: 
  // Low variance (<2000) → bot (0), high variance (>10000) → human (1)
  const varianceScore = variance < 2000 ? 0 : variance > 10000 ? 1 : (variance - 2000) / 8000

  // Weighted average
  const combinedScore = (avgScore * 0.6) + (varianceScore * 0.4)

  // Round to 2 decimal places
  return Math.round(combinedScore * 100) / 100
}


function getScrollBehavior(): 'none' | 'short' | 'medium' | 'long' {
  if (scrollEvents > 10) return 'long'
  if (scrollEvents > 3) return 'medium'
  if (scrollEvents > 0) return 'short'
  return 'none'
}

// ------------------- Data Persistence -------------------

function saveData() {
  const now = Date.now()
  const typingDurationMin = firstKeyTime && lastKeyTime ? (lastKeyTime - firstKeyTime) / 60000 : 0
  const typingSpeed = typingDurationMin > 0 ? keyCount / typingDurationMin : 0

  const clickIntervals = clickTimes.length > 1
    ? clickTimes.slice(1).map((t, i) => t - clickTimes[i])
    : []
  const clickPatternScore = calculateClickPatternScore(clickIntervals)

  const formFillTime = formStartTime && formEndTime ? (formEndTime - formStartTime) / 1000 : 0

  const data: BotSessionData = {
    session_id: sessionId,
    start_timestamp: new Date(startTimestamp).toISOString(),
    mouse_movement_units: mouseUnits,
    typing_speed_cpm: typingSpeed,
    click_pattern_score: clickPatternScore,
    time_spent_on_page_sec: (now - startTimestamp) / 1000,
    scroll_behavior_encoded: getScrollBehavior(),
    captcha_success: captchaSuccess,
    form_fill_time_sec: formFillTime,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ------------------- Tracking Functions -------------------

export function initBotSessionTracking() {
  // Mouse movement
  window.addEventListener('mousemove', (e) => {
    if (lastX !== null && lastY !== null) {
      mouseUnits += Math.hypot(e.clientX - lastX, e.clientY - lastY)
    }
    lastX = e.clientX
    lastY = e.clientY
    scheduleSave()
  })

  // Typing (letters & numbers only)
  window.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {  // Ignores Shift, Tab, etc.
      if (!firstKeyTime) firstKeyTime = Date.now()
      lastKeyTime = Date.now()
      keyCount++
      scheduleSave()
    }
  })

  // Click tracking
  window.addEventListener('click', () => {
    clickTimes.push(Date.now())
    scheduleSave()
  })

  // Scroll tracking
  window.addEventListener('scroll', () => {
    scrollEvents++
    scheduleSave()
  })

  // Form fill detection (any input, select, textarea)
  document.addEventListener('focusin', (e) => {
    const tagName = (e.target as HTMLElement).tagName
    if (!formStartTime && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) {
      formStartTime = Date.now()
    }
  })

  document.addEventListener('submit', () => {
    formEndTime = Date.now()
    scheduleSave()
  })

  // Save on page exit
  window.addEventListener('beforeunload', saveData)

  // Initial save
  saveData()
}

export function setCaptchaSuccess(success: boolean) {
  captchaSuccess = success ? 1 : 0
  scheduleSave()
}

export function getBotSessionData(): BotSessionData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = JSON.parse(raw)
    return {
      session_id: parsed.session_id || sessionId,
      start_timestamp: typeof parsed.start_timestamp === 'string'
        ? parsed.start_timestamp
        : new Date(startTimestamp).toISOString(),
      mouse_movement_units: parsed.mouse_movement_units || 0,
      typing_speed_cpm: parsed.typing_speed_cpm || 0,
      click_pattern_score: parsed.click_pattern_score || 0,
      time_spent_on_page_sec: parsed.time_spent_on_page_sec || 0,
      scroll_behavior_encoded: parsed.scroll_behavior_encoded || 'none',
      captcha_success: parsed.captcha_success || 0,
      form_fill_time_sec: parsed.form_fill_time_sec || 0,
    }
  }

  // Default session data if nothing saved
  return {
    session_id: sessionId,
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

  sessionId = nanoid()
  startTimestamp = Date.now()

  mouseUnits = 0
  lastX = null
  lastY = null

  keyCount = 0
  firstKeyTime = null
  lastKeyTime = null

  clickTimes = []
  scrollEvents = 0

  formStartTime = null
  formEndTime = null

  captchaSuccess = 0

  saveData()
}