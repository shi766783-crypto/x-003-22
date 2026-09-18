<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  appliance: { type: Object, default: null },
  categories: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue', 'save'])
const blank = () => ({ name: '', category: '制冷', power: 1000, hours: 1, quantity: 1, year: new Date().getFullYear(), note: '', icon: '▦' })
const form = reactive(blank())

watch(() => props.appliance, (value) => Object.assign(form, value ? { ...value } : blank()), { immediate: true })
watch(() => props.modelValue, (open) => {
  if (open && !props.appliance) Object.assign(form, blank())
})

function close() {
  emit('update:modelValue', false)
}
function submit() {
  emit('save', { ...form, power: Number(form.power), hours: Number(form.hours), quantity: Number(form.quantity), year: Number(form.year) })
  close()
}
</script>

<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <form class="modal-panel appliance-modal" @submit.prevent="submit">
      <div class="modal-header">
        <div><span class="section-kicker">用电档案</span><h2>{{ appliance ? '编辑电器' : '添加新电器' }}</h2></div>
        <button type="button" class="icon-button close-button" title="关闭" @click="close">×</button>
      </div>
      <div class="form-grid">
        <label class="form-field field-span-2"><span>电器名称</span><input v-model="form.name" class="text-input" required placeholder="例如：书房台灯" /></label>
        <label class="form-field"><span>类别</span><select v-model="form.category" class="text-input"><option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option></select></label>
        <label class="form-field"><span>额定功率（瓦）</span><input v-model="form.power" class="text-input" required type="number" min="1" /></label>
        <label class="form-field"><span>日均使用小时</span><input v-model="form.hours" class="text-input" required type="number" min="0" step="0.1" /></label>
        <label class="form-field"><span>数量</span><input v-model="form.quantity" class="text-input" required type="number" min="1" /></label>
        <label class="form-field"><span>购买年份</span><input v-model="form.year" class="text-input" required type="number" min="1990" max="2100" /></label>
        <label class="form-field field-span-2"><span>备注</span><input v-model="form.note" class="text-input" placeholder="补充能效等级、使用场景等信息" /></label>
      </div>
      <div class="modal-actions"><button type="button" class="secondary-button" @click="close">取消</button><button type="submit" class="primary-button">保存电器 <span>→</span></button></div>
    </form>
  </div>
</template>
