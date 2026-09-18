<script setup>
import { computed, ref } from 'vue'
import TrendChart from '../components/TrendChart.vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const { state, appliances, totalMonthly, monthlyCost, categoryBreakdown, estimatedSaving, actualReduction } = useEnergyStore()
const selectedGoal = ref(state.monthlyGoal)
const saved = ref(false)

const recommendations = computed(() => {
  const top = appliances.value[0]
  const fridge = appliances.value.find((item) => item.name.includes('冰箱'))
  const washer = appliances.value.find((item) => item.name.includes('洗衣'))
  return [
    { priority: '高', color: 'orange', title: '空调温度调高 1℃', description: '空调是当前耗电最高的设备。夏季制冷温度每调高 1℃，通常可减少约 7% 的制冷用电。', saving: top ? top.monthly * 0.07 : 0, action: '调整温度' },
    { priority: '中', color: 'lime', title: '洗衣机尽量满载运行', description: '将零散衣物集中清洗，减少低负载运行次数，可以降低清洁类电器的单位耗电。', saving: washer ? washer.monthly * 0.2 : 0, action: '加入挑战' },
    { priority: '低', color: 'blue', title: '检查冰箱门封与温度', description: '冰箱保持 4℃左右、冷冻室保持 -18℃，并定期检查门封，可避免无效制冷。', saving: fridge ? fridge.monthly * 0.06 : 0, action: '查看方法' },
  ]
})

function updateGoal() {
  state.monthlyGoal = Number(selectedGoal.value)
  saved.value = true
  window.setTimeout(() => { saved.value = false }, 1800)
}
</script>

<template>
  <section class="view-stack">
    <div class="insight-hero">
      <div><span class="section-kicker">SMART ENERGY BRIEFING · 2026 / 09</span><h2>本月的节能空间，<em>比想象中更多。</em></h2><p>根据 {{ state.appliances.length }} 件电器的使用画像，我们为你找到了 {{ estimatedSaving.toFixed(1) }} kWh 的可优化空间。</p></div>
      <div class="goal-control"><span>月度节能目标</span><div class="goal-row"><select v-model="selectedGoal" class="goal-select"><option :value="5">减少 5%</option><option :value="10">减少 10%</option><option :value="15">减少 15%</option><option :value="20">减少 20%</option></select><button class="primary-button" @click="updateGoal">{{ saved ? '已保存' : '更新目标' }}</button></div></div>
    </div>

    <div class="content-grid two-thirds">
      <article class="panel insight-score">
        <div class="panel-header"><div><span class="section-kicker">EFFICIENCY SCORE</span><h2>家庭能效评分</h2></div><span class="score-caption">本月</span></div>
        <div class="score-layout"><div class="score-ring"><strong>{{ Math.min(99, 72 + Math.round(actualReduction)) }}</strong><span>/ 100</span></div><div><h3>表现不错，继续保持</h3><p>你的实际节能比例为 <b>{{ actualReduction.toFixed(1) }}%</b>。再完成 2 个建议，就能进入「节能达人」行列。</p><div class="score-line"><span>能效水平</span><strong>良好</strong></div><div class="progress-track"><span :style="{ width: `${Math.min(100, 72 + actualReduction)}%` }"></span></div></div></div>
      </article>
      <article class="panel saving-estimate"><span class="section-kicker">SAVING ESTIMATE</span><h2>如果完成全部建议</h2><div class="saving-number">-{{ (estimatedSaving * 0.68).toFixed(1) }} <small>kWh / 月</small></div><p>约合 <b>¥{{ (estimatedSaving * 0.68 * state.electricityPrice).toFixed(0) }}</b> 电费，减少 <b>{{ (estimatedSaving * 0.68 * 0.785).toFixed(1) }} kg</b> 碳排放。</p><div class="saving-mark">↘</div></article>
    </div>

    <article class="panel recommendations-panel">
      <div class="panel-header"><div><span class="section-kicker">RULE-BASED RECOMMENDATIONS</span><h2>为你准备的节能建议</h2></div><span class="recommendation-count">{{ recommendations.length }} 条建议</span></div>
      <div class="recommendation-list"><div v-for="item in recommendations" :key="item.title" class="recommendation-row"><span class="priority-dot" :class="`priority-${item.color}`"></span><div class="recommendation-copy"><div class="recommendation-title"><strong>{{ item.title }}</strong><span class="category-pill" :class="`pill-${item.color}`">{{ item.priority }}优先</span></div><p>{{ item.description }}</p></div><div class="saving-tag">约省 {{ item.saving.toFixed(1) }} kWh / 月</div><button class="secondary-button compact-button">{{ item.action }} <span>→</span></button></div></div>
    </article>

    <div class="content-grid equal-grid">
      <article class="panel">
        <div class="panel-header"><div><span class="section-kicker">ACTUAL VS ESTIMATED</span><h2>实际用电对比</h2></div><span class="chart-note">近 7 日</span></div>
        <TrendChart :data="state.dailyRecords.map((item) => ({ label: item.date.slice(8), value: totalMonthly / 30 }))" :actual="state.dailyRecords.map((item) => ({ label: item.date.slice(8), value: item.usage }))" :height="170" actual-label="实际" estimated-label="预估" />
        <div class="chart-legend"><span><i class="legend-line dashed"></i>预估用电</span><span><i class="legend-line"></i>实际用电</span></div>
      </article>
      <article class="panel category-insight"><div class="panel-header"><div><span class="section-kicker">FOCUS AREA</span><h2>优先关注</h2></div></div><div v-for="(category, index) in categoryBreakdown.slice(0, 3)" :key="category.value" class="focus-row"><span class="focus-rank">0{{ index + 1 }}</span><div class="focus-main"><strong>{{ category.label }}类电器</strong><div class="focus-track"><span :style="{ width: `${category.value / categoryBreakdown[0].value * 100}%` }"></span></div></div><strong>{{ category.value.toFixed(1) }} kWh</strong></div></article>
    </div>
  </section>
</template>
