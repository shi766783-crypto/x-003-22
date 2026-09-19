import { computed, reactive, watch } from 'vue'
import { categoryOptions, defaultState } from '../data/defaultData'

const STORAGE_KEY = 'home-energy-detective-v1'
const carbonFactor = 0.785

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...defaultState, ...JSON.parse(saved) }
  } catch (error) {
    console.warn('Unable to restore energy data', error)
  }
  return JSON.parse(JSON.stringify(defaultState))
}

const state = reactive(loadState())

watch(state, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}, { deep: true })

const enrichedAppliances = computed(() => state.appliances.map((item) => {
  const daily = item.power * item.hours * item.quantity / 1000
  return {
    ...item,
    daily,
    monthly: daily * 30,
    yearly: daily * 365,
    monthlyCost: daily * 30 * state.electricityPrice,
    categoryMeta: categoryOptions.find((category) => category.value === item.category) || categoryOptions.at(-1),
  }
}))

const totalMonthly = computed(() => enrichedAppliances.value.reduce((sum, item) => sum + item.monthly, 0))
const totalDaily = computed(() => enrichedAppliances.value.reduce((sum, item) => sum + item.daily, 0))
const totalPower = computed(() => state.appliances.reduce((sum, item) => sum + item.power * item.quantity, 0))
const monthlyCost = computed(() => totalMonthly.value * state.electricityPrice)
const yearlyCarbon = computed(() => totalMonthly.value * 12 * carbonFactor)
const averageActual = computed(() => {
  if (!state.dailyRecords.length) return 0
  return state.dailyRecords.reduce((sum, item) => sum + Number(item.usage), 0) / state.dailyRecords.length
})

const categoryBreakdown = computed(() => categoryOptions
  .map((category) => ({
    ...category,
    value: enrichedAppliances.value.filter((item) => item.category === category.value).reduce((sum, item) => sum + item.monthly, 0),
  }))
  .filter((category) => category.value > 0)
  .sort((a, b) => b.value - a.value))

const trendData = computed(() => [
  { label: '4月', value: totalMonthly.value * 0.94 },
  { label: '5月', value: totalMonthly.value * 1.02 },
  { label: '6月', value: totalMonthly.value * 0.98 },
  { label: '7月', value: totalMonthly.value * 1.12 },
  { label: '8月', value: totalMonthly.value * 1.05 },
  { label: '9月', value: totalMonthly.value },
])

const estimatedSaving = computed(() => Math.max(0, totalMonthly.value * state.monthlyGoal / 100))
const actualReduction = computed(() => {
  const previous = totalMonthly.value * 1.08
  return Math.max(0, (previous - totalMonthly.value) / previous * 100)
})
// 本月相对上月基线实际节电量（kWh），与 actualReduction 使用同一条基线
const actualSavedKwh = computed(() => Math.max(0, totalMonthly.value * 0.08))

function addAppliance(appliance) {
  state.appliances.push({ ...appliance, id: crypto.randomUUID?.() || `appliance-${Date.now()}` })
}

function updateAppliance(appliance) {
  const index = state.appliances.findIndex((item) => item.id === appliance.id)
  if (index >= 0) state.appliances[index] = { ...appliance }
}

function removeAppliance(id) {
  state.appliances = state.appliances.filter((item) => item.id !== id)
}

function addDailyRecord(record) {
  const existing = state.dailyRecords.find((item) => item.date === record.date)
  if (existing) existing.usage = Number(record.usage)
  else state.dailyRecords.push({ ...record, usage: Number(record.usage) })
  state.dailyRecords.sort((a, b) => a.date.localeCompare(b.date))
}

function setPrice(value) {
  state.electricityPrice = Number(value) || 0
}

function toggleChallenge(id) {
  const challenge = state.challenges.find((item) => item.id === id)
  if (!challenge) return
  if (!challenge.joined) {
    challenge.joined = true
    challenge.progress = 0
    return
  }
  if (challenge.progress < challenge.days) challenge.progress += 1
  if (challenge.progress >= challenge.days) {
    challenge.completed = true
    state.profile.points += challenge.points
  } else {
    state.profile.points += 10
  }
}

function resetData() {
  Object.assign(state, JSON.parse(JSON.stringify(defaultState)))
}

export function useEnergyStore() {
  return {
    state,
    categoryOptions,
    carbonFactor,
    appliances: enrichedAppliances,
    totalMonthly,
    totalDaily,
    totalPower,
    monthlyCost,
    yearlyCarbon,
    averageActual,
    categoryBreakdown,
    trendData,
    estimatedSaving,
    actualReduction,
    actualSavedKwh,
    addAppliance,
    updateAppliance,
    removeAppliance,
    addDailyRecord,
    setPrice,
    toggleChallenge,
    resetData,
  }
}
