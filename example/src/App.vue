<script setup lang="ts">
import { ref } from 'vue'
import type { fitType } from '@v2v/pdf'
import {APdf} from '@v2v/vue-pdf'

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
// const url = ref('https://projects.wojtekmaj.pl/react-pdf/assets/sample-8bb8af10.pdf')

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
          <NButton size="small" :disabled="slotProps.currentPage <= 1" @click="prevPage">
            &lt
          </NButton>
          <NButton size="small" :disabled="slotProps.currentPage >= slotProps.pageTotal"
            @click="() => nextPage(slotProps.pageTotal)">
            &gt
          </NButton>
          <NButton size="small" @click="(() => { setMode('page-actual') })">
            原始
          </NButton>
          <NButton size="small" @click="(() => { setMode('page-width') })">
            铺满
          </NButton>
          <span>
            {{ slotProps.currentPage }}
            /
            {{ slotProps.pageTotal }}
          </span>
          <NSelect  size="small" style="width: 80px" placeholder="缩放比例" @update:value="setScale" :options="options" />
        </NSpace>
      </template>
    </a-pdf>
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
  box-sizing: border-box;
}

#app {
  overflow: hidden;
}
</style>
