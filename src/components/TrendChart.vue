<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  height: { type: Number, default: 196 },
  actual: { type: Array, default: () => [] },
  actualLabel: { type: String, default: '实际用电' },
  estimatedLabel: { type: String, default: '预估用电' },
})

const canvas = ref(null)
let resizeObserver

const maxValue = computed(() => Math.max(...props.data.map((item) => item.value), ...props.actual.map((item) => item.value), 1) * 1.15)
const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxValue.value * ratio)))

function drawLine(context, values, width, height, color, dashed = false) {
  if (!values.length) return
  const padding = 4
  const step = values.length === 1 ? 0 : (width - padding * 2) / (values.length - 1)
  context.beginPath()
  values.forEach((item, index) => {
    const x = values.length === 1 ? width / 2 : padding + index * step
    const y = height - item.value / maxValue.value * (height - padding * 2) - padding
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  })
  context.setLineDash(dashed ? [5, 4] : [])
  context.strokeStyle = color
  context.lineWidth = 2
  context.stroke()
  context.setLineDash([])
  if (!dashed) {
    values.forEach((item, index) => {
      const x = values.length === 1 ? width / 2 : padding + index * step
      const y = height - item.value / maxValue.value * (height - padding * 2) - padding
      context.beginPath()
      context.arc(x, y, 3, 0, Math.PI * 2)
      context.fillStyle = '#ffffff'
      context.fill()
      context.strokeStyle = color
      context.lineWidth = 1.5
      context.stroke()
    })
  }
}

function drawChart() {
  if (!canvas.value) return
  const element = canvas.value
  const bounds = element.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1
  element.width = bounds.width * ratio
  element.height = bounds.height * ratio
  const context = element.getContext('2d')
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, bounds.width, bounds.height)
  drawLine(context, props.data, bounds.width, bounds.height, '#a1c638')
  drawLine(context, props.actual, bounds.width, bounds.height, '#ef9d55', true)
}

onMounted(async () => {
  await nextTick()
  drawChart()
  resizeObserver = new ResizeObserver(drawChart)
  resizeObserver.observe(canvas.value)
})
watch(() => [props.data, props.actual, props.height], drawChart, { deep: true })
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="trend-chart" :style="{ '--chart-height': `${height}px` }">
    <div class="chart-y-axis">
      <span v-for="tick in yTicks.slice().reverse()" :key="tick">{{ tick }}</span>
    </div>
    <div class="chart-plot">
      <div v-for="line in 5" :key="line" class="chart-grid-line" :style="{ top: `${(line - 1) * 25}%` }"></div>
      <canvas ref="canvas" aria-label="用电趋势图"></canvas>
      <div class="chart-x-axis"><span v-for="item in data" :key="item.label">{{ item.label }}</span></div>
    </div>
  </div>
</template>
