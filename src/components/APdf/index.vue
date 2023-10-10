<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import { RenderType, type fitType } from '@v2v/pdf'
import { usePdf } from './hooks/use-pdf'

import '@v2v/pdf/styles/index.css'

const props = defineProps({
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  loadingTextColor: {
    type: String,
    default: 'green',
  },
  loadingSize: {
    type: Number,
    default: 30,
  },
  showLoading: {
    type: Boolean,
    default: true,
  },
  workerSrc: {
    type: String,
  },
  renderTextLayer: {
    type: Boolean,
    default: true,
  },
  // 全部加载
  loadAll: {
    type: Boolean,
    default: false,
  },
  // 加载页数， 只有loadAll为false时生效
  page: {
    type: Number,
    default: 1,
  },
  fitType: {
    type: String as PropType<fitType>,
    default: 'page-width',
  },
  scale: {
    type: Number,
    default: 1,
  },
  url: {
    type: String,
    required: true,
  },
})

const loadingStyle = computed(() => ({
  width: `${props.loadingSize}px`,
  height: `${props.loadingSize}px`,
  borderTop: `2px solid ${props.loadingTextColor}`,
}))

const loadingTextStyle = computed(() => ({
  color: props.loadingTextColor,
}))

const pdfRef = ref<HTMLDivElement | null>(null)
const lastScaleType = ref<'scale' | 'fit' | null>(null)


const { loading, vPdf, render, total, setMode, setScale } = usePdf(
  {
    url: props.url,
    pdfContainer: pdfRef,
    config: {
      loadAll: props.loadAll,
      page: props.page,
      workerSrc: props.workerSrc,
    },
  },
)

// watch
watch(() => loading.value, (value) => {
  console.log('value', value)
})

watch(() => props.loadAll, (mode) => {
  if (mode) {
    render({
      fitType: props.fitType,
      scale: props.scale,
      lastScaleType: lastScaleType.value,
      renderType: RenderType.ALL,
    })
  } else {
    render({
      pageNum: props.page,
      fitType: props.fitType,
      scale: props.scale,
      lastScaleType: lastScaleType.value,
      renderType: RenderType.SINGLE,
    })
  }
})

watch(() => props.page, (page) => {
  if (page > total.value || page < 1) {
    return
  }

  if (props.loadAll) {
    console.warn('LoadAll mode, page prop will not work')
    return
  }

  render({
    pageNum: page,
    fitType: props.fitType,
    scale: props.scale,
    lastScaleType: lastScaleType.value,
    renderType: props.loadAll ? RenderType.ALL : RenderType.SINGLE,
  })
})

watch(() => props.fitType, (newVal) => {
  lastScaleType.value = 'fit'
  setMode(newVal)
})

watch(() => props.scale, (newVal) => {
  lastScaleType.value = 'scale'
  setScale(newVal)
})


// methods
function getTotal() {
    return total.value
}

function getVPdfRef() {
  return vPdf
}


defineExpose({
  getTotal,
  getVPdfRef
})
</script>

<template>
  <div id="pdf" ref="pdfRef" />
  <Teleport to="body">
    <div class="loadingContainer" v-show="showLoading && loading">
      <span class="loading" :style="loadingStyle" />
      <p class="loadingText" :style="loadingTextStyle">
        {{ loadingText }}
      </p>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loadingContainer {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 999;
}

.loading {
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid green;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loadingText {
  margin: 0;
}
</style>
