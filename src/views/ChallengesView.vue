<script setup>
import { computed, ref } from 'vue'
import { useEnergyStore } from '../composables/useEnergyStore'

const { state, toggleChallenge, totalMonthly, averageActual } = useEnergyStore()
const activeChallenges = computed(() => state.challenges.filter((challenge) => !challenge.completed))
const completedChallenges = computed(() => state.challenges.filter((challenge) => challenge.completed))

const boards = [
  { id: 'expert', label: '节能达人榜' },
  { id: 'detective', label: '能耗侦探榜' },
]
const activeBoard = ref('expert')

const trendIcon = { up: '↗', down: '↘', flat: '→' }
const rankColor = (rank) => (['gold', 'silver', 'bronze'][rank - 1] || '')

const expertLeaderboard = [
  { name: '陈安安', avatar: 'CA', saving: 18.4, trend: 'up' },
  { name: state.profile.name, avatar: state.profile.avatar, saving: 12.8, trend: 'up' },
  { name: '周小北', avatar: 'ZB', saving: 10.6, trend: 'flat' },
  { name: '苏苏', avatar: 'SS', saving: 9.2, trend: 'down' },
].map((person, index) => ({
  ...person,
  rank: index + 1,
  color: rankColor(index + 1),
  mine: person.name === state.profile.name,
}))

const myRankExpert = computed(() => expertLeaderboard.find((person) => person.mine)?.rank ?? expertLeaderboard.length + 1)

// 能耗侦探榜：以本月实际节电量 / 连续打卡天数排序
const detectiveMetrics = [
  { id: 'saving', label: '本月节电量' },
  { id: 'streak', label: '连续打卡' },
]
const detectiveMetric = ref('saving')

// 当前用户的本月实际节电量 = 预估月用电量 - 按近 7 日实际均耗推算的月用电量
const myMonthlySaving = computed(() => Math.max(0, totalMonthly.value - averageActual.value * 30))
const myStreak = computed(() => state.profile.streak)

const detectiveNeighbors = [
  { name: '陈安安', avatar: 'CA', monthlySaving: 142.6, streak: 21, trend: 'up' },
  { name: '周小北', avatar: 'ZB', monthlySaving: 96.4, streak: 15, trend: 'flat' },
  { name: '苏苏', avatar: 'SS', monthlySaving: 73.8, streak: 11, trend: 'down' },
  { name: '何一然', avatar: 'HY', monthlySaving: 58.2, streak: 6, trend: 'up' },
]

const detectiveLeaderboard = computed(() => {
  const rows = [
    ...detectiveNeighbors,
    {
      name: state.profile.name,
      avatar: state.profile.avatar,
      monthlySaving: Number(myMonthlySaving.value.toFixed(1)),
      streak: myStreak.value,
      trend: 'up',
      mine: true,
    },
  ]
  // 主排序取当前榜单指标，同分时用另一指标兜底，保证排名稳定
  rows.sort((a, b) => {
    const primary = detectiveMetric.value === 'saving'
      ? b.monthlySaving - a.monthlySaving
      : b.streak - a.streak
    const secondary = detectiveMetric.value === 'saving'
      ? b.streak - a.streak
      : b.monthlySaving - a.monthlySaving
    return primary || secondary
  })
  return rows.map((person, index) => ({ ...person, rank: index + 1, color: rankColor(index + 1) }))
})

const myRankDetective = computed(() => detectiveLeaderboard.value.find((person) => person.mine)?.rank ?? detectiveLeaderboard.value.length)
const detectiveTotal = computed(() => detectiveLeaderboard.value.length)
</script>

