<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  unit: { type: String, default: '度' },
})

const colors = ['#b4d83e', '#ef9d55', '#6fa7dc', '#e6c94a', '#cc8fd6', '#70c6c7', '#a7adb0']
const gradient = computed(() => {
  let start = 0
  const stops = props.segments.map((segment, index) => {
    const end = start + (props.total ? segment.value / props.total * 100 : 0)
    const stop = `${colors[index % colors.length]} ${start}% ${end}%`
    start = end
    return stop
  })
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="donut-wrap">
    <div class="donut-chart" :style="{ background: gradient }">
      <div class="donut-hole">
        <strong>{{ total.toFixed(1) }}</strong>
        <span>{{ unit }} / 月</span>
      </div>
    </div>
  </div>
</template>
