import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { usePoolAprUpdater, useUpdateLatestTxReceipt } from 'state/farmsV4/hooks'
import { UniversalFarms } from 'views/universalFarms'

const FarmsPage = () => {
  usePoolAprUpdater()
  useUpdateLatestTxReceipt()

  return <UniversalFarms />
}

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
