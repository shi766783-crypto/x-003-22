<script setup>
defineProps({
  activeView: { type: String, required: true },
  profile: { type: Object, required: true },
})

const emit = defineEmits(['navigate'])

const navGroups = [
  {
    label: '工作台',
    items: [
      { id: 'dashboard', label: '总览看板', icon: '⌂' },
      { id: 'appliances', label: '我的电器', icon: '▦' },
      { id: 'insights', label: '节能洞察', icon: '↗' },
    ],
  },
  {
    label: '行动',
    items: [
      { id: 'challenges', label: '节能挑战', icon: '♢', badge: '3' },
      { id: 'profile', label: '个人中心', icon: '◎' },
    ],
  },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand-lockup">
      <div class="brand-mark"><span></span><span></span><span></span></div>
      <div><strong>能耗侦探</strong><small>HOME ENERGY LAB</small></div>
    </div>

    <div class="sidebar-rule"></div>
    <nav class="nav-groups" aria-label="主导航">
      <div v-for="group in navGroups" :key="group.label" class="nav-group">
        <p class="nav-label">{{ group.label }}</p>
        <button
          v-for="item in group.items"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeView === item.id }"
          @click="emit('navigate', item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
      </div>
    </nav>

    <div class="sidebar-bottom">
      <div class="streak-card">
        <div class="streak-spark">✦</div>
        <div><strong>{{ profile.streak }} 天连续节能</strong><small>保持你的绿色习惯</small></div>
        <span class="streak-arrow">↗</span>
      </div>
      <div class="profile-mini">
        <div class="avatar small-avatar">{{ profile.avatar }}</div>
        <div><strong>{{ profile.name }}</strong><small>{{ profile.points }} 积分</small></div>
        <button class="icon-button tiny-button" title="打开个人中心" @click="emit('navigate', 'profile')">···</button>
      </div>
    </div>
  </aside>
</template>
