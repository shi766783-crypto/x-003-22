<script setup>
import { computed } from 'vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const { state, toggleChallenge } = useEnergyStore()
const activeChallenges = computed(() => state.challenges.filter((challenge) => !challenge.completed))
const completedChallenges = computed(() => state.challenges.filter((challenge) => challenge.completed))
const leaderboard = [
  { rank: 1, name: '陈安安', avatar: 'CA', saving: '18.4%', color: 'gold' },
  { rank: 2, name: '林小满', avatar: 'LM', saving: '12.8%', color: 'silver', mine: true },
  { rank: 3, name: '周小北', avatar: 'ZB', saving: '10.6%', color: 'bronze' },
  { rank: 4, name: '苏苏', avatar: 'SS', saving: '9.2%', color: '' },
]
</script>

<template>
  <section class="view-stack">
    <div class="challenge-banner"><div><span class="section-kicker">SEPTEMBER GREEN MISSION</span><h2>节能不是一个人的坚持。</h2><p>每天一个小行动，和 1,284 个家庭一起累计改变。</p></div><div class="mission-stat"><strong>86%</strong><span>本月社区完成度</span></div><div class="mission-shape">♧</div></div>
    <div class="content-grid two-thirds challenge-layout">
      <article class="panel challenge-panel"><div class="panel-header"><div><span class="section-kicker">MY CHALLENGES</span><h2>正在参与</h2></div><button class="ghost-button">筛选 <span>⌄</span></button></div><div class="challenge-list"><div v-for="challenge in activeChallenges" :key="challenge.id" class="challenge-card" :class="`accent-${challenge.accent}`"><div class="challenge-card-top"><div class="challenge-symbol">{{ challenge.icon }}</div><div class="challenge-points">+{{ challenge.points }} <small>积分</small></div></div><h3>{{ challenge.title }}</h3><p>{{ challenge.description }}</p><div class="challenge-progress-meta"><span>{{ challenge.progress }} / {{ challenge.days }} 天</span><strong>{{ Math.round(challenge.progress / challenge.days * 100) }}%</strong></div><div class="progress-track"><span :style="{ width: `${challenge.progress / challenge.days * 100}%` }"></span></div><button class="checkin-button" @click="toggleChallenge(challenge.id)">{{ challenge.joined ? '今日打卡  ·  +' + (challenge.completed ? challenge.points : 10) + ' 积分' : '参加挑战' }} <span>{{ challenge.joined ? '✓' : '→' }}</span></button></div></div></article>
      <div class="side-stack"><article class="panel points-panel"><span class="section-kicker">MY ENERGY POINTS</span><div class="points-number">{{ state.profile.points.toLocaleString() }} <small>pts</small></div><div class="points-foot"><span>本月新增 <b>+180</b></span><span class="rank-up">排名 ↑ 12</span></div></article><article class="panel"><div class="panel-header"><div><span class="section-kicker">RECENT WINS</span><h2>最近完成</h2></div></div><div v-for="challenge in completedChallenges" :key="challenge.id" class="win-row"><span class="win-check">✓</span><div><strong>{{ challenge.title }}</strong><small>已完成 · 获得 {{ challenge.points }} 积分</small></div></div></article></div>
    </div>
    <article class="panel leaderboard-panel"><div class="panel-header"><div><span class="section-kicker">COMMUNITY LEADERBOARD</span><h2>社区排行榜</h2></div><div class="segmented"><button class="selected">节能达人榜</button><button>能耗侦探榜</button></div></div><div class="leaderboard-head"><span>排名</span><span>侦探</span><span>节省电量比例</span><span>趋势</span></div><div v-for="person in leaderboard" :key="person.rank" class="leaderboard-row" :class="{ mine: person.mine }"><strong class="rank-number" :class="person.color">{{ person.rank }}</strong><div class="leader-person"><div class="avatar leaderboard-avatar">{{ person.avatar }}</div><strong>{{ person.name }} <span v-if="person.mine">（我）</span></strong></div><strong class="saving-percent">{{ person.saving }}</strong><span class="leader-trend">↗</span></div></article>
  </section>
</template>
