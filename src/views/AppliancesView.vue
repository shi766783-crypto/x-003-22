<script setup>
import { computed, ref } from 'vue'
import ApplianceModal from '../components/ApplianceModal.vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const { state, appliances, categoryOptions, removeAppliance, addAppliance, updateAppliance } = useEnergyStore()
const search = ref('')
const selectedCategory = ref('全部')
const modalOpen = ref(false)
const editing = ref(null)
const filtered = computed(() => appliances.value.filter((item) => {
  const matchSearch = item.name.includes(search.value) || item.note?.includes(search.value)
  const matchCategory = selectedCategory.value === '全部' || item.category === selectedCategory.value
  return matchSearch && matchCategory
}))

function openAdd() { editing.value = null; modalOpen.value = true }
function openEdit(item) { editing.value = item; modalOpen.value = true }
function save(item) { editing.value ? updateAppliance(item) : addAppliance(item) }
function confirmRemove(item) {
  if (window.confirm(`确定删除「${item.name}」吗？`)) removeAppliance(item.id)
}
</script>

<template>
  <section class="view-stack">
    <div class="page-toolbar"><div class="toolbar-filters"><label class="search-box"><span>⌕</span><input v-model="search" placeholder="搜索电器名称或备注" /></label><select v-model="selectedCategory" class="filter-select"><option>全部</option><option v-for="category in categoryOptions" :key="category.value">{{ category.label }}</option></select></div><button class="primary-button" @click="openAdd">＋ 添加电器</button></div>
    <div class="appliance-stats"><div><span>电器总数</span><strong>{{ state.appliances.length }} <small>件</small></strong></div><div><span>每日预估</span><strong>{{ appliances.reduce((sum, item) => sum + item.daily, 0).toFixed(1) }} <small>kWh</small></strong></div><div><span>月度预估</span><strong>{{ appliances.reduce((sum, item) => sum + item.monthly, 0).toFixed(1) }} <small>kWh</small></strong></div><div><span>月度费用</span><strong>¥{{ appliances.reduce((sum, item) => sum + item.monthlyCost, 0).toFixed(0) }}</strong></div></div>
    <article class="panel appliance-table-panel">
      <div class="table-header"><div><span class="section-kicker">YOUR APPLIANCES</span><h2>电器档案</h2></div><span class="table-count">{{ filtered.length }} 条记录</span></div>
      <div class="table-scroll"><table><thead><tr><th>电器</th><th>类别</th><th>功率 / 使用</th><th>月耗电</th><th>月费用</th><th>购买年份</th><th></th></tr></thead><tbody><tr v-for="item in filtered" :key="item.id"><td><div class="table-appliance"><div class="appliance-icon" :class="`tone-${item.categoryMeta.tone}`">{{ item.icon }}</div><div><strong>{{ item.name }}</strong><small>{{ item.note || '暂无备注' }}</small></div></div></td><td><span class="category-pill" :class="`pill-${item.categoryMeta.tone}`">{{ item.category }}</span></td><td><strong>{{ item.power }}W</strong><small>{{ item.hours }} 小时 / 天 × {{ item.quantity }}</small></td><td><strong>{{ item.monthly.toFixed(1) }} <small>kWh</small></strong></td><td><strong>¥{{ item.monthlyCost.toFixed(0) }}</strong></td><td>{{ item.year }}</td><td><div class="row-actions"><button class="icon-button" title="编辑电器" @click="openEdit(item)">✎</button><button class="icon-button danger-icon" title="删除电器" @click="confirmRemove(item)">⌫</button></div></td></tr><tr v-if="!filtered.length"><td colspan="7" class="empty-state">没有找到匹配的电器</td></tr></tbody></table></div>
    </article>
    <ApplianceModal v-model="modalOpen" :appliance="editing" :categories="categoryOptions" @save="save" />
  </section>
</template>
