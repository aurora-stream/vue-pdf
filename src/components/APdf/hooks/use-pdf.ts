import type { fitType } from '@v2v/pdf'
import { pdf as Pdf, RenderType, GlobalWorkerOptions, pdfjsVersion } from '@v2v/pdf'
import { isRef, nextTick, onMounted, ref } from 'vue'
import { queryProps, config, usePdfProps } from '../types'

const defaultQuery: queryProps = {
  highlight: false,
  match: [],
  uniqueId: '',
}

const defaultConfig: config = {
  loadAll: false,
  page: 1,
}

export type lastScaleType = 'scale' | 'fit' | null

export function usePdf(
  { pdfContainer, query = defaultQuery, url, config = defaultConfig }: usePdfProps,
) {
  console.log('query', query)
  const loading = ref(false)
  const total = ref(0)

  let instance: Pdf | null = null

  async function render(
    config: {
      pageNum?: number,
      renderType?: RenderType,
      fitType?: fitType,
      scale?: number,
      lastScaleType?: lastScaleType,
    }
  ) {
    if (!instance) {
      window.console.error('instance is null')
    }

    loading.value = true

    const { fitType, scale, lastScaleType, pageNum, renderType } = config

    const renderProps = lastScaleType === 'scale' ? {
      type: renderType,
      pageNum,
      scale,
    } : {
      type: renderType,
      pageNum,
      fitType,
    }

    console.log('renderProps', renderProps)

    try {
      const renderInstance = await instance?.render(renderProps)
      loading.value = false

      if (renderType === RenderType.ALL) {
        renderInstance?.generateHightLight([
          {
            sortId: [1, 2, 3],
            text: 'test'
          }
        ], 'pdf_1')
      }

      return renderInstance
    } catch (err) {
      console.error('instance?.render', err)
      return null
    }
  }


  function setMode(type: fitType) {
    if (!instance)
      window.console.error('instance is null')

    instance?.setFitMode(type)
  }

  function setScale(scale: number) {
    if (!instance)
      window.console.error('instance is null')
    instance?.setScale(scale)
  }

  onMounted(() => {
    const container = isRef(pdfContainer) ? pdfContainer.value : typeof pdfContainer === 'string' ? document.getElementById(pdfContainer) : pdfContainer

    if (container) {
      loading.value = true

      setPdfWorkerSrc(config.workerSrc)

      const pdfInstance = new Pdf({
        container,
        src: url,
        canvasType: 'canvas',
        shouldListenResize: false,
      })

      instance = pdfInstance

      pdfInstance.init().then(async (pdfInstance) => {
        total.value = pdfInstance.pageNum || 0

        nextTick(() => {
          const renderProps = {
            pageNum: config.page || 1,
            lastScaleType: 'fit' as lastScaleType,
            renderType: config.loadAll ? RenderType.ALL : RenderType.SINGLE,
          }
          render(renderProps)
        })
      })
    }
    else {
      console.error('container is null', container)
    }
  })
  return {
    loading,
    total,
    render,
    setMode,
    vPdf: instance,
    setScale,
  }
}


export function setPdfWorkerSrc(url?: string) {
  GlobalWorkerOptions.workerSrc = url || `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`
}