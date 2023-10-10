
import { pdf as VPdf, } from '@v2v/pdf'

export const usePage = (vPdf: VPdf) => {

    return {
        total: vPdf.pageNum || 0,
    }
}