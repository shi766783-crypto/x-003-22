<script setup>
import { computed, ref } from 'vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const { state, appliances, totalMonthly, yearlyCarbon, resetData } = useEnergyStore()
const activeTab = ref('appliances')
const tabs = [
  { id: 'appliances', label: '我的电器' },
  { id: 'records', label: '用电记录' },
  { id: 'badges', label: '成就徽章' },
]
const unlockedBadges = computed(() => state.badges.filter((badge) => badge.unlocked).length)
function reset() {
  if (window.confirm('确定恢复演示数据吗？当前本地修改会被覆盖。')) resetData()
}
</script>

<template>
  <section class="view-stack">
    <div class="profile-hero"><div class="profile-avatar-large">{{ state.profile.avatar }}</div><div class="profile-copy"><span class="section-kicker">ENERGY DETECTIVE</span><h2>{{ state.profile.name }}</h2><p>从 2026 年 8 月开始记录家庭用电 · 已坚持 {{ state.profile.streak }} 天</p></div><div class="profile-total"><span>累计节能积分</span><strong>{{ state.profile.points.toLocaleString() }}</strong><small>距离下个等级还差 320 分</small></div></div>
    <div class="profile-stats"><div><span>已分析电器</span><strong>{{ state.appliances.length }} <small>件</small></strong></div><div><span>累计记录</span><strong>{{ state.dailyRecords.length }} <small>天</small></strong></div><div><span>累计减排</span><strong>{{ yearlyCarbon.toFixed(0) }} <small>kg</small></strong></div><div><span>解锁徽章</span><strong>{{ unlockedBadges }} <small>/ {{ state.badges.length }}</small></strong></div></div>
    <article class="panel profile-content-panel"><div class="profile-tabs"><button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ tab.label }}</button></div><div v-if="activeTab === 'appliances'" class="profile-list"><div v-for="item in appliances" :key="item.id" class="profile-list-row"><div class="appliance-icon" :class="`tone-${item.categoryMeta.tone}`">{{ item.icon }}</div><div><strong>{{ item.name }}</strong><small>{{ item.category }} · {{ item.power }}W</small></div><span class="profile-row-value">{{ item.monthly.toFixed(1) }} kWh / 月</span></div></div><div v-else-if="activeTab === 'records'" class="profile-list"><div v-for="record in state.dailyRecords.slice().reverse()" :key="record.date" class="profile-list-row"><div class="record-date">{{ record.date.slice(5).replace('-', ' / ') }}</div><div><strong>每日用电</strong><small>实际手动记录</small></div><span class="profile-row-value">{{ record.usage.toFixed(1) }} kWh</span></div></div><div v-else class="badge-grid"><div v-for="badge in state.badges" :key="badge.id" class="badge-item" :class="{ locked: !badge.unlocked }"><div class="badge-icon">{{ badge.icon }}</div><strong>{{ badge.name }}</strong><small>{{ badge.description }}</small></div></div></article>
    <div class="profile-footer-actions"><p>数据保存在当前浏览器的 localStorage 中</p><button class="text-button danger-text" @click="reset">恢复演示数据</button></div>
  </section>
</template>
