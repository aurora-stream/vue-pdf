<script setup lang="ts">
import { ref, computed } from 'vue';
import { fitType } from '@v2v/pdf'

import APdf from './components/APdf/index.vue'

import { NButton, NSelect, NSpace } from 'naive-ui';

// const desc = ref('启动中...')

// setTimeout(() => {
//   desc.value = '解析中... '
// }, 200)

const page = ref(2)
const scale = ref(1)
const fit = ref<fitType>('auto')
const loadAll = ref(false)
const APdfRef = ref<InstanceType<typeof APdf> | null>(null)

const url = ref('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')

const options = [
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 }
]


const total = computed(() => {
  return APdfRef.value?.getTotal() || 0
})

function switchRenderType() {
  loadAll.value = !loadAll.value
}

function setScale(value: number) {
  scale.value = value
}

function nextPage() {
  if (page.value >= total.value)
    return
  page.value += 1
}

function prevPage() {
  if (page.value <= 1)
    return
  page.value -= 1
}

function setMode(type: fitType) {
  fit.value = type
}


</script>

<template>
  <div class="content">
    <NSpace class="header">
      <NButton size="small" :disabled="page <= 1" @click="prevPage">
        &lt
      </NButton>
      <NButton size="small" :disabled="page >= total" @click="() => nextPage()">
        &gt
      </NButton>
      <NButton size="small" @click="(() => {
        switchRenderType()
      })">
        {{ loadAll ? '单页' : '全部' }}
      </NButton>
      <NButton size="small" @click="(() => { setMode('page-actual') })">
        原始
      </NButton>
      <NButton size="small" @click="(() => { setMode('page-width') })">
        铺满
      </NButton>
      <span>
        {{ page }}
        /
        {{ total }}
      </span>
      <NSelect size="small" style="width: 80px" placeholder="缩放" @update:value="setScale" :options="options" />
    </NSpace>
    <a-pdf :url="url" :loading-size="20" ref="APdfRef" :page="page" :fit-type="fit" :load-all="loadAll" :scale="scale" />

  </div>
</template>

<style scoped>
.header {
  position: absolute;
  top: 10px;
  left: 0;
  color: green;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  padding: 0 10px;
  box-sizing: border-box;
}

.content {
  width: 90%;
  max-width: 1100px;
  margin: 100px auto 0;
  border: 1px solid #222;
  height: calc(100vh - 140px);
  overflow: auto;
  padding-right: 3px;
  box-sizing: border-box;
}

#app {
  overflow: hidden;
}
</style>
