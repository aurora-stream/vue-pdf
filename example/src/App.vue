<script setup lang="ts">
import { ref } from 'vue'
import type { fitType } from '@v2v/pdf'
import {APdf} from '@v2v/vue-pdf'
import '@v2v/vue-pdf/dist/style.css'

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

import { NButton, NSelect, NSpace } from 'naive-ui';

const desc = ref('启动中...')

setTimeout(() => {
  desc.value = '解析中... '
}, 200)

const page = ref(2)
const scale = ref(1)
const fit = ref<fitType>('auto')

const url = ref('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')

const options = [
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 }
]

function setScale(value: number) {
  scale.value = value
}

function nextPage(total: number) {
  if (page.value >= total)
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
    <a-pdf :workerSrc="workerUrl" :url="url" :loading-size="20" :loading-text="desc" :page="page" :fit-type="fit"
      :scale="scale">
      <template #bar="slotProps">
        <NSpace class="header">
          <NButton :disabled="slotProps.currentPage <= 1" @click="prevPage">
            上一页
          </NButton>
          <NButton :disabled="slotProps.currentPage >= slotProps.pageTotal" @click="() => nextPage(slotProps.pageTotal)">
            下一页
          </NButton>

          <NButton @click="(() => { setMode('page-actual') })">
            原始
          </NButton>
          <NButton @click="(() => { setMode('page-width') })">
            铺满
          </NButton>
          <span>
            {{ slotProps.currentPage }}
            /
            {{ slotProps.pageTotal }}
          </span>
          <NSelect style="width: 160px" placeholder="请选择缩放比例" @update:value="setScale" :options="options" />
        </NSpace>
      </template>
    </a-pdf>
  </div>
</template>

<style scoped>
.header {
  color: green;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}
</style>
