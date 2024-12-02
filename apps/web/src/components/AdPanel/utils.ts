import memoize from 'lodash/memoize'

const AD_ASSETS_URL = 'https://assets.pancakeswap.finance/web/promotions'

export const getImageUrl = memoize((asset: string) => `${AD_ASSETS_URL}/${asset}.png`)
