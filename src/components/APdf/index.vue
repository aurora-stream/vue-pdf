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

const { loading, render, total, setMode , setScale} = usePdf(
  {
    url: '/a.pdf',
    // url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    pdfContainer: pdfRef,
    query: {
      highlight: false,
      match:
        [
          {
            sortId: [1],
            text: 'rreitmai',
          },
        ],
      uniqueId:
        'pdf_1',
    },
    config: {
      loadAll: props.loadAll,
      page: props.page,
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
  <slot name="bar" :page-total="total" :current-page="page" />

  <div class="pdfWrap">
    <div id="pdf" ref="pdfRef" />
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showLoading && loading" class="loadingContainer">
        <span class="loading" :style="loadingStyle" />
        <p class="loadingText" :style="loadingTextStyle">
          {{ loadingText }}
        </p>
      </div>
    </Transition>
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
  /* This will center the content vertically */
  height: 100vh;
  /* Assuming you want to center it in the full viewport height */
}

.loading {
  border: 2px solid rgba(0, 0, 0, 0.1);
  /* Light grey */
  border-top: 2px solid green;
  /* Green */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
  /* Spacing between the loader and the text */
}

.loadingText {
  margin: 0;
  /* Remove default margin */
}
</style>
