import { GlobalWorkerOptions } from 'pdfjs-dist'
import type { MatchInfos, fitType } from '@v2v/pdf'
import { pdf as Pdf, RenderType } from '@v2v/pdf'
import type { Ref } from 'vue'
import { isRef, nextTick, onMounted, ref } from 'vue'

import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url'

export interface queryProps {
  highlight: boolean
  match: MatchInfos[]
  uniqueId?: string
}

const defaultQuery: queryProps = {
  highlight: false,
  match: [],
  uniqueId: '',
}

export interface config {
  loadAll: boolean
  page: number
}

const defaultConfig: config = {
  loadAll: false,
  page: 1,
}

export interface usePdfProps {
  url: string
  pdfContainer: string | HTMLDivElement | Ref<HTMLDivElement | null>
  query?: queryProps
  config?: config
}

export function usePdf(
  { pdfContainer, query = defaultQuery, url, config = defaultConfig }: usePdfProps,
) {
  const loading = ref(false)
  const total = ref(0)

  let instance: Pdf | null = null

  function render(page: number) {
    if (!instance)
      window.console.error('instance is null')

    return instance?.render({
      type: RenderType.SINGLE,
      pageNum: page,
    })
  }

  function setMode(type: fitType) {
    if (!instance)
      window.console.error('instance is null')

    instance?.setFitMode(type)
  }

  function setScale(scale: number) {
    if (!instance)
      window.console.error('instance is null')

      console.log('enter setScale', scale)
    instance?.setScale(scale)
  }

  onMounted(() => {
    const container = isRef(pdfContainer) ? pdfContainer.value : typeof pdfContainer === 'string' ? document.getElementById(pdfContainer) : pdfContainer

    if (container) {
      loading.value = true

      //   GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`

      GlobalWorkerOptions.workerSrc = workerUrl

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
          if (config.loadAll) {
            pdfInstance.render().then((instance) => {
              if (query?.highlight) {
                setTimeout(() => {
                  if (query?.match.length > 0) {
                    instance.generateHightLight(
                      query.match,
                      query.uniqueId || `default-${new Date().getTime()}}`,
                    )
                    loading.value = false
                  }
                  else {
                    console.error('match is empty')
                  }
                }, 0)
              }
              else {
                loading.value = false
              }
            }).catch((err) => {
              console.error('pdfInstance.render', err)
            }).finally(() => {
              loading.value = false
            })
          }
          else {
            pdfInstance.render({
              type: RenderType.SINGLE,
              pageNum: config.page,
            }).then((instance) => {
              window.console.log('instance', instance)
            }).catch((err) => {
              window.console.error('Render single page error', err)
            }).finally(() => {
              loading.value = false
            })
          }
        })
      })
    }
    else {
      console.error('container is null', container)
    }
  })
  return {
    loading,
    render,
    total,
    setMode,
    setScale
  }
}
