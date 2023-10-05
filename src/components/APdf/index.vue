<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { fitType } from '@v2v/pdf'
import { usePdf } from './hooks/use-pdf'

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

const { loading, render, total, setMode, setScale } = usePdf(
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

watch(() => props.page, (newVal) => {
  if (newVal > total.value || newVal < 1)
    return
  render(newVal)
})

watch(() => props.fitType, (newVal) => {
  setMode(newVal)
})

watch(() => props.scale, (newVal) => {
  setScale(newVal)
})
</script>

<template>
  <div>
    <slot name='bar' :page-total="total" :current-page="page" />
    <div class="pdfWrap">
      <div id="pdf" ref="pdfRef" />
    </div>

    <Teleport to="body">
      <template v-show="showLoading && loading">
        <div class="loadingContainer">
          <span class="loading" :style="loadingStyle" />
          <p class="loadingText" :style="loadingTextStyle">
            {{ loadingText }}
          </p>
        </div>
      </template>
    </Teleport>
  </div>
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

#pdf {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.pdfWrap {
  overflow: hidden;
  box-sizing: border-box;
}

.loadingContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading {
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
