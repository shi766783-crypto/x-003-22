<script setup>
import { computed, ref } from 'vue'
import SidebarNav from './components/SidebarNav.vue'
import DashboardView from './views/DashboardView.vue'
import AppliancesView from './views/AppliancesView.vue'
import InsightsView from './views/InsightsView.vue'
import ChallengesView from './views/ChallengesView.vue'
import ProfileView from './views/ProfileView.vue'
import { useEnergyStore } from './composables/useEnergyStore'

const activeView = ref('dashboard')
const priceModalOpen = ref(false)
const { state, setPrice } = useEnergyStore()

const views = {
  dashboard: DashboardView,
  appliances: AppliancesView,
  insights: InsightsView,
  challenges: ChallengesView,
  profile: ProfileView,
}
const currentView = computed(() => views[activeView.value])
const viewTitles = {
  dashboard: ['总览看板', '今天也要成为更聪明的用电侦探'],
  appliances: ['我的电器', '建立家庭用电档案，找到每一度电的去向'],
  insights: ['节能洞察', '把数据变成可执行的家庭节能行动'],
  challenges: ['节能挑战', '和家人一起，把节能变成一种习惯'],
  profile: ['个人中心', '你的节能足迹与成就都在这里'],
}

function navigate(view) {
  activeView.value = view
}

function savePrice(value) {
  setPrice(value)
  priceModalOpen.value = false
}
</script>

<template>
  <div class="app-shell">
    <SidebarNav :active-view="activeView" :profile="state.profile" @navigate="navigate" />
    <main class="main-content">
      <header class="topbar">
        <div class="page-heading">
          <p class="eyebrow">HOME ENERGY DETECTIVE <span class="live-dot"></span> 实时分析中</p>
          <h1>{{ viewTitles[activeView][0] }}</h1>
          <p class="page-subtitle">{{ viewTitles[activeView][1] }}</p>
        </div>
        <div class="topbar-actions">
          <button class="price-button" title="设置当前电价" @click="priceModalOpen = true">
            <span class="icon-badge icon-badge-sun">¥</span>
            <span><small>当前电价</small><strong>¥{{ state.electricityPrice.toFixed(2) }}<i>/ 度</i></strong></span>
            <span class="chevron">⌄</span>
          </button>
          <div class="avatar" :title="state.profile.name">{{ state.profile.avatar }}</div>
        </div>
      </header>

      <component :is="currentView" @navigate="navigate" />
    </main>

    <div v-if="priceModalOpen" class="modal-backdrop" @click.self="priceModalOpen = false">
      <form class="modal-panel compact-modal" @submit.prevent="savePrice($event.target.price.value)">
        <div class="modal-header"><div><span class="section-kicker">家庭设置</span><h2>调整电价</h2></div><button type="button" class="icon-button" @click="priceModalOpen = false">×</button></div>
        <label class="field-label" for="price">当前电价（元 / 度）</label>
        <input id="price" name="price" class="text-input" type="number" min="0" step="0.01" :value="state.electricityPrice" autofocus />
        <p class="field-hint">修改后，所有费用预估会即时重新计算。</p>
        <button class="primary-button wide-button" type="submit">保存设置 <span>→</span></button>
      </form>
    </div>
  </div>
</template>
