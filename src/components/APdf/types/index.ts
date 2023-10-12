
import type { MatchInfos } from '@v2v/pdf'

import  type { Ref } from 'vue'

export interface queryProps {
  highlight: boolean
  match: MatchInfos[]
  uniqueId?: string
}


export interface config {
  loadAll: boolean
  page: number
  workerSrc?: string
}


export interface usePdfProps {
  url: string
  pdfContainer: string | HTMLDivElement | Ref<HTMLDivElement | null>
  query?: queryProps
  config?: config
}