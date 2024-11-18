import dynamic from 'next/dynamic'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import SwapLayout from 'views/Swap/SwapLayout'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Page showExternalLink={false} showHelpLink={false}>
      {children}
    </Page>
  )
}

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const TwapPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap />
  </SwapLayout>
)

TwapPage.chains = CHAIN_IDS
TwapPage.screen = true
TwapPage.Layout = Layout

export default TwapPage
