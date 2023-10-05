# Aurora Stream Vue PDF

提供快速集成到项目中的PDF Core 和 Vue3组件

## 用法

### 安装

``` bash
npm install @v2v/vue-pdf
```

```bash

yarn add @v2v/vue-pdf
```

### 使用

```typescript
import { ref } from 'vue'
import type { fitType } from '@v2v/pdf'
import APdf from '@v2v/vue-pdf'

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
// or use CDN

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
  console.log('scale', value)
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
```

```vue

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

```

### 高亮

提供快速后台返回数据进行全部高亮或者部分高亮

### 文书定位

轻松完成高亮或者文本精准定位，无需后台关心PDF的坐标系

## 备注

### 关于worker

1.打包到代码中：

```typescript
import { GlobalWorkerOptions } from 'pdfjs-dist'

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'

GlobalWorkerOptions.workerSrc = workerUrl

```

2.使用CDN：

```typescript

import { GlobalWorkerOptions, version } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js` //替换成你的CDN地址

```