<template>
  <section class="view-stack">
    <div class="challenge-banner"><div><span class="section-kicker">SEPTEMBER GREEN MISSION</span><h2>节能不是一个人的坚持。</h2><p>每天一个小行动，和 1,284 个家庭一起累计改变。</p></div><div class="mission-stat"><strong>86%</strong><span>本月社区完成度</span></div><div class="mission-shape">♧</div></div>
    <div class="content-grid two-thirds challenge-layout">
      <article class="panel challenge-panel"><div class="panel-header"><div><span class="section-kicker">MY CHALLENGES</span><h2>正在参与</h2></div><button class="ghost-button">筛选 <span>⌄</span></button></div><div class="challenge-list"><div v-for="challenge in activeChallenges" :key="challenge.id" class="challenge-card" :class="`accent-${challenge.accent}`"><div class="challenge-card-top"><div class="challenge-symbol">{{ challenge.icon }}</div><div class="challenge-points">+{{ challenge.points }} <small>积分</small></div></div><h3>{{ challenge.title }}</h3><p>{{ challenge.description }}</p><div class="challenge-progress-meta"><span>{{ challenge.progress }} / {{ challenge.days }} 天</span><strong>{{ Math.round(challenge.progress / challenge.days * 100) }}%</strong></div><div class="progress-track"><span :style="{ width: `${challenge.progress / challenge.days * 100}%` }"></span></div><button class="checkin-button" @click="toggleChallenge(challenge.id)">{{ challenge.joined ? '今日打卡  ·  +' + (challenge.completed ? challenge.points : 10) + ' 积分' : '参加挑战' }} <span>{{ challenge.joined ? '✓' : '→' }}</span></button></div></div></article>
      <div class="side-stack"><article class="panel points-panel"><span class="section-kicker">MY ENERGY POINTS</span><div class="points-number">{{ state.profile.points.toLocaleString() }} <small>pts</small></div><div class="points-foot"><span>本月新增 <b>+180</b></span><span class="rank-up">排名 ↑ 12</span></div></article><article class="panel"><div class="panel-header"><div><span class="section-kicker">RECENT WINS</span><h2>最近完成</h2></div></div><div v-for="challenge in completedChallenges" :key="challenge.id" class="win-row"><span class="win-check">✓</span><div><strong>{{ challenge.title }}</strong><small>已完成 · 获得 {{ challenge.points }} 积分</small></div></div></article></div>
    </div>
    <article class="panel leaderboard-panel">
      <div class="panel-header">
        <div><span class="section-kicker">COMMUNITY LEADERBOARD</span><h2>社区排行榜</h2></div>
        <div class="segmented">
          <button v-for="board in boards" :key="board.id" :class="{ selected: activeBoard === board.id }" @click="activeBoard = board.id">{{ board.label }}</button>
        </div>
      </div>

      <template v-if="activeBoard === 'expert'">
        <div class="leaderboard-head"><span>排名</span><span>侦探</span><span>节省电量比例</span><span>趋势</span></div>
        <div v-for="person in expertLeaderboard" :key="person.name" class="leaderboard-row" :class="{ mine: person.mine }"><strong class="rank-number" :class="person.color">{{ person.rank }}</strong><div class="leader-person"><div class="avatar leaderboard-avatar">{{ person.avatar }}</div><strong>{{ person.name }} <span v-if="person.mine">（我）</span></strong></div><strong class="saving-percent">{{ person.saving.toFixed(1) }}%</strong><span class="leader-trend" :class="`trend-${person.trend}`">{{ trendIcon[person.trend] }}</span></div>
        <div class="leaderboard-foot"><span class="mine-pin">●</span> 我在节能达人榜排名第 <b>{{ myRankExpert }}</b> / {{ expertLeaderboard.length }} 位</div>
      </template>

      <template v-else>
        <div class="detective-toolbar">
          <span class="detective-toolbar-label">排序依据</span>
          <div class="segmented detective-segmented">
            <button v-for="metric in detectiveMetrics" :key="metric.id" :class="{ selected: detectiveMetric === metric.id }" @click="detectiveMetric = metric.id">{{ metric.label }}</button>
          </div>
          <span class="detective-toolbar-hint">默认按本月实际节电量排序</span>
        </div>
        <div class="leaderboard-head">
          <span>排名</span><span>侦探</span><span>{{ detectiveMetric === 'saving' ? '本月节电量' : '连续打卡天数' }}</span><span>趋势</span>
        </div>
        <div v-for="person in detectiveLeaderboard" :key="person.name" class="leaderboard-row" :class="{ mine: person.mine }">
          <strong class="rank-number" :class="person.color">{{ person.rank }}</strong>
          <div class="leader-person"><div class="avatar leaderboard-avatar">{{ person.avatar }}</div><strong>{{ person.name }} <span v-if="person.mine">（我）</span></strong></div>
          <strong class="saving-percent">
            <template v-if="detectiveMetric === 'saving'">{{ person.monthlySaving.toFixed(1) }}<i> kWh</i></template>
            <template v-else>{{ person.streak }}<i> 天</i></template>
          </strong>
          <span class="leader-trend" :class="`trend-${person.trend}`">{{ trendIcon[person.trend] }}</span>
        </div>
        <div class="leaderboard-foot">
          <span class="mine-pin">●</span>
          我在能耗侦探榜排名第 <b>{{ myRankDetective }}</b> / {{ detectiveTotal }} 位 ·
          本月实际节电 <b>{{ myMonthlySaving.toFixed(1) }} kWh</b> ·
          连续打卡 <b>{{ myStreak }} 天</b>
        </div>
      </template>
    </article>
  </section>
</template>
