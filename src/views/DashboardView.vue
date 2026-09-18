<script setup>
import { computed, ref } from 'vue'
import DonutChart from '../components/DonutChart.vue'
import TrendChart from '../components/TrendChart.vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const emit = defineEmits(['navigate'])
const {
  state, appliances, totalMonthly, totalDaily, totalPower, monthlyCost, yearlyCarbon,
  categoryBreakdown, trendData, estimatedSaving, actualReduction, averageActual, addDailyRecord,
} = useEnergyStore()
const showRecordForm = ref(false)
const recordForm = ref({ date: '2026-09-12', usage: 10.4 })
const savingProgress = computed(() => Math.min(100, Math.round(actualReduction.value / state.monthlyGoal * 100)))
const topAppliances = computed(() => appliances.value.slice().sort((a, b) => b.monthly - a.monthly).slice(0, 4))

function saveRecord() {
  addDailyRecord(recordForm.value)
  showRecordForm.value = false
}
function formatNumber(value, digits = 1) {
  return Number(value).toFixed(digits)
}
</script>

<template>
  <section class="view-stack dashboard-view">
    <div class="summary-grid">
      <article class="metric-card hero-metric">
        <div class="metric-card-top"><span class="metric-label">本月预估用电</span><span class="metric-icon green-icon">ϟ</span></div>
        <div class="metric-value">{{ formatNumber(totalMonthly) }} <small>kWh</small></div>
        <div class="metric-foot"><span class="trend-up">↓ {{ state.monthlyGoal }}%</span><span>比上月减少 {{ state.monthlyGoal }}% 目标</span></div>
        <div class="progress-track"><span :style="{ width: `${savingProgress}%` }"></span></div>
      </article>
      <article class="metric-card">
        <div class="metric-card-top"><span class="metric-label">预估月费用</span><span class="metric-icon yellow-icon">¥</span></div>
        <div class="metric-value">¥{{ formatNumber(monthlyCost, 0) }}</div>
        <div class="metric-foot"><span class="muted">按 ¥{{ state.electricityPrice.toFixed(2) }} / 度计算</span></div>
      </article>
      <article class="metric-card">
        <div class="metric-card-top"><span class="metric-label">总额定功率</span><span class="metric-icon blue-icon">⌁</span></div>
        <div class="metric-value">{{ totalPower.toLocaleString() }} <small>W</small></div>
        <div class="metric-foot"><span class="muted">共 {{ state.appliances.length }} 件电器</span></div>
      </article>
      <article class="metric-card">
        <div class="metric-card-top"><span class="metric-label">年碳排放预估</span><span class="metric-icon pink-icon">◒</span></div>
        <div class="metric-value">{{ formatNumber(yearlyCarbon, 0) }} <small>kg</small></div>
        <div class="metric-foot"><span class="trend-green">比同类家庭低 8.6%</span></div>
      </article>
    </div>

    <div class="content-grid two-thirds">
      <article class="panel chart-panel">
        <div class="panel-header"><div><span class="section-kicker">CONSUMPTION TREND</span><h2>月度能耗趋势</h2></div><button class="ghost-button">近 6 个月 <span>⌄</span></button></div>
        <div class="chart-summary"><strong>{{ formatNumber(totalMonthly) }} <small>kWh</small></strong><span class="trend-green">↓ {{ state.monthlyGoal }}%</span><span>较上月</span></div>
        <TrendChart :data="trendData" :height="200" />
      </article>
      <article class="panel category-panel">
        <div class="panel-header"><div><span class="section-kicker">CATEGORY SPLIT</span><h2>各类电器占比</h2></div><button class="more-button" title="查看节能洞察" @click="emit('navigate', 'insights')">→</button></div>
        <div class="donut-content">
          <DonutChart :segments="categoryBreakdown" :total="totalMonthly" />
          <div class="legend-list">
            <div v-for="(category, index) in categoryBreakdown" :key="category.value" class="legend-item"><span class="legend-dot" :style="{ background: ['#b4d83e', '#ef9d55', '#6fa7dc', '#e6c94a', '#cc8fd6'][index % 5] }"></span><span>{{ category.label }}</span><strong>{{ (category.value / totalMonthly * 100).toFixed(0) }}%</strong></div>
          </div>
        </div>
      </article>
    </div>

    <div class="content-grid equal-grid">
      <article class="panel">
        <div class="panel-header"><div><span class="section-kicker">TOP CONSUMERS</span><h2>耗电大户</h2></div><button class="text-button" @click="emit('navigate', 'appliances')">查看全部 <span>→</span></button></div>
        <div class="consumer-list">
          <div v-for="item in topAppliances" :key="item.id" class="consumer-row">
            <div class="appliance-icon" :class="`tone-${item.categoryMeta.tone}`">{{ item.icon }}</div>
            <div class="consumer-info"><strong>{{ item.name }}</strong><small>{{ item.power }}W · {{ item.hours }}h/天</small></div>
            <div class="consumer-usage"><strong>{{ formatNumber(item.monthly) }} <small>kWh</small></strong><span>{{ ((item.monthly / totalMonthly) * 100).toFixed(0) }}%</span></div>
          </div>
        </div>
      </article>
      <article class="panel daily-panel">
        <div class="panel-header"><div><span class="section-kicker">DAILY LOG</span><h2>每日用电记录</h2></div><button class="add-record" title="添加今日用电记录" @click="showRecordForm = !showRecordForm">＋</button></div>
        <form v-if="showRecordForm" class="record-form" @submit.prevent="saveRecord"><input v-model="recordForm.date" class="text-input" type="date" required /><input v-model="recordForm.usage" class="text-input" type="number" min="0" step="0.1" required placeholder="kWh" /><button class="primary-button" type="submit">记录</button></form>
        <div class="daily-total"><strong>{{ formatNumber(averageActual) }} <small>kWh</small></strong><span>近 7 日平均</span><b>预估 {{ formatNumber(totalDaily) }} kWh/天</b></div>
        <div class="mini-chart"><TrendChart :data="state.dailyRecords.map((item) => ({ label: item.date.slice(8), value: item.usage }))" :actual="[]" :height="120" /></div>
      </article>
    </div>

    <article class="recommendation-banner">
      <div class="recommendation-icon">✦</div>
      <div><span class="section-kicker">TODAY'S SUGGESTION</span><h3>把空调温度调高 1℃，每月预计可省 {{ formatNumber(estimatedSaving * 0.42) }} kWh</h3><p>基于你的使用习惯，这是今天最值得尝试的节能行动。</p></div>
      <button class="secondary-button" @click="emit('navigate', 'insights')">查看建议 <span>→</span></button>
    </article>
  </section>
</template>
